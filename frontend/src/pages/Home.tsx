import { motion } from "motion/react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ArrowRight,
  Sparkles,
  UserPlus,
  LogIn,
} from "lucide-react";
import UserNavbar from "../components/users/UserNavbar";

function Home() {
  const token = localStorage.getItem("token");
  const isAuthenticated = Boolean(token);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--gruvbox-background)]">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-[var(--gruvbox-yellow)]/10 blur-3xl" />
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[var(--gruvbox-purple)]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-[var(--gruvbox-aqua)]/10 blur-3xl" />
      </div>

      <UserNavbar />

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-3xl text-center"
        >
          {/* Icon with gradient ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--gruvbox-paper)] shadow-2xl shadow-black/30 ring-1 ring-[var(--gruvbox-surface)]"
          >
            <BookOpen
              size={44}
              strokeWidth={1.8}
              className="text-[var(--gruvbox-yellow)]"
            />
          </motion.div>

          {/* Title with subtle gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="bg-gradient-to-r from-[var(--gruvbox-cream)] via-[var(--gruvbox-yellow)] to-[var(--gruvbox-orange)] bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl md:text-7xl"
          >
            Mktabti lfenna
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-[var(--gruvbox-muted-cream)] sm:text-xl"
          >
            Discover books, authors, and ideas worth remembering.
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            {isAuthenticated ? (
              <Link
                to="/books"
                className="group inline-flex items-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-7 py-3 text-base font-bold text-[var(--gruvbox-background)] shadow-lg shadow-[var(--gruvbox-yellow)]/20 transition-all duration-300 hover:bg-[var(--gruvbox-orange)] hover:shadow-xl hover:shadow-[var(--gruvbox-orange)]/30"
              >
                Explore Books
                <ArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-7 py-3 text-base font-bold text-[var(--gruvbox-background)] shadow-lg shadow-[var(--gruvbox-yellow)]/20 transition-all duration-300 hover:bg-[var(--gruvbox-orange)] hover:shadow-xl hover:shadow-[var(--gruvbox-orange)]/30"
                >
                  <UserPlus size={18} />
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-[var(--gruvbox-surface)] bg-[var(--gruvbox-paper)] px-7 py-3 text-base font-semibold text-[var(--gruvbox-cream)] transition-all duration-300 hover:border-[var(--gruvbox-yellow)]/60 hover:bg-[var(--gruvbox-yellow)]/10 hover:text-[var(--gruvbox-yellow)]"
                >
                  <LogIn size={18} />
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* How I Built This link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-10"
          >
            <Link
              to="/HowIBuiltThis"
              className="inline-flex items-center gap-2 text-sm text-[var(--gruvbox-gray)] transition-colors duration-200 hover:text-[var(--gruvbox-aqua)]"
            >
              <Sparkles size={16} />
              How I Built This
            </Link>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

export default Home;