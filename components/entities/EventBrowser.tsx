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
  Event,
  deleteEvent,
  getEvents,
  Flyer,
  getFlyers,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddEventModal from "./AddEventModal";
import "./EventBrowser.css";

export type EventBrowserHandle = {
  reloadEvents: () => void;
};

type EventBrowserProps = {
  showFilters: boolean;
};

const EventBrowser = forwardRef<EventBrowserHandle, EventBrowserProps>(
  function EventBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
    const selectedEventId = Number(searchParams.get("selected"));

    const [events, setEvents] = useState<Event[]>([]);
    const [flyers, setFlyers] = useState<Flyer[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadEvents() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [eventData, flyerData] = await Promise.all([
          getEvents(),
          getFlyers(),
        ]);

        setEvents(eventData);
        setFlyers(flyerData);

        setSelectedEvent((currentEvent) => {
          if (selectedEventId) {
            return (
              eventData.find((event) => event.id === selectedEventId) ??
              eventData[0] ??
              null
            );
          }

          if (!currentEvent) {
            return eventData[0] ?? null;
          }

          return (
            eventData.find((event) => event.id === currentEvent.id) ??
            eventData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load events."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadEvents();
    }, [selectedEventId]);

    useImperativeHandle(ref, () => ({
      reloadEvents: loadEvents,
    }));

    const filteredEvents = events.filter((event) =>
      ((event.title ?? "") + " " + (event.event_date ?? "") + " " + (event.year ?? "") + " " + (event.venue_name ?? "") + " " + (event.city ?? "") + " " + (event.band_name ?? "") + " " + (event.notes ?? ""))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    function getRelatedFlyers(): RelatedItem[] {
      if (!selectedEvent) {
        return [];
      }

      return flyers
        .filter(
          (flyer) =>
            flyer.event_name?.toLowerCase() === selectedEvent.title.toLowerCase()
        )
        .map((flyer) => ({
          id: flyer.id,
          name: flyer.title,
          subtitle: flyer.year || flyer.event_date || null,
          image_url: flyer.image_url ?? null,
          href: `/flyers?selected=${flyer.id}`,
        }));
    }

    async function handleDeleteEvent() {
      if (!selectedEvent) return;

      const confirmed = window.confirm(
        `Delete ${selectedEvent.title}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteEvent(selectedEvent.id);
        await loadEvents();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete event."
        );
      }
    }

    return (
      <div className="event-browser">
        <aside className="event-list">
          <div className="event-count">{filteredEvents.length} EVENTS</div>

          {showFilters && (
            <input
              className="event-search"
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="event-empty">Loading events...</div>}

          {errorMessage && <div className="event-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredEvents.map((event) => (
              <button
                className={`event-row ${
                  selectedEvent?.id === event.id ? "active" : ""
                }`}
                key={event.id}
onClick={() => {
  setSelectedEvent(event);
  router.replace(`${pathname}?selected=${event.id}`, { scroll: false });
}}
              >
                <Image
                  src={event.image_url || "/icons/Events.png"}
                  alt={event.title}
                  width={54}
                  height={54}
                  className="event-row-image"
                />

                <span>
                  <strong>{event.title}</strong>
                  <small>{event.venue_name || event.city || "Event"}</small>
                  <small>{event.year || event.event_date || "Date unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredEvents.length === 0 && (
            <div className="event-empty">No events found.</div>
          )}
        </aside>

        <section className="event-detail">
          {selectedEvent ? (
            <>
              <div className="event-detail-header">
                <div className="event-profile-top">
                  <Image
                    src={selectedEvent.image_url || "/icons/Events.png"}
                    alt={selectedEvent.title}
                    width={160}
                    height={160}
                    className="event-detail-image"
                  />

                  <div className="event-profile-copy">
                    <h2>{selectedEvent.title}</h2>
                    <p className="event-role">
                      {selectedEvent.venue_name || selectedEvent.city || "Event"}
                    </p>
                    <p className="event-location">
                      {selectedEvent.event_date || selectedEvent.year || "Date unknown"}
                    </p>
                    <p className="event-bio">
                      {selectedEvent.notes || selectedEvent.band_name || "No notes have been added for this event yet."}
                    </p>
                  </div>
                </div>

                <div className="event-detail-actions">
                  <button
                    type="button"
                    className="event-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="event-action-button delete"
                    onClick={handleDeleteEvent}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div className="event-related-area">
                <RelatedSection
                  title="RELATED FLYERS"
                  emptyText="No flyers have been linked to this event yet."
                  items={getRelatedFlyers()}
                  fallbackIcon="/icons/Flyers.png"
                  onLinkClick={() => alert("Add flyer from this section is coming next.")}
                  actionLabel="+ ADD FLYER"
                />
              </div>

              {isEditModalOpen && selectedEvent && (
                <AddEventModal
                  event={selectedEvent}
                  onClose={() => setIsEditModalOpen(false)}
                  onEventSaved={loadEvents}
                />
              )}
            </>
          ) : (
            <div className="event-empty">Select a event.</div>
          )}
        </section>
      </div>
    );
  }
);

export default EventBrowser;
