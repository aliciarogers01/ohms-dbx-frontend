"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import FlyerBrowser, {
  FlyerBrowserHandle,
} from "@/components/entities/FlyerBrowser";
import AddFlyerModal from "@/components/entities/AddFlyerModal";
import styles from "../artists/ArtistsPage.module.css";

export default function FlyersPage() {
  const flyerBrowserRef = useRef<FlyerBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Flyers.png"
            alt="Flyers"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>FLYERS</h1>
            <p className={styles.subtitle}>Browse show flyers</p>
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

      <FlyerBrowser ref={flyerBrowserRef} showFilters={showFilters} />

      {isAddModalOpen && (
        <AddFlyerModal
          onClose={() => setIsAddModalOpen(false)}
          onFlyerSaved={() => flyerBrowserRef.current?.reloadFlyers()}
        />
      )}
    </section>
  );
}
