"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Event, createEvent, updateEvent, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddEventModalProps = {
  event?: Event | null;
  onClose: () => void;
  onEventSaved: () => void;
};

export default function AddEventModal({
  event,
  onClose,
  onEventSaved,
}: AddEventModalProps) {
  const isEditing = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? "");
  const [eventDate, setEventDate] = useState(event?.event_date ?? "");
  const [year, setYear] = useState(event?.year ?? "");
  const [venueName, setVenueName] = useState(event?.venue_name ?? "");
  const [city, setCity] = useState(event?.city ?? "");
  const [bandName, setBandName] = useState(event?.band_name ?? "");
  const [notes, setNotes] = useState(event?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return event?.image_url || "/icons/Events.png";
  }, [event?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Event name/title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = event?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        event_date: eventDate.trim(),
        year: year.trim(),
        venue_name: venueName.trim(),
        city: city.trim(),
        band_name: bandName.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (event) {
        await updateEvent(event.id, payload);
      } else {
        await createEvent(payload);
      }

      onEventSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save event."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT EVENT" : "ADD EVENT"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Event preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Event Image
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(event) =>
                  setImageFile(event.target.files?.[0] ?? null)
                }
              />
            </label>
          </div>

          <label>
            Event Name
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Event Date
            <input value={eventDate} onChange={(event) => setEventDate(event.target.value)} />
          </label>
          <label>
            Year
            <input value={year} onChange={(event) => setYear(event.target.value)} />
          </label>
          <label>
            Venue Name
            <input value={venueName} onChange={(event) => setVenueName(event.target.value)} />
          </label>
          <label>
            City
            <input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>
          <label>
            Band Name
            <input value={bandName} onChange={(event) => setBandName(event.target.value)} />
          </label>
          <label>
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>

          {errorMessage && (
            <div className="artist-modal-error">{errorMessage}</div>
          )}

          <div className="artist-modal-actions">
            <button type="button" onClick={onClose}>
              CANCEL
            </button>

            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "SAVING..."
                : isEditing
                ? "SAVE CHANGES"
                : "SAVE EVENT"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
