"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import StudioBrowser, {
  StudioBrowserHandle,
} from "@/components/entities/StudioBrowser";
import AddStudioModal from "@/components/entities/AddStudioModal";
import styles from "../artists/ArtistsPage.module.css";

export default function StudiosPage() {
  const studioBrowserRef = useRef<StudioBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Studios.png"
            alt="STUDIOS"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>STUDIOS</h1>
            <p className={styles.subtitle}>Browse recording studios</p>
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

      <Suspense fallback={<div>Loading studios...</div>}>
        <StudioBrowser ref={studioBrowserRef} showFilters={showFilters} />
      </Suspense>

      {isAddModalOpen && (
        <AddStudioModal
          onClose={() => setIsAddModalOpen(false)}
          onStudioSaved={() => studioBrowserRef.current?.reloadStudios()}
        />
      )}
    </section>
  );
}
