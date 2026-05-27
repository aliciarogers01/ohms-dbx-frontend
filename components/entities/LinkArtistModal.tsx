"use client";

import { useEffect, useState } from "react";
import { Artist, Band, getArtists, updateArtist } from "@/lib/api";
import {
  addBandToArtistBands,
  isBadRelationshipName,
} from "@/lib/relationships";
import "./AddArtistModal.css";

type LinkArtistModalProps = {
  band: Band;
  onClose: () => void;
  onLinked: () => void;
};

export default function LinkArtistModal({
  band,
  onClose,
  onLinked,
}: LinkArtistModalProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadArtists() {
      setIsLoading(true);
      const data = await getArtists();
      setArtists(data);
      setIsLoading(false);
    }

    loadArtists();
  }, []);

const filteredArtists = artists.filter(
  (artist) =>
    !isBadRelationshipName(artist.name) &&
    `${artist.name} ${artist.roles ?? ""} ${artist.hometown ?? ""}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);

  async function handleLink() {
    if (!selectedArtist) return;

    const updatedBands = addBandToArtistBands(selectedArtist, band);

    await updateArtist(selectedArtist.id, {
      name: selectedArtist.name,
      roles: selectedArtist.roles ?? "",
      city: selectedArtist.hometown ?? "",
      bio: selectedArtist.bio ?? "",
      image_url: selectedArtist.image_url ?? "",
      bands: updatedBands,
    });

    onLinked();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>LINK ARTIST</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="artist-modal-form">
          <input
            className="artist-search"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div style={{ maxHeight: 420, overflowY: "auto", display: "grid", gap: 10 }}>
            {isLoading && <p>Loading artists...</p>}

            {!isLoading &&
              filteredArtists.map((artist) => (
                <button
                  key={artist.id}
                  type="button"
                  onClick={() => setSelectedArtist(artist)}
                  style={{
                    height: 56,
                    borderRadius: 12,
                    border: selectedArtist?.id === artist.id ? "1px solid #2f8cff" : "1px solid #333",
                    background: "#111",
                    color: "white",
                    textAlign: "left",
                    padding: "0 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {artist.name}
                </button>
              ))}
          </div>

          <div className="artist-modal-actions">
            <button type="button" onClick={onClose}>CANCEL</button>
            <button type="button" disabled={!selectedArtist} onClick={handleLink}>
              LINK ARTIST
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}