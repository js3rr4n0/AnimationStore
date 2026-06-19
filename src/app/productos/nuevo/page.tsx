"use client";

import Link from "next/link";
import { 
  ArrowLeft, Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Undo, Redo, Trash2, Plus, 
  Upload, RefreshCw, Settings, HelpCircle 
} from "lucide-react";
import styles from "./page.module.css";

export default function NuevoProducto() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <Link href="/productos" className={styles.backBtn}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className={styles.title}>Nuevo producto</h1>
            <p className={styles.subtitle}>Completá la información del producto</p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button className="btn btn-outline">Descartar</button>
          <button className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', border: 'none' }}>Guardar</button>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formCol}>
          {/* Información del producto */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Información del producto</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del producto <span className={styles.required}>*</span></label>
              <input type="text" className={styles.input} placeholder="Ej. Figura Escala 1/7 Guerrera Celestial" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción</label>
              <div className={styles.editorToolbar}>
                <button className={styles.editorBtn}><Bold size={16} /></button>
                <button className={styles.editorBtn}><Italic size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button className={styles.editorBtn}><Heading1 size={16} /></button>
                <button className={styles.editorBtn}><Heading2 size={16} /></button>
                <button className={styles.editorBtn}><Heading3 size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button className={styles.editorBtn}><List size={16} /></button>
                <button className={styles.editorBtn}><ListOrdered size={16} /></button>
                <button className={styles.editorBtn}><Quote size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button className={styles.editorBtn}><Undo size={16} /></button>
                <button className={styles.editorBtn}><Redo size={16} /></button>
              </div>
              <textarea className={styles.editorArea}></textarea>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Especificaciones</label>
              <div className={styles.specRow}>
                <input type="text" className={styles.input} placeholder="Clave (ej. Material)" />
                <input type="text" className={styles.input} placeholder="Valor (ej. PVC)" />
                <button style={{ color: 'var(--text-secondary)' }}><Trash2 size={18} /></button>
              </div>
              <button className={styles.addSpecBtn}>
                <Plus size={16} /> Agregar
              </button>
            </div>
          </div>

          {/* Precio y disponibilidad */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Precio y disponibilidad</h2>
            
            <div className={styles.pricingGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Precio final de venta</label>
                <div className={styles.inputWithAddon}>
                  <span className={`${styles.addon} ${styles.addonLeft}`}>$</span>
                  <input type="text" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Precio previo de venta</label>
                <div className={styles.inputWithAddon}>
                  <span className={`${styles.addon} ${styles.addonLeft}`}>$</span>
                  <input type="text" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Precio costo</label>
                <div className={styles.inputWithAddon}>
                  <span className={`${styles.addon} ${styles.addonLeft}`}>$</span>
                  <input type="text" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Máxima cantidad por orden</label>
                <input type="text" className={styles.input} defaultValue="1" />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock disponible</label>
                <input type="text" className={styles.input} defaultValue="0" />
              </div>
            </div>
          </div>

          {/* Opciones / Variaciones */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Opciones / Variaciones</h2>
            <div className={styles.switchRow}>
              <div className={styles.switch}></div>
              <span className={styles.switchLabel}>Este producto tiene variaciones como colores, tamaños o tipo</span>
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          {/* Fotografía */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Fotografía</h2>
            <div className={styles.imageUploadArea}>
              <Upload size={24} color="var(--text-secondary)" />
              <span>Sin imagen</span>
            </div>
            <button className="btn btn-outline" style={{ width: '100%' }}>
              <Upload size={16} /> Subir imagen
            </button>
            <div className={styles.imageUploadInfo}>
              JPG o PNG, máximo 700 kb.<br />
              <Link href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>Guía para subir imágenes</Link>
            </div>
          </div>

          {/* Estado del producto */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Estado del producto</h2>
            <select className={styles.input}>
              <option>Borrador</option>
              <option>Publicado</option>
              <option>No aprobado</option>
              <option>Archivado</option>
            </select>
            <p className={styles.helperText}>Puedes manejar los estados del producto en cualquier momento.</p>
          </div>

          {/* SKU */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>SKU</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className={styles.input} placeholder="Se genera automáticamente" disabled />
              <button className="btn btn-outline" style={{ padding: '8px' }}><RefreshCw size={16} /></button>
            </div>
            <p className={styles.helperTextNeutral}>Prefijo S-XXX-######### derivado del nombre.</p>
          </div>

          {/* Taxonomías */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Taxonomías</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Marca</label>
              <select className={styles.input}><option>Seleccionar marca</option></select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Departamento</label>
              <select className={styles.input}><option>Seleccionar departamento</option></select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.input} disabled><option>Primero selecciona un departamento</option></select>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Subcategoría</label>
              <select className={styles.input} disabled><option>Primero selecciona una categoría</option></select>
            </div>
            
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label className={styles.label}>Fineline</label>
              <select className={styles.input} disabled><option>Primero selecciona una subcategoría</option></select>
            </div>
          </div>

          {/* Búsqueda y organización */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Búsqueda y organización</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Keywords (0/10)</label>
              <p className={styles.helperText} style={{ marginBottom: '8px' }}>
                Las keywords están creadas para poder mostrar de manera más eficiente la búsqueda de tus productos. (máx. 10)
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" className={styles.input} placeholder="Agregar palabra clave" />
                <button className="btn btn-outline" style={{ padding: '8px' }}><Plus size={16} /></button>
              </div>
            </div>
            
            <div className={styles.formGroup} style={{ marginBottom: 0 }}>
              <label className={styles.label}>Grupos de búsqueda</label>
              <p className={styles.helperText} style={{ marginBottom: '8px' }}>
                Los grupos están creados para poder organizar mejor tus productos de tu comercio.
              </p>
              <div className={styles.tagRow}>
                <span className={styles.tag}>Novedades</span>
                <span className={styles.tag}>Más vendidos</span>
                <span className={styles.tag}>Preventa</span>
                <span className={styles.tag}>Edición limitada</span>
                <span className={styles.tag}>Ofertas</span>
              </div>
            </div>
          </div>

          {/* Help Box */}
          <div className={styles.helpCard}>
            <div className={styles.helpTitle}>
              <Settings size={20} />
              ¿Necesitas ayuda?
            </div>
            <p className={styles.helpText}>
              Si tienes algún problema con tu cuenta o quieres asesoría para realizar algún proceso dentro de tu dashboard, solicita soporte a nuestro contact center.
            </p>
            <button className="btn" style={{ backgroundColor: '#06B6D4', color: 'black', width: '100%', fontWeight: 600 }}>
              Contactar a soporte
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
