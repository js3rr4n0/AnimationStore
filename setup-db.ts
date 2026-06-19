import { createPool } from '@vercel/postgres';
import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync } from 'fs';

config({ path: resolve(__dirname, '.env.local') });

const sqlQuery = `
CREATE SCHEMA IF NOT EXISTS animation_store;
SET search_path TO animation_store;

-- ----------------------------------------------------------------
-- 1. ENUMS (estados)
-- ----------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE estado_producto AS ENUM
    ('borrador', 'publicado', 'no_aprobado', 'archivado');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE estado_orden AS ENUM
    ('pendiente', 'activa', 'a_entregar', 'procesada', 'cancelada');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ----------------------------------------------------------------
-- 2. TAXONOMÍAS (cascada: marca → depto → categoría → subcat → fineline)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS marcas (
  id      SERIAL PRIMARY KEY,
  nombre  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS departamentos (
  id      SERIAL PRIMARY KEY,
  nombre  TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS categorias (
  id               SERIAL PRIMARY KEY,
  departamento_id  INT NOT NULL REFERENCES departamentos(id) ON DELETE CASCADE,
  nombre           TEXT NOT NULL,
  UNIQUE (departamento_id, nombre)
);

CREATE TABLE IF NOT EXISTS subcategorias (
  id            SERIAL PRIMARY KEY,
  categoria_id  INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  nombre        TEXT NOT NULL,
  UNIQUE (categoria_id, nombre)
);

CREATE TABLE IF NOT EXISTS finelines (
  id              SERIAL PRIMARY KEY,
  subcategoria_id INT NOT NULL REFERENCES subcategorias(id) ON DELETE CASCADE,
  nombre          TEXT NOT NULL,
  UNIQUE (subcategoria_id, nombre)
);

-- Grupos de búsqueda fijos (Novedades, Más vendidos, Preventa, etc.)
CREATE TABLE IF NOT EXISTS grupos_busqueda (
  id      SERIAL PRIMARY KEY,
  nombre  TEXT NOT NULL UNIQUE
);

-- ----------------------------------------------------------------
-- 3. PRODUCTOS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS productos (
  id               SERIAL PRIMARY KEY,
  nombre           TEXT NOT NULL,
  descripcion      TEXT,                         -- HTML del editor enriquecido
  sku              TEXT NOT NULL UNIQUE,         -- S-XXX-#########
  precio_venta     NUMERIC(10,2) NOT NULL DEFAULT 0,
  precio_previo    NUMERIC(10,2),                -- para mostrar "antes/ahora"
  precio_costo     NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock            INT NOT NULL DEFAULT 0,
  max_compra       INT NOT NULL DEFAULT 1,
  estado           estado_producto NOT NULL DEFAULT 'borrador',
  tiene_variaciones BOOLEAN NOT NULL DEFAULT FALSE,
  imagen_url       TEXT,                         -- cache de la portada (ver producto_imagenes)
  marca_id         INT REFERENCES marcas(id)         ON DELETE SET NULL,
  departamento_id  INT REFERENCES departamentos(id)  ON DELETE SET NULL,
  categoria_id     INT REFERENCES categorias(id)     ON DELETE SET NULL,
  subcategoria_id  INT REFERENCES subcategorias(id)  ON DELETE SET NULL,
  fineline_id      INT REFERENCES finelines(id)      ON DELETE SET NULL,
  creado_en        TIMESTAMPTZ NOT NULL DEFAULT now(),
  actualizado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Especificaciones clave/valor (Material: PVC, Escala: 1/7, etc.)
CREATE TABLE IF NOT EXISTS producto_especificaciones (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  clave        TEXT NOT NULL,
  valor        TEXT NOT NULL
);

-- Keywords (máx. 10 — se valida en la app)
CREATE TABLE IF NOT EXISTS producto_keywords (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  palabra      TEXT NOT NULL,
  UNIQUE (producto_id, palabra)
);

-- Producto ↔ Grupos de búsqueda (N:M)
CREATE TABLE IF NOT EXISTS producto_grupo (
  producto_id  INT NOT NULL REFERENCES productos(id)       ON DELETE CASCADE,
  grupo_id     INT NOT NULL REFERENCES grupos_busqueda(id) ON DELETE CASCADE,
  PRIMARY KEY (producto_id, grupo_id)
);

-- Variantes (solo si tiene_variaciones = true)
CREATE TABLE IF NOT EXISTS variantes (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  nombre       TEXT NOT NULL,                 -- "Color: Rojo / Talla: M"
  sku          TEXT UNIQUE,
  stock        INT NOT NULL DEFAULT 0,
  atributos    JSONB,                         -- { "color": "rojo", "talla": "M" }
  precio_extra NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Galería de imágenes (mínimo 3 por producto — se valida en la app / al publicar)
CREATE TABLE IF NOT EXISTS producto_imagenes (
  id           SERIAL PRIMARY KEY,
  producto_id  INT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
  url          TEXT NOT NULL,                 -- URL en object storage
  orden        INT NOT NULL DEFAULT 0,        -- posición en la galería (0 = primera)
  es_portada   BOOLEAN NOT NULL DEFAULT FALSE,
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Solo UNA portada por producto
CREATE UNIQUE INDEX IF NOT EXISTS idx_una_portada
  ON producto_imagenes(producto_id) WHERE es_portada;

-- ----------------------------------------------------------------
-- 4. CLIENTES
-- ----------------------------------------------------------------
-- telefono es la LLAVE DE DEDUPLICACIÓN. correo es opcional.
CREATE TABLE IF NOT EXISTS clientes (
  id           SERIAL PRIMARY KEY,
  nombre       TEXT NOT NULL,
  telefono     TEXT NOT NULL UNIQUE,          -- normalizar antes de guardar
  correo       TEXT,                          -- opcional
  direccion    TEXT,
  departamento TEXT,
  municipio    TEXT,
  referencia   TEXT,                          -- punto de referencia
  creado_en    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 5. ÓRDENES  (un cliente → muchas órdenes)
-- ----------------------------------------------------------------
CREATE SEQUENCE IF NOT EXISTS orden_numero_seq START 1001;

CREATE TABLE IF NOT EXISTS ordenes (
  id          SERIAL PRIMARY KEY,
  numero      TEXT NOT NULL UNIQUE
              DEFAULT ('ORD-' || lpad(nextval('orden_numero_seq')::text, 6, '0')),
  cliente_id  INT NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  estado      estado_orden NOT NULL DEFAULT 'pendiente',
  total       NUMERIC(10,2) NOT NULL DEFAULT 0,
  comentario  TEXT,
  tracking    TEXT,
  -- snapshot de envío al momento de la orden (por si el cliente cambia datos)
  envio_direccion    TEXT,
  envio_departamento TEXT,
  envio_municipio    TEXT,
  envio_referencia   TEXT,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 6. ÍTEMS DE ORDEN  (una orden → muchos productos)
-- ----------------------------------------------------------------
-- Se guarda SNAPSHOT de nombre y precio: si el producto cambia o se
-- borra después, la orden conserva lo que el cliente realmente compró.
CREATE TABLE IF NOT EXISTS orden_items (
  id              SERIAL PRIMARY KEY,
  orden_id        INT NOT NULL REFERENCES ordenes(id)   ON DELETE CASCADE,
  producto_id     INT REFERENCES productos(id)          ON DELETE SET NULL,
  variante_id     INT REFERENCES variantes(id)          ON DELETE SET NULL,
  nombre_producto TEXT NOT NULL,                 -- snapshot
  precio_unit     NUMERIC(10,2) NOT NULL,        -- snapshot
  cantidad        INT NOT NULL CHECK (cantidad > 0),
  subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (precio_unit * cantidad) STORED
);

-- ----------------------------------------------------------------
-- 7. AUDITORÍA (opcional pero recomendada)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS eventos (
  id          SERIAL PRIMARY KEY,
  entidad     TEXT NOT NULL,        -- 'orden', 'producto', etc.
  entidad_id  INT  NOT NULL,
  accion      TEXT NOT NULL,        -- 'crear', 'cambiar_estado', etc.
  usuario_id  INT,
  detalle     JSONB,
  fecha       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------
-- 8. ÍNDICES
-- ----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_productos_estado      ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_departamento ON productos(departamento_id);
CREATE INDEX IF NOT EXISTS idx_productos_sku         ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_clientes_telefono     ON clientes(telefono);
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente       ON ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_estado        ON ordenes(estado);
CREATE INDEX IF NOT EXISTS idx_orden_items_orden     ON orden_items(orden_id);
CREATE INDEX IF NOT EXISTS idx_imagenes_producto     ON producto_imagenes(producto_id);

-- ----------------------------------------------------------------
-- 9. TRIGGER: actualizar 'actualizado_en' en productos
-- ----------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN
  NEW.actualizado_en = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_productos_actualizado ON productos;
CREATE TRIGGER trg_productos_actualizado
  BEFORE UPDATE ON productos
  FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

-- Regla de negocio: no se puede PUBLICAR un producto con menos de 3 fotos
CREATE OR REPLACE FUNCTION validar_min_fotos()
RETURNS TRIGGER AS $$
DECLARE
  v_fotos INT;
BEGIN
  IF NEW.estado = 'publicado' THEN
    SELECT COUNT(*) INTO v_fotos FROM producto_imagenes WHERE producto_id = NEW.id;
    IF v_fotos < 3 THEN
      RAISE EXCEPTION 'Un producto publicado requiere al menos 3 fotos (tiene %).', v_fotos;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_fotos ON productos;
CREATE TRIGGER trg_validar_fotos
  BEFORE UPDATE OF estado ON productos
  FOR EACH ROW EXECUTE FUNCTION validar_min_fotos();

-- ----------------------------------------------------------------
-- 10. VISTA: listado de clientes con métricas (órdenes + total gastado)
-- ----------------------------------------------------------------
CREATE OR REPLACE VIEW vista_clientes AS
SELECT
  c.id,
  c.nombre,
  c.correo,
  c.telefono,
  COUNT(o.id)                       AS ordenes,
  COALESCE(SUM(o.total), 0)         AS total_gastado,
  c.creado_en
FROM clientes c
LEFT JOIN ordenes o ON o.cliente_id = c.id
GROUP BY c.id;

-- ----------------------------------------------------------------
-- 11. SEED de grupos de búsqueda (los de las capturas)
-- ----------------------------------------------------------------
INSERT INTO grupos_busqueda (nombre) VALUES
  ('Novedades'), ('Más vendidos'), ('Preventa'),
  ('Edición limitada'), ('Ofertas')
ON CONFLICT (nombre) DO NOTHING;
`;

async function main() {
  const pool = createPool();
  try {
    console.log("Running schema...");
    await pool.query(sqlQuery);
    console.log("Schema successfully created!");
  } catch (error) {
    console.error("Error creating schema:", error);
  } finally {
    process.exit(0);
  }
}

main();
