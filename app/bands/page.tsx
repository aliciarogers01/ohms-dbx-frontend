"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import BandBrowser, {
  BandBrowserHandle,
} from "@/components/entities/BandBrowser";
import AddBandModal from "@/components/entities/AddBandModal";
import styles from "../artists/ArtistsPage.module.css";

export default function BandsPage() {
  const bandBrowserRef = useRef<BandBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Bands.png"
            alt="Bands"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>BANDS</h1>
            <p className={styles.subtitle}>Browse all bands</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={styles.button}
            onClick={() => setShowFilters((current) => !current)}
          >
            FILTER
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.addButton}`}
            onClick={() => setIsAddModalOpen(true)}
          >
            + ADD
          </button>
        </div>
      </header>

      <BandBrowser ref={bandBrowserRef} showFilters={showFilters} />

      {isAddModalOpen && (
        <AddBandModal
          onClose={() => setIsAddModalOpen(false)}
          onBandSaved={() => bandBrowserRef.current?.reloadBands()}
        />
      )}
    </section>
  );
}