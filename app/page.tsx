"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import HalftonePortrait from "@/components/HalftonePortrait";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";

const NAV_LINKS = [
  { label: "WORK", href: "work" },
  { label: "ABOUT", href: "about" },
  { label: "CONTACT", href: "contact" },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";
  const [activeSection, setActiveSection] = useState<string>("");

  // Smooth scroll handler
  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveSection(id);
      }
    },
    []
  );

  // Track active section on scroll
  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.href)).filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`flex flex-col min-h-screen font-sans transition-colors duration-500 ${isDark
        ? "bg-black text-white selection:bg-white selection:text-black"
        : "bg-white text-black selection:bg-black selection:text-white"
        }`}
    >
      {/* Premium Minimal Navigation */}
      <header
        className={`w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center border-b transition-colors duration-500 ${isDark ? "border-zinc-900/80" : "border-zinc-200"
          }`}
      >
        <div className="flex items-center">
          <Image
            src={isDark ? "/images/LOGO_DARKMODE.svg" : "/images/LOGO_LIGHTMODE.svg"}
            alt="J. Torre Logo"
            width={120}
            height={40}
            priority
            className="transition-opacity duration-500"
          />
        </div>
        <nav
          className={`hidden sm:flex gap-8 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-500 ${isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={`#${href}`}
              onClick={(e) => scrollTo(e, href)}
              className={`relative pb-1 transition-colors duration-300 group ${activeSection === href
                ? isDark ? "text-white" : "text-black"
                : isDark ? "hover:text-white" : "hover:text-black"
                }`}
            >
              {label}
              {/* Animated underline indicator */}
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-400 ease-out ${isDark ? "bg-white" : "bg-black"
                  } ${activeSection === href
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                  }`}
              />
            </a>
          ))}
        </nav>


        <div className="flex items-center gap-4">
          {/* Day / Night Mode Toggle */}
          <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`flex items-center gap-2 text-xs font-semibold tracking-wider uppercase border px-3.5 py-2 rounded-sm transition-all duration-300 cursor-pointer ${isDark
              ? "border-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-900"
              : "border-zinc-300 text-zinc-700 hover:border-zinc-500 hover:bg-zinc-100"
              }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>DAY MODE</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <span>NIGHT MODE</span>
              </>
            )}
          </button>

          <a
            href="#contact"
            className={`text-xs font-semibold tracking-wider uppercase border px-4 py-2 transition-all duration-300 rounded-sm ${isDark
              ? "border-zinc-700 hover:bg-white hover:text-black hover:border-white"
              : "border-zinc-800 bg-black text-white hover:bg-zinc-800"
              }`}
          >
            HIRE ME
          </a>
        </div>
      </header>

      {/* Hero Section Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Interactive Halftone Portrait */}
          <div className="lg:col-span-5 flex justify-center order-1 lg:order-1">
            <div
              className={`w-full max-w-[200px] lg:max-w-[420px] aspect-[4/5] group relative transition-colors duration-500 ${isDark ? "bg-black" : "bg-white"
                }`}
            >
              {/* HalftonePortrait Component */}
              <HalftonePortrait
                srcs={[
                  "/images/portrait.png",
                  "/images/portrait_right.png",
                  "/images/portrait.png",
                  "/images/portrait_left.png",
                  "/images/portrait.png",
                ]}
                displayDuration={3000}
                transitionDuration={2000}
                cellSize={6}
                dotRadius={1.8}
                shadowThreshold={0.55}
                jitterAmount={0.02}
                dotColor={isDark ? "#ffffff" : "#000000"}
                backgroundColor={isDark ? "#000000" : "#ffffff"}
                className="w-full h-full"
              />

              {/* Interactive Hover Tip */}
              <div
                className={`absolute bottom-4 left-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase text-center backdrop-blur-sm py-1.5 rounded border ${isDark
                  ? "bg-black/60 text-zinc-500 border-zinc-900/60"
                  : "bg-white/60 text-zinc-600 border-zinc-200"
                  }`}
              >
                Move cursor over portrait to interact
              </div>
            </div>
          </div>

          {/* Right Column: Premium Bold Uppercase Display Copy */}
          <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8 order-2 lg:order-2">
            <div className="flex items-center gap-3">
              <span
                className={`h-[1px] w-8 ${isDark ? "bg-zinc-700" : "bg-zinc-400"
                  }`}
              ></span>
              <span
                className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${isDark ? "text-zinc-500" : "text-zinc-500"
                  }`}
              >
                AI ENGINEER/FULL-STACK DEVELOPER
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tighter leading-none uppercase">
                JEPHONE ISRAEL <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark
                    ? "from-white via-zinc-300 to-zinc-700"
                    : "from-black via-zinc-700 to-zinc-400"
                    }`}
                >
                  JIREH TORRE
                </span>
              </h1>
            </div>

            <p
              className={`max-w-xl text-sm sm:text-base leading-relaxed tracking-wide font-light ${isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
            >
              As a Computer Science graduate currently working as an AI Trainer
              at Farben, I specialize in building, validating, and optimizing AI
              systems. My background includes developing self-hosted RAG
              chatbots using Ollama and n8n, training machine learning models
              like CNNs, and validating extensive datasets for AI and robotics
              training. Supported by a 12-month DataCamp Data Engineering
              scholarship, I am passionate about applying data-driven solutions
              to solve complex technical challenges.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a
                href="#contact"
                className={`flex items-center justify-center h-12 px-8 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 rounded-sm ${isDark
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "bg-black text-white hover:bg-zinc-800"
                  }`}
              >
                WORK WITH ME
              </a>
              <a
                href="/TORRE_CV_2026.pdf"
                download
                className={`flex items-center justify-center gap-2 h-12 px-8 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-sm border ${isDark
                  ? "border-zinc-700 text-zinc-300 hover:border-zinc-400 hover:text-white"
                  : "border-zinc-400 text-zinc-700 hover:border-zinc-800 hover:text-black"
                  }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                DOWNLOAD CV
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* About Section */}
      <AboutSection isDark={isDark} />

      {/* Projects Section */}
      <ProjectsSection isDark={isDark} />

      {/* Premium Minimalist Footer */}
      <footer
        className={`w-full max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col sm:flex-row justify-between items-center border-t text-[10px] tracking-widest uppercase gap-4 transition-colors duration-500 ${isDark
          ? "border-zinc-900/80 text-zinc-600"
          : "border-zinc-200 text-zinc-500"
          }`}
      >
        <div>© 2026 JEPHONE TORRE. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-6">
          <a
            href="#github"
            className={`transition-colors duration-300 ${isDark ? "hover:text-zinc-400" : "hover:text-black"
              }`}
          >
            GITHUB
          </a>
          <a
            href="#linkedin"
            className={`transition-colors duration-300 ${isDark ? "hover:text-zinc-400" : "hover:text-black"
              }`}
          >
            LINKEDIN
          </a>
          <a
            href="#twitter"
            className={`transition-colors duration-300 ${isDark ? "hover:text-zinc-400" : "hover:text-black"
              }`}
          >
            TWITTER
          </a>
        </div>
      </footer>
    </div>
  );
}
