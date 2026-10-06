import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import { Lock, Loader2, Check } from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type ApiError = {
  message?: string;
  errors?: { msg: string }[];
};

function ChangePassword() {
  const navigate = useNavigate();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleOldPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setOldPassword(event.target.value);
  }

  function handleNewPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    // Client-side validation
    if (!oldPassword || !newPassword) {
      setError("Please enter your old and new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsSaving(true);

    try {
      await api.put("/users/me/password", {
        oldPassword,
        newPassword,
      });

      setSuccess("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error changing password:", error);

      if (axios.isAxiosError<ApiError>(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (status === 401) {
          setError(
            data?.message || "Old password is incorrect. Please try again."
          );
        } else if (status === 400) {
          // Validation errors from backend (e.g., express-validator)
          if (data?.errors && Array.isArray(data.errors)) {
            const messages = data.errors.map((err) => err.msg).join(", ");
            setError(messages || "Please check your password requirements.");
          } else {
            setError(data?.message || "Invalid password format.");
          }
        } else {
          setError(data?.message || "Failed to change password. Please try again.");
        }
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
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="mx-auto max-w-xl px-3 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl sm:p-8"
        >
          <h1 className="text-3xl font-bold text-[var(--gruvbox-cream)]">
            Change Password
          </h1>
          <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
            Update your account password.
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-4 py-2 text-sm text-[var(--gruvbox-red)]">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-4 rounded-lg border border-[var(--gruvbox-green)]/40 bg-[var(--gruvbox-green)]/10 px-4 py-2 text-sm text-[var(--gruvbox-green)]">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="oldPassword"
                className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
              >
                Old password
              </label>
              <input
                id="oldPassword"
                type="password"
                value={oldPassword}
                onChange={handleOldPasswordChange}
                placeholder="Enter old password"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
              >
                New password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Enter new password"
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
              >
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm new password"
                required
                className={inputClasses}
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSaving}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-4 py-3 font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Changing password...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Change password
                </>
              )}
            </motion.button>
          </form>
        </motion.section>
      </main>
    </div>
  );
}

export default ChangePassword;