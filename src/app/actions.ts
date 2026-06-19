"use server";

import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const telefono = formData.get("telefono") as string;
  const correo = formData.get("correo") as string;
  const direccion = formData.get("direccion") as string;

  await sql`
    INSERT INTO animation_store.clientes (nombre, telefono, correo, direccion)
    VALUES (${nombre}, ${telefono}, ${correo}, ${direccion})
  `;

  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function createOrder(formData: FormData) {
  const cliente_id = formData.get("cliente_id") as string;
  const total = parseFloat(formData.get("total") as string || "0");
  const envio_direccion = formData.get("envio_direccion") as string;

  // Insertar orden base
  await sql`
    INSERT INTO animation_store.ordenes (cliente_id, estado, total, envio_direccion)
    VALUES (${cliente_id}, 'pendiente', ${total}, ${envio_direccion})
  `;

  revalidatePath("/ordenes");
  revalidatePath("/clientes");
  redirect("/ordenes");
}

export async function createProduct(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const descripcion = formData.get("descripcion") as string || "";
  const precio_venta = parseFloat(formData.get("precio_venta") as string || "0");
  const precio_previo = parseFloat(formData.get("precio_previo") as string || "0");
  const precio_costo = parseFloat(formData.get("precio_costo") as string || "0");
  const stock = parseInt(formData.get("stock") as string || "0");
  const estado = formData.get("estado") as string || "borrador";
  
  // Generate random SKU: S-XXX-#########
  const prefix = nombre.substring(0, 3).toUpperCase().padEnd(3, 'X');
  const randomNum = Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
  const sku = `S-${prefix}-${randomNum}`;
  
  // Handle image: it's sent as a base64 string
  const imagenBase64 = formData.get("imagenBase64") as string || null;

  const result = await sql`
    INSERT INTO animation_store.productos (
      nombre, descripcion, sku, precio_venta, precio_previo, precio_costo, 
      stock, estado, imagen_url
    )
    VALUES (
      ${nombre}, ${descripcion}, ${sku}, ${precio_venta}, ${precio_previo}, ${precio_costo},
      ${stock}, ${estado}, ${imagenBase64}
    )
    RETURNING id
  `;
  
  const productoId = result.rows[0].id;

  if (imagenBase64) {
    await sql`
      INSERT INTO animation_store.producto_imagenes (producto_id, url, es_portada)
      VALUES (${productoId}, ${imagenBase64}, true)
    `;
  }

  revalidatePath("/productos");
  redirect("/productos");
}
