"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Band, createBand, updateBand, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddBandModalProps = {
  band?: Band | null;
  onClose: () => void;
  onBandSaved: () => void;
};

export default function AddBandModal({
  band,
  onClose,
  onBandSaved,
}: AddBandModalProps) {
  const isEditing = Boolean(band);

  const [name, setName] = useState(band?.name ?? "");
  const [originCity, setOriginCity] = useState(band?.origin_city ?? "");
  const [region, setRegion] = useState(band?.region ?? "");
  const [genre, setGenre] = useState(band?.genre ?? "");
  const [yearsActive, setYearsActive] = useState(band?.years_active ?? "");
  const [bio, setBio] = useState(band?.bio ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return band?.image_url || "/icons/Bands.png";
  }, [band?.image_url, imageFile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Band name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = band?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: name.trim(),
        origin_city: originCity.trim(),
        region: region.trim(),
        genre: genre.trim(),
        years_active: yearsActive.trim(),
        bio: bio.trim(),
        image_url: imageUrl,
      };

      if (band) {
        await updateBand(band.id, payload);
      } else {
        await createBand(payload);
      }

      onBandSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save band."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT BAND" : "ADD BAND"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Band preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Band Image
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
            Band Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            Origin City
            <input
              value={originCity}
              onChange={(event) => setOriginCity(event.target.value)}
            />
          </label>

          <label>
            Region
            <input
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            />
          </label>

          <label>
            Genre
            <input
              value={genre}
              onChange={(event) => setGenre(event.target.value)}
            />
          </label>

          <label>
            Years Active
            <input
              value={yearsActive}
              onChange={(event) => setYearsActive(event.target.value)}
            />
          </label>

          <label>
            Bio
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
            />
          </label>

          {errorMessage && (
            <div className="artist-modal-error">{errorMessage}</div>
          )}

          <div className="artist-modal-actions">
            <button type="button" onClick={onClose}>
              CANCEL
            </button>

            <button type="submit" disabled={isSaving}>
              {isSaving ? "SAVING..." : isEditing ? "SAVE CHANGES" : "SAVE BAND"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}