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
  Flyer,
  Venue,
  deleteVenue,
  getFlyers,
  getVenues,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddVenueModal from "./AddVenueModal";
import "./VenueBrowser.css";

export type VenueBrowserHandle = {
  reloadVenues: () => void;
};

type VenueBrowserProps = {
  showFilters: boolean;
};

const VenueBrowser = forwardRef<VenueBrowserHandle, VenueBrowserProps>(
  function VenueBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
    const selectedVenueId = Number(searchParams.get("selected"));

    const [venues, setVenues] = useState<Venue[]>([]);
    const [flyers, setFlyers] = useState<Flyer[]>([]);
    const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadVenues() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [venueData, flyerData] = await Promise.all([
          getVenues(),
          getFlyers(),
        ]);

        setVenues(venueData);
        setFlyers(flyerData);

        setSelectedVenue((currentVenue) => {
          if (selectedVenueId) {
            return (
              venueData.find((venue) => venue.id === selectedVenueId) ??
              venueData[0] ??
              null
            );
          }

          if (!currentVenue) {
            return venueData[0] ?? null;
          }

          return (
            venueData.find((venue) => venue.id === currentVenue.id) ??
            venueData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load venues."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadVenues();
    }, [selectedVenueId]);

    useImperativeHandle(ref, () => ({
      reloadVenues: loadVenues,
    }));

    const filteredVenues = venues.filter((venue) =>
      `${venue.name ?? ""} ${venue.city ?? ""} ${venue.region ?? ""} ${
        venue.address ?? ""
      } ${venue.years_active ?? ""}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedFlyers(): RelatedItem[] {
      if (!selectedVenue) {
        return [];
      }

      return flyers
        .filter(
          (flyer) =>
            flyer.venue_name?.toLowerCase() === selectedVenue.name.toLowerCase()
        )
        .map((flyer) => ({
          id: flyer.id,
          name: flyer.title,
          subtitle: flyer.year || flyer.event_date || null,
          image_url: flyer.image_url ?? null,
          href: `/flyers?selected=${flyer.id}`,
        }));
    }

    async function handleDeleteVenue() {
      if (!selectedVenue) return;

      const confirmed = window.confirm(
        `Delete ${selectedVenue.name}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteVenue(selectedVenue.id);
        await loadVenues();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete venue."
        );
      }
    }

    return (
      <div className="venue-browser">
        <aside className="venue-list">
          <div className="venue-count">{filteredVenues.length} VENUES</div>

          {showFilters && (
            <input
              className="venue-search"
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="venue-empty">Loading venues...</div>}

          {errorMessage && <div className="venue-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredVenues.map((venue) => (
              <button
                className={`venue-row ${
                  selectedVenue?.id === venue.id ? "active" : ""
                }`}
                key={venue.id}
                onClick={() => setSelectedVenue(venue)}
              >
                <Image
                  src={venue.image_url || "/icons/Venues.png"}
                  alt={venue.name}
                  width={54}
                  height={54}
                  className="venue-row-image"
                />

                <span>
                  <strong>{venue.name}</strong>
                  <small>{venue.city || "Venue"}</small>
                  <small>{venue.years_active || venue.region || "Dates unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredVenues.length === 0 && (
            <div className="venue-empty">No venues found.</div>
          )}
        </aside>

        <section className="venue-detail">
          {selectedVenue ? (
            <>
              <div className="venue-detail-header">
                <div className="venue-profile-top">
                  <Image
                    src={selectedVenue.image_url || "/icons/Venues.png"}
                    alt={selectedVenue.name}
                    width={160}
                    height={160}
                    className="venue-detail-image"
                  />

                  <div className="venue-profile-copy">
                    <h2>{selectedVenue.name}</h2>
                    <p className="venue-role">
                      {selectedVenue.city || selectedVenue.region || "Venue"}
                    </p>
                    <p className="venue-location">
                      {selectedVenue.address || selectedVenue.years_active || "Address unknown"}
                    </p>
                    <p className="venue-bio">
                      {selectedVenue.history ||
                        selectedVenue.notes ||
                        "No history has been added for this venue yet."}
                    </p>
                  </div>
                </div>

                <div className="venue-detail-actions">
                  <button
                    type="button"
                    className="venue-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="venue-action-button delete"
                    onClick={handleDeleteVenue}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              <div className="venue-related-area">
                <RelatedSection
                  title="RELATED FLYERS"
                  emptyText="No flyers have been linked to this venue yet."
                  items={getRelatedFlyers()}
                  fallbackIcon="/icons/Flyers.png"
                  onLinkClick={() => alert("Link flyer modal coming next.")}
                  actionLabel="+ ADD FLYER"
                />
              </div>

              {isEditModalOpen && selectedVenue && (
                <AddVenueModal
                  venue={selectedVenue}
                  onClose={() => setIsEditModalOpen(false)}
                  onVenueSaved={loadVenues}
                />
              )}
            </>
          ) : (
            <div className="venue-empty">Select a venue.</div>
          )}
        </section>
      </div>
    );
  }
);

export default VenueBrowser;
