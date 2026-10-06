import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ImagePlus,
  LoaderCircle,
  Upload,
  UserRound,
} from "lucide-react";

import api from "../../../services/api";
import AdminNavbar from "../../../components/admin/AdminNavbar";

type Author = {
  _id?: string;
  id?: string;
  name: string;
  surname: string;
};

type AuthorResponse = {
  authors?: Author[];
  data?: Author[];
};

type Book = {
  _id?: string;
  id?: string;
  title: string;
  numberOfPages: number;
  genre: string;
  summary: string;
  cover?: string;
  author?: Author | string;
};

type BookResponse = {
  book?: Book;
  data?: Book;
};

type BookForm = {
  title: string;
  numberOfPages: string;
  genre: string;
  summary: string;
  author: string;
};

type ApiError = {
  message?: string;
};

function getAuthors(data: AuthorResponse | Author[]) {
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

function getBook(data: BookResponse | Book) {
  if ("book" in data && data.book) {
    return data.book;
  }

  if ("data" in data && data.data) {
    return data.data;
  }

  return data as Book;
}

function getAuthorId(author?: Author | string) {
  if (!author) {
    return "";
  }

  if (typeof author === "string") {
    return author;
  }

  return author._id || author.id || "";
}

function BookEditOne() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [authors, setAuthors] = useState<Author[]>([]);

  const [form, setForm] = useState<BookForm>({
    title: "",
    numberOfPages: "",
    genre: "",
    summary: "",
    author: "",
  });

  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadBookAndAuthors() {
      if (!id) {
        setError("Book ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const [bookResponse, authorsResponse] = await Promise.all([
          api.get<BookResponse | Book>(`/books/${id}`),
          api.get<AuthorResponse | Author[]>("/authors?page=1&limit=100"),
        ]);

        const book = getBook(bookResponse.data);

        if (!book) {
          setError("The book could not be found.");
          return;
        }

        setForm({
          title: book.title || "",
          numberOfPages: String(book.numberOfPages || ""),
          genre: book.genre || "",
          summary: book.summary || "",
          author: getAuthorId(book.author),
        });

        setCoverPreview(book.cover || "");
        setAuthors(getAuthors(authorsResponse.data));
      } catch {
        setError("Unable to load the book.");
      } finally {
        setIsLoading(false);
      }
    }

    loadBookAndAuthors();
  }, [id]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handleCoverChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.title ||
      !form.numberOfPages ||
      !form.genre ||
      !form.summary ||
      !form.author
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (Number(form.numberOfPages) <= 0) {
      setError("The number of pages must be greater than zero.");
      return;
    }

    if (!id) {
      setError("Book ID is missing.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("numberOfPages", form.numberOfPages);
      formData.append("genre", form.genre);
      formData.append("summary", form.summary);
      formData.append("author", form.author);

      if (cover) {
        formData.append("cover", cover);
      }

      await api.put(`/admin/books/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("The book was updated successfully.");

      setTimeout(() => {
        navigate("/admin/books");
      }, 900);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message || "The book could not be updated.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const inputClasses = `
    w-full rounded-xl border
    border-[var(--gruvbox-surface)]
    bg-[var(--gruvbox-background)]/60
    px-4 py-3 text-[var(--gruvbox-cream)]
    outline-none placeholder:text-[var(--gruvbox-gray)]
    transition-all duration-200
    hover:border-[var(--gruvbox-orange)]
    focus:border-[var(--gruvbox-yellow)]
    focus:ring-2 focus:ring-[var(--gruvbox-yellow)]/20
  `;

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="
              mb-6 inline-flex items-center gap-2
              text-sm text-[var(--gruvbox-gray)]
              transition-colors duration-200
              hover:text-[var(--gruvbox-yellow)]
            "
          >
            <ArrowLeft size={17} />
            Back to books
          </button>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              Library management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Edit book
            </h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              Update the information for this book.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[var(--gruvbox-gray)]">
              <LoaderCircle size={22} className="animate-spin" />
              Loading book...
            </div>
          ) : (
            <>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    mb-6 rounded-2xl
                    border border-[var(--gruvbox-red)]/40
                    bg-[var(--gruvbox-red)]/10
                    px-5 py-4 text-sm
                    text-[var(--gruvbox-red)]
                  "
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="
                    mb-6 rounded-2xl
                    border border-[var(--gruvbox-green)]/40
                    bg-[var(--gruvbox-green)]/10
                    px-5 py-4 text-sm
                    text-[var(--gruvbox-green)]
                  "
                >
                  {success}
                </motion.div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid gap-6 lg:grid-cols-[1fr_300px]"
              >
                <section
                  className="
                    rounded-2xl border
                    border-[var(--gruvbox-surface)]
                    bg-[var(--gruvbox-paper)]
                    p-5 shadow-xl shadow-black/10
                    sm:p-7
                  "
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]">
                      <BookOpen size={22} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Book details</h2>

                      <p className="text-sm text-[var(--gruvbox-gray)]">
                        Update the book information.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="title"
                        className="
                          mb-2 block text-sm font-medium
                          text-[var(--gruvbox-muted-cream)]
                        "
                      >
                        Book title
                      </label>

                      <input
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="numberOfPages"
                          className="
                            mb-2 block text-sm font-medium
                            text-[var(--gruvbox-muted-cream)]
                          "
                        >
                          Number of pages
                        </label>

                        <input
                          id="numberOfPages"
                          name="numberOfPages"
                          type="number"
                          min="1"
                          value={form.numberOfPages}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="genre"
                          className="
                            mb-2 block text-sm font-medium
                            text-[var(--gruvbox-muted-cream)]
                          "
                        >
                          Genre
                        </label>

                        <input
                          id="genre"
                          name="genre"
                          value={form.genre}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="author"
                        className="
                          mb-2 flex items-center gap-2
                          text-sm font-medium
                          text-[var(--gruvbox-muted-cream)]
                        "
                      >
                        <UserRound size={16} />
                        Author
                      </label>

                      <select
                        id="author"
                        name="author"
                        value={form.author}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                      >
                        <option value="">Select an author</option>

                        {authors.map((author) => {
                          const authorId = author._id || author.id;

                          return (
                            <option key={authorId} value={authorId}>
                              {author.name} {author.surname}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="summary"
                        className="
                          mb-2 block text-sm font-medium
                          text-[var(--gruvbox-muted-cream)]
                        "
                      >
                        Summary
                      </label>

                      <textarea
                        id="summary"
                        name="summary"
                        value={form.summary}
                        onChange={handleChange}
                        rows={7}
                        required
                        className={`${inputClasses} resize-none`}
                      />
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <section
                    className="
                      rounded-2xl border
                      border-[var(--gruvbox-surface)]
                      bg-[var(--gruvbox-paper)]
                      p-5 shadow-xl shadow-black/10
                    "
                  >
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-aqua)]/15 text-[var(--gruvbox-aqua)]">
                        <ImagePlus size={22} />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold">Cover image</h2>

                        <p className="text-sm text-[var(--gruvbox-gray)]">
                          Optional replacement
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="cover"
                      className="
                        flex cursor-pointer flex-col
                        items-center justify-center
                        rounded-2xl border border-dashed
                        border-[var(--gruvbox-surface)]
                        bg-[var(--gruvbox-background)]/40
                        p-5 text-center
                        transition-all duration-200
                        hover:border-[var(--gruvbox-yellow)]/60
                        hover:bg-[var(--gruvbox-yellow)]/5
                      "
                    >
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Book cover preview"
                          className="h-56 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <>
                          <Upload
                            size={25}
                            className="text-[var(--gruvbox-aqua)]"
                          />

                          <p className="mt-3 text-sm font-bold">
                            Upload a cover
                          </p>
                        </>
                      )}

                      <input
                        id="cover"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleCoverChange}
                        className="hidden"
                      />
                    </label>
                  </section>

                  <section
                    className="
                      rounded-2xl border
                      border-[var(--gruvbox-surface)]
                      bg-[var(--gruvbox-background-soft)]
                      p-5
                    "
                  >
                    <h2 className="font-bold">Save your changes</h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-gray)]">
                      The updated information will replace the current book
                      details.
                    </p>

                    <motion.button
                      type="submit"
                      disabled={isSaving}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      className="
                        mt-5 flex w-full items-center
                        justify-center gap-2 rounded-xl
                        bg-[var(--gruvbox-yellow)]
                        px-4 py-3 font-bold
                        text-[var(--gruvbox-background)]
                        transition-all duration-200
                        hover:bg-[var(--gruvbox-orange)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {isSaving ? (
                        <>
                          <LoaderCircle size={18} className="animate-spin" />
                          Saving changes...
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          Save changes
                        </>
                      )}
                    </motion.button>
                  </section>
                </aside>
              </form>
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default BookEditOne;
