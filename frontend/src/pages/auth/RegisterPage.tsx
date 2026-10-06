import { ChangeEvent, FormEvent, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowRight,
  BookOpen,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";

import api from "../../services/api";

type RegisterForm = {
  username: string;
  email: string;
  password: string;
};

type ApiError = {
  message?: string;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.username || !form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(form.password)) {
      setError("Password must include at least 1 symbol.");
      return;
    }

    if (!/[A-Z]/.test(form.password)) {
      setError("Password must include at least 1 uppercase letter.");
      return;
    }

    if (form.password.length > 25) {
      setError("Password must be 25 characters or fewer.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      const { token } = response.data;

      localStorage.setItem("token", token);
      setSuccess("Your account was created successfully.");

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses = `
    w-full rounded-xl
    border border-[var(--gruvbox-surface)]
    bg-[var(--gruvbox-background)]/60
    px-4 py-2.5 pl-11
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
    <main
      className="
        flex h-[100dvh] items-center justify-center
        overflow-hidden
        bg-[var(--gruvbox-background)]
        px-4 py-3
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full max-w-md"
      >
        <section
          className="
            max-h-[calc(100dvh-1.5rem)] w-full
            overflow-hidden rounded-3xl
            border border-[var(--gruvbox-surface)]
            bg-[var(--gruvbox-paper)]
            p-5
            shadow-2xl shadow-black/25
            sm:p-7
          "
        >
          <div className="mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.15,
                duration: 0.45,
              }}
              className="
                mb-3 flex h-10 w-10 items-center
                justify-center rounded-xl
                rounded-bl-sm
                bg-[var(--gruvbox-yellow)]
                text-[var(--gruvbox-background)]
              "
            >
              <BookOpen size={20} strokeWidth={2.2} />
            </motion.div>

            <h1
              className="
                text-2xl font-bold tracking-tight
                text-[var(--gruvbox-cream)]
                sm:text-3xl
              "
            >
              Create your account
            </h1>

            <p className="mt-1 text-sm text-[var(--gruvbox-muted-cream)]">
              A quiet place for books, authors, and ideas.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="
                mb-3 rounded-xl
                border border-[var(--gruvbox-red)]/40
                bg-[var(--gruvbox-red)]/10
                px-4 py-2.5
                text-sm text-[var(--gruvbox-red)]
              "
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="
                mb-3 rounded-xl
                border border-[var(--gruvbox-green)]/40
                bg-[var(--gruvbox-green)]/10
                px-4 py-2.5
                text-sm text-[var(--gruvbox-green)]
              "
            >
              {success}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="username"
                className="
                  mb-1 block text-sm font-medium
                  text-[var(--gruvbox-muted-cream)]
                "
              >
                Username
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="
                    pointer-events-none absolute left-4
                    top-1/2 -translate-y-1/2
                    text-[var(--gruvbox-aqua)]
                  "
                />

                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="
                  mb-1 block text-sm font-medium
                  text-[var(--gruvbox-muted-cream)]
                "
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="
                    pointer-events-none absolute left-4
                    top-1/2 -translate-y-1/2
                    text-[var(--gruvbox-aqua)]
                  "
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClasses}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="
                  mb-1 block text-sm font-medium
                  text-[var(--gruvbox-muted-cream)]
                "
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="
                    pointer-events-none absolute left-4
                    top-1/2 -translate-y-1/2
                    text-[var(--gruvbox-aqua)]
                  "
                />

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                  className={inputClasses}
                />
              </div>

              <p className="mt-1 text-xs leading-4 text-[var(--gruvbox-gray)]">
                At least 8 characters, one uppercase letter, one number, and one
                special character.
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="
                flex w-full items-center justify-center
                gap-2 rounded-xl
                bg-[var(--gruvbox-yellow)]
                px-4 py-3
                font-bold
                text-[var(--gruvbox-background)]
                transition-all duration-200
                hover:bg-[var(--gruvbox-orange)]
                hover:shadow-lg
                hover:shadow-[var(--gruvbox-orange)]/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isLoading ? "Creating account..." : "Create account"}

              {!isLoading && <ArrowRight size={18} />}
            </motion.button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--gruvbox-gray)]">
            Already have an account?{" "}
            <RouterLink
              to="/login"
              className="
                font-bold
                text-[var(--gruvbox-yellow)]
                transition-colors duration-200
                hover:text-[var(--gruvbox-orange)]
              "
            >
              Log in
            </RouterLink>
          </p>
        </section>
      </motion.div>
    </main>
  );
}

export default RegisterPage;
