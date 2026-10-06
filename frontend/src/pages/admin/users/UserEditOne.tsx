import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Check,
  LoaderCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import api from "../../../services/api";
import AdminNavbar from "../../../components/admin/AdminNavbar";

type UserRole = "user" | "worker" | "admin";

type AdminUser = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

type UserResponse = {
  user?: AdminUser;
  data?: AdminUser;
};

type ApiError = {
  message?: string;
};

function getUser(data: UserResponse | AdminUser) {
  if ("user" in data && data.user) {
    return data.user;
  }

  if ("data" in data && data.data) {
    return data.data;
  }

  return data as AdminUser;
}

function UserEditOne() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [role, setRole] = useState<UserRole>("user");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadUser() {
      if (!id) {
        setError("User ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.get<UserResponse | AdminUser>(
          `/users/${id}`,
        );

        const loadedUser = getUser(response.data);

        setUser(loadedUser);
        setRole(loadedUser.role);
      } catch {
        setError("Unable to load this user.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id) {
      setError("User ID is missing.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      await api.put(`/admin/users/${id}/role`, {
        role,
      });

      setSuccess("The user's role was updated successfully.");

      setTimeout(() => {
        navigate("/admin/users");
      }, 900);
    } catch (error) {
      if (axios.isAxiosError<ApiError>(error)) {
        setError(
          error.response?.data?.message ||
            "The user's role could not be updated.",
        );
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
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
            onClick={() => navigate("/admin/users")}
            className="
              mb-6 inline-flex items-center gap-2
              text-sm text-[var(--gruvbox-gray)]
              hover:text-[var(--gruvbox-yellow)]
            "
          >
            <ArrowLeft size={17} />
            Back to users
          </button>

          <div className="mb-8">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              User management
            </p>

            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              Edit user role
            </h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              Change the permissions assigned to this user.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[var(--gruvbox-gray)]">
              <LoaderCircle size={22} className="animate-spin" />
              Loading user...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <section className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-6 shadow-xl shadow-black/10 sm:p-8">
                {error && (
                  <div className="mb-6 rounded-xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-4 py-3 text-sm text-[var(--gruvbox-red)]">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-6 rounded-xl border border-[var(--gruvbox-green)]/40 bg-[var(--gruvbox-green)]/10 px-4 py-3 text-sm text-[var(--gruvbox-green)]">
                    {success}
                  </div>
                )}

                {user && (
                  <div className="mb-7 flex items-center gap-4 rounded-2xl bg-[var(--gruvbox-background-soft)] p-4">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[var(--gruvbox-surface)] text-[var(--gruvbox-aqua)]">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.username} avatar`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserRound size={25} />
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-bold">{user.username}</h2>

                      <p className="text-sm text-[var(--gruvbox-muted-cream)]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]">
                    <ShieldCheck size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">Account role</h2>

                    <p className="text-sm text-[var(--gruvbox-gray)]">
                      Choose what this user can access.
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-[var(--gruvbox-muted-cream)]"
                  >
                    Role
                  </label>

                  <select
                    id="role"
                    value={role}
                    onChange={(event) =>
                      setRole(event.target.value as UserRole)
                    }
                    className="
                      w-full rounded-xl border
                      border-[var(--gruvbox-surface)]
                      bg-[var(--gruvbox-background)]/60
                      px-4 py-3
                      text-[var(--gruvbox-cream)]
                      outline-none
                      transition-all duration-200
                      hover:border-[var(--gruvbox-orange)]
                      focus:border-[var(--gruvbox-yellow)]
                      focus:ring-2
                      focus:ring-[var(--gruvbox-yellow)]/20
                    "
                  >
                    <option value="user">User — regular access</option>

                    <option value="worker">
                      Worker — content management access
                    </option>

                    <option value="admin">
                      Admin — full administration access
                    </option>
                  </select>
                </div>

                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    mt-7 flex w-full items-center
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
                      Saving role...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Save role
                    </>
                  )}
                </motion.button>
              </section>
            </form>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default UserEditOne;
