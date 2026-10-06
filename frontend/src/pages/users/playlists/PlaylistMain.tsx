import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Loader2, Plus, X } from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type PlaylistType = {
  _id: string;
  name: string;
  cover?: string;
  books: string[];
  createdAt?: string;
};

type PaginatedPlaylistsResponse = {
  playlists: PlaylistType[];
};

function PlaylistMain() {
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCover, setNewCover] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  async function fetchPlaylists() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/playlists");
      setPlaylists(response.data.playlists || []);
    } catch (err: any) {
      console.error("Error fetching playlists:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to load playlists. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setNewCover(file);
    }
  }

  async function handleCreateSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCreateError("");

    if (!newName.trim()) {
      setCreateError("Playlist name is required.");
      return;
    }

    setIsCreating(true);
    try {
      const formData = new FormData();
      formData.append("name", newName);
      if (newCover) {
        formData.append("cover", newCover);
      }

      await api.post("/playlists", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Reset and close modal
      setNewName("");
      setNewCover(null);
      setShowCreateModal(false);
      await fetchPlaylists();
    } catch (error: any) {
      console.error("Error creating playlist:", error);
      setCreateError(
        error?.response?.data?.message ||
          "Failed to create playlist. Please try again.",
      );
    } finally {
      setIsCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2
            className="animate-spin text-[var(--gruvbox-yellow)]"
            size={36}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error}</p>
            <button
              onClick={fetchPlaylists}
              className="mt-4 rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--gruvbox-cream)]">
              My Playlists
            </h1>
            <p className="mt-1 text-sm text-[var(--gruvbox-muted-cream)]">
              Organize your books into collections.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
          >
            <Plus size={18} />
            New Playlist
          </button>
        </div>

        {/* Playlist Grid */}
        {playlists.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--gruvbox-surface)] p-12 text-center">
            <p className="text-[var(--gruvbox-gray)]">No playlists yet.</p>
            <p className="mt-2 text-sm text-[var(--gruvbox-gray)]">
              Create your first playlist to start organizing.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {playlists.map((playlist) => (
              <motion.article
                key={playlist._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] shadow-lg shadow-black/10 transition-all duration-300 hover:border-[var(--gruvbox-yellow)]/40 hover:shadow-xl"
              >
                <Link
                  to={`/playlists/${playlist._id}`}
                  className="flex h-full flex-col"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-[var(--gruvbox-background)]">
                    {playlist.cover ? (
                      <img
                        src={playlist.cover}
                        alt={playlist.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                        <BookOpen size={40} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-1 font-bold text-[var(--gruvbox-cream)] group-hover:text-[var(--gruvbox-yellow)]">
                      {playlist.name}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--gruvbox-gray)]">
                      {playlist.books?.length || 0} books
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Create Playlist Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-2xl"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[var(--gruvbox-cream)]">
                    Create Playlist
                  </h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-lg p-1 text-[var(--gruvbox-gray)] transition hover:bg-[var(--gruvbox-background-soft)] hover:text-[var(--gruvbox-cream)]"
                  >
                    <X size={20} />
                  </button>
                </div>

                {createError && (
                  <div className="mb-4 rounded-lg border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-4 py-2 text-sm text-[var(--gruvbox-red)]">
                    {createError}
                  </div>
                )}

                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="playlistName"
                      className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                    >
                      Name
                    </label>
                    <input
                      id="playlistName"
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g., Favourites"
                      className="w-full rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 px-4 py-2 text-sm text-[var(--gruvbox-cream)] outline-none placeholder:text-[var(--gruvbox-gray)] focus:border-[var(--gruvbox-yellow)]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="playlistCover"
                      className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                    >
                      Cover (optional)
                    </label>
                    <input
                      id="playlistCover"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleCoverChange}
                      className="w-full text-sm text-[var(--gruvbox-gray)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--gruvbox-background-soft)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--gruvbox-cream)] hover:file:bg-[var(--gruvbox-surface)]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isCreating}
                    className="w-full rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)] disabled:opacity-50"
                  >
                    {isCreating ? "Creating..." : "Create"}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default PlaylistMain;
