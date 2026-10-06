import UserNavbar from "../../components/users/UserNavbar.tsx";
import { useEffect } from "react";
import { useNavigate, Link} from "react-router-dom";
import { motion } from "motion/react";
import { BookOpen, PenLine, Sparkles, Users } from "lucide-react";

type StoredUser = {
  id?: string;
  username?: string;
  email?: string;
  role?: string;
};

function MainPage() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user: StoredUser | null = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!token || !user) {
      navigate("/login", { replace: true });
    }
  }, [token, user, navigate]);

  if (!token || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />

      <main className="mx-auto max-w-7xl px-3 py-10 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="
            rounded-3xl border border-[var(--gruvbox-surface)]
            bg-[var(--gruvbox-paper)]
            p-6 shadow-xl shadow-black/10 sm:p-8
          "
        >
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="
                flex h-14 w-14 items-center justify-center
                rounded-2xl rounded-bl-sm
                bg-[var(--gruvbox-yellow)]
                text-[var(--gruvbox-background)]
              "
            >
              <BookOpen size={28} strokeWidth={2.2} />
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="
                  text-3xl font-bold tracking-tight
                  text-[var(--gruvbox-cream)]
                  sm:text-4xl
                "
              >
                Welcome back, {user.username}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-2 text-[var(--gruvbox-muted-cream)]"
              >
                Discover new books, revisit old favourites, and connect with
                authors and ideas.
              </motion.p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.35 }}
              className="
                rounded-2xl border border-[var(--gruvbox-surface)]
                bg-[var(--gruvbox-background)]/50 p-5
                transition-all duration-200
                hover:border-[var(--gruvbox-yellow)]/40
                hover:bg-[var(--gruvbox-yellow)]/5
              "
            >
              <BookOpen
                className="mb-2 text-[var(--gruvbox-yellow)]"
                size={24}
              />
              <h2 className="font-bold text-[var(--gruvbox-yellow)]">Books</h2>
              <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                Browse the library and rate your reads.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.35 }}
              className="
                rounded-2xl border border-[var(--gruvbox-surface)]
                bg-[var(--gruvbox-background)]/50 p-5
                transition-all duration-200
                hover:border-[var(--gruvbox-aqua)]/40
                hover:bg-[var(--gruvbox-aqua)]/5
              "
            >
              <Users className="mb-2 text-[var(--gruvbox-aqua)]" size={24} />
              <h2 className="font-bold text-[var(--gruvbox-aqua)]">Authors</h2>
              <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                Explore the minds behind the books.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.35 }}
              className="
                rounded-2xl border border-[var(--gruvbox-surface)]
                bg-[var(--gruvbox-background)]/50 p-5
                transition-all duration-200
                hover:border-[var(--gruvbox-purple)]/40
                hover:bg-[var(--gruvbox-purple)]/5
              "
            >
              <Sparkles
                className="mb-2 text-[var(--gruvbox-purple)]"
                size={24}
              />
              <h2 className="font-bold text-[var(--gruvbox-purple)]">
                AI Assistant
              </h2>
              <p className="mt-1 text-sm text-[var(--gruvbox-gray)]">
                Ask anything about literature and philosophy.
              </p>
            </motion.div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default MainPage;
