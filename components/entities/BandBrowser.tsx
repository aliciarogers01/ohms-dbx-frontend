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
  Artist,
  Band,
  deleteBand,
  getAlbums,
  getArtists,
  getBands,
} from "@/lib/api";
import {
  isBadRelationshipName,
  parseRelationshipList,
} from "@/lib/relationships";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import LinkArtistModal from "./LinkArtistModal";
import AddBandModal from "./AddBandModal";
import "./BandBrowser.css";

export type BandBrowserHandle = {
  reloadBands: () => void;
};

type BandBrowserProps = {
  showFilters: boolean;
};

const BandBrowser = forwardRef<BandBrowserHandle, BandBrowserProps>(
  function BandBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
    const selectedBandId = Number(searchParams.get("selected"));

    const [bands, setBands] = useState<Band[]>([]);
    const [artists, setArtists] = useState<Artist[]>([]);
const [albums, setAlbums] = useState<Album[]>([]);
    const [selectedBand, setSelectedBand] = useState<Band | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isLinkArtistModalOpen, setIsLinkArtistModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadBands() {
      try {
        setIsLoading(true);
        setErrorMessage("");

const [bandData, artistData, albumData] = await Promise.all([
  getBands(),
  getArtists(),
  getAlbums(),
]);

setBands(bandData);
setArtists(artistData);
setAlbums(albumData);

        setSelectedBand((currentBand) => {
          if (selectedBandId) {
            return (
              bandData.find((band) => band.id === selectedBandId) ??
              bandData[0] ??
              null
            );
          }

          if (!currentBand) {
            return bandData[0] ?? null;
          }

          return (
            bandData.find((band) => band.id === currentBand.id) ??
            bandData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load bands."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadBands();
    }, [selectedBandId]);

    useImperativeHandle(ref, () => ({
      reloadBands: loadBands,
    }));

const filteredBands = bands.filter(
  (band) =>
    !isBadRelationshipName(band.name) &&
    `${band.name ?? ""} ${band.origin_city ?? ""} ${band.genre ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);

    function getRelatedArtists(): RelatedItem[] {
      if (!selectedBand) {
        return [];
      }

      return artists
        .filter((artist) => {
          const artistBands = parseRelationshipList<Band>(artist.bands);
          return artistBands.some((band) => band.id === selectedBand.id);
        })
        .map((artist) => ({
          id: artist.id,
          name: artist.name,
          subtitle: artist.roles ?? artist.hometown ?? null,
          image_url: artist.image_url ?? null,
          href: `/artists?selected=${artist.id}`,
        }));
    }

function getRelatedAlbums(): RelatedItem[] {
  if (!selectedBand) {
    return [];
  }

  return albums
    .filter(
      (album) =>
        album.band_name?.toLowerCase() === selectedBand.name.toLowerCase()
    )
    .map((album) => ({
      id: album.id,
      name: album.title,
      subtitle: album.year || album.genre || null,
      image_url: album.image_url ?? null,
      href: `/albums?selected=${album.id}`,
    }));
}

    async function handleDeleteBand() {
      if (!selectedBand) {
        return;
      }

      const confirmed = window.confirm(
        `Delete ${selectedBand.name}? This cannot be undone.`
      );

      if (!confirmed) {
        return;
      }

      try {
        await deleteBand(selectedBand.id);
        await loadBands();
      } catch (error) {
        alert(error instanceof Error ? error.message : "Failed to delete band.");
      }
    }

    return (
      <div className="band-browser">
        <aside className="band-list">
          <div className="band-count">{filteredBands.length} BANDS</div>

          {showFilters && (
            <input
              className="band-search"
              type="text"
              placeholder="Search bands..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="band-empty">Loading bands...</div>}

          {errorMessage && <div className="band-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredBands.map((band) => (
              <button
                className={`band-row ${
                  selectedBand?.id === band.id ? "active" : ""
                }`}
                key={band.id}
                onClick={() => setSelectedBand(band)}
              >
                <Image
                  src={band.image_url || "/icons/Bands.png"}
                  alt={band.name}
                  width={54}
                  height={54}
                  className="band-row-image"
                />

                <span>
                  <strong>{band.name}</strong>
                  <small>{band.genre || "Band"}</small>
                  <small>{band.origin_city || "Location unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredBands.length === 0 && (
            <div className="band-empty">No bands found.</div>
          )}
        </aside>

        <section className="band-detail">
          {selectedBand ? (
            <>
              <div className="band-detail-header">
                <div className="band-profile-top">
                  <Image
                    src={selectedBand.image_url || "/icons/Bands.png"}
                    alt={selectedBand.name}
                    width={160}
                    height={160}
                    className="band-detail-image"
                  />

                  <div className="band-profile-copy">
                    <h2>{selectedBand.name}</h2>
                    <p className="band-role">{selectedBand.genre || "Band"}</p>
                    <p className="band-location">
                      {selectedBand.origin_city || "Location unknown"}
                    </p>
                    <p className="band-bio">
                      {selectedBand.bio ||
                        "No biography has been added for this band yet."}
                    </p>
                  </div>
                </div>

                <div className="band-detail-actions">
                  <button
                    type="button"
                    className="band-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="band-action-button delete"
                    onClick={handleDeleteBand}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="band-related-area">
                <RelatedSection
                  title="RELATED ARTISTS"
                  emptyText="No artists have been linked to this band yet."
                  items={getRelatedArtists()}
                  fallbackIcon="/icons/Artists.png"
                  onLinkClick={() => setIsLinkArtistModalOpen(true)}
                  actionLabel="+ ADD ARTIST"
                />

<RelatedSection
  title="RELATED ALBUMS"
  emptyText="No albums have been linked to this band yet."
  items={getRelatedAlbums()}
  fallbackIcon="/icons/Albums.png"
  onLinkClick={() => alert("Link album modal coming next.")}
  actionLabel="+ ADD ALBUM"
/>
              </div>

              {isLinkArtistModalOpen && selectedBand && (
                <LinkArtistModal
                  band={selectedBand}
                  onClose={() => setIsLinkArtistModalOpen(false)}
                  onLinked={loadBands}
                />
              )}

              {isEditModalOpen && selectedBand && (
                <AddBandModal
                  band={selectedBand}
                  onClose={() => setIsEditModalOpen(false)}
                  onBandSaved={loadBands}
                />
              )}
            </>
          ) : (
            <div className="band-empty">Select a band.</div>
          )}
        </section>
      </div>
    );
  }
);

export default BandBrowser;