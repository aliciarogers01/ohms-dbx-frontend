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
  BookZine,
  deleteBookZine,
  getBooksZines,
} from "@/lib/api";
import RelatedSection, { RelatedItem } from "./RelatedSection";
import AddBookZineModal from "./AddBookZineModal";
import "./BookZineBrowser.css";

export type BookZineBrowserHandle = {
  reloadBooksZines: () => void;
};

type BookZineBrowserProps = {
  showFilters: boolean;
};

const BookZineBrowser = forwardRef<BookZineBrowserHandle, BookZineBrowserProps>(
  function BookZineBrowser({ showFilters }, ref) {
    const searchParams = useSearchParams();
const router = useRouter();
const pathname = usePathname();
    const selectedBookZineId = Number(searchParams.get("selected"));

    const [bookszines, setBooksZines] = useState<BookZine[]>([]);
    const [selectedBookZine, setSelectedBookZine] = useState<BookZine | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    async function loadBooksZines() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const bookZineData = await getBooksZines();

        setBooksZines(bookZineData);

        setSelectedBookZine((currentBookZine) => {
          if (selectedBookZineId) {
            return (
              bookZineData.find((bookZine) => bookZine.id === selectedBookZineId) ??
              bookZineData[0] ??
              null
            );
          }

          if (!currentBookZine) {
            return bookZineData[0] ?? null;
          }

          return (
            bookZineData.find((bookZine) => bookZine.id === currentBookZine.id) ??
            bookZineData[0] ??
            null
          );
        });
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load bookszines."
        );
      } finally {
        setIsLoading(false);
      }
    }

    useEffect(() => {
      loadBooksZines();
    }, [selectedBookZineId]);

    useImperativeHandle(ref, () => ({
      reloadBooksZines: loadBooksZines,
    }));

    const filteredBooksZines = bookszines.filter((bookZine) =>
      ((bookZine.title ?? "") + " " + (bookZine.creator ?? "") + " " + (bookZine.publisher ?? "") + " " + (bookZine.year ?? "") + " " + (bookZine.city ?? "") + " " + (bookZine.subject_artist ?? "") + " " + (bookZine.subject_band ?? "") + " " + (bookZine.notes ?? ""))
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    async function handleDeleteBookZine() {
      if (!selectedBookZine) return;

      const confirmed = window.confirm(
        `Delete ${selectedBookZine.title}? This cannot be undone.`
      );

      if (!confirmed) return;

      try {
        await deleteBookZine(selectedBookZine.id);
        await loadBooksZines();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to delete book/zine."
        );
      }
    }

    return (
      <div className="book-zine-browser">
        <aside className="book-zine-list">
          <div className="book-zine-count">{filteredBooksZines.length} BOOKSZINES</div>

          {showFilters && (
            <input
              className="book-zine-search"
              type="text"
              placeholder="Search bookszines..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          )}

          {isLoading && <div className="book-zine-empty">Loading bookszines...</div>}

          {errorMessage && <div className="book-zine-error">{errorMessage}</div>}

          {!isLoading &&
            !errorMessage &&
            filteredBooksZines.map((bookZine) => (
              <button
                className={`book-zine-row ${
                  selectedBookZine?.id === bookZine.id ? "active" : ""
                }`}
                key={bookZine.id}
onClick={() => {
  setSelectedBookZine(bookZine);
  router.replace(`${pathname}?selected=${bookZine.id}`, { scroll: false });
}}
              >
                <Image
                  src={bookZine.image_url || "/icons/Books-Zines.png"}
                  alt={bookZine.title}
                  width={54}
                  height={54}
                  className="book-zine-row-image"
                />

                <span>
                  <strong>{bookZine.title}</strong>
                  <small>{bookZine.creator || bookZine.publisher || "Book / Zine"}</small>
                  <small>{bookZine.year || bookZine.city || "Date unknown"}</small>
                </span>
              </button>
            ))}

          {!isLoading && !errorMessage && filteredBooksZines.length === 0 && (
            <div className="book-zine-empty">No bookszines found.</div>
          )}
        </aside>

        <section className="book-zine-detail">
          {selectedBookZine ? (
            <>
              <div className="book-zine-detail-header">
                <div className="book-zine-profile-top">
                  <Image
                    src={selectedBookZine.image_url || "/icons/Books-Zines.png"}
                    alt={selectedBookZine.title}
                    width={160}
                    height={160}
                    className="book-zine-detail-image"
                  />

                  <div className="book-zine-profile-copy">
                    <h2>{selectedBookZine.title}</h2>
                    <p className="book-zine-role">
                      {selectedBookZine.creator || selectedBookZine.publisher || "Book / Zine"}
                    </p>
                    <p className="book-zine-location">
                      {selectedBookZine.year || selectedBookZine.city || "Details unknown"}
                    </p>
                    <p className="book-zine-bio">
                      {selectedBookZine.notes || "No notes have been added for this book/zine yet."}
                    </p>
                  </div>
                </div>

                <div className="book-zine-detail-actions">
                  <button
                    type="button"
                    className="book-zine-action-button"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    EDIT
                  </button>

                  <button
                    type="button"
                    className="book-zine-action-button delete"
                    onClick={handleDeleteBookZine}
                  >
                    DELETE
                  </button>
                </div>
              </div>

              {isEditModalOpen && selectedBookZine && (
                <AddBookZineModal
                  bookZine={selectedBookZine}
                  onClose={() => setIsEditModalOpen(false)}
                  onBookZineSaved={loadBooksZines}
                />
              )}
            </>
          ) : (
            <div className="book-zine-empty">Select a book/zine.</div>
          )}
        </section>
      </div>
    );
  }
);

export default BookZineBrowser;
