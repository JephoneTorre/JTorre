"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ProjectsSectionProps {
  isDark: boolean;
}

const PERSONAL_PROJECTS = [
  {
    title: "Sentisize",
    description: "A emotion/diary app",
    role: "UI/UX Designer",
    tags: ["Figma", "Mobile", "UX Research"],
    bgImage: "/images/senti.png",
    link: "https://www.figma.com/design/NKAu42YS258DRu36opGKiB/Data-Mining?node-id=0-1&t=7zCMR6jwuQqg5MlY-1",
  },
  {
    title: "Kantonize",
    description: "A SaaS webapp",
    role: "UI/UX Designer",
    tags: ["Next.js", "Tailwind", "SaaS"],
    bgImage: "/images/kanton.png",
    link: "https://kantonize.vercel.app",
  },
  {
    title: "Ipsync",
    description: "Internship and collab website",
    role: "UI/UX Designer",
    tags: ["Figma", "Web", "Platform"],
    bgImage: "/images/ipsync.png",
    link: "https://ipsync.vercel.app",
  },
  {
    title: "Debunkr",
    description: "Fake news classifier",
    role: "ML Engineer",
    tags: ["Python", "NLP", "Machine Learning"],
    bgImage: "/images/dbunker.png",
    link: "https://github.com/hydraadra112/Debunkr",
  },
  {
    title: "NumericalCalculator",
    description: "Numerical methods solver",
    role: "Developer",
    tags: ["Math", "Web", "Engineering"],
    bgImage: "/images/numerical.png",
    link: "https://numerical-methods-solver-root-findi-six.vercel.app/",
  },
  {
    title: "LIA Chatbot",
    description: "RAG chatbot for XFnite",
    role: "AI Engineer",
    tags: ["Ollama", "n8n", "RAG", "Self-hosted"],
    bgImage: "/images/lia.png",
    link: "https://lia-alpha.vercel.app/",
  },
  {
    title: "VIA Chatbot",
    description: "RAG chatbot for VIPscale",
    role: "AI Engineer",
    tags: ["Ollama", "n8n", "RAG", "LLM"],
    bgImage: "/images/via.png",
    link: "https://via-cyan.vercel.app/",
  },
  {
    title: "HO Presenter",
    description: "Church service presentation desktop app",
    role: "Developer",
    tags: ["Electron", "React", "TypeScript", "Vite"],
    bgImage: "/images/precenter.png",
    link: "https://drive.google.com/drive/folders/1HC_uaFisy6B2_u1DNsXu_QbNGME7Y_xl?usp=drive_link",
  },
];

