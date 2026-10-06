import { motion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowUpRight,
  Atom,
  Braces,
  Code2,
  ExternalLink,
  GitBranch,
} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import mongodbIcon from "../../icons/mongodb.svg";
import expressIcon from "../../icons/express.svg";
import nodejsIcon from "../../icons/nodejs.svg";
import deepseekIcon from "../../icons/deepseek.svg";
import replitIcon from "../../icons/replit.svg";
import muiIcon from "../../icons/mui.svg";
import lucideIcon from "../../icons/lucide.svg";

type Technology = {
  name: string;
  label: string;
  description: string;
  url: string;
  color: string;
  icon?: LucideIcon;
  image?: string;
};

const technologies: Technology[] = [
  {
    name: "MongoDB",
    label: "Database",
    description:
      "Used to store users, books, authors, reviews, comments, playlists, and the rest of the application data.",
    url: "https://www.mongodb.com",
    image: mongodbIcon,
    color: "var(--gruvbox-green)",
  },
  {
    name: "Express",
    label: "Backend framework",
    description:
      "Used to create the backend API, routes, authentication flow, and communication between the frontend and database.",
    url: "https://expressjs.com",
    image: expressIcon,
    color: "var(--gruvbox-yellow)",
  },
  {
    name: "React",
    label: "Frontend framework",
    description:
      "Used to build the pages, components, forms, navigation, and interactive experience of the application.",
    url: "https://react.dev",
    icon: Atom,
    color: "var(--gruvbox-blue)",
  },
  {
    name: "Node.js",
    label: "JavaScript runtime",
    description:
      "Used to run the backend server and power the application outside of the browser.",
    url: "https://nodejs.org",
    image: nodejsIcon,
    color: "var(--gruvbox-aqua)",
  },
  {
    name: "DeepSeek",
    label: "Backend assistant",
    description:
      "Used as an AI assistant while designing and developing the backend architecture, API routes, and server-side logic.",
    url: "https://www.deepseek.com",
    image: deepseekIcon,
    color: "var(--gruvbox-purple)",
  },
  {
    name: "Replit",
    label: "Frontend workspace",
    description:
      "Used to build, organize, develop, and iterate on the frontend application and its user interface.",
    url: "https://replit.com",
    image: replitIcon,
    color: "var(--gruvbox-orange)",
  },
  {
    name: "Material UI",
    label: "Component library",
    description:
      "Used for accessible React components, theming, layout utilities, and the foundation of the application's design system.",
    url: "https://mui.com",
    image: muiIcon,
    color: "var(--gruvbox-blue)",
  },
  {
    name: "Lucide React",
    label: "Icon library",
    description:
      "Used for clean, lightweight, and consistent icons throughout the interface.",
    url: "https://lucide.dev",
    image: lucideIcon,
    color: "var(--gruvbox-aqua)",
  },
  {
    name: "Project repository",
    label: "Codeberg repository",
    description:
      "Feel free to explore the source code, use it for learning, or build something of your own with it.",
    url: "https://codeberg.org/lfniwen/mktabti_MERN_Fullstack",
    icon: GitBranch,
    color: "var(--gruvbox-red)",
  },
];

