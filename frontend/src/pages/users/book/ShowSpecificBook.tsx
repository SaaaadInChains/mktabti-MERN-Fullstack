import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Loader2, Star, User as UserIcon } from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type AuthorType = {
  _id: string;
  name: string;
  surname: string;
};

type BookType = {
  _id: string;
  title: string;
  numberOfPages: number;
  genre: string;
  cover: string;
  summary: string;
  author: AuthorType | null;
  averageRating: number;
  reviewCount: number;
};

type ReviewType = {
  _id: string;
  rating: number;
  userId: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
};

type CommentType = {
  _id: string;
  content: string;
  user: {
    _id: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
};

type PlaylistType = {
  _id: string;
  name: string;
  books: string[];
};

function ShowSpecificBook() {
  const { id } = useParams<{ id: string }>();

  const [book, setBook] = useState<BookType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [showPlaylists, setShowPlaylists] = useState(false);
  const [isUpdatingPlaylist, setIsUpdatingPlaylist] = useState<string | null>(null);

  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  async function fetchBookData() {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const [bookResponse, reviewsResponse, commentsResponse] = await Promise.all([
        api.get<BookType>(`/books/${id}`),
        api.get(`/books/${id}/reviews`),
        api.get(`/books/${id}/comments`),
      ]);

      setBook(bookResponse.data);

      setReviews(reviewsResponse.data.reviews || []);

      if (bookResponse.data) {
        setBook({
          ...bookResponse.data,
          averageRating:
            reviewsResponse.data.averageRating ?? bookResponse.data.averageRating,
          reviewCount:
            reviewsResponse.data.count ?? bookResponse.data.reviewCount,
        });
      }

      setComments(commentsResponse.data.comments || []);
    } catch (err: any) {
      console.error("Error fetching book:", err);
      setError(
        err?.response?.data?.message || "Failed to load book. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function fetchPlaylists() {
    if (!isAuthenticated) return;
    try {
      const response = await api.get("/playlists");
      setPlaylists(response.data.playlists || []);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }

  useEffect(() => {
    fetchBookData();
    fetchPlaylists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleRatingSubmit() {
    if (!rating || rating < 1 || rating > 5) return;
    setIsSubmittingRating(true);
    try {
      await api.post(`/books/${id}/reviews`, { rating });
      setRating(0);
      await fetchBookData();
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      alert(error?.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  }

  async function handleCommentSubmit() {
    if (!comment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await api.post("/comments", {
        content: comment,
        targetType: "Book",
        targetId: id,
      });
      setComment("");
      const response = await api.get(`/books/${id}/comments`);
      setComments(response.data.comments || []);
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      alert(error?.response?.data?.message || "Failed to submit comment");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function toggleBookInPlaylist(playlistId: string) {
    if (!id || isUpdatingPlaylist) return;
    setIsUpdatingPlaylist(playlistId);
    try {
      // Fetch current playlist to get books array
      const playlistResponse = await api.get(`/playlists/${playlistId}`);
      const currentBooks = playlistResponse.data.playlist.books.map(
        (b: any) => b._id || b,
      );
      const bookId = id;
      let newBooks;
      if (currentBooks.includes(bookId)) {
        newBooks = currentBooks.filter((b: string) => b !== bookId);
      } else {
        newBooks = [...currentBooks, bookId];
      }
      await api.put(`/playlists/${playlistId}`, { books: newBooks });
      // Refresh playlists to update checked state
      await fetchPlaylists();
    } catch (error: any) {
      console.error("Error updating playlist:", error);
      alert(error?.response?.data?.message || "Failed to update playlist");
    } finally {
      setIsUpdatingPlaylist(null);
    }
  }

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

  if (error || !book) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error || "Book not found"}</p>
            <Link
              to="/books"
              className="mt-4 inline-block rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              Back to books
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
        {/* Book Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl shadow-black/10 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="overflow-hidden rounded-2xl bg-[var(--gruvbox-background)]"
            >
              {book.cover ? (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="h-80 w-full object-cover md:h-[420px]"
                />
              ) : (
                <div className="flex h-80 items-center justify-center text-[var(--gruvbox-gray)] md:h-[420px]">
                  <BookOpen size={64} />
                </div>
              )}
            </motion.div>

            {/* Main Info */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--gruvbox-cream)] sm:text-4xl">
                {book.title}
              </h1>

              <p className="mt-3 text-lg text-[var(--gruvbox-muted-cream)]">
                By{" "}
                {book.author ? (
                  <Link
                    to={`/authors/${book.author._id}`}
                    className="font-semibold text-[var(--gruvbox-yellow)] transition hover:text-[var(--gruvbox-orange)] hover:underline"
                  >
                    {book.author.name} {book.author.surname}
                  </Link>
                ) : (
                  "Unknown author"
                )}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-3 py-1 text-sm text-[var(--gruvbox-muted-cream)]">
                  {book.genre}
                </span>
                <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-3 py-1 text-sm text-[var(--gruvbox-muted-cream)]">
                  {book.numberOfPages} pages
                </span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= Math.round(book.averageRating)
                          ? "fill-[var(--gruvbox-yellow)] text-[var(--gruvbox-yellow)]"
                          : "text-[var(--gruvbox-gray)]"
                      }
                    />
                  ))}
                  <span className="text-sm text-[var(--gruvbox-gray)]">
                    {book.averageRating?.toFixed(1)} ({book.reviewCount})
                  </span>
                </div>
              </div>

              {/* Rating input */}
              <div className="mt-6">
                {isAuthenticated ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-[var(--gruvbox-muted-cream)]">
                      Your rating:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="transition-transform duration-150 hover:scale-125"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            size={26}
                            className={
                              star <= rating
                                ? "fill-[var(--gruvbox-yellow)] text-[var(--gruvbox-yellow)]"
                                : "text-[var(--gruvbox-gray)]"
                            }
                          />
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={handleRatingSubmit}
                      disabled={!rating || isSubmittingRating}
                      className="rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSubmittingRating ? "Submitting..." : "Submit rating"}
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-[var(--gruvbox-gray)]">
                    Please{" "}
                    <Link
                      to="/login"
                      className="text-[var(--gruvbox-yellow)] hover:underline"
                    >
                      log in
                    </Link>{" "}
                    to rate this book.
                  </p>
                )}
              </div>

              {/* Add to playlist */}
              {isAuthenticated && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowPlaylists((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--gruvbox-surface)] px-4 py-2 text-sm font-medium text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-background-soft)] hover:text-[var(--gruvbox-cream)]"
                  >
                    <BookOpen size={16} />
                    Add to playlist
                  </button>
                  <AnimatePresence>
                    {showPlaylists && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="mt-2 w-64 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-2 shadow-xl"
                      >
                        {playlists.length === 0 ? (
                          <p className="p-2 text-sm text-[var(--gruvbox-gray)]">
                            No playlists yet. Create one from your profile.
                          </p>
                        ) : (
                          playlists.map((playlist) => {
                            const isBookInPlaylist = playlist.books.includes(id!);
                            return (
                              <button
                                key={playlist._id}
                                onClick={() => toggleBookInPlaylist(playlist._id)}
                                disabled={isUpdatingPlaylist === playlist._id}
                                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-background-soft)] disabled:opacity-50"
                              >
                                <span>{playlist.name}</span>
                                <span className="text-[var(--gruvbox-yellow)]">
                                  {isBookInPlaylist ? "✓" : ""}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Description */}
              <div className="mt-6 border-t border-[var(--gruvbox-surface)] pt-5">
                <h2 className="text-xl font-bold text-[var(--gruvbox-cream)]">
                  About this book
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--gruvbox-muted-cream)]">
                  {book.summary || "No summary available."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Reviews and Comments */}
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {/* Reviews */}
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5"
          >
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--gruvbox-cream)]">
              <Star size={20} className="text-[var(--gruvbox-yellow)]" />
              Reviews ({reviews.length})
            </h2>
            <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <p className="text-sm text-[var(--gruvbox-gray)]">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review._id}
                    className="flex items-start gap-3 rounded-lg bg-[var(--gruvbox-background)]/50 p-3"
                  >
                    {review.userId.avatar ? (
                      <img
                        src={review.userId.avatar}
                        alt={review.userId.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon
                        size={24}
                        className="mt-1 text-[var(--gruvbox-aqua)]"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-[var(--gruvbox-cream)]">
                        {review.userId.username}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={14}
                            className={
                              star <= review.rating
                                ? "fill-[var(--gruvbox-yellow)] text-[var(--gruvbox-yellow)]"
                                : "text-[var(--gruvbox-gray)]"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>

          {/* Comments */}
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5"
          >
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--gruvbox-cream)]">
              Comments ({comments.length})
            </h2>

            {isAuthenticated ? (
              <div className="mb-4 flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 px-4 py-2 text-sm text-[var(--gruvbox-cream)] outline-none placeholder:text-[var(--gruvbox-gray)] focus:border-[var(--gruvbox-aqua)]"
                />
                <button
                  onClick={handleCommentSubmit}
                  disabled={!comment.trim() || isSubmittingComment}
                  className="rounded-lg bg-[var(--gruvbox-aqua)] px-3 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-blue)] disabled:opacity-50"
                >
                  {isSubmittingComment ? "..." : "Post"}
                </button>
              </div>
            ) : (
              <p className="mb-4 text-sm text-[var(--gruvbox-gray)]">
                Please{" "}
                <Link
                  to="/login"
                  className="text-[var(--gruvbox-yellow)] hover:underline"
                >
                  log in
                </Link>{" "}
                to comment.
              </p>
            )}

            <div className="max-h-80 space-y-3 overflow-y-auto pr-2">
              {comments.length === 0 ? (
                <p className="text-sm text-[var(--gruvbox-gray)]">
                  No comments yet.
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="flex items-start gap-2 rounded-lg bg-[var(--gruvbox-background)]/50 p-3"
                  >
                    {comment.user.avatar ? (
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon
                        size={16}
                        className="mt-0.5 text-[var(--gruvbox-aqua)]"
                      />
                    )}
                    <div>
                      <p className="text-sm font-bold text-[var(--gruvbox-cream)]">
                        {comment.user.username}
                      </p>
                      <p className="text-sm text-[var(--gruvbox-muted-cream)]">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

export default ShowSpecificBook;