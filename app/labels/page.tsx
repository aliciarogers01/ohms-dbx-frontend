"use client";

import { Suspense, useRef, useState } from "react";
import Image from "next/image";
import LabelBrowser, {
  LabelBrowserHandle,
} from "@/components/entities/LabelBrowser";
import AddLabelModal from "@/components/entities/AddLabelModal";
import styles from "../artists/ArtistsPage.module.css";

export default function LabelsPage() {
  const labelBrowserRef = useRef<LabelBrowserHandle>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          <Image
            className={styles.headerIcon}
            src="/icons/Labels.png"
            alt="LABELS"
            width={74}
            height={74}
            priority
          />

          <div>
            <h1 className={styles.title}>LABELS</h1>
            <p className={styles.subtitle}>Browse record labels</p>
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

      <Suspense fallback={<div>Loading labels...</div>}>
        <LabelBrowser ref={labelBrowserRef} showFilters={showFilters} />
      </Suspense>

      {isAddModalOpen && (
        <AddLabelModal
          onClose={() => setIsAddModalOpen(false)}
          onLabelSaved={() => labelBrowserRef.current?.reloadLabels()}
        />
      )}
    </section>
  );
}
