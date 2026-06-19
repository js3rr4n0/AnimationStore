"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Bold, Italic, Heading1, Heading2, Heading3, 
  List, ListOrdered, Quote, Undo, Redo, Trash2, Plus, 
  Upload, RefreshCw, Settings, HelpCircle, Image as ImageIcon
} from "lucide-react";
import { createProduct } from "@/app/actions";
import styles from "./page.module.css";

export default function NuevoProducto() {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skuPreview, setSkuPreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length >= 3) {
      const prefix = val.substring(0, 3).toUpperCase().padEnd(3, 'X');
      setSkuPreview(`S-${prefix}-#########`);
    } else {
      setSkuPreview("");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form 
      action={async (formData) => {
        setIsSubmitting(true);
        try {
          if (imageBase64) {
            formData.append("imagenBase64", imageBase64);
          }
          await createProduct(formData);
        } catch (e) {
          console.error(e);
          setIsSubmitting(false);
          alert("Ocurrió un error al crear el producto.");
        }
      }}
    >
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
          <Link href="/productos" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center' }}>
            Descartar
          </Link>
          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5', border: 'none' }}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formCol}>
          {/* Información del producto */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Información del producto</h2>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre del producto <span className={styles.required}>*</span></label>
              <input name="nombre" type="text" required onChange={handleNameChange} className={styles.input} placeholder="Ej. Figura Escala 1/7 Guerrera Celestial" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Descripción</label>
              <div className={styles.editorToolbar}>
                <button type="button" className={styles.editorBtn}><Bold size={16} /></button>
                <button type="button" className={styles.editorBtn}><Italic size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button type="button" className={styles.editorBtn}><Heading1 size={16} /></button>
                <button type="button" className={styles.editorBtn}><Heading2 size={16} /></button>
                <button type="button" className={styles.editorBtn}><Heading3 size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button type="button" className={styles.editorBtn}><List size={16} /></button>
                <button type="button" className={styles.editorBtn}><ListOrdered size={16} /></button>
                <button type="button" className={styles.editorBtn}><Quote size={16} /></button>
                <div className={styles.editorDivider}></div>
                <button type="button" className={styles.editorBtn}><Undo size={16} /></button>
                <button type="button" className={styles.editorBtn}><Redo size={16} /></button>
              </div>
              <textarea name="descripcion" className={styles.editorArea}></textarea>
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
                  <input name="precio_venta" type="number" step="0.01" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Precio previo de venta</label>
                <div className={styles.inputWithAddon}>
                  <span className={`${styles.addon} ${styles.addonLeft}`}>$</span>
                  <input name="precio_previo" type="number" step="0.01" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Precio costo</label>
                <div className={styles.inputWithAddon}>
                  <span className={`${styles.addon} ${styles.addonLeft}`}>$</span>
                  <input name="precio_costo" type="number" step="0.01" className={styles.input} placeholder="0.00" />
                  <span className={styles.addon}>USD</span>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Stock disponible</label>
                <input name="stock" type="number" className={styles.input} defaultValue="0" />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formCol}>
          {/* Fotografía */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Fotografía principal</h2>
            <div className={styles.imageUploadArea} style={imageBase64 ? { padding: 0, overflow: 'hidden' } : {}}>
              {imageBase64 ? (
                <img src={imageBase64} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <ImageIcon size={32} color="var(--text-secondary)" style={{ marginBottom: '8px' }} />
                  <span>Sin imagen</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleImageUpload} 
            />
            <button type="button" onClick={triggerFileInput} className="btn btn-outline" style={{ width: '100%' }}>
              <Upload size={16} /> {imageBase64 ? 'Cambiar imagen' : 'Subir imagen'}
            </button>
            <div className={styles.imageUploadInfo}>
              JPG o PNG (convertido a Base64 localmente).
            </div>
          </div>

          {/* Estado del producto */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>Estado del producto</h2>
            <select name="estado" className={styles.input} defaultValue="borrador">
              <option value="borrador">Borrador</option>
              <option value="publicado">Publicado</option>
              <option value="no_aprobado">No aprobado</option>
              <option value="archivado">Archivado</option>
            </select>
            <p className={styles.helperText}>Puedes manejar los estados del producto en cualquier momento.</p>
          </div>

          {/* SKU */}
          <div className={styles.cardSection}>
            <h2 className={styles.sectionTitle}>SKU</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" className={styles.input} value={skuPreview} placeholder="Se genera al guardar" disabled />
            </div>
            <p className={styles.helperTextNeutral}>Prefijo S-XXX-######### derivado del nombre.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
