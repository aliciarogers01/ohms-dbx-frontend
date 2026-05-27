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
  Band,
  Flyer,
  Venue,
  deleteFlyer,
  getBands,
  getFlyers,
  getVenues,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddFlyerModal from "./AddFlyerModal";
import "./FlyerBrowser.css";

export type FlyerBrowserHandle = {
  reloadFlyers: () => void;
};

type FlyerBrowserProps = {
  showFilters: boolean;
};

const FlyerBrowser = forwardRef<FlyerBrowserHandle, FlyerBrowserProps>(
  function FlyerBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
    const selectedFlyerId = Number(searchParams.get("selected"));

    const [flyers, setFlyers] = useState<Flyer[]>([]);
    const [bands, setBands] = useState<Band[]>([]);
    const [venues, setVenues] = useState<Venue[]>([]);
    const [selectedFlyer, setSelectedFlyer] = useState<Flyer | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadFlyers() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [flyerData, bandData, venueData] = await Promise.all([
          getFlyers(),
          getBands(),
          getVenues(),
        ]);

        setFlyers(flyerData);
        setBands(bandData);
        setVenues(venueData);

        setSelectedFlyer((currentFlyer) => {
          if (selectedFlyerId) {
            return (
              flyerData.find((flyer) => flyer.id === selectedFlyerId) ??
              flyerData[0] ??
              null
            );
          }

          if (!currentFlyer) {
            return flyerData[0] ?? null;
          }

          return (
            flyerData.find((flyer) => flyer.id === currentFlyer.id) ??
            flyerData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load flyers."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadFlyers();
    }, [selectedFlyerId]);

    useImperativeHandle(ref, () => ({
      reloadFlyers: loadFlyers,
    }));

    const filteredFlyers = flyers.filter((flyer) =>
      `${flyer.title ?? ""} ${flyer.event_name ?? ""} ${
        flyer.venue_name ?? ""
      } ${flyer.band_name ?? ""} ${flyer.artist_name ?? ""} ${
        flyer.city ?? ""
      } ${flyer.year ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedBands(): RelatedItem[] {
      if (!selectedFlyer?.band_name) {
        return [];
      }

      return bands
        .filter(
          (band) =>
            band.name.toLowerCase() === selectedFlyer.band_name?.toLowerCase()
        )
        .map((band) => ({
          id: band.id,
          name: band.name,
          subtitle: band.origin_city || band.genre || null,
          image_url: band.image_url ?? null,
          href: `/bands?selected=${band.id}`,
        }));
    }

    function getRelatedVenues(): RelatedItem[] {
      if (!selectedFlyer?.venue_name) {
        return [];
      }

      return venues
        .filter(
          (venue) =>
            venue.name.toLowerCase() === selectedFlyer.venue_name?.toLowerCase()
        )
        .map((venue) => ({
          id: venue.id,
          name: venue.name,
          subtitle: venue.city || venue.region || null,
          image_url: venue.image_url ?? null,
          href: `/venues?selected=${venue.id}`,
        }));
    }

    async function handleDeleteFlyer() {
      if (!selectedFlyer) return;

      const confirmed = window.confirm(
        `Delete ${selectedFlyer.title}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteFlyer(selectedFlyer.id);
        await loadFlyers();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete flyer."
        );
      }
    }

    return (
      <div className="flyer-browser">
        <aside className="flyer-list">
          <div className="flyer-count">{filteredFlyers.length} FLYERS</div>

          {showFilters && (
            <input
              className="flyer-search"
              type="text"
              placeholder="Search flyers..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="flyer-empty">Loading flyers...</div>}

          {errorMessage && <div className="flyer-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredFlyers.map((flyer) => (
              <button
                className={`flyer-row ${
                  selectedFlyer?.id === flyer.id ? "active" : ""
                }`}
                key={flyer.id}
                onClick={() => setSelectedFlyer(flyer)}
              >
                <Image
                  src={flyer.image_url || "/icons/Flyers.png"}
                  alt={flyer.title}
                  width={54}
                  height={54}
                  className="flyer-row-image"
                />

                <span>
                  <strong>{flyer.title}</strong>
                  <small>{flyer.venue_name || flyer.event_name || "Flyer"}</small>
                  <small>{flyer.year || flyer.event_date || "Date unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredFlyers.length === 0 && (
            <div className="flyer-empty">No flyers found.</div>
          )}
        </aside>

        <section className="flyer-detail">
          {selectedFlyer ? (
            <>
              <div className="flyer-detail-header">
                <div className="flyer-profile-top">
                  <Image
                    src={selectedFlyer.image_url || "/icons/Flyers.png"}
                    alt={selectedFlyer.title}
                    width={160}
                    height={160}
                    className="flyer-detail-image"
                  />

                  <div className="flyer-profile-copy">
                    <h2>{selectedFlyer.title}</h2>
                    <p className="flyer-role">
                      {selectedFlyer.event_name || selectedFlyer.venue_name || "Flyer"}
                    </p>
                    <p className="flyer-location">
                      {selectedFlyer.year || selectedFlyer.event_date || "Date unknown"}
                    </p>
                    <p className="flyer-bio">
                      {selectedFlyer.notes ||
                        "No notes have been added for this flyer yet."}
                    </p>
                  </div>
                </div>

                <div className="flyer-detail-actions">
                  <button
                    type="button"
                    className="flyer-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="flyer-action-button delete"
                    onClick={handleDeleteFlyer}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="flyer-related-area">
                <RelatedSection
                  title="RELATED BANDS"
                  emptyText="No bands have been linked to this flyer yet."
                  items={getRelatedBands()}
                  fallbackIcon="/icons/Bands.png"
                  onLinkClick={() => alert("Link band modal coming next.")}
                  actionLabel="+ ADD BAND"
                />

                <RelatedSection
                  title="RELATED VENUES"
                  emptyText="No venues have been linked to this flyer yet."
                  items={getRelatedVenues()}
                  fallbackIcon="/icons/Venues.png"
                  onLinkClick={() => alert("Link venue modal coming next.")}
                  actionLabel="+ ADD VENUE"
                />
              </div>

              {isEditModalOpen && selectedFlyer && (
                <AddFlyerModal
                  flyer={selectedFlyer}
                  onClose={() => setIsEditModalOpen(false)}
                  onFlyerSaved={loadFlyers}
                />
              )}
            </>
          ) : (
            <div className="flyer-empty">Select a flyer.</div>
          )}
        </section>
      </div>
    );
  }
);

export default FlyerBrowser;
