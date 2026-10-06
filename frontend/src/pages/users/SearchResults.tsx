import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, User, Loader2 } from "lucide-react";
import UserNavbar from "../../components/users/UserNavbar";
import api from "../../services/api";

type BookResult = {
  _id: string;
  title: string;
  cover?: string;
  author?: {
    _id: string;
    name: string;
    surname: string;
  } | null;
};

type AuthorResult = {
  _id: string;
  name: string;
  surname: string;
  picture?: string;
};

type SearchResponse = {
  books: BookResult[];
  authors: AuthorResult[];
};

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [books, setBooks] = useState<BookResult[]>([]);
  const [authors, setAuthors] = useState<AuthorResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    async function fetchSearchResults() {
      setLoading(true);
      setError("");
      try {
        const response = await api.get<SearchResponse>("/search", {
          params: { q: query },
        });
        setBooks(response.data.books || []);
        setAuthors(response.data.authors || []);
      } catch (err: any) {
        console.error("Search error:", err);
        setError(
          err?.response?.data?.message || "Failed to perform search. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--gruvbox-cream)]">
            Search Results
          </h1>
          <p className="mt-1 text-sm text-[var(--gruvbox-muted-cream)]">
            Showing results for{" "}
            <span className="font-semibold text-[var(--gruvbox-yellow)]">
              "{query}"
            </span>
          </p>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[var(--gruvbox-yellow)]" size={36} />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-4 text-sm text-[var(--gruvbox-red)]">
            {error}
          </div>
        ) : books.length === 0 && authors.length === 0 ? (
          <p className="text-[var(--gruvbox-gray)]">No results found.</p>
        ) : (
          <div className="space-y-10">
            {/* Authors Section */}
            {authors.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--gruvbox-cream)]">
                  <User size={20} className="text-[var(--gruvbox-aqua)]" />
                  Authors ({authors.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {authors.map((author) => (
                    <Link
                      key={author._id}
                      to={`/authors/${author._id}`}
                      className="group flex flex-col items-center rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-4 transition hover:border-[var(--gruvbox-aqua)]/40"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-full bg-[var(--gruvbox-background)]">
                        {author.picture ? (
                          <img
                            src={author.picture}
                            alt={`${author.name} ${author.surname}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                            <User size={32} />
                          </div>
                        )}
                      </div>
                      <p className="mt-2 text-center font-bold text-[var(--gruvbox-cream)] group-hover:text-[var(--gruvbox-aqua)]">
                        {author.name} {author.surname}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Books Section */}
            {books.length > 0 && (
              <section>
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-[var(--gruvbox-cream)]">
                  <BookOpen size={20} className="text-[var(--gruvbox-yellow)]" />
                  Books ({books.length})
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {books.map((book) => (
                    <Link
                      key={book._id}
                      to={`/books/${book._id}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] transition hover:border-[var(--gruvbox-yellow)]/40"
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
                        {book.author && (
                          <p className="text-xs text-[var(--gruvbox-gray)]">
                            {book.author.name} {book.author.surname}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default SearchResults;