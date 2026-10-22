"use client";

import React, { useEffect, useRef, useState } from "react";
import HalftonePortrait from "@/components/HalftonePortrait";
import TowerSkills from "@/components/TowerSkills";

interface AboutSectionProps {
  isDark: boolean;
}

export default function AboutSection({ isDark }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [targetIndex, setTargetIndex] = useState<number>(0);

  // Monitor scroll position to morph portrait from about.png <-> about_bye.png
  useEffect(() => {
    const handleScroll = () => {
      if (!portraitRef.current) return;
      const rect = portraitRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When the portrait scrolls past the middle of the viewport, switch state
      if (rect.top < windowHeight * 0.45) {
        setTargetIndex(1);
      } else {
        setTargetIndex(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`w-full py-20 md:py-32 border-t transition-colors duration-500 ${isDark ? "border-zinc-900/80 bg-black/50" : "border-zinc-200 bg-zinc-50/50"
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-16">
          <div className="flex items-center gap-3">
            <span
              className={`h-[1px] w-8 ${isDark ? "bg-zinc-700" : "bg-zinc-400"
                }`}
            ></span>
            <span
              className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${isDark ? "text-zinc-500" : "text-zinc-500"
                }`}
            >
              01 / BACKGROUND & SKILLS
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            ABOUT{" "}
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark
                ? "from-white via-zinc-400 to-zinc-600"
                : "from-black via-zinc-700 to-zinc-500"
                }`}
            >
              ME
            </span>
          </h2>
        </div>

        {/* Top Content Grid: Interactive Halftone Portrait + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-center">
          {/* Halftone Portrait with Scroll Morphing */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={portraitRef}
              className={`w-full max-w-[380px] aspect-[4/5] group relative transition-colors duration-500 overflow-hidden ${isDark ? "bg-black" : "bg-white"
                }`}
            >
              <HalftonePortrait
                srcs={["/images/about.png", "/images/about_bye.png"]}
                targetIndex={targetIndex}
                transitionDuration={300}
                cellSize={5.5}
                dotRadius={1.7}
                shadowThreshold={0.60}
                jitterAmount={0.02}
                dotColor={isDark ? "#ffffff" : "#000000"}
                backgroundColor={isDark ? "#000000" : "#ffffff"}
                className="w-full h-full"
              />

              {/* Status Indicator / Interactive Hover Tip */}
              <div
                className={`absolute bottom-4 left-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase text-center backdrop-blur-sm py-1.5 rounded border ${isDark
                  ? "bg-black/60 text-zinc-400 border-zinc-900/60"
                  : "bg-white/60 text-zinc-600 border-zinc-200"
                  }`}
              >
                {targetIndex === 0
                  ? "Scroll down to wave goodbye 👋"
                  : "Wave goodbye! Scroll up to return"}
              </div>
            </div>
          </div>

          {/* Bio Description Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3
              className={`text-2xl sm:text-3xl font-bold leading-snug tracking-tight ${isDark ? "text-white" : "text-zinc-900"
                }`}
            >
              Hi! I’m a Computer Science graduate from{" "}
              <span className="underline decoration-zinc-500 underline-offset-4">
                West Visayas State University
              </span>
              .
            </h3>

            <p
              className={`text-base sm:text-lg leading-relaxed font-light ${isDark ? "text-zinc-300" : "text-zinc-700"
                }`}
            >
              I specialize in building intelligent applications and user-centered web
              solutions. My hands-on toolkit includes{" "}
              <strong className={isDark ? "text-white font-semibold" : "text-black font-semibold"}>
                Python, Next.js, Tailwind CSS, n8n, Ollama, Supabase, MongoDB, and Pinecone
              </strong>
              .
            </p>

            <p
              className={`text-base sm:text-lg leading-relaxed font-light ${isDark ? "text-zinc-400" : "text-zinc-600"
                }`}
            >
              From developing non-invasive ML diagnostic tools and custom RAG chatbots
              to prototyping clean web interfaces in Figma, I enjoy turning complex
              data and technology into functional, scalable software.
            </p>

            <div
              className={`p-6 rounded-lg border backdrop-blur-sm transition-all mt-2 ${isDark
                ? "bg-zinc-900/40 border-zinc-800 text-zinc-300"
                : "bg-white border-zinc-200 text-zinc-700 shadow-sm"
                }`}
            >
              <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Current Professional Development
              </div>
              <p className="text-sm sm:text-base leading-relaxed">
                Currently continuing my professional development through the{" "}
                <strong
                  className={isDark ? "text-white font-semibold" : "text-black font-semibold"}
                >
                  DataCamp x Data Engineering Pilipinas Scholarship
                </strong>
                .
              </p>
            </div>
          </div>
        </div>

        {/* ── Work Experience ── */}
        <div className={`mb-20 pt-16 border-t ${isDark ? "border-zinc-900/80" : "border-zinc-200"}`}>
          {/* Sub-header */}
          <div className="flex flex-col gap-3 mb-12">
            <div className="flex items-center gap-3">
              <span className={`h-[1px] w-8 ${isDark ? "bg-zinc-700" : "bg-zinc-400"}`} />
              <span className={`text-[10px] tracking-[0.3em] font-extrabold uppercase ${isDark ? "text-zinc-500" : "text-zinc-500"}`}>
                WORK EXPERIENCE
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight uppercase">
              WHERE I&apos;VE{" "}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? "from-white via-zinc-400 to-zinc-600" : "from-black via-zinc-700 to-zinc-500"}`}>
                WORKED
              </span>
            </h3>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl flex flex-col">

            {/* INNODATA */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${isDark ? "bg-white ring-zinc-900" : "bg-black ring-white"}`} />
                <div className={`flex-1 w-[1px] mt-2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              </div>
              <div className="flex-1 pb-10">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
                  <h4 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Innodata</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>AI Analyst (Level 2)</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Contract</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  October 1, 2026 – November 15, 2026
                </div>
                <ul className={`flex flex-col gap-2 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Reviewed and evaluated AI-generated outputs against project guidelines to improve model accuracy and quality.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Analyzed and validated datasets, flagging errors and inconsistencies to support AI model training.</li>
                </ul>
              </div>
            </div>

            {/* FARBEN */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${isDark ? "bg-white ring-zinc-900" : "bg-black ring-white"}`} />
                <div className={`flex-1 w-[1px] mt-2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              </div>
              <div className="flex-1 pb-10">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
                  <h4 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Farben</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>AI Trainer</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Full-time · Remote</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  July 7, 2026 – Sept 22, 2026
                </div>
                <ul className={`flex flex-col gap-2 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Evaluated and fine-tuned AI models by creating, testing, and optimizing technical prompts, datasets, and code across STEM, software engineering, and data analytics domains.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Conducted rigorous quality assurance and code reviews on AI-generated solutions to eliminate logical errors, improve model reasoning, and ensure production-grade accuracy.</li>
                </ul>
              </div>
            </div>

            {/* LineWise */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${isDark ? "bg-white ring-zinc-900" : "bg-black ring-white"}`} />
                <div className={`flex-1 w-[1px] mt-2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              </div>
              <div className="flex-1 pb-10">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
                  <h4 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>LineWise</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Expert Validator</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Part-time</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  May 30, 2026 – Current
                </div>
                <ul className={`flex flex-col gap-2 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Validated and reviewed over 1,000 hours of video datasets to ensure annotation accuracy and data quality for AI model and robotics training.</li>
                </ul>
              </div>
            </div>

            {/* VIPscale */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${isDark ? "bg-white ring-zinc-900" : "bg-black ring-white"}`} />
                <div className={`flex-1 w-[1px] mt-2 ${isDark ? "bg-zinc-800" : "bg-zinc-200"}`} />
              </div>
              <div className="flex-1 pb-10">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
                  <h4 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>VIPscale</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Software / AI Engineer Intern · Marketing</span>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>486 hrs · Remote</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  January 27, 2026 – April 30, 2026
                </div>
                <ul className={`flex flex-col gap-2 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Created LIA RAG chatbot using self-hosted Ollama on Hostinger and n8n webhook as the backend for the XFnite project in GHL, eliminating token costs.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Created VIA RAG chatbot using the same infrastructure approach with a different dataset for VIPscale.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Built various automation workflows to generate content using Gemini node and webhook integrations for the company&apos;s internal tools.</li>
                </ul>
              </div>
            </div>

            {/* BHW */}
            <div className="relative flex gap-6">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ring-2 ${isDark ? "bg-white ring-zinc-900" : "bg-black ring-white"}`} />
              </div>
              <div className="flex-1 pb-0">
                <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
                  <h4 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-zinc-900"}`}>Provincial BHW Association of Iloilo</h4>
                  <span className={`text-[10px] font-semibold uppercase tracking-[0.15em] px-2 py-0.5 rounded-sm ${isDark ? "bg-zinc-800 text-zinc-500" : "bg-zinc-100 text-zinc-500"}`}>Admin Support & Data Management</span>
                </div>
                <div className={`flex items-center gap-1.5 text-xs mb-3 ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  July 2022 – August 2025 · Iloilo, PH
                </div>
                <ul className={`flex flex-col gap-2 text-sm leading-relaxed ${isDark ? "text-zinc-400" : "text-zinc-600"}`}>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Document editing, formatting, and design support — polishing content (PPT, Excel, posters), improving visuals, and ensuring materials meet the association&apos;s standards.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Assisted in maintaining payroll records for BHWs at the municipal and provincial levels.</li>
                  <li className="flex gap-2"><span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${isDark ? "bg-zinc-600" : "bg-zinc-400"}`} />Compiled and updated the BHW master list (municipal, provincial, regional) and supported data entry for the BHW National Registry.</li>
                </ul>
              </div>
            </div>

          </div>
        </div>

        {/* Tower Skills Visualization */}
        <TowerSkills isDark={isDark} />

      </div>
    </section>
  );
}
