"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Studio, createStudio, updateStudio, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddStudioModalProps = {
  studio?: Studio | null;
  onClose: () => void;
  onStudioSaved: () => void;
};

export default function AddStudioModal({
  studio,
  onClose,
  onStudioSaved,
}: AddStudioModalProps) {
  const isEditing = Boolean(studio);

  const [name, setName] = useState(studio?.name ?? "");
  const [city, setCity] = useState(studio?.city ?? "");
  const [region, setRegion] = useState(studio?.region ?? "");
  const [address, setAddress] = useState(studio?.address ?? "");
  const [yearsActive, setYearsActive] = useState(studio?.years_active ?? "");
  const [history, setHistory] = useState(studio?.history ?? "");
  const [notes, setNotes] = useState(studio?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return studio?.image_url || "/icons/Studios.png";
  }, [studio?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Studio name/title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = studio?.image_url ?? "";

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

      if (studio) {
        await updateStudio(studio.id, payload);
      } else {
        await createStudio(payload);
      }

      onStudioSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save studio."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT STUDIO" : "ADD STUDIO"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Studio preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Studio Image
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
            Studio Name
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
                : "SAVE STUDIO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
