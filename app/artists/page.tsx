"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import ArtistBrowser, {
  ArtistBrowserHandle,
} from "@/components/entities/ArtistBrowser";
import AddArtistModal from "@/components/entities/AddArtistModal";
import styles from "./ArtistsPage.module.css";

export default function ArtistsPage() {
  const artistBrowserRef = useRef<ArtistBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Artists.png"
            alt="Artists"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>ARTISTS</h1>
            <p className={styles.subtitle}>Browse all artists</p>
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

      <ArtistBrowser ref={artistBrowserRef} showFilters={showFilters} />

      {isAddModalOpen && (
        <AddArtistModal
          onClose={() => setIsAddModalOpen(false)}
          onArtistSaved={() => artistBrowserRef.current?.reloadArtists()}
        />
      )}
    </section>
  );
}