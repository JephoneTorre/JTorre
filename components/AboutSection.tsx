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
                shadowThreshold={0.45}
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

        {/* Tower Skills Visualization */}
        <TowerSkills isDark={isDark} />
      </div>
    </section>
  );
}
