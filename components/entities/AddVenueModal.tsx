"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Venue, createVenue, updateVenue, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddVenueModalProps = {
  venue?: Venue | null;
  onClose: () => void;
  onVenueSaved: () => void;
};

export default function AddVenueModal({
  venue,
  onClose,
  onVenueSaved,
}: AddVenueModalProps) {
  const isEditing = Boolean(venue);

  const [name, setName] = useState(venue?.name ?? "");
  const [city, setCity] = useState(venue?.city ?? "");
  const [region, setRegion] = useState(venue?.region ?? "");
  const [address, setAddress] = useState(venue?.address ?? "");
  const [yearsActive, setYearsActive] = useState(venue?.years_active ?? "");
  const [history, setHistory] = useState(venue?.history ?? "");
  const [notes, setNotes] = useState(venue?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return venue?.image_url || "/icons/Venues.png";
  }, [venue?.image_url, imageFile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Venue name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = venue?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: name.trim(),
        city: city.trim(),
        region: region.trim(),
        address: address.trim(),
        years_active: yearsActive.trim(),
        history: history.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (venue) {
        await updateVenue(venue.id, payload);
      } else {
        await createVenue(payload);
      }

      onVenueSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save venue."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT VENUE" : "ADD VENUE"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Venue preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Venue Image
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
            Venue Name
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>

          <label>
            City
            <input value={city} onChange={(event) => setCity(event.target.value)} />
          </label>

          <label>
            Region
            <input value={region} onChange={(event) => setRegion(event.target.value)} />
          </label>

          <label>
            Address
            <input value={address} onChange={(event) => setAddress(event.target.value)} />
          </label>

          <label>
            Years Active
            <input value={yearsActive} onChange={(event) => setYearsActive(event.target.value)} />
          </label>

          <label>
            History
            <textarea value={history} onChange={(event) => setHistory(event.target.value)} />
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
                : "SAVE VENUE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
