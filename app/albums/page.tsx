"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import AlbumBrowser, {
  AlbumBrowserHandle,
} from "@/components/entities/AlbumBrowser";
import AddAlbumModal from "@/components/entities/AddAlbumModal";
import styles from "../artists/ArtistsPage.module.css";

export default function AlbumsPage() {
  const albumBrowserRef = useRef<AlbumBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Albums.png"
            alt="Albums"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>ALBUMS</h1>
            <p className={styles.subtitle}>Browse all albums</p>
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

<Suspense fallback={<div>Loading albums...</div>}>
  <AlbumBrowser ref={albumBrowserRef} showFilters={showFilters} />
</Suspense>

      {isAddModalOpen && (
        <AddAlbumModal
          onClose={() => setIsAddModalOpen(false)}
          onAlbumSaved={() => albumBrowserRef.current?.reloadAlbums()}
        />
      )}
    </section>
  );
}