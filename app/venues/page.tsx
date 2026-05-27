"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import VenueBrowser, {
  VenueBrowserHandle,
} from "@/components/entities/VenueBrowser";
import AddVenueModal from "@/components/entities/AddVenueModal";
import styles from "../artists/ArtistsPage.module.css";

export default function VenuesPage() {
  const venueBrowserRef = useRef<VenueBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Venues.png"
            alt="Venues"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>VENUES</h1>
            <p className={styles.subtitle}>Browse venues</p>
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

<Suspense fallback={<div>Loading venues...</div>}>
  <VenueBrowser ref={venueBrowserRef} showFilters={showFilters} />
</Suspense>

      {isAddModalOpen && (
        <AddVenueModal
          onClose={() => setIsAddModalOpen(false)}
          onVenueSaved={() => venueBrowserRef.current?.reloadVenues()}
        />
      )}
    </section>
  );
}
