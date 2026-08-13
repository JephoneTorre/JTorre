"use client";

import React, { useState } from "react";
import Image from "next/image";

interface TowerSkillsProps {
  isDark: boolean;
}

interface Skill {
  name: string;
  detail?: string;
}

interface SkillFloor {
  id: string;
  title: string;
  side: "left" | "right";
  /** 0–100: vertical % position on the tower image where leader line attaches */
  yPercent: number;
  /** Distance from center to the outer edge of this specific floor */
  xOffset?: number;
  skills: Skill[];
}

const FLOORS: SkillFloor[] = [
  {
    id: "ai",
    title: "AI, ML & AUTOMATION",
    side: "left",
    yPercent: 18,
    xOffset: 76,
    skills: [
      { name: "n8n" },
      { name: "Ollama" },
      { name: "Hugging Face" },
      { name: "Streamlit" },
      { name: "Pinecone" },
      { name: "Gemini Node" },
      { name: "CNN" },
    ],
  },
  {
    id: "web",
    title: "WEB DEV & DATABASES",
    side: "right",
    yPercent: 30,
    xOffset: 96,
    skills: [
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "JavaScript" },
      { name: "HTML / CSS" },
      { name: "Python" },
      { name: "C++" },
      { name: "Supabase" },
      { name: "MongoDB" },
    ],
  },
  {
    id: "design",
    title: "DESIGN & PROTOTYPING",
    side: "left",
    yPercent: 44,
    xOffset: 104,
    skills: [
      { name: "Figma" },
    ],
  },
  {
    id: "hardware",
    title: "HARDWARE & EDGE",
    side: "right",
    yPercent: 59,
    xOffset: 100,
    skills: [
      { name: "Raspberry Pi 4" },
    ],
  },
  {
    id: "hosting",
    title: "HOSTING, CRM & OPS",
    side: "left",
    yPercent: 75,
    xOffset: 96,
    skills: [
      { name: "Hostinger" },
      { name: "GoHighLevel (GHL)" },
      { name: "Zapier" },
    ],
  },
];

