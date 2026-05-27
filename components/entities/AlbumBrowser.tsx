"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Album,
  Band,
  deleteAlbum,
  getAlbums,
  getBands,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddAlbumModal from "./AddAlbumModal";
import "./AlbumBrowser.css";

export type AlbumBrowserHandle = {
  reloadAlbums: () => void;
};

type AlbumBrowserProps = {
  showFilters: boolean;
};

const AlbumBrowser = forwardRef<AlbumBrowserHandle, AlbumBrowserProps>(
  function AlbumBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
    const selectedAlbumId = Number(searchParams.get("selected"));

    const [albums, setAlbums] = useState<Album[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadAlbums() {
      try {
        setIsLoading(true);
        setErrorMessage("");

const [albumData, bandData] = await Promise.all([
  getAlbums(),
  getBands(),
]);

setAlbums(albumData);
setBands(bandData);

        setSelectedAlbum((currentAlbum) => {
          if (selectedAlbumId) {
            return (
              albumData.find((album) => album.id === selectedAlbumId) ??
              albumData[0] ??
              null
            );
          }

          if (!currentAlbum) {
            return albumData[0] ?? null;
          }

          return (
            albumData.find((album) => album.id === currentAlbum.id) ??
            albumData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load albums."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadAlbums();
    }, [selectedAlbumId]);

    useImperativeHandle(ref, () => ({
      reloadAlbums: loadAlbums,
    }));

    const filteredAlbums = albums.filter((album) =>
      `${album.title ?? ""} ${album.band_name ?? ""} ${
        album.artist_name ?? ""
      } ${album.year ?? ""} ${album.genre ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedBands(): RelatedItem[] {
      if (!selectedAlbum?.band_name) {
        return [];
      }

      return bands
        .filter(
          (band) =>
            band.name.toLowerCase() === selectedAlbum.band_name?.toLowerCase()
        )
        .map((band) => ({
          id: band.id,
          name: band.name,
          subtitle: band.origin_city || band.genre || null,
          image_url: band.image_url ?? null,
          href: `/bands?selected=${band.id}`,
        }));
    }

    async function handleDeleteAlbum() {
      if (!selectedAlbum) return;

      const confirmed = window.confirm(
        `Delete ${selectedAlbum.title}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteAlbum(selectedAlbum.id);
        await loadAlbums();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete album."
        );
      }
    }

    return (
      <div className="album-browser">
        <aside className="album-list">
          <div className="album-count">{filteredAlbums.length} ALBUMS</div>

          {showFilters && (
            <input
              className="album-search"
              type="text"
              placeholder="Search albums..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="album-empty">Loading albums...</div>}

          {errorMessage && <div className="album-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredAlbums.map((album) => (
              <button
                className={`album-row ${
                  selectedAlbum?.id === album.id ? "active" : ""
                }`}
                key={album.id}
                onClick={() => setSelectedAlbum(album)}
              >
                <Image
                  src={album.image_url || "/icons/Albums.png"}
                  alt={album.title}
                  width={54}
                  height={54}
                  className="album-row-image"
                />

                <span>
                  <strong>{album.title}</strong>
                  <small>
                    {album.band_name || album.artist_name || "Album"}
                  </small>
                  <small>
                    {album.year || album.release_date || "Date unknown"}
                  </small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredAlbums.length === 0 && (
            <div className="album-empty">No albums found.</div>
          )}
        </aside>

        <section className="album-detail">
          {selectedAlbum ? (
            <>
              <div className="album-detail-header">
                <div className="album-profile-top">
                  <Image
                    src={selectedAlbum.image_url || "/icons/Albums.png"}
                    alt={selectedAlbum.title}
                    width={160}
                    height={160}
                    className="album-detail-image"
                  />

                  <div className="album-profile-copy">
                    <h2>{selectedAlbum.title}</h2>
                    <p className="album-role">
                      {selectedAlbum.band_name ||
                        selectedAlbum.artist_name ||
                        "Album"}
                    </p>
                    <p className="album-location">
                      {selectedAlbum.year ||
                        selectedAlbum.release_date ||
                        "Date unknown"}
                    </p>
                    <p className="album-bio">
                      {selectedAlbum.notes ||
                        "No notes have been added for this album yet."}
                    </p>
                  </div>
                </div>

                <div className="album-detail-actions">
                  <button
                    type="button"
                    className="album-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="album-action-button delete"
                    onClick={handleDeleteAlbum}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="album-related-area">
                <RelatedSection
                  title="RELATED BANDS"
                  emptyText="No bands have been linked to this album yet."
                  items={getRelatedBands()}
                  fallbackIcon="/icons/Bands.png"
                  onLinkClick={() => alert("Link band modal coming next.")}
                  actionLabel="+ ADD BAND"
                />
              </div>

              {isEditModalOpen && selectedAlbum && (
                <AddAlbumModal
                  album={selectedAlbum}
                  onClose={() => setIsEditModalOpen(false)}
                  onAlbumSaved={loadAlbums}
                />
              )}
            </>
          ) : (
            <div className="album-empty">Select an album.</div>
          )}
        </section>
      </div>
    );
  }
);

export default AlbumBrowser;