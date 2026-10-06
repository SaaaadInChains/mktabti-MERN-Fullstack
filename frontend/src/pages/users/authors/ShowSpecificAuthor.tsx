import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, Loader2, User as UserIcon } from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type AuthorType = {
  _id: string;
  name: string;
  surname: string;
  movement?: string;
  nationality?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  dateOfDeath?: string | null;
  biography?: string;
  picture?: string;
};

type BookType = {
  _id: string;
  title: string;
  cover: string;
  genre?: string;
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

type AuthorResponse = {
  author: AuthorType;
  books: BookType[];
};

function ShowSpecificAuthor() {
  const { id } = useParams<{ id: string }>();

  const [author, setAuthor] = useState<AuthorType | null>(null);
  const [books, setBooks] = useState<BookType[]>([]);
  const [comments, setComments] = useState<CommentType[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  async function fetchAuthorData() {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const authorResponse = await api.get<AuthorResponse>(`/authors/${id}`);
      setAuthor(authorResponse.data.author);
      setBooks(authorResponse.data.books || []);

      // Fetch comments for this author
      const commentsResponse = await api.get(`/authors/${id}/comments`);
      setComments(commentsResponse.data.comments || []);
    } catch (err: any) {
      console.error("Error fetching author:", err);
      setError(
        err?.response?.data?.message || "Failed to load author. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAuthorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleCommentSubmit() {
    if (!comment.trim()) return;
    setIsSubmittingComment(true);
    try {
      await api.post("/comments", {
        content: comment,
        targetType: "Author",
        targetId: id,
      });
      setComment("");
      const response = await api.get(`/authors/${id}/comments`);
      setComments(response.data.comments || []);
    } catch (error: any) {
      console.error("Error submitting comment:", error);
      alert(error?.response?.data?.message || "Failed to submit comment");
    } finally {
      setIsSubmittingComment(false);
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

  if (error || !author) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error || "Author not found"}</p>
            <Link
              to="/authors"
              className="mt-4 inline-block rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              Back to authors
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
        {/* Author Hero */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl shadow-black/10 sm:p-8"
        >
          <div className="grid gap-6 md:grid-cols-[250px_1fr]">
            {/* Author Picture */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="overflow-hidden rounded-2xl bg-[var(--gruvbox-background)]"
            >
              {author.picture ? (
                <img
                  src={author.picture}
                  alt={`${author.name} ${author.surname}`}
                  className="h-72 w-full object-cover md:h-96"
                />
              ) : (
                <div className="flex h-72 items-center justify-center text-[var(--gruvbox-gray)] md:h-96">
                  <UserIcon size={80} />
                </div>
              )}
            </motion.div>

            {/* Author Info */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--gruvbox-cream)] sm:text-4xl">
                {author.name} {author.surname}
              </h1>

              <div className="mt-4 flex flex-wrap gap-2">
                {author.movement && (
                  <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-3 py-1 text-sm text-[var(--gruvbox-muted-cream)]">
                    {author.movement}
                  </span>
                )}
                {author.nationality && (
                  <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-3 py-1 text-sm text-[var(--gruvbox-muted-cream)]">
                    {author.nationality}
                  </span>
                )}
                {author.placeOfBirth && (
                  <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-3 py-1 text-sm text-[var(--gruvbox-muted-cream)]">
                    Born: {author.placeOfBirth}
                  </span>
                )}
              </div>

              <div className="mt-4 text-sm text-[var(--gruvbox-gray)]">
                {author.dateOfBirth && (
                  <span>Born: {new Date(author.dateOfBirth).toLocaleDateString()}</span>
                )}
                {author.dateOfDeath && (
                  <span className="ml-4">
                    Died: {new Date(author.dateOfDeath).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="mt-6 border-t border-[var(--gruvbox-surface)] pt-5">
                <h2 className="text-xl font-bold text-[var(--gruvbox-cream)]">Biography</h2>
                <p className="mt-3 leading-relaxed text-[var(--gruvbox-muted-cream)]">
                  {author.biography || "No biography available."}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Books by this author */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--gruvbox-cream)]">
            <BookOpen size={20} className="text-[var(--gruvbox-yellow)]" />
            Books by {author.name} {author.surname}
          </h2>

          {books.length === 0 ? (
            <p className="text-sm text-[var(--gruvbox-gray)]">No books found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book) => (
                <Link
                  key={book._id}
                  to={`/books/${book._id}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] transition-all duration-300 hover:border-[var(--gruvbox-yellow)]/40 hover:shadow-lg"
                >
                  <div className="h-40 w-full overflow-hidden bg-[var(--gruvbox-background)]">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                        <BookOpen size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 font-bold text-[var(--gruvbox-cream)] group-hover:text-[var(--gruvbox-yellow)]">
                      {book.title}
                    </p>
                    {book.genre && (
                      <p className="text-xs text-[var(--gruvbox-gray)]">{book.genre}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.section>

        {/* Comments Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5"
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
                className="rounded-lg bg-[var(--gruvbox-aqua)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-blue)] disabled:opacity-50"
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
              <p className="text-sm text-[var(--gruvbox-gray)]">No comments yet.</p>
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
                    <UserIcon size={16} className="mt-0.5 text-[var(--gruvbox-aqua)]" />
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
      </main>
    </div>
  );
}

export default ShowSpecificAuthor;