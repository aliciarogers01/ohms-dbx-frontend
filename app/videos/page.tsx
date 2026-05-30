"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import VideoBrowser, {
  VideoBrowserHandle,
} from "@/components/entities/VideoBrowser";
import AddVideoModal from "@/components/entities/AddVideoModal";
import styles from "../artists/ArtistsPage.module.css";

export default function VideosPage() {
  const videoBrowserRef = useRef<VideoBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Videos.png"
            alt="VIDEOS"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>VIDEOS</h1>
            <p className={styles.subtitle}>Browse videos</p>
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

      <Suspense fallback={<div>Loading videos...</div>}>
        <VideoBrowser ref={videoBrowserRef} showFilters={showFilters} />
      </Suspense>

      {isAddModalOpen && (
        <AddVideoModal
          onClose={() => setIsAddModalOpen(false)}
          onVideoSaved={() => videoBrowserRef.current?.reloadVideos()}
        />
      )}
    </section>
  );
}
