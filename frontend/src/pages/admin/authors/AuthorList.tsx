import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "motion/react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

import api from "../../../services/api";
import AdminNavbar from "../../../components/admin/AdminNavbar";

type Author = {
  _id?: string;
  id?: string;
  name: string;
  surname: string;
  movement?: string;
  nationality?: string;
  placeOfBirth?: string;
  picture?: string;
};

type AuthorsResponse = {
  authors?: Author[];
  data?: Author[];
};

function getAuthors(data: AuthorsResponse | Author[]) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.authors)) {
    return data.authors;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

function AuthorList() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAuthors() {
      try {
        const response = await api.get<
          AuthorsResponse | Author[]
        >("/authors?page=1&limit=100");

        setAuthors(getAuthors(response.data));
      } catch {
        setError("Unable to load the authors.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthors();
  }, []);

  const filteredAuthors = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return authors.filter((author) => {
      const fullName =
        `${author.name} ${author.surname}`.toLowerCase();

      return (
        fullName.includes(search) ||
        author.movement?.toLowerCase().includes(search) ||
        author.nationality?.toLowerCase().includes(search)
      );
    });
  }, [authors, searchTerm]);

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

              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                All authors
              </h1>

              <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
                Browse and edit every author in the library.
              </p>
            </div>

            <RouterLink
              to="/admin/authors/new"
              className="
                inline-flex items-center justify-center gap-2
                rounded-xl bg-[var(--gruvbox-yellow)]
                px-4 py-3 font-bold
                text-[var(--gruvbox-background)]
                transition-all duration-200
                hover:bg-[var(--gruvbox-orange)]
              "
            >
              <Plus size={18} />
              Add author
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
              placeholder="Search by name, movement, or nationality..."
              className="
                w-full bg-transparent
                text-[var(--gruvbox-cream)]
                outline-none
                placeholder:text-[var(--gruvbox-gray)]
              "
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
              Loading authors...
            </div>
          ) : filteredAuthors.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-5 py-16 text-center">
              <UserRound
                size={38}
                className="mx-auto text-[var(--gruvbox-gray)]"
              />

              <h2 className="mt-4 text-xl font-bold">
                No authors found
              </h2>

              <p className="mt-2 text-[var(--gruvbox-gray)]">
                Try another search or add a new author.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAuthors.map((author, index) => {
                const authorId = author._id || author.id;

                return (
                  <motion.article
                    key={
                      authorId ||
                      `${author.name}-${author.surname}`
                    }
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.4,
                    }}
                    className="
                      group overflow-hidden rounded-2xl
                      border border-[var(--gruvbox-surface)]
                      bg-[var(--gruvbox-paper)]
                      transition-all duration-300
                      hover:-translate-y-1
                      hover:border-[var(--gruvbox-purple)]/50
                      hover:shadow-xl hover:shadow-black/20
                    "
                  >
                    <div className="h-64 overflow-hidden bg-[var(--gruvbox-background-soft)]">
                      {author.picture ? (
                        <img
                          src={author.picture}
                          alt={`${author.name} ${author.surname}`}
                          className="
                            h-full w-full object-cover
                            transition-transform duration-500
                            group-hover:scale-105
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                          <UserRound size={48} />
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gruvbox-purple)]">
                        {author.movement || "Author"}
                      </p>

                      <h2 className="mt-2 text-2xl font-bold">
                        {author.name} {author.surname}
                      </h2>

                      <p className="mt-2 text-sm text-[var(--gruvbox-muted-cream)]">
                        {author.nationality ||
                          "Nationality unavailable"}
                      </p>

                      {author.placeOfBirth && (
                        <p className="mt-1 text-xs text-[var(--gruvbox-gray)]">
                          Born in {author.placeOfBirth}
                        </p>
                      )}

                      <RouterLink
                        to={`/admin/authors/${authorId}/edit`}
                        className="
                          mt-5 inline-flex items-center gap-2
                          text-sm font-bold
                          text-[var(--gruvbox-yellow)]
                          transition-colors duration-200
                          hover:text-[var(--gruvbox-orange)]
                        "
                      >
                        <Pencil size={16} />
                        Edit author
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

export default AuthorList;