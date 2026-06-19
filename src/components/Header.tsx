"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink } from "lucide-react";
import styles from "./Header.module.css";

const PATH_NAMES: Record<string, string> = {
  "/": "Inicio",
  "/productos": "Productos",
  "/ordenes": "Órdenes",
  "/clientes": "Clientes",
  "/reportes": "Reportes",
  "/marketing": "Marketing",
  "/configuracion": "Configuración",
};

export default function Header() {
  const pathname = usePathname();
  // We use split to handle sub-paths if needed, but for simplicity we match base
  const basepath = `/${pathname.split('/')[1]}`;
  const pageName = PATH_NAMES[basepath] || "Inicio";

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <div className={styles.breadcrumb}>
          <span className={styles.storeName}>Animation Store</span> / <span className={styles.currentPage}>{pageName}</span>
        </div>
        <div className={styles.statusGroup}>
          <div className={styles.statusIndicator}>
            <span className={`${styles.dot} ${styles.dotOnline}`}></span> Online
          </div>
          <div className={styles.statusIndicator}>
            <span className={`${styles.dot} ${styles.dotApproved}`}></span> Aprobado
          </div>
          <Link href="#" className={styles.viewStoreBtn}>
            Ver comercio <ExternalLink size={14} />
          </Link>
        </div>
      </div>
      
      <nav className={styles.navigation}>
        {Object.entries(PATH_NAMES).map(([path, name]) => (
          <Link 
            key={path} 
            href={path} 
            className={`${styles.navItem} ${basepath === path ? styles.active : ''}`}
          >
            {name}
          </Link>
        ))}
        
        <div className={styles.navSpacer}></div>
        
        <div className={styles.navControls}>
          <div className={styles.scrollBtn}>▲</div>
          <div className={styles.scrollBtn}>▼</div>
        </div>
      </nav>
    </header>
  );
}
