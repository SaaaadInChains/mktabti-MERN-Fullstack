import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  BookOpen,
  Loader2,
  Plus,
  X,
  Trash2,
  Search,
} from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type BookInPlaylist = {
  _id: string;
  title: string;
  cover?: string;
  author?: {
    _id: string;
    name: string;
    surname: string;
  } | null;
};

type PlaylistType = {
  _id: string;
  name: string;
  cover?: string;
  books: BookInPlaylist[];
};

type AllBookType = {
  _id: string;
  title: string;
  cover?: string;
  author?: {
    _id: string;
    name: string;
    surname: string;
  } | null;
};

function PlaylistEditSpecific() {
  const { id } = useParams<{ id: string }>();

  const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
  const [allBooks, setAllBooks] = useState<AllBookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch playlist data
  async function fetchPlaylist() {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const response = await api.get<{ playlist: PlaylistType }>(`/playlists/${id}`);
      setPlaylist(response.data.playlist);
      // Initialize selected IDs with current books
      setSelectedBookIds(response.data.playlist.books.map((b) => b._id));
    } catch (err: any) {
      console.error("Error fetching playlist:", err);
      setError(
        err?.response?.data?.message || "Failed to load playlist. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Fetch all available books for adding
  async function fetchAllBooks() {
    try {
      const response = await api.get("/books?page=1&limit=100");
      setAllBooks(response.data.books || []);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  }

  useEffect(() => {
    fetchPlaylist();
    fetchAllBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Remove a book from playlist
  async function handleRemoveBook(bookId: string) {
    if (!id) return;
    setIsUpdating(true);
    try {
      const updatedBookIds = selectedBookIds.filter((bid) => bid !== bookId);
      await api.put(`/playlists/${id}`, { books: updatedBookIds });
      setSelectedBookIds(updatedBookIds);
      // Update local playlist data
      if (playlist) {
        setPlaylist({
          ...playlist,
          books: playlist.books.filter((b) => b._id !== bookId),
        });
      }
    } catch (err: any) {
      console.error("Error removing book:", err);
      alert(err?.response?.data?.message || "Failed to remove book");
    } finally {
      setIsUpdating(false);
    }
  }

  // Add selected books to playlist
  async function handleAddBooks() {
    if (!id || selectedBookIds.length === 0) return;
    setIsUpdating(true);
    try {
      await api.put(`/playlists/${id}`, { books: selectedBookIds });
      setShowAddModal(false);
      // Refresh playlist
      await fetchPlaylist();
    } catch (err: any) {
      console.error("Error adding books:", err);
      alert(err?.response?.data?.message || "Failed to add books");
    } finally {
      setIsUpdating(false);
    }
  }

  function toggleBookSelection(bookId: string) {
    setSelectedBookIds((prev) =>
      prev.includes(bookId)
        ? prev.filter((bid) => bid !== bookId)
        : [...prev, bookId],
    );
  }

  // Filter books for search
  const filteredAllBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="animate-spin text-[var(--gruvbox-yellow)]" size={36} />
        </div>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error || "Playlist not found"}</p>
            <Link
              to="/playlists"
              className="mt-4 inline-block rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              Back to playlists
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">
        {/* Playlist header */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-32 h-32 shrink-0 overflow-hidden rounded-2xl bg-[var(--gruvbox-background)]">
              {playlist.cover ? (
                <img
                  src={playlist.cover}
                  alt={playlist.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                  <BookOpen size={40} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-[var(--gruvbox-cream)]">
                {playlist.name}
              </h1>
              <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                {playlist.books.length} books
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              <Plus size={18} />
              Add books
            </button>
          </div>
        </motion.section>

        {/* Books list */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playlist.books.length === 0 ? (
            <p className="text-[var(--gruvbox-gray)] col-span-full text-center py-12">
              No books in this playlist yet.
            </p>
          ) : (
            playlist.books.map((book) => (
              <motion.div
                key={book._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="group flex items-start gap-4 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-4 transition hover:border-[var(--gruvbox-yellow)]/40"
              >
                <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--gruvbox-background)]">
                  {book.cover ? (
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    to={`/books/${book._id}`}
                    className="font-bold text-[var(--gruvbox-cream)] hover:text-[var(--gruvbox-yellow)]"
                  >
                    {book.title}
                  </Link>
                  {book.author && (
                    <p className="text-xs text-[var(--gruvbox-gray)]">
                      {book.author.name} {book.author.surname}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveBook(book._id)}
                  disabled={isUpdating}
                  className="text-[var(--gruvbox-gray)] hover:text-[var(--gruvbox-red)] transition"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </div>

        {/* Add books modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-[var(--gruvbox-cream)]">
                    Add books to playlist
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="rounded-lg p-1 text-[var(--gruvbox-gray)] hover:bg-[var(--gruvbox-background-soft)]"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--gruvbox-gray)]"
                  />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search books..."
                    className="w-full rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 pl-10 pr-4 py-2 text-sm text-[var(--gruvbox-cream)] outline-none focus:border-[var(--gruvbox-yellow)]"
                  />
                </div>

                <div className="space-y-2">
                  {filteredAllBooks.length === 0 ? (
                    <p className="text-sm text-[var(--gruvbox-gray)]">No books found.</p>
                  ) : (
                    filteredAllBooks.map((book) => {
                      const isSelected = selectedBookIds.includes(book._id);
                      return (
                        <div
                          key={book._id}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-[var(--gruvbox-background-soft)] cursor-pointer"
                          onClick={() => toggleBookSelection(book._id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleBookSelection(book._id)}
                            className="accent-[var(--gruvbox-yellow)]"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-[var(--gruvbox-cream)]">
                              {book.title}
                            </p>
                            {book.author && (
                              <p className="text-xs text-[var(--gruvbox-gray)]">
                                {book.author.name} {book.author.surname}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="rounded-lg px-4 py-2 text-sm text-[var(--gruvbox-muted-cream)] hover:bg-[var(--gruvbox-background-soft)]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddBooks}
                    disabled={isUpdating || selectedBookIds.length === 0}
                    className="rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] hover:bg-[var(--gruvbox-orange)] disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Add selected"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default PlaylistEditSpecific;