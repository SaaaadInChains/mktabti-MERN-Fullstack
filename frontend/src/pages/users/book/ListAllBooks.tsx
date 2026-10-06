import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import UserNavbar from "../../../components/users/UserNavbar.tsx"; 
import api from "../../../services/api.ts"; 

type BookType = {
  _id: string;
  title: string;
  numberOfPages: number;
  genre: string;
  cover: string;
  summary: string;
  author: {
    _id: string;
    name: string;
    surname: string;
  } | null;
  averageRating?: number;
  reviewCount?: number;
  createdAt?: string;
};

type PaginatedBooksResponse = {
  books: BookType[];
  total: number;
  page: number;
  pages: number;
};

function ListAllBooks() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 12;

  async function fetchBooks() {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<PaginatedBooksResponse>("/books", {
        params: { page, limit },
      });
      setBooks(response.data.books);
      setTotalPages(response.data.pages || 1);
    } catch (err: any) {
      console.error("Error fetching books:", err);
      setError(
        err?.response?.data?.message || "Failed to load books. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [page]);

  function goToPage(newPage: number) {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
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

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error}</p>
            <button
              onClick={fetchBooks}
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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[var(--gruvbox-cream)]">
              All Books
            </h1>
            <p className="mt-1 text-sm text-[var(--gruvbox-muted-cream)]">
              Discover your next favourite read.
            </p>
          </div>
          <BookOpen className="hidden text-[var(--gruvbox-yellow)] sm:block" size={32} />
        </div>

        {books.length === 0 ? (
          <p className="text-center text-[var(--gruvbox-gray)]">
            No books found. Check back later!
          </p>
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
            {books.map((book) => (
              <motion.article
                key={book._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] shadow-lg shadow-black/10 transition-all duration-300 hover:border-[var(--gruvbox-yellow)]/40 hover:shadow-xl hover:shadow-[var(--gruvbox-yellow)]/5"
              >
                <Link to={`/books/${book._id}`} className="flex h-full flex-col">
                  <div className="relative h-52 w-full overflow-hidden bg-[var(--gruvbox-background)]">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                        <BookOpen size={48} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 font-bold text-[var(--gruvbox-cream)] transition-colors group-hover:text-[var(--gruvbox-yellow)]">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                      {book.author
                        ? `${book.author.name} ${book.author.surname}`
                        : "Unknown author"}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded-full bg-[var(--gruvbox-background-soft)] px-2.5 py-1 text-xs text-[var(--gruvbox-muted-cream)]">
                        {book.genre}
                      </span>
                      {book.averageRating !== undefined && (
                        <span className="text-sm font-medium text-[var(--gruvbox-yellow)]">
                          ★ {book.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        )}

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-[var(--gruvbox-surface)] px-3 py-2 text-sm text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-yellow)]/10 hover:text-[var(--gruvbox-yellow)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Prev
            </button>
            <span className="text-sm text-[var(--gruvbox-gray)]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="flex items-center gap-1 rounded-lg border border-[var(--gruvbox-surface)] px-3 py-2 text-sm text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-yellow)]/10 hover:text-[var(--gruvbox-yellow)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ListAllBooks;