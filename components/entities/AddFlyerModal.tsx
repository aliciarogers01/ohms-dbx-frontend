"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Flyer, createFlyer, updateFlyer, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddFlyerModalProps = {
  flyer?: Flyer | null;
  onClose: () => void;
  onFlyerSaved: () => void;
};

export default function AddFlyerModal({
  flyer,
  onClose,
  onFlyerSaved,
}: AddFlyerModalProps) {
  const isEditing = Boolean(flyer);

  const [title, setTitle] = useState(flyer?.title ?? "");
  const [eventName, setEventName] = useState(flyer?.event_name ?? "");
  const [venueName, setVenueName] = useState(flyer?.venue_name ?? "");
  const [bandName, setBandName] = useState(flyer?.band_name ?? "");
  const [artistName, setArtistName] = useState(flyer?.artist_name ?? "");
  const [eventDate, setEventDate] = useState(flyer?.event_date ?? "");
  const [year, setYear] = useState(flyer?.year ?? "");
  const [city, setCity] = useState(flyer?.city ?? "");
  const [notes, setNotes] = useState(flyer?.notes ?? "");
  const [sources, setSources] = useState(flyer?.sources ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return flyer?.image_url || "/icons/Flyers.png";
  }, [flyer?.image_url, imageFile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Flyer title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = flyer?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        event_name: eventName.trim(),
        venue_name: venueName.trim(),
        band_name: bandName.trim(),
        artist_name: artistName.trim(),
        event_date: eventDate.trim(),
        year: year.trim(),
        city: city.trim(),
        notes: notes.trim(),
        sources: sources.trim(),
        image_url: imageUrl,
      };

      if (flyer) {
        await updateFlyer(flyer.id, payload);
      } else {
        await createFlyer(payload);
      }

      onFlyerSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save flyer."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT FLYER" : "ADD FLYER"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Flyer preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Flyer Image
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
            Flyer Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>

          <label>
            Event Name
            <input value={eventName} onChange={(event) => setEventName(event.target.value)} />
          </label>

          <label>
            Venue Name
            <input value={venueName} onChange={(event) => setVenueName(event.target.value)} />
          </label>

          <label>
            Band Name
            <input value={bandName} onChange={(event) => setBandName(event.target.value)} />
          </label>

          <label>
            Artist Name
            <input value={artistName} onChange={(event) => setArtistName(event.target.value)} />
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
            City
            <input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>

          <label>
            Notes
            <textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
          </label>

          <label>
            Sources
            <textarea value={sources} onChange={(event) => setSources(event.target.value)} />
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
                : "SAVE FLYER"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
