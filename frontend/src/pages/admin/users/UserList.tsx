import { useEffect, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "motion/react";
import { LoaderCircle, Pencil, Search, UserRound, Users } from "lucide-react";

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
  createdAt?: string;
};

type UsersResponse = {
  users?: AdminUser[];
  data?: AdminUser[];
};

function getUsers(data: UsersResponse | AdminUser[]) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.users)) {
    return data.users;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

function formatDate(date?: string) {
  if (!date) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function UserList() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get<UsersResponse | AdminUser[]>(
          "/admin/users?page=1&limit=100",
        );

        setUsers(getUsers(response.data));
      } catch {
        setError("Unable to load the users.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return users.filter((user) => {
      return (
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              All users
            </h1>

            <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
              View users and manage their roles.
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-4 py-3">
            <Search size={19} className="text-[var(--gruvbox-gray)]" />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by username, email, or role..."
              className="
                w-full bg-transparent
                text-[var(--gruvbox-cream)]
                outline-none
                placeholder:text-[var(--gruvbox-gray)]
              "
            />
          </div>

          {error && (
            <div className="mt-6 rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-5 py-4 text-sm text-[var(--gruvbox-red)]">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-20 text-[var(--gruvbox-gray)]">
              <LoaderCircle size={21} className="animate-spin" />
              Loading users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-5 py-16 text-center">
              <Users size={38} className="mx-auto text-[var(--gruvbox-gray)]" />

              <h2 className="mt-4 text-xl font-bold">No users found</h2>

              <p className="mt-2 text-[var(--gruvbox-gray)]">
                Try searching for another user.
              </p>
            </div>
          ) : (
            <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-[var(--gruvbox-surface)] text-xs uppercase tracking-[0.14em] text-[var(--gruvbox-gray)]">
                      <th className="px-5 py-4 font-medium">User</th>

                      <th className="px-5 py-4 font-medium">Email</th>

                      <th className="px-5 py-4 font-medium">Role</th>

                      <th className="px-5 py-4 font-medium">Joined</th>

                      <th className="px-5 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map((user, index) => {
                      const userId = user._id || user.id;

                      return (
                        <motion.tr
                          key={userId || user.email}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.04,
                            duration: 0.3,
                          }}
                          className="border-b border-[var(--gruvbox-surface)]/70 transition-colors hover:bg-[var(--gruvbox-background)]/40"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[var(--gruvbox-background-soft)] text-[var(--gruvbox-aqua)]">
                                {user.avatar ? (
                                  <img
                                    src={user.avatar}
                                    alt={`${user.username} avatar`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <UserRound size={19} />
                                )}
                              </div>

                              <span className="font-bold">{user.username}</span>
                            </div>
                          </td>

                          <td className="px-5 py-4 text-sm text-[var(--gruvbox-muted-cream)]">
                            {user.email}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                rounded-full px-2.5 py-1
                                text-xs font-bold
                                ${
                                  user.role === "admin"
                                    ? "bg-[var(--gruvbox-red)]/15 text-[var(--gruvbox-red)]"
                                    : user.role === "worker"
                                      ? "bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]"
                                      : "bg-[var(--gruvbox-aqua)]/15 text-[var(--gruvbox-aqua)]"
                                }
                              `}
                            >
                              {user.role}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-sm text-[var(--gruvbox-muted-cream)]">
                            {formatDate(user.createdAt)}
                          </td>

                          <td className="px-5 py-4 text-right">
                            {userId ? (
                              <RouterLink
                                to={`/admin/users/${userId}/edit`}
                                className="
                                  inline-flex items-center gap-2
                                  text-sm font-bold
                                  text-[var(--gruvbox-yellow)]
                                  hover:text-[var(--gruvbox-orange)]
                                "
                              >
                                <Pencil size={16} />
                                Edit role
                              </RouterLink>
                            ) : (
                              <span className="text-sm text-[var(--gruvbox-gray)]">
                                —
                              </span>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default UserList;