export default function TowerSkills({ isDark }: TowerSkillsProps) {
  const [hoveredFloor, setHoveredFloor] = useState<string | null>(null);

  const stroke = isDark ? "#ffffff" : "#000000";
  const textColor = isDark ? "#e4e4e7" : "#18181b";
  const cardBg = isDark ? "bg-zinc-900/80 border-zinc-800" : "bg-white/90 border-zinc-200";
  const cardShadow = isDark ? "" : "shadow-sm";

  return (
    <div className="w-full flex flex-col items-center gap-8">
      {/* Section Label */}
      <div className={`w-full pt-8 border-t border-dashed ${isDark ? "border-zinc-800/60" : "border-zinc-300/60"}`}>
        <h3
          className={`text-xs font-extrabold tracking-[0.25em] uppercase ${isDark ? "text-zinc-400" : "text-zinc-600"
            }`}
        >
          Torre's Technical Tool kit / Platforms
        </h3>
      </div>

      {/* MOBILE LAYOUT (< 768px) */}
      <div className="md:hidden flex flex-col w-full gap-8">
        <div className="w-full flex justify-center">
          <div className="relative w-[180px] h-[320px]">
            <Image
              src="/images/torre.png"
              alt="Brutalist tower skill architecture"
              fill
              sizes="180px"
              style={{
                objectFit: "contain",
                objectPosition: "center top",
                filter: isDark ? "invert(1) brightness(0.85)" : "brightness(1)",
              }}
              priority
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4">
          {FLOORS.map((floor) => (
            <div
              key={floor.id}
              className={`border rounded-sm p-4 flex flex-col gap-3 ${cardBg} ${cardShadow}`}
            >
              <h4 className="text-[10px] font-black tracking-[0.15em] uppercase" style={{ color: textColor }}>
                {floor.title}
              </h4>
              <ul className="space-y-1.5 flex flex-wrap gap-x-4 gap-y-2">
                {floor.skills.map((skill, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-zinc-500" />
                    <span className="text-[11px] font-semibold" style={{ color: textColor }}>
                      {skill.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP LAYOUT (>= 768px) */}
      <div className="hidden md:flex relative w-full items-start justify-center">
        {/* Outer container */}
        <div
          className="relative"
          style={{ width: "100%", maxWidth: "960px", minHeight: "700px" }}
        >
          {/* Tower Image — centered */}
          <div
            className="absolute"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              width: "360px",
              top: 0,
              bottom: 0,
              zIndex: 1,
            }}
          >
            <div className="relative w-full" style={{ height: "700px" }}>
              <Image
                src="/images/torre.png"
                alt="Brutalist tower skill architecture"
                fill
                sizes="360px"
                style={{
                  objectFit: "contain",
                  objectPosition: "center top",
                  filter: isDark
                    ? "invert(1) brightness(0.85)"
                    : "brightness(1)",
                }}
                priority
              />
            </div>
          </div>

          {/* SVG Leader Lines overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 2 }}
            viewBox="0 0 960 700"
            preserveAspectRatio="xMidYMid meet"
          >
            {FLOORS.map((floor) => {
              const towerCenterX = 480; // center of 960 viewBox
              const towerHalfWidth = floor.xOffset || 90;
              const y = (floor.yPercent / 100) * 700;
              const isLeft = floor.side === "left";
              const isHovered = hoveredFloor === floor.id;

              // Leader line: from tower edge → horizontal → end terminus (which touches the card)
              const startX = isLeft
                ? towerCenterX - towerHalfWidth
                : towerCenterX + towerHalfWidth;
              const endX = isLeft ? towerCenterX - 200 : towerCenterX + 200;

              return (
                <g key={floor.id}>
                  {/* Horizontal leader line */}
                  <line
                    x1={startX}
                    y1={y}
                    x2={endX}
                    y2={y}
                    stroke={stroke}
                    strokeWidth={isHovered ? 1.2 : 0.7}
                    opacity={isHovered ? 0.9 : 0.45}
                    style={{ transition: "all 0.3s ease" }}
                  />
                  {/* Small dot marker touching the tower outer edge */}
                  <circle
                    cx={startX}
                    cy={y}
                    r={2}
                    fill={stroke}
                    opacity={isHovered ? 0.9 : 0.45}
                    style={{ transition: "all 0.3s ease" }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Callout Cards */}
          {FLOORS.map((floor) => {
            const y = (floor.yPercent / 100) * 700;
            const isLeft = floor.side === "left";
            const isHovered = hoveredFloor === floor.id;

            return (
              <div
                key={floor.id}
                className={`absolute border rounded-sm backdrop-blur-sm px-4 py-3 cursor-default transition-all duration-300 ${cardBg} ${cardShadow}`}
                style={{
                  zIndex: 3,
                  top: y,
                  transform: "translateY(-50%)",
                  width: "240px",
                  ...(isLeft
                    ? { right: "calc(50% + 200px)" }
                    : { left: "calc(50% + 200px)" }),
                  opacity: isHovered ? 1 : 0.75,
                  boxShadow: isHovered
                    ? isDark
                      ? "0 0 0 1px rgba(255,255,255,0.1), 0 4px 16px rgba(0,0,0,0.4)"
                      : "0 0 0 1px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.08)"
                    : undefined,
                }}
                onMouseEnter={() => setHoveredFloor(floor.id)}
                onMouseLeave={() => setHoveredFloor(null)}
              >
                {/* Title */}
                <p
                  className="text-[9px] font-black tracking-[0.18em] uppercase mb-2 leading-tight"
                  style={{ color: textColor }}
                >
                  {floor.title}
                </p>
                {/* Skills */}
                <ul className="space-y-1">
                  {floor.skills.map((skill, i) => (
                    <li key={i}>
                      <span
                        className="text-[11px] font-semibold leading-snug"
                        style={{ color: textColor }}
                      >
                        {skill.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
