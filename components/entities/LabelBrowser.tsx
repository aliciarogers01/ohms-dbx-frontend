"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Label,
  deleteLabel,
  getLabels,
  Album,
  getAlbums,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddLabelModal from "./AddLabelModal";
import "./LabelBrowser.css";

export type LabelBrowserHandle = {
  reloadLabels: () => void;
};

type LabelBrowserProps = {
  showFilters: boolean;
};

const LabelBrowser = forwardRef<LabelBrowserHandle, LabelBrowserProps>(
  function LabelBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
    const selectedLabelId = Number(searchParams.get("selected"));

    const [labels, setLabels] = useState<Label[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadLabels() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [labelData, albumData] = await Promise.all([
          getLabels(),
          getAlbums(),
        ]);

        setLabels(labelData);
        setAlbums(albumData);

        setSelectedLabel((currentLabel) => {
          if (selectedLabelId) {
            return (
              labelData.find((label) => label.id === selectedLabelId) ??
              labelData[0] ??
              null
            );
          }

          if (!currentLabel) {
            return labelData[0] ?? null;
          }

          return (
            labelData.find((label) => label.id === currentLabel.id) ??
            labelData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load labels."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadLabels();
    }, [selectedLabelId]);

    useImperativeHandle(ref, () => ({
      reloadLabels: loadLabels,
    }));

    const filteredLabels = labels.filter((label) =>
      ((label.name ?? "") + " " + (label.city ?? "") + " " + (label.region ?? "") + " " + (label.years_active ?? "") + " " + (label.history ?? "") + " " + (label.notes ?? ""))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedAlbums(): RelatedItem[] {
      if (!selectedLabel) {
        return [];
      }

      return albums
        .filter((album) => album.label?.toLowerCase() === selectedLabel.name.toLowerCase())
        .map((album) => ({
          id: album.id,
          name: album.title,
          subtitle: album.year || album.release_date || null,
          image_url: album.image_url ?? null,
          href: `/albums?selected=${album.id}`,
        }));
    }

    async function handleDeleteLabel() {
      if (!selectedLabel) return;

      const confirmed = window.confirm(
        `Delete ${selectedLabel.name}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteLabel(selectedLabel.id);
        await loadLabels();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete label."
        );
      }
    }

    return (
      <div className="label-browser">
        <aside className="label-list">
          <div className="label-count">{filteredLabels.length} LABELS</div>

          {showFilters && (
            <input
              className="label-search"
              type="text"
              placeholder="Search labels..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="label-empty">Loading labels...</div>}

          {errorMessage && <div className="label-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredLabels.map((label) => (
              <button
                className={`label-row ${
                  selectedLabel?.id === label.id ? "active" : ""
                }`}
                key={label.id}
onClick={() => {
  setSelectedLabel(label);
  router.replace(`${pathname}?selected=${label.id}`, { scroll: false });
}}
              >
                <Image
                  src={label.image_url || "/icons/Labels.png"}
                  alt={label.name}
                  width={54}
                  height={54}
                  className="label-row-image"
                />

                <span>
                  <strong>{label.name}</strong>
                  <small>{label.city || "Label"}</small>
                  <small>{label.years_active || label.region || "Dates unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredLabels.length === 0 && (
            <div className="label-empty">No labels found.</div>
          )}
        </aside>

        <section className="label-detail">
          {selectedLabel ? (
            <>
              <div className="label-detail-header">
                <div className="label-profile-top">
                  <Image
                    src={selectedLabel.image_url || "/icons/Labels.png"}
                    alt={selectedLabel.name}
                    width={160}
                    height={160}
                    className="label-detail-image"
                  />

                  <div className="label-profile-copy">
                    <h2>{selectedLabel.name}</h2>
                    <p className="label-role">
                      {selectedLabel.city || selectedLabel.region || "Label"}
                    </p>
                    <p className="label-location">
                      {selectedLabel.years_active || "Dates unknown"}
                    </p>
                    <p className="label-bio">
                      {selectedLabel.history || selectedLabel.notes || "No history has been added for this label yet."}
                    </p>
                  </div>
                </div>

                <div className="label-detail-actions">
                  <button
                    type="button"
                    className="label-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="label-action-button delete"
                    onClick={handleDeleteLabel}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div className="label-related-area">
                <RelatedSection
                  title="RELATED ALBUMS"
                  emptyText="No albums have been linked to this label yet."
                  items={getRelatedAlbums()}
                  fallbackIcon="/icons/Albums.png"
                  onLinkClick={() => alert("Add album from this section is coming next.")}
                  actionLabel="+ ADD ALBUM"
                />
              </div>

              {isEditModalOpen && selectedLabel && (
                <AddLabelModal
                  label={selectedLabel}
                  onClose={() => setIsEditModalOpen(false)}
                  onLabelSaved={loadLabels}
                />
              )}
            </>
          ) : (
            <div className="label-empty">Select a label.</div>
          )}
        </section>
      </div>
    );
  }
);

export default LabelBrowser;
