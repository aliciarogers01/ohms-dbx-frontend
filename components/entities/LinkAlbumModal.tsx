"use client";

import { useEffect, useState } from "react";
import { Album, Band, getAlbums, updateAlbum } from "@/lib/api";
import "./AddArtistModal.css";

type LinkAlbumModalProps = {
  band: Band;
  onClose: () => void;
  onLinked: () => void;
};

export default function LinkAlbumModal({
  band,
  onClose,
  onLinked,
}: LinkAlbumModalProps) {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadAlbums() {
      setIsLoading(true);
      const data = await getAlbums();
      setAlbums(data);
      setIsLoading(false);
    }

    loadAlbums();
  }, []);

  const filteredAlbums = albums.filter((album) => {
    const title = album.title || album.album_name || album.album_title || "";
    const currentBandName = album.band_name || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      currentBandName.toLowerCase() !== band.name.toLowerCase()
    );
  });

  async function handleLink() {
    if (!selectedAlbum) return;

    await updateAlbum(selectedAlbum.id, {
      title:
        selectedAlbum.title ||
        selectedAlbum.album_name ||
        selectedAlbum.album_title ||
        "",
      album_name:
        selectedAlbum.album_name ||
        selectedAlbum.album_title ||
        selectedAlbum.title ||
        "",
      album_title:
        selectedAlbum.album_title ||
        selectedAlbum.album_name ||
        selectedAlbum.title ||
        "",
      band_name: band.name,
      year: selectedAlbum.year ?? "",
      track_list: selectedAlbum.track_list ?? "",
      image_url: selectedAlbum.image_url ?? "",
    });

    onLinked();
    onClose();
  }

  return (
    <div className="modal-backdrop">
      <div className="artist-modal">
        <div className="artist-modal-header">
          <h2>LINK ALBUM</h2>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="artist-modal-form">
          <input
            className="artist-search"
            placeholder="Search albums..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <div
            style={{
              maxHeight: 420,
              overflowY: "auto",
              display: "grid",
              gap: 10,
            }}
          >
            {isLoading && <p>Loading albums...</p>}

            {!isLoading &&
              filteredAlbums.map((album) => {
                const title =
                  album.title || album.album_name || album.album_title || "Untitled album";

                return (
                  <button
                    key={album.id}
                    type="button"
                    onClick={() => setSelectedAlbum(album)}
                    style={{
                      height: 56,
                      borderRadius: 12,
                      border:
                        selectedAlbum?.id === album.id
                          ? "1px solid #ff3b30"
                          : "1px solid #333",
                      background: "#111",
                      color: "white",
                      textAlign: "left",
                      padding: "0 14px",
                      cursor: "pointer",
                      fontWeight: 700,
                    }}
                  >
                    {title}
                  </button>
                );
              })}
          </div>

          <div className="artist-modal-actions">
            <button type="button" onClick={onClose}>
              CANCEL
            </button>
            <button type="button" disabled={!selectedAlbum} onClick={handleLink}>
              LINK ALBUM
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}