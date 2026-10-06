import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Ghost, ArrowLeft } from "lucide-react";
import UserNavbar from "../components/users/UserNavbar";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-[var(--gruvbox-background)]">
      <UserNavbar />
      <main className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md"
        >
          <Ghost size={64} className="mx-auto text-[var(--gruvbox-gray)]" />
          <h1 className="mt-6 text-4xl font-bold text-[var(--gruvbox-cream)]">
            404
          </h1>
          <p className="mt-2 text-lg text-[var(--gruvbox-muted-cream)]">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[var(--gruvbox-yellow)] px-5 py-2.5 font-bold text-[var(--gruvbox-background)] transition hover:bg-[var(--gruvbox-orange)]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </main>
    </div>
  );
}

export default PageNotFound;