function HowIBuiltThis() {
  return (
    <main className="min-h-screen bg-[var(--gruvbox-background)] px-4 py-8 text-[var(--gruvbox-cream)] sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <RouterLink
            to="/"
            className="
              mb-8 inline-flex items-center gap-2
              text-sm text-[var(--gruvbox-gray)]
              transition-colors duration-200
              hover:text-[var(--gruvbox-yellow)]
            "
          >
            <ArrowLeft size={17} />
            Back home
          </RouterLink>

          <section
            className="
              relative overflow-hidden rounded-3xl
              border border-[var(--gruvbox-surface)]
              bg-[var(--gruvbox-paper)]
              px-6 py-10 shadow-2xl shadow-black/20
              sm:px-10 sm:py-14
            "
          >
            <div
              className="
                pointer-events-none absolute -right-24 -top-24
                h-64 w-64 rounded-full
                bg-[var(--gruvbox-yellow)]/10 blur-3xl
              "
            />

            <div
              className="
                pointer-events-none absolute -bottom-32 -left-20
                h-72 w-72 rounded-full
                bg-[var(--gruvbox-aqua)]/10 blur-3xl
              "
            />

            <div className="relative max-w-3xl">
              <div
                className="
                  mb-5 inline-flex items-center gap-2
                  rounded-full border
                  border-[var(--gruvbox-yellow)]/30
                  bg-[var(--gruvbox-yellow)]/10
                  px-3 py-1.5 text-sm
                  text-[var(--gruvbox-yellow)]
                "
              >
                <Braces size={16} />
                How I built this
              </div>

              <h1
                className="
                  text-4xl font-bold tracking-tight
                  text-[var(--gruvbox-cream)]
                  sm:text-6xl
                "
              >
                Built with the{" "}
                <span className="text-[var(--gruvbox-yellow)]">MERN</span>{" "}
                stack.
              </h1>

              <p
                className="
                  mt-5 max-w-2xl text-base leading-7
                  text-[var(--gruvbox-muted-cream)]
                  sm:text-lg
                "
              >
                This project combines a fully Typescript stack with AI-assisted
                development to create a place where readers can discover books,
                learn about authors, share reviews, and keep track of their
                literary journey.
              </p>
            </div>
          </section>
        </motion.div>

        <section className="mt-10">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-orange)]">
              The stack
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--gruvbox-cream)] sm:text-3xl">
              The tools behind the experience.
            </h2>

            <p className="mt-3 max-w-2xl text-[var(--gruvbox-muted-cream)]">
              Here are the tools and the technologies to make this fullstack
              work :
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {technologies.map((technology, index) => {
              const Icon = technology.icon;

              return (
                <motion.a
                  key={technology.name}
                  href={technology.url}
                  target="_blank"
                  rel="noreferrer"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 * index,
                    duration: 0.5,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  className="
                    group rounded-2xl
                    border border-[var(--gruvbox-surface)]
                    bg-[var(--gruvbox-paper)] p-6
                    transition-all duration-300
                    hover:border-[var(--gruvbox-yellow)]/50
                    hover:shadow-xl hover:shadow-black/20
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="
                        flex h-14 w-14 items-center
                        justify-center rounded-2xl
                        border border-[var(--gruvbox-surface)]
                        bg-[var(--gruvbox-background-soft)]
                        p-3
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    >
                      {technology.image ? (
                        <img
                          src={technology.image}
                          alt={`${technology.name} logo`}
                          className="
                            h-full w-full object-contain
                            transition-transform duration-300
                            group-hover:scale-110
                          "
                        />
                      ) : (
                        Icon && (
                          <Icon
                            size={28}
                            style={{ color: technology.color }}
                            strokeWidth={1.8}
                          />
                        )
                      )}
                    </div>

                    <ArrowUpRight
                      size={20}
                      className="
                        text-[var(--gruvbox-gray)]
                        transition-all duration-300
                        group-hover:-translate-y-1
                        group-hover:translate-x-1
                        group-hover:text-[var(--gruvbox-yellow)]
                      "
                    />
                  </div>

                  <p
                    className="
                      mt-6 text-xs font-bold uppercase
                      tracking-[0.16em]
                      text-[var(--gruvbox-gray)]
                    "
                  >
                    {technology.label}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-[var(--gruvbox-cream)]">
                    {technology.name}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[var(--gruvbox-muted-cream)]">
                    {technology.description}
                  </p>

                  <div
                    className="
                      mt-5 inline-flex items-center gap-2
                      text-sm font-bold
                      transition-colors duration-200
                      group-hover:text-[var(--gruvbox-orange)]
                    "
                    style={{ color: technology.color }}
                  >
                    {technology.name === "Project repository"
                      ? "View the repository"
                      : "Visit official website"}

                    <ExternalLink size={15} />
                  </div>
                </motion.a>
              );
            })}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="
            mt-10 rounded-2xl
            border border-[var(--gruvbox-surface)]
            bg-[var(--gruvbox-background-soft)]
            p-6 sm:p-8
          "
        >
          <div className="flex items-center gap-3">
            <Code2 size={22} className="text-[var(--gruvbox-yellow)]" />

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--gruvbox-aqua)]">
              Development notes
            </p>
          </div>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-bold text-[var(--gruvbox-cream)]">
                Backend
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-muted-cream)]">
                For the backend, I built everything in TypeScript using Express
                as the framework and Node.js to run the server. I used MongoDB
                for the database and Cloudinary for cloud-based file storage.
                For authentication, I implemented JWT tokens and securely hashed
                passwords with Argon2. I also added Helmet and Express Rate
                Limit to improve the application’s security, with DeepSeek’s
                assistance throughout the development process.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-[var(--gruvbox-cream)]">
                Frontend
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--gruvbox-muted-cream)]">
                For the frontend, I used React with Typescript, one of the best
                frameworks available, along with Material UI for the theme and
                main design elements. I also used Tailwind CSS for styling, a
                custom font (InconsolataLGCNerdFont), and Lucide icons. Replit
                helped me a lot throughuot the process.
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-[var(--gruvbox-gray)]">
            Feel free to use the repository, explore the code, and make it your
            own.
          </p>
        </motion.section>
      </div>
    </main>
  );
}

export default HowIBuiltThis;
