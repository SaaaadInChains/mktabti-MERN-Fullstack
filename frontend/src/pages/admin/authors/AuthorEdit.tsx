import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
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

function AuthorEdit() {
  const navigate = useNavigate();

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
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setPicture(selectedFile);
    setPicturePreview(URL.createObjectURL(selectedFile));
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

      formData.append("dateOfDeath", form.dateOfDeath);

      if (picture) {
        formData.append("picture", picture);
      }

      await api.post("/admin/authors", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("The author was created successfully.");

      setTimeout(() => {
        navigate("/admin/authors");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message || "The author could not be created.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  const inputClasses = `
    w-full rounded-xl
    border border-[var(--gruvbox-surface)]
    bg-[var(--gruvbox-background)]/60
    px-4 py-3
    text-[var(--gruvbox-cream)]
    outline-none
    placeholder:text-[var(--gruvbox-gray)]
    transition-all duration-200
    hover:border-[var(--gruvbox-orange)]
    focus:border-[var(--gruvbox-yellow)]
    focus:ring-2
    focus:ring-[var(--gruvbox-yellow)]/20
  `;

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/admin/dashboard")}
            className="
              mb-6 inline-flex items-center gap-2
              text-sm text-[var(--gruvbox-gray)]
              transition-colors duration-200
              hover:text-[var(--gruvbox-yellow)]
            "
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </button>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              Library management
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--gruvbox-cream)] sm:text-4xl">
              Add a new author
            </h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              Create a detailed author profile for your literary collection.
            </p>
          </div>

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
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-purple)]/15 text-[var(--gruvbox-purple)]">
                  <UserRound size={22} />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[var(--gruvbox-cream)]">
                    Author details
                  </h2>

                  <p className="text-sm text-[var(--gruvbox-gray)]">
                    Add the main information about this author.
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
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Albert"
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
                      type="text"
                      value={form.surname}
                      onChange={handleChange}
                      placeholder="Camus"
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
                      type="text"
                      value={form.movement}
                      onChange={handleChange}
                      placeholder="Existentialism"
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
                      type="text"
                      value={form.nationality}
                      onChange={handleChange}
                      placeholder="French"
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
                    type="text"
                    value={form.placeOfBirth}
                    onChange={handleChange}
                    placeholder="Algiers, Algeria"
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
                    placeholder="Write a short biography of the author..."
                    rows={8}
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
                    <h2 className="text-lg font-bold text-[var(--gruvbox-cream)]">
                      Author picture
                    </h2>

                    <p className="text-sm text-[var(--gruvbox-gray)]">
                      Optional
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="picture"
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

                      <p className="mt-3 text-sm font-bold text-[var(--gruvbox-cream)]">
                        Upload a picture
                      </p>

                      <p className="mt-1 text-xs text-[var(--gruvbox-gray)]">
                        JPEG, PNG, or WEBP
                      </p>
                    </>
                  )}

                  <input
                    id="picture"
                    name="picture"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePictureChange}
                    className="hidden"
                  />
                </label>

                {picture && (
                  <p className="mt-3 truncate text-xs text-[var(--gruvbox-gray)]">
                    Selected: {picture.name}
                  </p>
                )}
              </section>

              <section
                className="
                  rounded-2xl border
                  border-[var(--gruvbox-surface)]
                  bg-[var(--gruvbox-background-soft)]
                  p-5
                "
              >
                <h2 className="font-bold text-[var(--gruvbox-cream)]">
                  Ready to publish?
                </h2>

                <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-gray)]">
                  Check the information carefully before adding this author to
                  the library.
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
                      Saving author...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Create author
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

export default AuthorEdit;