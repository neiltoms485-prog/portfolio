import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  Code2,
  Wrench,
  FileText,
  Moon,
  Sun,
  Search,
  Download,
} from "lucide-react";

/**
 * Neil Toms — Interactive Portfolio (single-file React component)
 *
 * Includes:
 * - Sticky nav + scroll spy
 * - Command palette search (Ctrl/Cmd + K)
 * - Dark mode toggle (class-based)
 * - GitHub Pages-safe asset URLs
 * - Premium tech background (grid + noise + optional background image)
 * - Project storytelling: Problem → Build → Result → What I learned
 *
 * Gallery removed (per request).
 *
 * NOTE (Tailwind):
 * Ensure tailwind.config.js includes: darkMode: "class"
 */

// GitHub Pages friendly base URL (e.g. "/portfolio/")
const BASE_URL = (import.meta?.env?.BASE_URL || "/").replace(/([^/])$/, "$1/");

// Optional background image (upload to: public/backgrounds/tech-bg.jpg)
// If you don't add the file, the design still works (image layer is just ignored by the browser).
const BG_IMAGE_URL = `${BASE_URL}backgrounds/tech-bg.jpg`;

// Noise texture (SVG → data uri)
const NOISE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
  </filter>
  <rect width="180" height="180" filter="url(#n)" opacity="0.7" />
