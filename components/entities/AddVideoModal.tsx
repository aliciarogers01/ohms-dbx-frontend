"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Video, createVideo, updateVideo, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddVideoModalProps = {
  video?: Video | null;
  onClose: () => void;
  onVideoSaved: () => void;
};

export default function AddVideoModal({
  video,
  onClose,
  onVideoSaved,
}: AddVideoModalProps) {
  const isEditing = Boolean(video);

  const [title, setTitle] = useState(video?.title ?? "");
  const [artistName, setArtistName] = useState(video?.artist_name ?? "");
  const [bandName, setBandName] = useState(video?.band_name ?? "");
  const [venueName, setVenueName] = useState(video?.venue_name ?? "");
  const [releaseDate, setReleaseDate] = useState(video?.release_date ?? "");
  const [year, setYear] = useState(video?.year ?? "");
  const [url, setUrl] = useState(video?.url ?? "");
  const [notes, setNotes] = useState(video?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return video?.image_url || "/icons/Videos.png";
  }, [video?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Video name/title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = video?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        artist_name: artistName.trim(),
        band_name: bandName.trim(),
        venue_name: venueName.trim(),
        release_date: releaseDate.trim(),
        year: year.trim(),
        url: url.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (video) {
        await updateVideo(video.id, payload);
      } else {
        await createVideo(payload);
      }

      onVideoSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save video."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT VIDEO" : "ADD VIDEO"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Video preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Video Image
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
            Video Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Artist Name
            <input value={artistName} onChange={(event) => setArtistName(event.target.value)} />
          </label>
          <label>
            Band Name
            <input value={bandName} onChange={(event) => setBandName(event.target.value)} />
          </label>
          <label>
            Venue Name
            <input value={venueName} onChange={(event) => setVenueName(event.target.value)} />
          </label>
          <label>
            Release Date
            <input value={releaseDate} onChange={(event) => setReleaseDate(event.target.value)} />
          </label>
          <label>
            Year
            <input value={year} onChange={(event) => setYear(event.target.value)} />
          </label>
          <label>
            Video URL
            <input value={url} onChange={(event) => setUrl(event.target.value)} />
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
                : "SAVE VIDEO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
