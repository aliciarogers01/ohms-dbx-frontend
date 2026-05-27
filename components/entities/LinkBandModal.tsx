"use client";

import { useEffect, useState } from "react";
import { Artist, Band, getBands, updateArtist } from "@/lib/api";
import {
  addBandToArtistBands,
  isBadRelationshipName,
} from "@/lib/relationships";
import "./AddArtistModal.css";

type LinkBandModalProps = {
  artist: Artist;
  onClose: () => void;
  onLinked: () => void;
};

export default function LinkBandModal({
  artist,
  onClose,
  onLinked,
}: LinkBandModalProps) {
  const [bands, setBands] = useState<Band[]>([]);
  const [selectedBand, setSelectedBand] = useState<Band | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadBands() {
      setIsLoading(true);
      const data = await getBands();
      setBands(data);
      setIsLoading(false);
    }

    loadBands();
  }, []);

const filteredBands = bands.filter(
  (band) =>
    !isBadRelationshipName(band.name) &&
    band.name.toLowerCase().includes(searchTerm.toLowerCase())
);

  async function handleLink() {
    if (!selectedBand) return;

    const updatedBands = addBandToArtistBands(artist, selectedBand);

    await updateArtist(artist.id, {
      name: artist.name,
      roles: artist.roles ?? "",
      city: artist.hometown ?? "",
      bio: artist.bio ?? "",
      image_url: artist.image_url ?? "",
      bands: updatedBands,
    });

    onLinked();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>LINK BAND</h2>
          <button type="button" onClick={onClose}>×</button>
        </div>

        <div className="artist-modal-form">
          <input
            className="artist-search"
            placeholder="Search bands..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div style={{ maxHeight: 420, overflowY: "auto", display: "grid", gap: 10 }}>
            {isLoading && <p>Loading bands...</p>}

            {!isLoading &&
              filteredBands.map((band) => (
                <button
                  key={band.id}
                  type="button"
                  onClick={() => setSelectedBand(band)}
                  style={{
                    height: 56,
                    borderRadius: 12,
                    border: selectedBand?.id === band.id ? "1px solid #ff3b30" : "1px solid #333",
                    background: "#111",
                    color: "white",
                    textAlign: "left",
                    padding: "0 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {band.name}
                </button>
              ))}
          </div>

          <div className="artist-modal-actions">
            <button type="button" onClick={onClose}>CANCEL</button>
            <button type="button" disabled={!selectedBand} onClick={handleLink}>
              LINK BAND
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}