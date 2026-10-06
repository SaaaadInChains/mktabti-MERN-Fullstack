import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
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
  movement: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string;
  dateOfDeath?: string | null;
  biography: string;
  picture?: string;
};

type AuthorResponse = {
  author?: Author;
  data?: Author;
};

type AuthorForm = {
  name: string;
  surname: string;
  movement: string;
  nationality: string;
  placeOfBirth: string;
  dateOfBirth: string;
  dateOfDeath: string;
  biography: string;
};

type ApiError = {
  message?: string;
};

function getAuthor(data: AuthorResponse | Author) {
  if ("author" in data && data.author) {
    return data.author;
  }

  if ("data" in data && data.data) {
    return data.data;
  }

  return data as Author;
}

function formatDateForInput(date?: string | null) {
  if (!date) {
    return "";
  }

  return date.slice(0, 10);
}

function AuthorEditOne() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<AuthorForm>({
    name: "",
    surname: "",
    movement: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    dateOfDeath: "",
    biography: "",
  });

  const [picture, setPicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadAuthor() {
      if (!id) {
        setError("Author ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<AuthorResponse | Author>(
          `/authors/${id}`,
        );

        const author = getAuthor(response.data);

        if (!author) {
          setError("The author could not be found.");
          return;
        }

        setForm({
          name: author.name || "",
          surname: author.surname || "",
          movement: author.movement || "",
          nationality: author.nationality || "",
          placeOfBirth: author.placeOfBirth || "",
          dateOfBirth: formatDateForInput(author.dateOfBirth),
          dateOfDeath: formatDateForInput(author.dateOfDeath),
          biography: author.biography || "",
        });

        setPicturePreview(author.picture || "");
      } catch {
        setError("Unable to load the author.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAuthor();
  }, [id]);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function handlePictureChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setPicture(file);
    setPicturePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !form.name ||
      !form.surname ||
      !form.movement ||
      !form.nationality ||
      !form.placeOfBirth ||
      !form.dateOfBirth ||
      !form.biography
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!id) {
      setError("Author ID is missing.");
      return;
    }

    setIsSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("surname", form.surname);
      formData.append("movement", form.movement);
      formData.append("nationality", form.nationality);
      formData.append("placeOfBirth", form.placeOfBirth);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("biography", form.biography);

      if (form.dateOfDeath) {
        formData.append("dateOfDeath", form.dateOfDeath);
      }

      if (picture) {
        formData.append("picture", picture);
      }

      await api.put(`/admin/authors/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("The author was updated successfully.");

      setTimeout(() => {
        navigate("/admin/authors");
      }, 900);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message || "The author could not be updated.",
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
    px-4 py-3
    text-[var(--gruvbox-cream)]
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
            onClick={() => navigate("/admin/authors")}
            className="
              mb-6 inline-flex items-center gap-2
              text-sm text-[var(--gruvbox-gray)]
              hover:text-[var(--gruvbox-yellow)]
            "
          >
            <ArrowLeft size={17} />
            Back to authors
          </button>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              Library management
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Edit author</h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              Update this author&apos;s profile.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[var(--gruvbox-gray)]">
              <LoaderCircle size={22} className="animate-spin" />
              Loading author...
            </div>
          ) : (
            <>
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-purple)]/15 text-[var(--gruvbox-purple)]">
                      <UserRound size={22} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">Author details</h2>

                      <p className="text-sm text-[var(--gruvbox-gray)]">
                        Update the author information.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          First name
                        </label>

                        <input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="surname"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          Surname
                        </label>

                        <input
                          id="surname"
                          name="surname"
                          value={form.surname}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="movement"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          Literary movement
                        </label>

                        <input
                          id="movement"
                          name="movement"
                          value={form.movement}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="nationality"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          Nationality
                        </label>

                        <input
                          id="nationality"
                          name="nationality"
                          value={form.nationality}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="placeOfBirth"
                        className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                      >
                        Place of birth
                      </label>

                      <input
                        id="placeOfBirth"
                        name="placeOfBirth"
                        value={form.placeOfBirth}
                        onChange={handleChange}
                        required
                        className={inputClasses}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="dateOfBirth"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          Date of birth
                        </label>

                        <input
                          id="dateOfBirth"
                          name="dateOfBirth"
                          type="date"
                          value={form.dateOfBirth}
                          onChange={handleChange}
                          required
                          className={inputClasses}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="dateOfDeath"
                          className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                        >
                          Date of death
                        </label>

                        <input
                          id="dateOfDeath"
                          name="dateOfDeath"
                          type="date"
                          value={form.dateOfDeath}
                          onChange={handleChange}
                          className={inputClasses}
                        />

                        <p className="mt-2 text-xs text-[var(--gruvbox-gray)]">
                          Leave empty if the author is alive.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="biography"
                        className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                      >
                        Biography
                      </label>

                      <textarea
                        id="biography"
                        name="biography"
                        value={form.biography}
                        onChange={handleChange}
                        rows={8}
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
                        <h2 className="text-lg font-bold">Author picture</h2>

                        <p className="text-sm text-[var(--gruvbox-gray)]">
                          Optional replacement
                        </p>
                      </div>
                    </div>

                    <label
                      htmlFor="picture"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/40 p-5 text-center hover:border-[var(--gruvbox-yellow)]/60"
                    >
                      {picturePreview ? (
                        <img
                          src={picturePreview}
                          alt="Author picture preview"
                          className="h-56 w-full rounded-xl object-cover"
                        />
                      ) : (
                        <>
                          <Upload
                            size={25}
                            className="text-[var(--gruvbox-aqua)]"
                          />

                          <p className="mt-3 text-sm font-bold">
                            Upload a picture
                          </p>
                        </>
                      )}

                      <input
                        id="picture"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePictureChange}
                        className="hidden"
                      />
                    </label>
                  </section>

                  <section className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-5">
                    <h2 className="font-bold">Save your changes</h2>

                    <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-gray)]">
                      The updated information will replace the current author
                      details.
                    </p>

                    <motion.button
                      type="submit"
                      disabled={isSaving}
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-4 py-3 font-bold text-[var(--gruvbox-background)] hover:bg-[var(--gruvbox-orange)] disabled:cursor-not-allowed disabled:opacity-50"
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

export default AuthorEditOne;
