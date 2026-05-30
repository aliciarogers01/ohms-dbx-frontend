"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { BookZine, createBookZine, updateBookZine, uploadImage } from "@/lib/api";
import "./AddArtistModal.css";

type AddBookZineModalProps = {
  bookZine?: BookZine | null;
  onClose: () => void;
  onBookZineSaved: () => void;
};

export default function AddBookZineModal({
  bookZine,
  onClose,
  onBookZineSaved,
}: AddBookZineModalProps) {
  const isEditing = Boolean(bookZine);

  const [title, setTitle] = useState(bookZine?.title ?? "");
  const [creator, setCreator] = useState(bookZine?.creator ?? "");
  const [publisher, setPublisher] = useState(bookZine?.publisher ?? "");
  const [year, setYear] = useState(bookZine?.year ?? "");
  const [city, setCity] = useState(bookZine?.city ?? "");
  const [subjectArtist, setSubjectArtist] = useState(bookZine?.subject_artist ?? "");
  const [subjectBand, setSubjectBand] = useState(bookZine?.subject_band ?? "");
  const [notes, setNotes] = useState(bookZine?.notes ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return bookZine?.image_url || "/icons/Books-Zines.png";
  }, [bookZine?.image_url, imageFile]);

  async function handleSubmit(formEvent: React.FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Book / Zine name/title is required.");
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      let imageUrl = bookZine?.image_url ?? "";

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        title: title.trim(),
        creator: creator.trim(),
        publisher: publisher.trim(),
        year: year.trim(),
        city: city.trim(),
        subject_artist: subjectArtist.trim(),
        subject_band: subjectBand.trim(),
        notes: notes.trim(),
        image_url: imageUrl,
      };

      if (bookZine) {
        await updateBookZine(bookZine.id, payload);
      } else {
        await createBookZine(payload);
      }

      onBookZineSaved();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save book / zine."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>{isEditing ? "EDIT BOOK / ZINE" : "ADD BOOK / ZINE"}</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="artist-modal-form">
          <div className="artist-image-picker">
            <Image
              src={previewUrl}
              alt="Book / Zine preview"
              width={120}
              height={120}
              className="artist-image-preview"
              unoptimized
            />

            <label className="artist-file-label">
              Book / Zine Image
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
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>
            Creator / Author
            <input value={creator} onChange={(event) => setCreator(event.target.value)} />
          </label>
          <label>
            Publisher
            <input value={publisher} onChange={(event) => setPublisher(event.target.value)} />
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
            Subject Artist
            <input value={subjectArtist} onChange={(event) => setSubjectArtist(event.target.value)} />
          </label>
          <label>
            Subject Band
            <input value={subjectBand} onChange={(event) => setSubjectBand(event.target.value)} />
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
                : "SAVE BOOK / ZINE"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