const GROUP_PROJECTS = [
  {
    title: "HemoGlyph",
    subtitle: "Thesis Project",
    role: "ML Engineer & Researcher",
    period: "Nov. 2023 – May 2026",
    description:
      "Trained a CNN to classify ABO blood groups from fingerprint images, achieving 89% accuracy, deployed on a Raspberry Pi 4 as a portable, non-invasive medical device.",
    tags: ["CNN", "Python", "Raspberry Pi", "Medical AI"],

    links: undefined as { label: string; href: string }[] | undefined,
  },
  {
    title: "CICT College Website – WVSU",
    subtitle: "University Project",
    role: "UI/UX Designer & Main Front-End Developer",
    period: "Nov. 2025 – May 2026",
    description:
      "Designed the UI/UX for the Contact Us page with wireframes and high-fidelity Figma mockups. Served as the main front-end developer for the Contact Us and Faculty pages, implementing responsive layouts and interactive components.",
    tags: ["Next.js", "Figma", "Front-End", "UI/UX"],

    links: undefined as { label: string; href: string }[] | undefined,
  },
  {
    title: "LIA & VIA RAG Chatbots",
    subtitle: "XFnite / VIPscale",
    role: "AI Engineer",
    period: "2025",
    description:
      "Created LIA RAG chatbot using self-hosted Ollama on Hostinger and n8n webhook as the backend for XFnite, eliminating token costs. Built VIA RAG chatbot using the same infrastructure with a different dataset for VIPscale. Developed automation workflows using Gemini node and webhook integrations.",
    tags: ["Ollama", "n8n", "RAG", "LLM", "Automation"],

    links: [
      { label: "LIA →", href: "https://lia-alpha.vercel.app/" },
      { label: "VIA →", href: "https://via-cyan.vercel.app/" },
    ],
  },
  {
    title: "Sentisize",
    subtitle: "Emotion-Diary App",
    role: "UI/UX Designer",
    period: "Apr. 2025 – Jun. 2025",
    description:
      "Collaborated in developing Sentisize, an emotion-diary mobile app. Designed and prototyped user flows, wireframes, and high-fidelity mockups in Figma. Contributed to front-end development, conducted usability testing, and iterated based on feedback.",
    tags: ["Figma", "Mobile", "UX Research", "Front-End"],

    links: undefined as { label: string; href: string }[] | undefined,
  },
  {
    title: "Kantonize",
    subtitle: "SaaS Web App",
    role: "UI/UX Designer",
    period: "Mar 2025 – Apr 2025",
    description:
      "Collaborated on Kantonize, a SaaS web application. Designed wireframes and interactive mockups using Figma, ensuring accessibility and scalability. Supported front-end integration with Next.js and Tailwind CSS.",
    tags: ["Figma", "Next.js", "Tailwind", "SaaS"],

    links: undefined as { label: string; href: string }[] | undefined,
  },
  {
    title: "Ipsync",
    subtitle: "Internship & Collaboration Platform",
    role: "UI/UX Designer",
    period: "Jan. 2025 – Mar. 2025",
    description:
      "Co-designed Ipsync, an internship and collaboration platform website. Developed prototypes in Figma focusing on internship listings, collaboration tools, and student–company interactions. Refined visual identity and assisted in front-end structure.",
    tags: ["Figma", "Web", "Platform", "UI/UX"],

    links: undefined as { label: string; href: string }[] | undefined,
  },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Project Card                                                        */
/* ──────────────────────────────────────────────────────────────────── */
function ProjectCard({
  project,
  isDark,
  index,
}: {
  project: (typeof PERSONAL_PROJECTS)[0];
  isDark: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 80);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
      className={`group relative flex flex-col overflow-hidden rounded-sm cursor-pointer border transition-all duration-500 ${
        isDark
          ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
          : "border-zinc-200 bg-white hover:border-zinc-400 shadow-sm hover:shadow-md"
      }`}
    >
      {/* Image / Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-zinc-900">
        {!imgError ? (
          <Image
            src={project.bgImage}
            alt={project.title}
            fill
            className={`object-cover transition-transform duration-700 ${
              hovered ? "scale-105" : "scale-100"
            }`}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${
              isDark ? "bg-zinc-800" : "bg-zinc-100"
            }`}
          >
            <span
              className={`text-3xl font-black tracking-tighter uppercase select-none ${
                isDark ? "text-zinc-700" : "text-zinc-300"
              }`}
            >
              {project.title.slice(0, 2)}
            </span>
          </div>
        )}

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-500 ${
            hovered ? "opacity-50" : "opacity-10"
          }`}
        />

        {/* External link icon */}
        <div
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            hovered ? "opacity-100 scale-100" : "opacity-0 scale-75"
          } ${isDark ? "bg-white text-black" : "bg-black text-white"}`}
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-3 p-5">
        <div>
          <h3
            className={`text-sm font-bold uppercase tracking-tight ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-zinc-500" : "text-zinc-500"
            }`}
          >
            {project.description}
          </p>
        </div>

        <span
          className={`self-start text-[10px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1 rounded-sm border ${
            isDark
              ? "border-zinc-700 text-zinc-400 bg-zinc-800/50"
              : "border-zinc-300 text-zinc-600 bg-zinc-50"
          }`}
        >
          {project.role}
        </span>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                isDark
                  ? "bg-zinc-800 text-zinc-500"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className={`h-[2px] w-full transition-all duration-500 ${
          isDark ? "bg-white" : "bg-black"
        } ${hovered ? "opacity-100" : "opacity-0"}`}
      />
    </a>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Group Project Timeline Entry                                        */
/* ──────────────────────────────────────────────────────────────────── */
function GroupProjectEntry({
  project,
  isDark,
  index,
  isLast,
}: {
  project: (typeof GROUP_PROJECTS)[0];
  isDark: boolean;
  index: number;
  isLast: boolean;
}) {
  const entryRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (entryRef.current) observer.observe(entryRef.current);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={entryRef}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
      className="relative flex gap-6"
    >
      {/* Dot + line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${
            isDark
              ? "bg-white ring-zinc-900"
              : "bg-black ring-white"
          }`}
        />
        {!isLast && (
          <div
            className={`flex-1 w-[1px] mt-2 min-h-[2rem] ${
              isDark ? "bg-zinc-800" : "bg-zinc-200"
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 ${isLast ? "pb-0" : "pb-10"}`}>
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-2">
          <h3
            className={`text-base font-bold tracking-tight ${
              isDark ? "text-white" : "text-zinc-900"
            }`}
          >
            {project.title}
          </h3>
          <span
            className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${
              isDark
                ? "bg-zinc-800 text-zinc-500"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {project.subtitle}
          </span>
        </div>

        <div
          className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-3 ${
            isDark ? "text-zinc-500" : "text-zinc-500"
          }`}
        >
          <span className="font-semibold">{project.role}</span>
          <span
            className={`flex items-center gap-1.5 ${
              isDark ? "text-zinc-600" : "text-zinc-400"
            }`}
          >
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {project.period}
          </span>
        </div>

        <p
          className={`text-sm leading-relaxed mb-4 ${
            isDark ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold ${
                isDark
                  ? "bg-zinc-800 text-zinc-500"
                  : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>

        {project.links && (
          <div className="flex gap-4 mt-2">
            {project.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`text-xs font-semibold tracking-wider uppercase underline underline-offset-4 transition-colors duration-300 ${
                  isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-zinc-500 hover:text-black"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Main Section                                                        */
/* ──────────────────────────────────────────────────────────────────── */
export default function ProjectsSection({ isDark }: ProjectsSectionProps) {
  const [tab, setTab] = useState<"personal" | "group">("personal");

  return (
    <section
      id="work"
      className={`w-full py-20 md:py-32 border-t transition-colors duration-500 ${
        isDark
          ? "border-zinc-900/80 bg-black"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-12">
          <div className="flex items-center gap-3">
            <span
              className={`h-[1px] w-8 ${
                isDark ? "bg-zinc-700" : "bg-zinc-400"
              }`}
            />
            <span
              className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${
                isDark ? "text-zinc-500" : "text-zinc-500"
              }`}
            >
              02 / SELECTED WORK
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            MY{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${
                isDark
                  ? "from-white via-zinc-400 to-zinc-600"
                  : "from-black via-zinc-700 to-zinc-500"
              }`}
            >
              PROJECTS
            </span>
          </h2>
        </div>

        {/* Tab Switcher */}
        <div
          className={`flex items-center gap-1 p-1 rounded-sm mb-12 w-fit border ${
            isDark
              ? "border-zinc-800 bg-zinc-900/50"
              : "border-zinc-200 bg-zinc-100"
          }`}
        >
          {(["personal", "group"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm transition-all duration-300 cursor-pointer ${
                tab === t
                  ? isDark
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : isDark
                  ? "text-zinc-500 hover:text-zinc-300"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              {t === "personal" ? "Personal" : "Group"}
            </button>
          ))}
        </div>

        {/* Personal Projects Grid */}
        {tab === "personal" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERSONAL_PROJECTS.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                isDark={isDark}
                index={i}
              />
            ))}
          </div>
        )}

        {/* Group Projects Timeline */}
        {tab === "group" && (
          <div className="max-w-3xl">
            {GROUP_PROJECTS.map((project, i) => (
              <GroupProjectEntry
                key={project.title + project.period}
                project={project}
                isDark={isDark}
                index={i}
                isLast={i === GROUP_PROJECTS.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
