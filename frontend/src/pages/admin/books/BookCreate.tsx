import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
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
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.authors)) return data.authors;
  if (Array.isArray(data.data)) return data.data;

  return [];
}

function BookCreate() {
  const navigate = useNavigate();

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
  const [isLoadingAuthors, setIsLoadingAuthors] =
    useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadAuthors() {
      try {
        const response = await api.get<AuthorResponse | Author[]>(
          "/authors?page=1&limit=100"
        );

        setAuthors(getAuthors(response.data));
      } catch {
        setError("Unable to load authors.");
      } finally {
        setIsLoadingAuthors(false);
      }
    }

    loadAuthors();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleCoverChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
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

      await api.post("/admin/books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("The book was created successfully.");

      setTimeout(() => {
        navigate("/admin/books");
      }, 900);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message ||
            "The book could not be created."
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
          transition={{ duration: 0.5 }}
        >
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--gruvbox-gray)] hover:text-[var(--gruvbox-yellow)]"
          >
            <ArrowLeft size={17} />
            Back to books
          </button>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              Library management
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Add a new book
            </h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              Add a book to your literary collection.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-5 py-4 text-sm text-[var(--gruvbox-red)]">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-2xl border border-[var(--gruvbox-green)]/40 bg-[var(--gruvbox-green)]/10 px-5 py-4 text-sm text-[var(--gruvbox-green)]">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1fr_300px]"
          >
            <section className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5 shadow-xl shadow-black/10 sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]">
                  <BookOpen size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold">
                    Book details
                  </h2>

                  <p className="text-sm text-[var(--gruvbox-gray)]">
                    Add the main information about this book.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                  >
                    Book title
                  </label>

                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter the book title"
                    required
                    className={inputClasses}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="numberOfPages"
                      className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
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
                      placeholder="320"
                      required
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="genre"
                      className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                    >
                      Genre
                    </label>

                    <input
                      id="genre"
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      placeholder="Philosophy"
                      required
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="author"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--gruvbox-muted-cream)]"
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
                    disabled={isLoadingAuthors}
                    className={inputClasses}
                  >
                    <option value="">
                      {isLoadingAuthors
                        ? "Loading authors..."
                        : "Select an author"}
                    </option>

                    {authors.map((author) => {
                      const authorId = author._id || author.id;

                      return (
                        <option
                          key={authorId}
                          value={authorId}
                        >
                          {author.name} {author.surname}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="summary"
                    className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                  >
                    Summary
                  </label>

                  <textarea
                    id="summary"
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    placeholder="Write a short summary..."
                    rows={7}
                    required
                    className={`${inputClasses} resize-none`}
                  />
                </div>
              </div>
            </section>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5 shadow-xl shadow-black/10">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-aqua)]/15 text-[var(--gruvbox-aqua)]">
                    <ImagePlus size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      Cover image
                    </h2>

                    <p className="text-sm text-[var(--gruvbox-gray)]">
                      Optional
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="cover"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/40 p-5 text-center hover:border-[var(--gruvbox-yellow)]/60"
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

                      <p className="mt-1 text-xs text-[var(--gruvbox-gray)]">
                        JPEG, PNG, or WEBP
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

              <section className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-5">
                <h2 className="font-bold">Ready to publish?</h2>

                <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-gray)]">
                  Check the information before adding this book.
                </p>

                <motion.button
                  type="submit"
                  disabled={isSaving || isLoadingAuthors}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-4 py-3 font-bold text-[var(--gruvbox-background)] hover:bg-[var(--gruvbox-orange)] disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <LoaderCircle
                        size={18}
                        className="animate-spin"
                      />
                      Saving book...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Create book
                    </>
                  )}
                </motion.button>
              </section>
            </aside>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

export default BookCreate;