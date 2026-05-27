"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import AddArtistModal from "./AddArtistModal";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import LinkBandModal from "./LinkBandModal";
import {
  Artist,
  Band,
  deleteArtist,
  getArtists,
} from "@/lib/api";
import {
  isBadRelationshipName,
  parseRelationshipList,
} from "@/lib/relationships";
import "./ArtistBrowser.css";

export type ArtistBrowserHandle = {
  reloadArtists: () => void;
};

type ArtistBrowserProps = {
  showFilters: boolean;
};

const ArtistBrowser = forwardRef<ArtistBrowserHandle, ArtistBrowserProps>(
  function ArtistBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
    const selectedArtistId = Number(searchParams.get("selected"));

    const [artists, setArtists] = useState<Artist[]>([]);
    const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isLinkBandModalOpen, setIsLinkBandModalOpen] = useState(false);

    async function loadArtists() {
      try {
        setIsLoading(true);
        setErrorMessage("");

const artistData = await getArtists();

setArtists(artistData);

        setSelectedArtist((currentArtist) => {
          if (selectedArtistId) {
            return (
              artistData.find((artist) => artist.id === selectedArtistId) ??
              artistData[0] ??
              null
            );
          }

          if (!currentArtist) {
            return artistData[0] ?? null;
          }

          return (
            artistData.find((artist) => artist.id === currentArtist.id) ??
            artistData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load artists."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useImperativeHandle(ref, () => ({
      reloadArtists: loadArtists,
    }));

    useEffect(() => {
      loadArtists();
    }, [selectedArtistId]);

    async function handleDeleteArtist() {
      if (!selectedArtist) return;

      const confirmed = window.confirm(`Delete ${selectedArtist.name}?`);

      if (!confirmed) return;

      try {
        await deleteArtist(selectedArtist.id);
        await loadArtists();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete artist."
        );
      }
    }

    function getRelatedBands(): RelatedItem[] {
      if (!selectedArtist?.bands || selectedArtist.bands === "{}") {
        return [];
      }

      const parsedBands = parseRelationshipList<Band>(selectedArtist.bands);

      return parsedBands
        .filter((band) => !isBadRelationshipName(band.name))
        .map((band, index) => ({
          id: band.id ?? index,
          name: band.name ?? String(band),
          subtitle: band.origin_city ?? null,
          image_url: band.image_url ?? null,
          href: band.id ? `/bands?selected=${band.id}` : undefined,
        }));
    }

    const filteredArtists = artists.filter(
      (artist) =>
        !isBadRelationshipName(artist.name) &&
        `${artist.name ?? ""} ${artist.roles ?? ""} ${artist.hometown ?? ""}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );

    return (
      <div className="artist-browser">
        <aside className="artist-list">
          <div className="artist-count">{filteredArtists.length} ARTISTS</div>

          {showFilters && (
            <input
              className="artist-search"
              type="text"
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="artist-empty">Loading artists...</div>}

          {errorMessage && <div className="artist-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredArtists.map((artist) => (
              <button
                className={`artist-row ${
                  selectedArtist?.id === artist.id ? "active" : ""
                }`}
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
              >
                <Image
                  src={artist.image_url || "/icons/Artists.png"}
                  alt={artist.name}
                  width={54}
                  height={54}
                  className="artist-row-image"
                />

                <span>
                  <strong>{artist.name}</strong>
                  <small>{artist.roles || "Artist"}</small>
                  <small>{artist.hometown || "Location unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredArtists.length === 0 && (
            <div className="artist-empty">No artists found.</div>
          )}
        </aside>

        <section className="artist-detail">
          {selectedArtist ? (
            <>
              <div className="artist-profile-top">
                <Image
                  src={selectedArtist.image_url || "/icons/Artists.png"}
                  alt={selectedArtist.name}
                  width={160}
                  height={160}
                  className="artist-detail-image"
                />

                <div className="artist-profile-copy">
                  <div className="artist-detail-header">
                    <div>
                      <h2>{selectedArtist.name}</h2>
                      <p className="artist-role">
                        {selectedArtist.roles || "Artist"}
                      </p>
                      <p className="artist-location">
                        {selectedArtist.hometown || "Location unknown"}
                      </p>
                    </div>

                    <div className="artist-detail-actions">
                      <button
                        type="button"
                        className="artist-action-button"
                        onClick={() => setIsEditModalOpen(true)}
                      >
                        EDIT
                      </button>

                      <button
                        type="button"
                        className="artist-action-button delete"
                        onClick={handleDeleteArtist}
                      >
                        DELETE
                      </button>
                    </div>
                  </div>

                  <p className="artist-bio">
                    {selectedArtist.bio ||
                      "No biography has been added for this artist yet."}
                  </p>
                </div>
              </div>

              <div className="artist-related-area">
<RelatedSection
  title="RELATED BANDS"
  emptyText="No bands have been linked to this artist yet."
  items={getRelatedBands()}
  fallbackIcon="/icons/Bands.png"
  onLinkClick={() => setIsLinkBandModalOpen(true)}
  actionLabel="+ ADD BAND"
/>
              </div>

              {isEditModalOpen && (
                <AddArtistModal
                  artist={selectedArtist}
                  onClose={() => setIsEditModalOpen(false)}
                  onArtistSaved={loadArtists}
                />
              )}

              {isLinkBandModalOpen && selectedArtist && (
                <LinkBandModal
                  artist={selectedArtist}
                  onClose={() => setIsLinkBandModalOpen(false)}
                  onLinked={loadArtists}
                />
              )}
            </>
          ) : (
            <div className="artist-empty">Select an artist.</div>
          )}
        </section>
      </div>
    );
  }
);

export default ArtistBrowser;