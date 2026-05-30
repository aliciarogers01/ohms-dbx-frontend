"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Album, createAlbum, updateAlbum, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddAlbumModalProps = {
  album?: Album | null;
  onClose: () => void;
  onAlbumSaved: () => void;
};

export default function AddAlbumModal({
  album,
  onClose,
  onAlbumSaved,
}: AddAlbumModalProps) {
  const isEditing = Boolean(album);

  const [title, setTitle] = useState(album?.title ?? "");
  const [bandName, setBandName] = useState(album?.band_name ?? "");
  const [year, setYear] = useState(album?.year ?? "");
  const [releaseDate, setReleaseDate] = useState(album?.release_date ?? "");
  const [genre, setGenre] = useState(album?.genre ?? "");
  const [label, setLabel] = useState(album?.label ?? "");
  const [studio, setStudio] = useState(album?.studio ?? "");
  const [trackList, setTrackList] = useState(album?.track_list ?? "");
  const [notes, setNotes] = useState(album?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return album?.image_url || "/icons/Albums.png";
  }, [album?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Album title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = album?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        album_name: title.trim(),
        band_name: bandName.trim(),
        year: year.trim(),
        release_date: releaseDate.trim(),
        genre: genre.trim(),
        label: label.trim(),
        studio: studio.trim(),
        track_list: trackList.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (album) {
        await updateAlbum(album.id, payload);
      } else {
        await createAlbum(payload);
      }

      onAlbumSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save album."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT ALBUM" : "ADD ALBUM"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Album preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Album Image
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
            Album Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Band Name
            <input
              value={bandName}
              onChange={(event) => setBandName(event.target.value)}
            />
          </label>

          <label>
            Year
            <input
              value={year}
              onChange={(event) => setYear(event.target.value)}
            />
          </label>

          <label>
            Release Date
            <input
              value={releaseDate}
              onChange={(event) => setReleaseDate(event.target.value)}
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
            Label
            <input
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </label>

          <label>
            Studio
            <input
              value={studio}
              onChange={(event) => setStudio(event.target.value)}
            />
          </label>

          <label>
            Track List
            <textarea
              value={trackList}
              onChange={(event) => setTrackList(event.target.value)}
            />
          </label>

          <label>
            Notes
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
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
              {isSaving
                ? "SAVING..."
                : isEditing
                ? "SAVE CHANGES"
                : "SAVE ALBUM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}