"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Artist, createArtist, updateArtist, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddArtistModalProps = {
  artist?: Artist | null;
  onClose: () => void;
  onArtistSaved: () => void;
};

export default function AddArtistModal({
  artist,
  onClose,
  onArtistSaved,
}: AddArtistModalProps) {
  const isEditing = Boolean(artist);

  const [name, setName] = useState(artist?.name ?? "");
  const [roles, setRoles] = useState(artist?.roles ?? "");
 const [city, setCity] = useState(artist?.hometown ?? "");
  const [bio, setBio] = useState(artist?.bio ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }

    return artist?.image_url || "/icons/Artists.png";
  }, [artist?.image_url, imageFile]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      setErrorMessage("Artist name is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = artist?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

const payload = {
  name: name.trim(),
  roles: roles.trim(),
  hometown: city.trim(),
  bio: bio.trim(),
  image_url: imageUrl,
};

      if (artist) {
        await updateArtist(artist.id, payload);
      } else {
        await createArtist(payload);
      }

      onArtistSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save artist."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT ARTIST" : "ADD ARTIST"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Artist preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Artist Image
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
            Artist Name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            Roles
            <input
              value={roles}
              onChange={(event) => setRoles(event.target.value)}
              placeholder="Singer / Guitarist / Producer"
            />
          </label>

          <label>
            City
            <input
              value={city}
              onChange={(event) => setCity(event.target.value)}
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
              {isSaving ? "SAVING..." : isEditing ? "SAVE CHANGES" : "SAVE ARTIST"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}