</svg>
`.trim();
const NOISE_DATA_URI = `url("data:image/svg+xml,${encodeURIComponent(NOISE_SVG)}")`;

const CONTENT = {
  name: "Neil Toms",
  title: "IT Support · Web · Technical Operations",
  tagline: "IT support + web-focused builder. I troubleshoot systems, document solutions, and ship clean, user-friendly web experiences.",
  location: "Waddell, AZ",
  email: "neiltoms485@gmail.com",
  github: "https://github.com/neiltoms485-prog",
  linkedin: "https://www.linkedin.com/in/neil-toms-13567b239",
  resumeUrl: `${BASE_URL}Neil-Toms-Resume.pdf`,
  availability: "Open to entry-level IT / Web roles",

  about: {
    headline: "Hands-on, detail-oriented, and obsessed with making things work.",
    body: [
  "I’m building a career in IT support and web development, focused on practical problem-solving and clean design.",
  "I’m strongest at troubleshooting, documenting solutions, and improving workflows in fast-paced environments.",
  "Right now I’m building small, polished projects to prove skills and grow into bigger systems and web work."
],
  },

  skills: {
  "IT Support": ["Troubleshooting", "Ticket-style documentation", "Windows basics", "Linux basics", "Networking fundamentals"],
  "Web": ["HTML", "CSS", "JavaScript", "Responsive UI"],
  "Tools": ["Git/GitHub", "VS Code", "Command line", "Google Workspace"],
  "Workflow": ["Customer communication", "Process improvement", "Accuracy under pressure"]
},

  projects: [
    {
      id: "portfolio",
      name: "Interactive Portfolio Website",
      blurb: "A polished, mobile-first portfolio with motion, search, and project storytelling.",
      tags: ["React", "Tailwind", "Framer Motion"],
      links: { demo: "", repo: "https://github.com/neiltoms485-prog/portfolio" },
      story: {
        problem:
          "I needed a portfolio that feels modern, loads fast, and makes it easy for employers to scan my skills and projects.",
        built: [
          "Sticky navigation + scroll spy",
          "Command palette search (Ctrl/Cmd + K)",
          "Dark mode with saved preference",
          "GitHub Pages deployment using Actions",
        ],
        result: ["Deployed a live, shareable portfolio URL", "Created a reusable template for future projects"],
        learned: [
          "How GitHub Pages base paths affect assets",
          "How to debug CI build failures from Action logs",
          "How to design for fast scanning",
        ],
      },
    },
    {
      id: "pi",
      name: "Raspberry Pi Setup + Troubleshooting Notes",
      blurb: "A repeatable setup checklist for imaging, boot issues, and quality-of-life tweaks.",
      tags: ["Linux", "Raspberry Pi", "Docs"],
      links: { demo: "#", repo: "#" },
      story: {
        problem:
          "I wanted a reliable way to set up and recover Raspberry Pi installs without re-learning the same fixes every time.",
        built: [
          "A step-by-step checklist for imaging + boot",
          "A troubleshooting map for common failures",
          "A reusable notes format I can expand over time",
        ],
        result: ["Faster setup time and fewer repeat mistakes", "Clear documentation I can reuse or share"],
        learned: ["How to isolate boot issues vs. storage issues", "Why checklists prevent big time loss"],
      },
    },
    {
      id: "3d",
      name: "3D-Printed Cup & Lid Organizer (Prototype)",
      blurb: "A functional storage design built around real-world constraints and iterative feedback.",
      tags: ["3D Printing", "Iteration", "Design"],
      links: { demo: "#", repo: "#" },
      story: {
        problem:
          "I needed a compact organizer that fits strict cabinet dimensions and makes restocking fast and ergonomic.",
        built: [
          "Modular snap-together pieces",
          "Curved supports to cradle sleeves and reduce snagging",
          "Iterative sizing based on real measurements",
        ],
        result: ["A printable prototype that improves organization", "A repeatable process for refining physical designs"],
        learned: ["Iteration beats perfection for real-world fit", "Designing for speed of use (not just appearance)"],
      },
    },
  ],

  experience: [
    {
      role: "Barista",
      company: "Starbucks",
      dates: "May 2025 — Present",
      bullets: [
        "Deliver fast, accurate service in a high-volume environment.",
        "Communicate clearly with teammates to keep operations smooth during rushes.",
        "Maintain quality standards and a welcoming customer experience.",
      ],
    },
  ],

  timeline: [
    { when: "2025", what: "Started building a more focused IT + web development roadmap." },
    { when: "2025", what: "Began Raspberry Pi + Linux hands-on learning projects." },
    { when: "2026", what: "Launched a portfolio + personal project hub." },
  ],

  contact: {
    headline: "Want to build something useful?",
    body:
      "I’m open to entry-level IT roles, junior web opportunities, or mentorship. If you have a project, idea, or job lead — I’d love to talk.",
  },
};

const cn = (...classes) => classes.filter(Boolean).join(" ");

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    const onChange = () => setReduced(!!m.matches);
    onChange();
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useScrollSpy(sectionIds, offset = 120) {
  const [active, setActive] = useState(sectionIds[0] || "");
  useEffect(() => {
    const handler = () => {
      const positions = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const top = el.getBoundingClientRect().top;
          return { id, top };
        })
        .filter(Boolean);

      const current = positions
        .filter((p) => p.top <= offset)
        .sort((a, b) => b.top - a.top)[0];

      if (current?.id) setActive(current.id);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [sectionIds, offset]);

  return active;
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200">
      {children}
    </span>
  );
}

function Section({ id, eyebrow, title, children }) {
  return (
    <section id={id} className="scroll-mt-24">
      {/* Section header */}
      <div className="mb-6">
        {eyebrow ? (
          <div className="mb-2 text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h2>

        {/* Accent divider */}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-indigo-500/40 via-cyan-400/30 to-transparent" />
      </div>

      {children}
    </section>
  );
}

function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm backdrop-blur transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-lg",
        "dark:border-zinc-800 dark:bg-zinc-950/40",
        className
      )}
    >
      {children}
    </div>
  );
}

function IconLink({ href, icon: Icon, label }) {
  if (!href || href === "#") return null;
  return (
    <a
      className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/50 dark:text-zinc-100"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
      <ArrowUpRight className="h-4 w-4 opacity-70" />
    </a>
  );
}

function ProjectCard({ p }) {
  return (
    <Card className="group relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.20),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-zinc-500 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-100" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{p.name}</h3>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{p.blurb}</p>
        </div>
        <ExternalLink className="h-5 w-5 text-zinc-400 opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="relative mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <Pill key={t}>{t}</Pill>
        ))}
      </div>

      <div className="relative mt-4 grid gap-3 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white/60 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Problem</div>
          <p className="mt-2 leading-relaxed">{p.story.problem}</p>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/60 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">What I built</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {p.story.built.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white/60 p-3 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Result</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {p.story.result.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-xl border border-zinc-200 bg-white/60 p-3 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">What I learned</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
              {p.story.learned.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2">
            {p.links?.repo && p.links.repo !== "#" ? (
              <a
                href={p.links.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
              >
                <Github className="h-4 w-4" /> Repo
                <ArrowUpRight className="h-4 w-4 opacity-70" />
              </a>
            ) : null}
            {p.links?.demo && p.links.demo !== "#" ? (
              <a
                href={p.links.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
              >
                <ExternalLink className="h-4 w-4" /> Live
                <ArrowUpRight className="h-4 w-4 opacity-70" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </Card>
  );
}

function SkillGrid({ skills }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Object.entries(skills).map(([group, items]) => (
        <Card key={group}>
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-zinc-500" />
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{group}</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {items.map((x) => (
              <Pill key={x}>{x}</Pill>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function ExperienceList({ items }) {
  return (
    <div className="grid gap-4">
      {items.map((e) => (
        <Card key={`${e.company}-${e.role}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-zinc-500" />
                <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {e.role} · {e.company}
                </h3>
              </div>
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{e.dates}</div>
            </div>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div className="grid gap-3">
      {items.map((t) => (
        <div
          key={`${t.when}-${t.what}`}
          className="rounded-2xl border border-zinc-200 bg-white/70 p-4 text-sm text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200"
        >
          <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{t.when}</div>
          <div className="mt-1">{t.what}</div>
        </div>
      ))}
    </div>
  );
}

