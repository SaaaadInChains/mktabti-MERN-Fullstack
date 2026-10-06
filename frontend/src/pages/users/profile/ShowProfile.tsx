import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { User, Upload, Loader2, Check } from "lucide-react";

import UserNavbar from "../../../components/users/UserNavbar";
import api from "../../../services/api";

type UserProfile = {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
};

function ShowProfile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await api.get<{ user: UserProfile }>("/users/me");
        const user = response.data.user;
        setProfile(user);
        setBio(user.bio || "");
        setAvatarPreview(user.avatar || "");
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(
          err?.response?.data?.message ||
            "Failed to load profile. Please log in again.",
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    setIsSaving(true);
    try {
      const formData = new FormData();
      if (bio !== undefined && bio !== profile?.bio) {
        formData.append("bio", bio);
      }
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await api.put("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Profile updated successfully.");
      // Optionally refresh profile after short delay
      setTimeout(() => {
        // Refresh local data
        if (profile) {
          setProfile({
            ...profile,
            bio: bio,
            avatar: avatarPreview,
          });
        }
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(
        err?.response?.data?.message ||
          "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2
            className="animate-spin text-[var(--gruvbox-yellow)]"
            size={36}
          />
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="min-h-screen bg-[var(--gruvbox-background)]">
        <UserNavbar />
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 p-6 text-center">
            <p className="text-[var(--gruvbox-red)]">{error}</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 rounded-lg bg-[var(--gruvbox-yellow)] px-4 py-2 text-sm font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
            >
              Go to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl sm:p-8"
        >
          <h1 className="text-3xl font-bold text-[var(--gruvbox-cream)]">
            Your Profile
          </h1>
          <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
            Manage your avatar and bio.
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <div className="relative h-32 w-32 overflow-hidden rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[var(--gruvbox-gray)]">
                    <User size={64} />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="avatar"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--gruvbox-surface)] px-4 py-2 text-sm font-medium text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-background-soft)] hover:text-[var(--gruvbox-cream)]"
                >
                  <Upload size={16} />
                  Upload new avatar
                </label>
                <input
                  id="avatar"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {avatarFile && (
                  <p className="mt-2 text-xs text-[var(--gruvbox-gray)]">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Username / Email display (read-only) */}
            {profile && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    disabled
                    className="w-full rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 px-4 py-2 text-sm text-[var(--gruvbox-cream)] opacity-70"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]">
                    Email
                  </label>
                  <input
                    type="text"
                    value={profile.email}
                    disabled
                    className="w-full rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 px-4 py-2 text-sm text-[var(--gruvbox-cream)] opacity-70"
                  />
                </div>
              </div>
            )}

            {/* Bio */}
            <div>
              <label
                htmlFor="bio"
                className="mb-1 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
              >
                Bio
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                placeholder="Tell us about yourself..."
                className="w-full rounded-lg border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background)]/60 px-4 py-2 text-sm text-[var(--gruvbox-cream)] outline-none placeholder:text-[var(--gruvbox-gray)] focus:border-[var(--gruvbox-yellow)]"
              />
            </div>

              <Link
                to="/profile/change-password"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--gruvbox-surface)] px-4 py-2 text-sm font-medium text-[var(--gruvbox-muted-cream)] transition hover:bg-[var(--gruvbox-background-soft)] hover:text-[var(--gruvbox-cream)]"
              >
                Change password
              </Link>

            {/* Save button */}
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
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Save changes
                </>
              )}
            </motion.button>
          </form>
        </motion.section>
      </main>
    </div>
  );
}

export default ShowProfile;
