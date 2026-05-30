"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Label, createLabel, updateLabel, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddLabelModalProps = {
  label?: Label | null;
  onClose: () => void;
  onLabelSaved: () => void;
};

export default function AddLabelModal({
  label,
  onClose,
  onLabelSaved,
}: AddLabelModalProps) {
  const isEditing = Boolean(label);

  const [name, setName] = useState(label?.name ?? "");
  const [city, setCity] = useState(label?.city ?? "");
  const [region, setRegion] = useState(label?.region ?? "");
  const [yearsActive, setYearsActive] = useState(label?.years_active ?? "");
  const [history, setHistory] = useState(label?.history ?? "");
  const [notes, setNotes] = useState(label?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return label?.image_url || "/icons/Labels.png";
  }, [label?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Label name/title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = label?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: name.trim(),
        city: city.trim(),
        region: region.trim(),
        years_active: yearsActive.trim(),
        history: history.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (label) {
        await updateLabel(label.id, payload);
      } else {
        await createLabel(payload);
      }

      onLabelSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save label."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT LABEL" : "ADD LABEL"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Label preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Label Image
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
            Label Name
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
                : "SAVE LABEL"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
