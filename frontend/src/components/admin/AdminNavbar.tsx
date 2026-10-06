import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Plus,
  Sun,
  UserRound,
  Users,
  X,
} from "lucide-react";

import { useThemeMode } from "../../hooks/useThemeMode";

function AdminNavbar() {
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);

  const { mode, toggleTheme } = useThemeMode();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
    setIsCreateMenuOpen(false);
  }

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `
      inline-flex items-center gap-2 rounded-xl px-3 py-2
      text-sm font-medium transition-all duration-200
      ${
        isActive
          ? "bg-[var(--gruvbox-yellow)]/15 text-[var(--gruvbox-yellow)]"
          : "text-[var(--gruvbox-muted-cream)] hover:bg-[var(--gruvbox-background-soft)] hover:text-[var(--gruvbox-cream)]"
      }
    `;

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        sticky top-0 z-50
        border-b border-[var(--gruvbox-surface)]
        bg-[var(--gruvbox-background)]/95
        shadow-lg shadow-black/10
        backdrop-blur-xl
      "
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link
            to="/admin/dashboard"
            onClick={closeMobileMenu}
            className="
              group flex shrink-0 items-center gap-3
              text-[var(--gruvbox-cream)]
            "
          >
            <span
              className="
                flex h-10 w-10 items-center justify-center
                rounded-xl rounded-bl-sm
                bg-[var(--gruvbox-yellow)]
                text-[var(--gruvbox-background)]
                transition-transform duration-200
                group-hover:rotate-[-4deg]
              "
            >
              <BookOpen size={21} strokeWidth={2.2} />
            </span>

            <span className="hidden sm:block">
              <span className="block text-sm font-bold tracking-wide">
                Maktabti
              </span>

              <span className="block text-xs text-[var(--gruvbox-gray)]">
                Admin panel
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavLink to="/admin/dashboard" className={navLinkClasses}>
              <LayoutDashboard size={17} />
              Dashboard
            </NavLink>

            <NavLink to="/admin/users" className={navLinkClasses}>
              <Users size={17} />
              Users
            </NavLink>

            <NavLink to="/admin/books" className={navLinkClasses}>
              <BookOpen size={17} />
              Books
            </NavLink>

            <NavLink to="/admin/authors" className={navLinkClasses}>
              <UserRound size={17} />
              Authors
            </NavLink>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCreateMenuOpen((previous) => !previous)}
                className="
                  inline-flex items-center gap-2 rounded-xl
                  bg-[var(--gruvbox-yellow)]
                  px-3 py-2 text-sm font-bold
                  text-[var(--gruvbox-background)]
                  transition-all duration-200
                  hover:bg-[var(--gruvbox-orange)]
                  hover:shadow-lg
                  hover:shadow-[var(--gruvbox-orange)]/20
                "
              >
                <Plus size={17} />
                Add
                <ChevronDown
                  size={15}
                  className={`
                    transition-transform duration-200
                    ${isCreateMenuOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              <AnimatePresence>
                {isCreateMenuOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -6,
                      scale: 0.98,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                      scale: 0.98,
                    }}
                    transition={{ duration: 0.16 }}
                    className="
                      absolute right-0 mt-2 w-52
                      rounded-2xl border
                      border-[var(--gruvbox-surface)]
                      bg-[var(--gruvbox-paper)]
                      p-2 shadow-xl shadow-black/25
                    "
                  >
                    <Link
                      to="/admin/books/new"
                      onClick={() => setIsCreateMenuOpen(false)}
                      className="
                        flex items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm
                        text-[var(--gruvbox-muted-cream)]
                        transition-colors duration-200
                        hover:bg-[var(--gruvbox-background-soft)]
                        hover:text-[var(--gruvbox-yellow)]
                      "
                    >
                      <BookOpen size={17} />
                      Add a book
                    </Link>

                    <Link
                      to="/admin/authors/new"
                      onClick={() => setIsCreateMenuOpen(false)}
                      className="
                        flex items-center gap-3 rounded-xl
                        px-3 py-2.5 text-sm
                        text-[var(--gruvbox-muted-cream)]
                        transition-colors duration-200
                        hover:bg-[var(--gruvbox-background-soft)]
                        hover:text-[var(--gruvbox-purple)]
                      "
                    >
                      <FilePlus2 size={17} />
                      Add an author
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${
                mode === "dark" ? "light" : "dark"
              } theme`}
              className="
                inline-flex items-center gap-2 rounded-xl
                border border-[var(--gruvbox-surface)]
                px-3 py-2 text-sm
                text-[var(--gruvbox-muted-cream)]
                transition-all duration-200
                hover:border-[var(--gruvbox-yellow)]/50
                hover:bg-[var(--gruvbox-yellow)]/10
                hover:text-[var(--gruvbox-yellow)]
              "
            >
              {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}

              {mode === "dark" ? "Light" : "Dark"}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="
                inline-flex items-center gap-2 rounded-xl
                border border-[var(--gruvbox-surface)]
                px-3 py-2 text-sm
                text-[var(--gruvbox-gray)]
                transition-all duration-200
                hover:border-[var(--gruvbox-red)]/50
                hover:bg-[var(--gruvbox-red)]/10
                hover:text-[var(--gruvbox-red)]
              "
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>

          <button
            type="button"
            aria-label={
              isMobileMenuOpen ? "Close admin menu" : "Open admin menu"
            }
            onClick={() => setIsMobileMenuOpen((previous) => !previous)}
            className="
              rounded-xl p-2
              text-[var(--gruvbox-muted-cream)]
              transition-colors duration-200
              hover:bg-[var(--gruvbox-background-soft)]
              hover:text-[var(--gruvbox-cream)]
              lg:hidden
            "
          >
            {isMobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-1 border-t border-[var(--gruvbox-surface)] py-4">
                <NavLink
                  to="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className={navLinkClasses}
                >
                  <LayoutDashboard size={17} />
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/users"
                  onClick={closeMobileMenu}
                  className={navLinkClasses}
                >
                  <Users size={17} />
                  Users
                </NavLink>

                <NavLink
                  to="/admin/books"
                  onClick={closeMobileMenu}
                  className={navLinkClasses}
                >
                  <BookOpen size={17} />
                  Books
                </NavLink>

                <NavLink
                  to="/admin/authors"
                  onClick={closeMobileMenu}
                  className={navLinkClasses}
                >
                  <UserRound size={17} />
                  Authors
                </NavLink>

                <div className="my-3 border-t border-[var(--gruvbox-surface)]" />

                <p className="px-3 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--gruvbox-gray)]">
                  Create
                </p>

                <Link
                  to="/admin/books/new"
                  onClick={closeMobileMenu}
                  className={navLinkClasses({
                    isActive: false,
                  })}
                >
                  <Plus size={17} />
                  Add a book
                </Link>

                <Link
                  to="/admin/authors/new"
                  onClick={closeMobileMenu}
                  className={navLinkClasses({
                    isActive: false,
                  })}
                >
                  <FilePlus2 size={17} />
                  Add an author
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    toggleTheme();
                    closeMobileMenu();
                  }}
                  className="
                    mt-2 inline-flex w-full items-center gap-2
                    rounded-xl px-3 py-2 text-sm
                    text-[var(--gruvbox-muted-cream)]
                    transition-colors duration-200
                    hover:bg-[var(--gruvbox-yellow)]/10
                    hover:text-[var(--gruvbox-yellow)]
                  "
                >
                  {mode === "dark" ? <Sun size={17} /> : <Moon size={17} />}
                  Switch to {mode === "dark" ? "light" : "dark"} theme
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    mt-2 inline-flex w-full items-center gap-2
                    rounded-xl px-3 py-2 text-sm
                    text-[var(--gruvbox-gray)]
                    transition-colors duration-200
                    hover:bg-[var(--gruvbox-red)]/10
                    hover:text-[var(--gruvbox-red)]
                  "
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default AdminNavbar;
