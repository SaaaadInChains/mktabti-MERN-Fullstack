import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  BookOpen,
  ChevronRight,
  Database,
  FilePlus2,
  LoaderCircle,
  Pencil,
  Plus,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import api from "../../services/api";
import AdminNavbar from "../../components/admin/AdminNavbar";

type AdminUser = {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  role: "user" | "worker" | "admin";
  avatar?: string;
  createdAt?: string;
};

type ApiCollection<T> = {
  users?: T[];
  books?: T[];
  authors?: T[];
  data?: T[];
  total?: number;
  count?: number;
  totalCount?: number;
};

type StatCard = {
  title: string;
  value: number;
  description: string;
  href: string;
  color: string;
  icon: typeof Users;
};

function getItems<T>(
  data: ApiCollection<T> | T[] | undefined,
  key: "users" | "books" | "authors",
): T[] {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data[key])) {
    return data[key] as T[];
  }

  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  return [];
}

function getTotal<T>(
  data: ApiCollection<T> | T[] | undefined,
  key: "users" | "books" | "authors",
): number {
  if (Array.isArray(data)) {
    return data.length;
  }

  if (!data) {
    return 0;
  }

  if (typeof data.total === "number") {
    return data.total;
  }

  if (typeof data.totalCount === "number") {
    return data.totalCount;
  }

  if (typeof data.count === "number") {
    return data.count;
  }

  return getItems(data, key).length;
}

