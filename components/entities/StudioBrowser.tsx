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
  Studio,
  deleteStudio,
  getStudios,
  Album,
  getAlbums,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddStudioModal from "./AddStudioModal";
import "./StudioBrowser.css";

export type StudioBrowserHandle = {
  reloadStudios: () => void;
};

type StudioBrowserProps = {
  showFilters: boolean;
};

const StudioBrowser = forwardRef<StudioBrowserHandle, StudioBrowserProps>(
  function StudioBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
    const selectedStudioId = Number(searchParams.get("selected"));

    const [studios, setStudios] = useState<Studio[]>([]);
    const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedStudio, setSelectedStudio] = useState<Studio | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadStudios() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [studioData, albumData] = await Promise.all([
          getStudios(),
          getAlbums(),
        ]);

        setStudios(studioData);
        setAlbums(albumData);

        setSelectedStudio((currentStudio) => {
          if (selectedStudioId) {
            return (
              studioData.find((studio) => studio.id === selectedStudioId) ??
              studioData[0] ??
              null
            );
          }

          if (!currentStudio) {
            return studioData[0] ?? null;
          }

          return (
            studioData.find((studio) => studio.id === currentStudio.id) ??
            studioData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load studios."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadStudios();
    }, [selectedStudioId]);

    useImperativeHandle(ref, () => ({
      reloadStudios: loadStudios,
    }));

    const filteredStudios = studios.filter((studio) =>
      ((studio.name ?? "") + " " + (studio.city ?? "") + " " + (studio.region ?? "") + " " + (studio.address ?? "") + " " + (studio.years_active ?? "") + " " + (studio.history ?? "") + " " + (studio.notes ?? ""))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedAlbums(): RelatedItem[] {
      if (!selectedStudio) {
        return [];
      }

      return albums
        .filter((album) => album.studio?.toLowerCase() === selectedStudio.name.toLowerCase())
        .map((album) => ({
          id: album.id,
          name: album.title,
          subtitle: album.year || album.release_date || null,
          image_url: album.image_url ?? null,
          href: `/albums?selected=${album.id}`,
        }));
    }

    async function handleDeleteStudio() {
      if (!selectedStudio) return;

      const confirmed = window.confirm(
        `Delete ${selectedStudio.name}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteStudio(selectedStudio.id);
        await loadStudios();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete studio."
        );
      }
    }

    return (
      <div className="studio-browser">
        <aside className="studio-list">
          <div className="studio-count">{filteredStudios.length} STUDIOS</div>

          {showFilters && (
            <input
              className="studio-search"
              type="text"
              placeholder="Search studios..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="studio-empty">Loading studios...</div>}

          {errorMessage && <div className="studio-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredStudios.map((studio) => (
              <button
                className={`studio-row ${
                  selectedStudio?.id === studio.id ? "active" : ""
                }`}
                key={studio.id}
onClick={() => {
  setSelectedStudio(studio);
  router.replace(`${pathname}?selected=${studio.id}`, { scroll: false });
}}
              >
                <Image
                  src={studio.image_url || "/icons/Studios.png"}
                  alt={studio.name}
                  width={54}
                  height={54}
                  className="studio-row-image"
                />

                <span>
                  <strong>{studio.name}</strong>
                  <small>{studio.city || "Studio"}</small>
                  <small>{studio.years_active || studio.region || "Dates unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredStudios.length === 0 && (
            <div className="studio-empty">No studios found.</div>
          )}
        </aside>

        <section className="studio-detail">
          {selectedStudio ? (
            <>
              <div className="studio-detail-header">
                <div className="studio-profile-top">
                  <Image
                    src={selectedStudio.image_url || "/icons/Studios.png"}
                    alt={selectedStudio.name}
                    width={160}
                    height={160}
                    className="studio-detail-image"
                  />

                  <div className="studio-profile-copy">
                    <h2>{selectedStudio.name}</h2>
                    <p className="studio-role">
                      {selectedStudio.city || selectedStudio.region || "Studio"}
                    </p>
                    <p className="studio-location">
                      {selectedStudio.address || selectedStudio.years_active || "Address unknown"}
                    </p>
                    <p className="studio-bio">
                      {selectedStudio.history || selectedStudio.notes || "No history has been added for this studio yet."}
                    </p>
                  </div>
                </div>

                <div className="studio-detail-actions">
                  <button
                    type="button"
                    className="studio-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="studio-action-button delete"
                    onClick={handleDeleteStudio}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div className="studio-related-area">
                <RelatedSection
                  title="RELATED ALBUMS"
                  emptyText="No albums have been linked to this studio yet."
                  items={getRelatedAlbums()}
                  fallbackIcon="/icons/Albums.png"
                  onLinkClick={() => alert("Add album from this section is coming next.")}
                  actionLabel="+ ADD ALBUM"
                />
              </div>

              {isEditModalOpen && selectedStudio && (
                <AddStudioModal
                  studio={selectedStudio}
                  onClose={() => setIsEditModalOpen(false)}
                  onStudioSaved={loadStudios}
                />
              )}
            </>
          ) : (
            <div className="studio-empty">Select a studio.</div>
          )}
        </section>
      </div>
    );
  }
);

export default StudioBrowser;