function CommandPalette({ open, onClose, sections, projects }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    const sec = sections
      .map((s) => ({ type: "section", id: s.id, label: s.label }))
      .filter((x) => (query ? x.label.toLowerCase().includes(query) : true));

    const proj = projects
      .map((p) => ({ type: "project", id: p.id, label: p.name }))
      .filter((x) => (query ? x.label.toLowerCase().includes(query) : true));

    return [...sec, ...proj].slice(0, 10);
  }, [q, sections, projects]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close search" />
        <motion.div
          className="absolute left-1/2 top-20 w-[min(720px,92vw)] -translate-x-1/2 rounded-3xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          initial={{ y: -10, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -10, opacity: 0, scale: 0.98 }}
        >
          <div className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
            <Search className="h-4 w-4 text-zinc-500" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search sections or projects…"
              className="w-full bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-500 dark:text-zinc-50"
            />
            <span className="text-xs text-zinc-500">ESC</span>
          </div>

          <div className="mt-3 max-h-[50vh] overflow-auto rounded-2xl border border-zinc-200 p-2 dark:border-zinc-800">
            {results.length ? (
              <div className="grid gap-2">
                {results.map((r) => (
                  <button
                    key={`${r.type}-${r.id}`}
                    onClick={() => {
                      onClose();
                      if (r.type === "project") {
                        scrollToId("projects");
                        setTimeout(() => {
                          const el = document.getElementById(`project-${r.id}`);
                          el?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }, 250);
                      } else {
                        scrollToId(r.id);
                      }
                    }}
                    className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-3 py-3 text-left text-sm text-zinc-900 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{r.type}</span>
                      <span className="font-medium">{r.label}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-sm text-zinc-500">No results.</div>
            )}
          </div>

          <div className="mt-3 text-xs text-zinc-500">
            Tip: Press <span className="font-semibold">Ctrl</span> + <span className="font-semibold">K</span> to open search.
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function runSelfTests() {
  // Lightweight checks to catch common GitHub Pages mistakes.
  try {
    console.assert(typeof BASE_URL === "string" && BASE_URL.length > 0, "BASE_URL should be a non-empty string");
    console.assert(CONTENT.resumeUrl.includes("Neil-Toms-Resume.pdf"), "Resume URL should include the PDF filename");
  } catch {
    // ignore
  }
}

export default function App() {
  const reducedMotion = usePrefersReducedMotion();
  const [dark, setDark] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const sections = useMemo(
    () => [
      { id: "top", label: "Home" },
      { id: "about", label: "About" },
      { id: "skills", label: "Skills" },
      { id: "projects", label: "Projects" },
      { id: "experience", label: "Experience" },
      { id: "resume", label: "Resume" },
      { id: "timeline", label: "Timeline" },
      { id: "contact", label: "Contact" },
    ],
    []
  );

  const active = useScrollSpy(
    sections.map((s) => s.id),
    140
  );

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const initial = stored ? stored === "dark" : window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
    setDark(!!initial);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    window.localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => {
    const onKey = (e) => {
      const isK = e.key?.toLowerCase() === "k";
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        setPaletteOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (import.meta.env.DEV) runSelfTests();
  }, []);

  const motionProps = reducedMotion ? { initial: false, animate: false, transition: { duration: 0 } } : undefined;

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 antialiased dark:text-zinc-50">
      {/* Premium background: optional image + gradient glow + grid + noise */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Optional image layer */}
        <div
  className="absolute inset-0 bg-center bg-cover opacity-[0.6] dark:opacity-[0.45]"
  style={{
    backgroundImage: `url(${BG_IMAGE_URL})`,
    filter: "blur(2px)",
    transform: "scale(1.05)",
  }}
/>

        {/* Animated glow */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-500/30 via-cyan-400/20 to-purple-500/30 blur-[140px] animate-pulse" />
        </div>

        {/* Tech grid */}
        <div
          className="absolute inset-0 opacity-[0.30] dark:opacity-[0.22]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.14) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 55%, transparent 85%)",
          }}
        />

        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]" style={{ backgroundImage: NOISE_DATA_URI }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.12)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} sections={sections.filter((s) => s.id !== "top")} projects={CONTENT.projects} />

      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <button onClick={() => scrollToId("top")} className="flex items-center gap-2 rounded-xl px-2 py-1 text-sm font-semibold tracking-tight text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-900" aria-label="Go to top">
            <Wrench className="h-4 w-4 text-zinc-500" />
            {CONTENT.name}
          </button>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition",
                  active === s.id
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                )}
              >
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
              aria-label="Search"
              title="Search (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search</span>
              <span className="hidden text-xs text-zinc-500 sm:inline">Ctrl K</span>
            </button>

            <button
              onClick={() => setDark((v) => !v)}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white/70 p-2 text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-10">
          <motion.div
            {...(motionProps || {
              initial: { opacity: 0, y: 12 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6, ease: "easeOut" },
            })}
            className="grid gap-6 rounded-3xl border border-zinc-200 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 md:p-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{CONTENT.title}</div>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{CONTENT.tagline}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Pill>{CONTENT.location}</Pill>
                  <Pill>{CONTENT.availability}</Pill>
                  <Pill>GitHub: neiltoms485-prog</Pill>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <IconLink href={CONTENT.github} icon={Github} label="GitHub" />
                <IconLink href={CONTENT.linkedin} icon={Linkedin} label="LinkedIn" />
                <IconLink href={`mailto:${CONTENT.email}`} icon={Mail} label="Email" />
                <a
                  href={CONTENT.resumeUrl}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
                >
                  <Download className="h-4 w-4" /> Resume
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-zinc-500" />
                  <div className="text-sm font-semibold">Quick intro</div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{CONTENT.about.body[0]}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => scrollToId("projects")}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-zinc-900"
                  >
                    View projects <ArrowUpRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => scrollToId("contact")}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50"
                  >
                    Contact <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-zinc-500" />
                  <div className="text-sm font-semibold">Now building</div>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                  <li>• Web projects that prove skill</li>
                  <li>• Linux + systems fundamentals</li>
                  <li>• A teen-focused resource hub</li>
                </ul>
                <div className="mt-4 rounded-xl border border-zinc-200 bg-white/60 p-3 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300">
                  Tip: Press <span className="font-semibold">Ctrl + K</span> to search.
                </div>
              </Card>
            </div>
          </motion.div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-12">
          <Section id="about" eyebrow="About" title="Who I am">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{CONTENT.about.headline}</h3>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
                  {CONTENT.about.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </Card>
              <Card>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Values</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["Clarity", "Reliability", "Kindness", "Growth", "Craft"].map((v) => (
                    <Pill key={v}>{v}</Pill>
                  ))}
                </div>
              </Card>
            </div>
          </Section>

          <Section id="skills" eyebrow="Skills" title="What I work with">
            <SkillGrid skills={CONTENT.skills} />
          </Section>

          <Section id="projects" eyebrow="Projects" title="Featured work">
            <div className="mb-4 rounded-2xl border border-zinc-200 bg-white/60 p-4 text-sm text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-200">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">How I present work</div>
              <div className="mt-1">
                I keep projects scannable: <span className="font-semibold">Problem → Build → Result</span>, plus what I learned.
              </div>
            </div>

            <div className="grid gap-4">
              {CONTENT.projects.map((p) => (
                <div key={p.id} id={`project-${p.id}`} className="scroll-mt-28">
                  <ProjectCard p={p} />
                </div>
              ))}
              <Card>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">Want to see more?</div>
                    <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
                      Add 6–10 projects over time. Even small utilities count if they’re polished.
                    </div>
                  </div>
                  <a
                    href={CONTENT.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-zinc-900"
                  >
                    Browse GitHub <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </Card>
            </div>
          </Section>

          <Section id="experience" eyebrow="Experience" title="Work experience">
            <ExperienceList items={CONTENT.experience} />
          </Section>

          <Section id="resume" eyebrow="Resume" title="Resume">
  <div className="grid gap-4 md:grid-cols-3">
    {/* Left: actions + embedded preview */}
    <Card className="md:col-span-2">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Resume (PDF)</div>
          <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Download, open in a new tab, or preview below.
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={CONTENT.resumeUrl}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-zinc-900"
          >
            <Download className="h-4 w-4" />
            Download
          </a>

          <a
            href={CONTENT.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </a>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/40">
        <object
          data={CONTENT.resumeUrl}
          type="application/pdf"
          className="h-[75vh] w-full"
          aria-label="Resume PDF"
        >
          <iframe
            src={CONTENT.resumeUrl}
            title="Resume PDF"
            className="h-[75vh] w-full"
          />
        </object>
      </div>
    </Card>

    {/* Right: quick scan */}
    <Card>
      <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Quick scan
      </div>

      <div className="mt-3 space-y-4 text-sm text-zinc-700 dark:text-zinc-200">
        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Best fit roles
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>IT Support / Help Desk</li>
            <li>Technical Operations</li>
            <li>Junior Web / UI</li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Strengths
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Troubleshooting", "Documentation", "Workflow improvement", "Customer communication"].map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Tools
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Git/GitHub", "Google Workspace", "VS Code", "Command line"].map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
</Section>

          <Section id="timeline" eyebrow="Timeline" title="Milestones">
            <Timeline items={CONTENT.timeline} />
          </Section>

          <Section id="contact" eyebrow="Contact" title="Let’s connect">
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="md:col-span-2">
                <div className="text-lg font-semibold">{CONTENT.contact.headline}</div>
                <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{CONTENT.contact.body}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={`mailto:${CONTENT.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:bg-white dark:text-zinc-900"
                  >
                    <Mail className="h-4 w-4" /> Email me
                  </a>
                  <a
                    href={CONTENT.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a
                    href={CONTENT.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-50"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </Card>

              <Card>
                <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Quick info</div>
                <div className="mt-3 space-y-3 text-sm text-zinc-700 dark:text-zinc-200">
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Email</div>
                    <div className="break-all">{CONTENT.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Location</div>
                    <div>{CONTENT.location}</div>
                  </div>
                </div>
              </Card>
            </div>
          </Section>

          <footer className="pb-6">
            <div className="flex flex-col items-start justify-between gap-3 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400 md:flex-row md:items-center">
              <div>© {new Date().getFullYear()} {CONTENT.name} · Built with React</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollToId("top")}
                  className="rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-100"
                >
                  Back to top
                </button>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
