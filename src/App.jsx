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
 * Neil Toms — Interactive Portfolio
 * React + Tailwind + Framer Motion
 */

const BASE_URL = (import.meta?.env?.BASE_URL || "/").replace(/([^/])$/, "$1/");

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
  tagline: "Tech-focused professional supporting digital systems and building clean, reliable web experiences.",
  location: "Waddell, AZ",
  email: "neiltoms485@gmail.com",
  github: "https://github.com/neiltoms485-prog",
  linkedin: "https://www.linkedin.com/in/neil-toms-13567b239",
  resumeUrl: `${BASE_URL}Neil-Toms-Resume.pdf`,

  about: [
    "I’m building a career in IT with a strong focus on websites, apps, and the systems behind them.",
    "I enjoy practical problem-solving, clean design, and learning by building real things.",
    "Long-term, I want to create tools and platforms that genuinely help people."
  ],

  skills: {
    Web: ["HTML", "CSS", "JavaScript", "Responsive UI"],
    IT: ["Troubleshooting", "Linux basics", "Windows basics", "Networking fundamentals"],
    Tools: ["Git/GitHub", "Command Line", "VS Code"],
    Strengths: ["Communication", "Reliability", "Learning fast"]
  },

  projects: [
    {
      name: "Interactive Portfolio Website",
      blurb: "A modern, recruiter-friendly portfolio built with React and Tailwind.",
      tags: ["React", "Tailwind", "GitHub Pages"],
      problem: "I needed a professional portfolio that was fast, scannable, and deployable for free.",
      built: [
        "Single-page React app",
        "Dark mode with persistence",
        "GitHub Pages deployment"
      ],
      result: [
        "Live, shareable portfolio",
        "Reusable foundation for future projects"
      ],
      learned: [
        "GitHub Pages base paths",
        "Debugging build pipelines",
        "Designing for recruiters"
      ],
      repo: "https://github.com/neiltoms485-prog/portfolio"
    }
  ]
};

const cn = (...c) => c.filter(Boolean).join(" ");

function Pill({ children }) {
  return (
    <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs dark:border-zinc-700">
      {children}
    </span>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">

      {/* TECH BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 left-1/2 h-[120vh] w-[120vh] -translate-x-1/2 rounded-full 
            bg-gradient-to-tr from-indigo-500/30 via-cyan-400/20 to-purple-500/30 
            blur-[140px] animate-pulse" />
        </div>

        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 55%, transparent 85%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: NOISE_DATA_URI }}
        />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-zinc-300 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 font-semibold">
            <Wrench className="h-4 w-4" />
            {CONTENT.name}
          </div>
          <button
            onClick={() => setDark(!dark)}
            className="rounded-xl border border-zinc-300 px-3 py-1 text-sm dark:border-zinc-700"
          >
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 py-12 space-y-16">

        {/* HERO */}
        <section className="space-y-4">
          <div className="text-sm text-zinc-500">{CONTENT.title}</div>
          <h1 className="text-3xl md:text-4xl font-semibold">{CONTENT.tagline}</h1>
          <div className="flex flex-wrap gap-2">
            <Pill>{CONTENT.location}</Pill>
            <Pill>Open to IT roles</Pill>
          </div>
          <div className="flex flex-wrap gap-3 pt-4">
            <a href={CONTENT.github} className="underline">GitHub</a>
            <a href={CONTENT.linkedin} className="underline">LinkedIn</a>
            <a href={`mailto:${CONTENT.email}`} className="underline">Email</a>
            <a href={CONTENT.resumeUrl} className="underline">Resume</a>
          </div>
        </section>

        {/* ABOUT */}
        <section>
          <h2 className="text-xl font-semibold mb-3">About</h2>
          <div className="space-y-3 text-sm">
            {CONTENT.about.map((p) => <p key={p}>{p}</p>)}
          </div>
        </section>

        {/* SKILLS */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Skills</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(CONTENT.skills).map(([k, v]) => (
              <div key={k}>
                <div className="font-semibold text-sm mb-2">{k}</div>
                <div className="flex flex-wrap gap-2">
                  {v.map((x) => <Pill key={x}>{x}</Pill>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROJECTS */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Projects</h2>
          {CONTENT.projects.map((p) => (
            <div key={p.name} className="rounded-2xl border border-zinc-300 p-5 dark:border-zinc-800">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm mt-1">{p.blurb}</p>

              <div className="mt-3 space-y-2 text-sm">
                <div><strong>Problem:</strong> {p.problem}</div>
                <div><strong>What I built:</strong>
                  <ul className="list-disc ml-5">
                    {p.built.map(b => <li key={b}>{b}</li>)}
                  </ul>
                </div>
                <div><strong>Result:</strong>
                  <ul className="list-disc ml-5">
                    {p.result.map(r => <li key={r}>{r}</li>)}
                  </ul>
                </div>
                <div><strong>What I learned:</strong>
                  <ul className="list-disc ml-5">
                    {p.learned.map(l => <li key={l}>{l}</li>)}
                  </ul>
                </div>
              </div>

              <a href={p.repo} className="underline mt-3 inline-block">View Repository</a>
            </div>
          ))}
        </section>

        {/* FOOTER */}
        <footer className="border-t border-zinc-300 pt-6 text-sm dark:border-zinc-800">
          © {new Date().getFullYear()} {CONTENT.name}
        </footer>

      </main>
    </div>
  );
}
