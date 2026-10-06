import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  BookOpen,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
} from "lucide-react";

import api from "../../../services/api";
import AdminNavbar from "../../../components/admin/AdminNavbar";

type Author = {
  _id?: string;
  id?: string;
  name: string;
  surname: string;
};

type Book = {
  _id?: string;
  id?: string;
  title: string;
  numberOfPages: number;
  genre: string;
  cover?: string;
  author?: Author | string;
};

type BooksResponse = {
  books?: Book[];
  data?: Book[];
};

function getBooks(data: BooksResponse | Book[]) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.books)) return data.books;
  if (Array.isArray(data.data)) return data.data;

  return [];
}

function getAuthorName(author?: Author | string) {
  if (!author) return "Unknown author";
  if (typeof author === "string") return author;

  return `${author.name} ${author.surname}`;
}

function BookEdit() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await api.get<BooksResponse | Book[]>(
          "/books?page=1&limit=100"
        );

        setBooks(getBooks(response.data));
      } catch {
        setError("Unable to load the books.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return books.filter((book) => {
      const author = getAuthorName(book.author);

      return (
        book.title.toLowerCase().includes(search) ||
        book.genre.toLowerCase().includes(search) ||
        author.toLowerCase().includes(search)
      );
    });
  }, [books, searchTerm]);

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
                Library management
              </p>

              <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                All books
              </h1>

              <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
                Browse and edit every book in the library.
              </p>
            </div>

            <RouterLink
              to="/admin/books/new"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-4 py-3 font-bold text-[var(--gruvbox-background)] hover:bg-[var(--gruvbox-orange)]"
            >
              <Plus size={18} />
              Add book
            </RouterLink>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-4 py-3">
            <Search
              size={19}
              className="text-[var(--gruvbox-gray)]"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search books by title, author, or genre..."
              className="w-full bg-transparent text-[var(--gruvbox-cream)] outline-none placeholder:text-[var(--gruvbox-gray)]"
            />
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-5 py-4 text-[var(--gruvbox-red)]">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[var(--gruvbox-gray)]">
              <LoaderCircle size={21} className="animate-spin" />
              Loading books...
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-5 py-16 text-center">
              <BookOpen
                size={38}
                className="mx-auto text-[var(--gruvbox-gray)]"
              />

              <h2 className="mt-4 text-xl font-bold">
                No books found
              </h2>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book, index) => {
                const bookId = book._id || book.id;

                return (
                  <motion.article
                    key={bookId || book.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04,
                      duration: 0.4,
                    }}
                    className="group overflow-hidden rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--gruvbox-yellow)]/50 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="h-56 overflow-hidden bg-[var(--gruvbox-background-soft)]">
                      {book.cover ? (
                        <img
                          src={book.cover}
                          alt={`${book.title} cover`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                          <BookOpen size={42} />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gruvbox-orange)]">
                        {book.genre}
                      </p>

                      <h2 className="mt-2 line-clamp-2 text-xl font-bold">
                        {book.title}
                      </h2>

                      <p className="mt-2 text-sm text-[var(--gruvbox-muted-cream)]">
                        {getAuthorName(book.author)}
                      </p>

                      <p className="mt-1 text-xs text-[var(--gruvbox-gray)]">
                        {book.numberOfPages} pages
                      </p>

                      <RouterLink
                        to={`/admin/books/${bookId}/edit`}
                        className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--gruvbox-yellow)] hover:text-[var(--gruvbox-orange)]"
                      >
                        <Pencil size={16} />
                        Edit book
                      </RouterLink>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default BookEdit;