"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Video,
  deleteVideo,
  getVideos,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddVideoModal from "./AddVideoModal";
import "./VideoBrowser.css";

export type VideoBrowserHandle = {
  reloadVideos: () => void;
};

type VideoBrowserProps = {
  showFilters: boolean;
};

const VideoBrowser = forwardRef<VideoBrowserHandle, VideoBrowserProps>(
  function VideoBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
    const selectedVideoId = Number(searchParams.get("selected"));

    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadVideos() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const videoData = await getVideos();

        setVideos(videoData);

        setSelectedVideo((currentVideo) => {
          if (selectedVideoId) {
            return (
              videoData.find((video) => video.id === selectedVideoId) ??
              videoData[0] ??
              null
            );
          }

          if (!currentVideo) {
            return videoData[0] ?? null;
          }

          return (
            videoData.find((video) => video.id === currentVideo.id) ??
            videoData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load videos."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadVideos();
    }, [selectedVideoId]);

    useImperativeHandle(ref, () => ({
      reloadVideos: loadVideos,
    }));

    const filteredVideos = videos.filter((video) =>
      ((video.title ?? "") + " " + (video.artist_name ?? "") + " " + (video.band_name ?? "") + " " + (video.venue_name ?? "") + " " + (video.release_date ?? "") + " " + (video.year ?? "") + " " + (video.url ?? "") + " " + (video.notes ?? ""))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    async function handleDeleteVideo() {
      if (!selectedVideo) return;

      const confirmed = window.confirm(
        `Delete ${selectedVideo.title}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteVideo(selectedVideo.id);
        await loadVideos();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete video."
        );
      }
    }

    return (
      <div className="video-browser">
        <aside className="video-list">
          <div className="video-count">{filteredVideos.length} VIDEOS</div>

          {showFilters && (
            <input
              className="video-search"
              type="text"
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="video-empty">Loading videos...</div>}

          {errorMessage && <div className="video-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredVideos.map((video) => (
              <button
                className={`video-row ${
                  selectedVideo?.id === video.id ? "active" : ""
                }`}
                key={video.id}
onClick={() => {
  setSelectedVideo(video);
  router.replace(`${pathname}?selected=${video.id}`, { scroll: false });
}}
              >
                <Image
                  src={video.image_url || "/icons/Videos.png"}
                  alt={video.title}
                  width={54}
                  height={54}
                  className="video-row-image"
                />

                <span>
                  <strong>{video.title}</strong>
                  <small>{video.band_name || video.artist_name || "Video"}</small>
                  <small>{video.year || video.release_date || "Date unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredVideos.length === 0 && (
            <div className="video-empty">No videos found.</div>
          )}
        </aside>

        <section className="video-detail">
          {selectedVideo ? (
            <>
              <div className="video-detail-header">
                <div className="video-profile-top">
                  <Image
                    src={selectedVideo.image_url || "/icons/Videos.png"}
                    alt={selectedVideo.title}
                    width={160}
                    height={160}
                    className="video-detail-image"
                  />

                  <div className="video-profile-copy">
                    <h2>{selectedVideo.title}</h2>
                    <p className="video-role">
                      {selectedVideo.band_name || selectedVideo.artist_name || "Video"}
                    </p>
                    <p className="video-location">
                      {selectedVideo.venue_name || selectedVideo.year || "Location unknown"}
                    </p>
                    <p className="video-bio">
                      {selectedVideo.notes || selectedVideo.url || "No notes have been added for this video yet."}
                    </p>
                  </div>
                </div>

                <div className="video-detail-actions">
                  <button
                    type="button"
                    className="video-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="video-action-button delete"
                    onClick={handleDeleteVideo}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              {isEditModalOpen && selectedVideo && (
                <AddVideoModal
                  video={selectedVideo}
                  onClose={() => setIsEditModalOpen(false)}
                  onVideoSaved={loadVideos}
                />
              )}
            </>
          ) : (
            <div className="video-empty">Select a video.</div>
          )}
        </section>
      </div>
    );
  }
);

export default VideoBrowser;
