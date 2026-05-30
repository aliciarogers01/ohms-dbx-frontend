"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import BookZineBrowser, {
  BookZineBrowserHandle,
} from "@/components/entities/BookZineBrowser";
import AddBookZineModal from "@/components/entities/AddBookZineModal";
import styles from "../artists/ArtistsPage.module.css";

export default function BooksZinesPage() {
  const bookZineBrowserRef = useRef<BookZineBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Books-Zines.png"
            alt="BOOKS / ZINES"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>BOOKS / ZINES</h1>
            <p className={styles.subtitle}>Browse books, magazines, and zines</p>
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

      <Suspense fallback={<div>Loading books / zines...</div>}>
        <BookZineBrowser ref={bookZineBrowserRef} showFilters={showFilters} />
      </Suspense>

      {isAddModalOpen && (
        <AddBookZineModal
          onClose={() => setIsAddModalOpen(false)}
          onBookZineSaved={() => bookZineBrowserRef.current?.reloadBooksZines()}
        />
      )}
    </section>
  );
}
