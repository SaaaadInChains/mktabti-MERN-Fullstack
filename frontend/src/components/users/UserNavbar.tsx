import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Bot,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Search,
  Sun,
  UserPlus,
  User,
  Users,
  Library,
  ListMusic,
  X,
} from "lucide-react";
import { useThemeMode } from "../../hooks/useThemeMode"; // adjust path

function UserNavbar() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeMode();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Determine if user is logged in by checking token in localStorage
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchQuery("");
  }

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `
      inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5
      text-xs font-medium transition-all duration-200
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
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="
        sticky top-0 z-50
        border-b border-[var(--gruvbox-surface)]
        bg-[var(--gruvbox-background)]/95
        shadow-lg shadow-black/10
        backdrop-blur-xl
      "
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-3">
          {/* Brand */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2 text-[var(--gruvbox-cream)]"
          >
            <span
              className="
                flex h-8 w-8 items-center justify-center
                rounded-lg rounded-bl-sm
                bg-[var(--gruvbox-yellow)]
                text-[var(--gruvbox-background)]
                transition-transform duration-200
                group-hover:rotate-[-4deg]
              "
            >
              <BookOpen size={17} strokeWidth={2.2} />
            </span>
            <span className="hidden sm:block">
              <span className="block text-sm font-bold tracking-wide">
                Maktabti
              </span>
              <span className="block text-[10px] text-[var(--gruvbox-gray)]">
                Your library
              </span>
            </span>
          </Link>

          {/* Search bar (desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden flex-1 max-w-md lg:block"
          >
            <div className="relative">
              <Search
                size={15}
                className="
                  pointer-events-none absolute left-3.5
                  top-1/2 -translate-y-1/2
                  text-[var(--gruvbox-aqua)]
                "
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search books or authors..."
                className="
                  w-full rounded-lg
                  border border-transparent
                  bg-[var(--gruvbox-background)]/60
                  px-3.5 py-1.5 pl-9
                  text-sm text-[var(--gruvbox-cream)]
                  outline-none
                  placeholder:text-[var(--gruvbox-gray)]
                  transition-all duration-300
                  hover:border-[var(--gruvbox-surface)]
                  hover:bg-[var(--gruvbox-background)]
                  focus:border-[var(--gruvbox-yellow)]
                  focus:bg-[var(--gruvbox-background)]
                  focus:ring-2 focus:ring-[var(--gruvbox-yellow)]/20
                "
              />
            </div>
          </form>

          {/* Desktop nav links */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavLink to="/" className={navLinkClasses} end>
              <Library size={14} />
              Home
            </NavLink>
            <NavLink to="/books" className={navLinkClasses}>
              <BookOpen size={14} />
              Books
            </NavLink>
            <NavLink to="/authors" className={navLinkClasses}>
              <Users size={14} />
              Authors
            </NavLink>
            <NavLink to="/playlists" className={navLinkClasses}>
              <ListMusic size={14} />
              Playlists
            </NavLink>
            <NavLink to="/profile" className={navLinkClasses}>
              <User size={14} />
              Profile
            </NavLink>
          </nav>

          {/* Right side buttons */}
          <div className="hidden items-center gap-1.5 lg:flex">
            {/* AI circle */}
            <Link
              to="/chatbot"
              aria-label="AI Chatbot"
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full border
                border-[var(--gruvbox-surface)]
                bg-[var(--gruvbox-aqua)]/10
                text-[var(--gruvbox-aqua)]
                transition-all duration-200
                hover:scale-110
                hover:border-[var(--gruvbox-aqua)]
                hover:bg-[var(--gruvbox-aqua)]/20
                hover:text-[var(--gruvbox-cream)]
              "
            >
              <Bot size={16} />
            </Link>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} theme`}
              className="
                inline-flex items-center gap-1.5 rounded-lg
                border border-[var(--gruvbox-surface)]
                px-2.5 py-1.5 text-xs
                text-[var(--gruvbox-muted-cream)]
                transition-all duration-200
                hover:border-[var(--gruvbox-yellow)]/50
                hover:bg-[var(--gruvbox-yellow)]/10
                hover:text-[var(--gruvbox-yellow)]
              "
            >
              {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              {mode === "dark" ? "Light" : "Dark"}
            </button>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="
                  inline-flex items-center gap-1.5 rounded-lg
                  border border-[var(--gruvbox-surface)]
                  px-2.5 py-1.5 text-xs
                  text-[var(--gruvbox-gray)]
                  transition-all duration-200
                  hover:border-[var(--gruvbox-red)]/50
                  hover:bg-[var(--gruvbox-red)]/10
                  hover:text-[var(--gruvbox-red)]
                "
              >
                <LogOut size={14} />
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="
                    inline-flex items-center gap-1.5 rounded-lg
                    border border-[var(--gruvbox-surface)]
                    px-2.5 py-1.5 text-xs
                    text-[var(--gruvbox-muted-cream)]
                    transition-all duration-200
                    hover:border-[var(--gruvbox-green)]/50
                    hover:bg-[var(--gruvbox-green)]/10
                    hover:text-[var(--gruvbox-green)]
                  "
                >
                  <LogIn size={14} />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="
                    inline-flex items-center gap-1.5 rounded-lg
                    bg-[var(--gruvbox-yellow)]
                    px-2.5 py-1.5 text-xs font-bold
                    text-[var(--gruvbox-background)]
                    transition-all duration-200
                    hover:bg-[var(--gruvbox-orange)]
                    hover:shadow-md hover:shadow-[var(--gruvbox-orange)]/20
                  "
                >
                  <UserPlus size={14} />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="
              rounded-lg p-1.5
              text-[var(--gruvbox-muted-cream)]
              transition-colors duration-200
              hover:bg-[var(--gruvbox-background-soft)]
              hover:text-[var(--gruvbox-cream)]
              lg:hidden
            "
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden lg:hidden"
            >
              <div className="space-y-1 border-t border-[var(--gruvbox-surface)] py-3">
                {/* Mobile search */}
                <form onSubmit={handleSearchSubmit} className="mb-2">
                  <div className="relative">
                    <Search
                      size={15}
                      className="
                        pointer-events-none absolute left-3.5
                        top-1/2 -translate-y-1/2
                        text-[var(--gruvbox-aqua)]
                      "
                    />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search..."
                      className="
                        w-full rounded-lg
                        border border-[var(--gruvbox-surface)]
                        bg-[var(--gruvbox-background)]/60
                        px-3.5 py-1.5 pl-9
                        text-sm text-[var(--gruvbox-cream)]
                        outline-none
                        placeholder:text-[var(--gruvbox-gray)]
                        focus:border-[var(--gruvbox-yellow)]
                      "
                    />
                  </div>
                </form>

                <NavLink to="/" onClick={closeMobileMenu} className={navLinkClasses} end>
                  <Library size={14} />
                  Home
                </NavLink>
                <NavLink to="/books" onClick={closeMobileMenu} className={navLinkClasses}>
                  <BookOpen size={14} />
                  Books
                </NavLink>
                <NavLink to="/authors" onClick={closeMobileMenu} className={navLinkClasses}>
                  <Users size={14} />
                  Authors
                </NavLink>
                <NavLink to="/playlists" onClick={closeMobileMenu} className={navLinkClasses}>
                  <ListMusic size={14} />
                  Playlists
                </NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu} className={navLinkClasses}>
                  <User size={14} />
                  Profile
                </NavLink>

                <div className="my-2 border-t border-[var(--gruvbox-surface)]" />

                <Link
                  to="/chatbot"
                  onClick={closeMobileMenu}
                  className="
                    flex items-center gap-2 rounded-lg
                    px-3 py-2 text-xs
                    text-[var(--gruvbox-aqua)]
                    transition-colors duration-200
                    hover:bg-[var(--gruvbox-aqua)]/10
                  "
                >
                  <Bot size={15} />
                  AI Chatbot
                </Link>

                <button
                  type="button"
                  onClick={() => { toggleTheme(); closeMobileMenu(); }}
                  className="
                    mt-1 inline-flex w-full items-center gap-2
                    rounded-lg px-3 py-2 text-xs
                    text-[var(--gruvbox-muted-cream)]
                    transition-colors duration-200
                    hover:bg-[var(--gruvbox-yellow)]/10
                    hover:text-[var(--gruvbox-yellow)]
                  "
                >
                  {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                  Switch to {mode === "dark" ? "light" : "dark"} theme
                </button>

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      mt-1 inline-flex w-full items-center gap-2
                      rounded-lg px-3 py-2 text-xs
                      text-[var(--gruvbox-gray)]
                      transition-colors duration-200
                      hover:bg-[var(--gruvbox-red)]/10
                      hover:text-[var(--gruvbox-red)]
                    "
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                ) : (
                  <div className="mt-1 space-y-1">
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        flex w-full items-center gap-2 rounded-lg
                        px-3 py-2 text-xs
                        text-[var(--gruvbox-muted-cream)]
                        transition-colors duration-200
                        hover:bg-[var(--gruvbox-green)]/10
                        hover:text-[var(--gruvbox-green)]
                      "
                    >
                      <LogIn size={15} />
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="
                        flex w-full items-center gap-2 rounded-lg
                        px-3 py-2 text-xs font-bold
                        bg-[var(--gruvbox-yellow)]
                        text-[var(--gruvbox-background)]
                        transition-colors duration-200
                        hover:bg-[var(--gruvbox-orange)]
                      "
                    >
                      <UserPlus size={15} />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

export default UserNavbar;