function formatDate(date?: string) {
  if (!date) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function Dashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userCount, setUserCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);
  const [authorCount, setAuthorCount] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setError("");

        const [usersResponse, booksResponse, authorsResponse] =
          await Promise.all([
            api.get<ApiCollection<AdminUser>>("/admin/users?page=1&limit=8"),
            api.get<ApiCollection<unknown>>("/books?page=1&limit=1"),
            api.get<ApiCollection<unknown>>("/authors?page=1&limit=1"),
          ]);

        if (!isMounted) {
          return;
        }

        const usersData = usersResponse.data;
        const booksData = booksResponse.data;
        const authorsData = authorsResponse.data;

        setUsers(getItems(usersData, "users"));
        setUserCount(getTotal(usersData, "users"));
        setBookCount(getTotal(booksData, "books"));
        setAuthorCount(getTotal(authorsData, "authors"));
      } catch {
        if (isMounted) {
          setError(
            "Unable to load the dashboard. Make sure you are logged in as an admin.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statCards: StatCard[] = [
    {
      title: "Users",
      value: userCount,
      description: "Registered accounts",
      href: "/admin/users",
      color: "var(--gruvbox-aqua)",
      icon: Users,
    },
    {
      title: "Books",
      value: bookCount,
      description: "Books in the library",
      href: "/admin/books",
      color: "var(--gruvbox-yellow)",
      icon: BookOpen,
    },
    {
      title: "Authors",
      value: authorCount,
      description: "Authors in the library",
      href: "/admin/authors",
      color: "var(--gruvbox-purple)",
      icon: Database,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)] text-[var(--gruvbox-cream)]">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--gruvbox-red)]/30 bg-[var(--gruvbox-red)]/10 px-3 py-1.5 text-sm text-[var(--gruvbox-red)]">
                <ShieldCheck size={16} />
                Administrator area
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 text-[var(--gruvbox-muted-cream)]">
                Manage your library, users, books, and authors from one place.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-4 py-3 text-sm text-[var(--gruvbox-gray)]">
              Admin overview
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-2xl border border-[var(--gruvbox-red)]/40 bg-[var(--gruvbox-red)]/10 px-5 py-4 text-sm text-[var(--gruvbox-red)]"
          >
            {error}
          </motion.div>
        )}

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {statCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.5,
                }}
              >
                <RouterLink
                  to={card.href}
                  className="
                    group block rounded-2xl
                    border border-[var(--gruvbox-surface)]
                    bg-[var(--gruvbox-paper)] p-5
                    transition-all duration-300
                    hover:-translate-y-1
                    hover:border-[var(--gruvbox-yellow)]/50
                    hover:shadow-xl hover:shadow-black/20
                  "
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--gruvbox-background-soft)]"
                      style={{ color: card.color }}
                    >
                      <Icon size={24} />
                    </div>

                    <ChevronRight
                      size={20}
                      className="
                        text-[var(--gruvbox-gray)]
                        transition-transform duration-300
                        group-hover:translate-x-1
                        group-hover:text-[var(--gruvbox-yellow)]
                      "
                    />
                  </div>

                  <p className="mt-5 text-sm text-[var(--gruvbox-gray)]">
                    {card.title}
                  </p>

                  <p className="mt-1 text-4xl font-bold">
                    {isLoading ? "—" : card.value}
                  </p>

                  <p className="mt-2 text-sm text-[var(--gruvbox-muted-cream)]">
                    {card.description}
                  </p>
                </RouterLink>
              </motion.div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)]">
            <div className="flex items-center justify-between border-b border-[var(--gruvbox-surface)] px-5 py-4">
              <div>
                <h2 className="text-xl font-bold">Current users</h2>

                <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                  Recently loaded admin user records.
                </p>
              </div>

              <RouterLink
                to="/admin/users"
                className="text-sm font-bold text-[var(--gruvbox-yellow)] hover:text-[var(--gruvbox-orange)]"
              >
                View all
              </RouterLink>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 px-5 py-12 text-[var(--gruvbox-gray)]">
                  <LoaderCircle size={20} className="animate-spin" />
                  Loading users...
                </div>
              ) : users.length === 0 ? (
                <div className="px-5 py-12 text-center text-[var(--gruvbox-gray)]">
                  No users were found.
                </div>
              ) : (
                <table className="w-full min-w-[620px] text-left">
                  <thead>
                    <tr className="border-b border-[var(--gruvbox-surface)] text-xs uppercase tracking-[0.14em] text-[var(--gruvbox-gray)]">
                      <th className="px-5 py-4 font-medium">User</th>

                      <th className="px-5 py-4 font-medium">Role</th>

                      <th className="px-5 py-4 font-medium">Joined</th>

                      <th className="px-5 py-4 text-right font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => {
                      const userId = user._id || user.id;

                      return (
                        <tr
                          key={userId || user.email}
                          className="border-b border-[var(--gruvbox-surface)]/70 hover:bg-[var(--gruvbox-background)]/40"
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

                              <div>
                                <p className="font-bold">{user.username}</p>

                                <p className="text-sm text-[var(--gruvbox-gray)]">
                                  {user.email}
                                </p>
                              </div>
                            </div>
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
                                className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--gruvbox-yellow)] hover:text-[var(--gruvbox-orange)]"
                              >
                                <Pencil size={15} />
                                Edit
                              </RouterLink>
                            ) : (
                              <span className="text-sm text-[var(--gruvbox-gray)]">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] p-5">
            <h2 className="text-xl font-bold">Quick actions</h2>

            <p className="mt-1 text-sm leading-6 text-[var(--gruvbox-gray)]">
              Common admin actions for managing the library.
            </p>

            <div className="mt-5 space-y-3">
              <RouterLink
                to="/admin/books/new"
                className="group flex items-center gap-3 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-3 hover:border-[var(--gruvbox-yellow)]/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]">
                  <BookOpen size={18} />
                </span>

                <span className="flex-1">
                  <span className="block font-bold">Add a book</span>

                  <span className="block text-xs text-[var(--gruvbox-gray)]">
                    Create a new library entry
                  </span>
                </span>

                <Plus
                  size={18}
                  className="text-[var(--gruvbox-gray)] group-hover:text-[var(--gruvbox-yellow)]"
                />
              </RouterLink>

              <RouterLink
                to="/admin/authors/new"
                className="group flex items-center gap-3 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-3 hover:border-[var(--gruvbox-purple)]/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gruvbox-purple)]/15 text-[var(--gruvbox-purple)]">
                  <UserRound size={18} />
                </span>

                <span className="flex-1">
                  <span className="block font-bold">Add an author</span>

                  <span className="block text-xs text-[var(--gruvbox-gray)]">
                    Create a new author profile
                  </span>
                </span>

                <Plus
                  size={18}
                  className="text-[var(--gruvbox-gray)] group-hover:text-[var(--gruvbox-purple)]"
                />
              </RouterLink>

              <RouterLink
                to="/admin/users"
                className="group flex items-center gap-3 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-3 hover:border-[var(--gruvbox-aqua)]/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gruvbox-aqua)]/15 text-[var(--gruvbox-aqua)]">
                  <Users size={18} />
                </span>

                <span className="flex-1">
                  <span className="block font-bold">Manage users</span>

                  <span className="block text-xs text-[var(--gruvbox-gray)]">
                    Review roles and accounts
                  </span>
                </span>

                <ChevronRight
                  size={18}
                  className="text-[var(--gruvbox-gray)] group-hover:text-[var(--gruvbox-aqua)]"
                />
              </RouterLink>

              <RouterLink
                to="/admin/books"
                className="group flex items-center gap-3 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-3 hover:border-[var(--gruvbox-yellow)]/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]">
                  <Pencil size={18} />
                </span>

                <span className="flex-1">
                  <span className="block font-bold">Manage books</span>

                  <span className="block text-xs text-[var(--gruvbox-gray)]">
                    View and edit the book collection
                  </span>
                </span>

                <ChevronRight
                  size={18}
                  className="text-[var(--gruvbox-gray)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--gruvbox-yellow)]"
                />
              </RouterLink>

              <RouterLink
                to="/admin/authors"
                className="group flex items-center gap-3 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-background-soft)] p-3 hover:border-[var(--gruvbox-orange)]/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--gruvbox-orange)]/15 text-[var(--gruvbox-orange)]">
                  <FilePlus2 size={18} />
                </span>

                <span className="flex-1">
                  <span className="block font-bold">Manage authors</span>

                  <span className="block text-xs text-[var(--gruvbox-gray)]">
                    View and edit author profiles
                  </span>
                </span>

                <ChevronRight
                  size={18}
                  className="text-[var(--gruvbox-gray)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--gruvbox-orange)]"
                />
              </RouterLink>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
