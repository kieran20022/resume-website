"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  Globe,
  Lock,
  MapPin,
  Menu,
  Plus,
  X,
} from "lucide-react";

// Shared easing for all welcome animations
const E = [0.25, 0.46, 0.45, 0.94] as const;

const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

/* ────────────────────────────────────────────────────────────────
   Ripple hover effect
   ──────────────────────────────────────────────────────────────── */

type RippleState = {
  x: number;
  y: number;
  size: number;
  leaving: boolean;
} | null;

function useRipple() {
  const [ripple, setRipple] = useState<RippleState>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending timer on unmount so we never setState on a dead component
  useEffect(
    () => () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    },
    [],
  );

  const onMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const maxDist = Math.hypot(
      Math.max(x, rect.width - x),
      Math.max(y, rect.height - y),
    );
    setRipple({ x, y, size: maxDist * 2, leaving: false });
  };

  const onMouseLeave = () => {
    setRipple((prev) => (prev ? { ...prev, leaving: true } : null));
    leaveTimer.current = setTimeout(() => setRipple(null), 380);
  };

  return {
    ripple,
    onMouseEnter,
    onMouseLeave,
    hovered: ripple !== null && !ripple.leaving,
  };
}

function RippleFill({ ripple, color }: { ripple: RippleState; color: string }) {
  if (!ripple) return null;
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: ripple.x - ripple.size / 2,
        top: ripple.y - ripple.size / 2,
        width: `${ripple.size}px`,
        height: `${ripple.size}px`,
        borderRadius: "50%",
        background: color,
        pointerEvents: "none",
        zIndex: 0,
        animation: ripple.leaving
          ? "skillRippleOut 0.35s ease forwards"
          : "skillRippleIn 0.42s cubic-bezier(0.4, 0, 0.2, 1) forwards",
      }}
    />
  );
}

function Rippleable<T extends React.ElementType>({
  as,
  rippleColor,
  style,
  onMouseEnter,
  onMouseLeave,
  children,
  ...rest
}: {
  as: T;
  rippleColor: string;
  children: React.ReactNode;
} & Omit<
  React.ComponentPropsWithoutRef<T>,
  "as" | "rippleColor" | "children"
>) {
  const ripple = useRipple();
  const Component = as as React.ElementType;
  return (
    <Component
      {...rest}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        ripple.onMouseEnter(e);
        (onMouseEnter as React.MouseEventHandler<HTMLElement> | undefined)?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        ripple.onMouseLeave();
        (onMouseLeave as React.MouseEventHandler<HTMLElement> | undefined)?.(e);
      }}
    >
      <RippleFill ripple={ripple.ripple} color={rippleColor} />
      {children}
    </Component>
  );
}

/* ────────────────────────────────────────────────────────────────
   Skills data + shapes
   ──────────────────────────────────────────────────────────────── */

type SkillLevel = "once" | "familiar" | "comfortable";
type SkillShape = "circle" | "triangle" | "square";

const LEVEL_META: Record<
  SkillLevel,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    shape: SkillShape;
  }
> = {
  once: {
    label: "Used once or twice",
    color: "rgba(80,80,80,0.7)",
    bg: "rgba(120,120,120,0.14)",
    border: "rgba(120,120,120,0.35)",
    shape: "circle",
  },
  familiar: {
    label: "Familiar with it",
    color: "#548687",
    bg: "rgba(84,134,135,0.2)",
    border: "rgba(84,134,135,0.6)",
    shape: "triangle",
  },
  comfortable: {
    label: "Comfortable with it",
    color: "#b0413e",
    bg: "rgba(176,65,62,0.18)",
    border: "rgba(176,65,62,0.6)",
    shape: "square",
  },
};

function ShapeIcon({
  shape,
  size,
  color,
}: {
  shape: SkillShape;
  size: number;
  color: string;
}) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: color,
        display: "inline-flex",
        flexShrink: 0,
        borderRadius: shape === "circle" ? "50%" : 0,
        clipPath:
          shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
      }}
    />
  );
}

const SKILLS: Record<string, { name: string; level: SkillLevel }[]> = {
  Languages: [
    { name: "Python", level: "comfortable" },
    { name: "JavaScript", level: "comfortable" },
    { name: "C#", level: "comfortable" },
    { name: "Java", level: "once" },
  ],
  Frameworks: [
    { name: "React", level: "comfortable" },
    { name: "Flask", level: "comfortable" },
    { name: "ASP.Net", level: "once" },
    { name: "Next.js", level: "familiar" },
  ],
  Tools: [
    { name: "Git", level: "comfortable" },
    { name: "Docker", level: "familiar" },
    { name: "GCP", level: "familiar" },
    { name: "Adobe Photoshop", level: "familiar" },
    { name: "Claude Code", level: "comfortable" },
    { name: "Github Actions", level: "once" },
  ],
  Databases: [
    { name: "PostgreSQL", level: "once" },
    { name: "MongoDB", level: "familiar" },
    { name: "Google Firestore", level: "once" },
  ],
};

const PROJECTS = [
  {
    num: "01",
    title: "Board Game Digital",
    subtitle: "First Programming Project",
    tech: ["Python", "Processing"],
    description:
      "A digital implementation of a custom board game, built from scratch in Python using the Processing programming environment. The very first real programming project — learning logic, loops, and what it means to make a computer do something.",
    learnings:
      "Python fundamentals: control flow, data structures and functions. The bedrock everything else was built on.",
    accent: "#b0413e",
    github: "https://github.com/The0Danktor/Trench-warfare",
  },
  {
    num: "02",
    title: "AgriReport — Viscon Group",
    subtitle: "Agricultural Issue Reporting",
    tech: ["ASP.Net", "React", "C#"],
    description:
      "A web application for reporting and tracking issues with agricultural machinery, built for Viscon Group. The first web project — messy code, hard lessons, and the spark that ignited a lasting passion for web development.",
    learnings:
      "React and ASP.Net fundamentals. Learned the hard way why architecture matters before writing a single line.",
    accent: "#548687",
    github: "https://github.com/nowaaaaaa/Project-C",
  },
  {
    num: "03",
    title: "Container Security Scanner",
    subtitle: "Docker Vulnerability Analysis",
    tech: ["Flask", "React", "Docker", "Syft SBOM Scanner", "MongoDB"],
    description:
      "A web application to scan incoming Docker containers for known security vulnerabilities via SBOM analysis. A research-intensive project requiring deep dives into container ecosystems and software supply chain security.",
    learnings:
      "Advanced React & Flask patterns, Docker architecture, SBOM generation tools (Syft, Grype), and practical security analysis workflows.",
    accent: "#b0413e",
    github: "https://github.com/nowaaaaaa/Project-Dae",
  },
  {
    num: "04",
    title: "CloudAdvies Web Portal",
    subtitle: "Internship — Multi-CRM Platform",
    tech: ["React", "Flask", "GCP", "Zoho CRM"],
    description:
      "An enterprise-grade web portal connecting to multiple Zoho CRM environments, rendering dynamic, environment-specific frontends for each. Built during an internship at CloudAdvies and deployed on Google Cloud Platform.",
    learnings:
      "OAuth2 auth flows, multi-tenant database design, GCP deployment (Cloud Run, Cloud SQL), and what it actually means to ship production software.",
    accent: "#548687",
    github: "",
  },
  {
    num: "05",
    title: "New York Taxi Prediction",
    subtitle: "Minor Project — Data Science",
    tech: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
    description:
      "A data science project analyzing a dataset of New York City taxi trips to predict trip durations based on various features. The project involved data cleaning, exploratory analysis, feature engineering, and building models with linear regression, XGBoost and Prophet. The project also included the writing of a paper detailing the methodology and results.",
    learnings:
      "The first step into Data Science — data cleaning, feature engineering, and the basics of predictive modeling. A great reminder that raw data is messy and insights come from the work put into understanding it.",
    accent: "#b0413e",
    github: "https://github.com/9iiota/CMI-MINBOD-2526",
  },
  {
    num: "06",
    title: "Delirium Prediction Capstone Project",
    subtitle: "Internal Minor Project — Machine Learning",
    tech: [
      "Python",
      "Pandas",
      "Scikit-learn",
      "XGBoost",
      "Random Forest",
      "LSTM",
    ],
    description:
      "A capstone project focusing on predicting delirium in hospitalized patients in the MIMIC-IV Dataset, using machine learning techniques. The project involved data preprocessing, feature selection, and model training with Random Forest, XGBoost, and LSTM and a final Ensemble model averaging the outputs of the individual models. This project also included the writing of a scientific paper detailing the methodology and results.",
    learnings:
      "A step further into machine learning. Detailing every step of the process. Working with bigger datasets, more complex preprocessing, and more advanced models.",
    accent: "#548687",
    github: "https://github.com/Hadyalt/AI_In_Healthcare_Capstone_Project",
  },
  {
    num: "07",
    title: "Invoice Application — BromFix",
    subtitle: "Project for a Local Business ran by a Friend — [AI Used]",
    tech: ["Flutter", "Firebase", "Google Firestore"],
    description:
      "A mobile application for creating and managing invoices for a friend's Moped Repair business. The app allows the user to create invoices, add items, and send them to customers via email, WhatsApp, etc. The app was mainly built to streamline the previously fully manual process.",
    learnings:
      "Building a full-stack mobile application, directly working with the client, and learning the importance of user experience and feedback in a real-world application.",
    accent: "#b0413e",
    github: "https://github.com/kieran20022/invoice-app",
  },
];

const EDUCATION = [
  {
    years: "2015 — 2020",
    institution: "Melanchton Schiebroek",
    type: "Havo · High School",
    description:
      "Graduated with an NT + Economics profile, with a natural strength and passion for mathematics. The analytical mindset built here became the bedrock for everything that followed.",
    highlight: "Havo — NT + Economics — strong maths foundation",
    accent: "#548687",
  },
  {
    years: "2020 — 2021",
    institution: "Haagse Hogeschool",
    type: "Toegepaste Wiskunde · Applied Mathematics",
    description:
      "Applied Mathematics turned out not to be the right path — but it introduced programming for the first time through Visual Basic and Python. That single spark was enough to change the entire direction.",
    highlight: "First contact: Visual Basic & Python",
    accent: "#b0413e",
  },
  {
    years: "2021 — 2027",
    institution: "Hogeschool Rotterdam",
    type: "Informatica · Computer Science",
    description:
      "Currently studying Computer Science with a focus on full stack development and a completed minor in Data Science. Every project, every course, and every late debugging session has sharpened both the skill set and the drive to build things that matter.",
    highlight: "Currently enrolled — full stack development",
    accent: "#548687",
  },
];

/* ────────────────────────────────────────────────────────────────
   Small shared building blocks
   ──────────────────────────────────────────────────────────────── */

/** The recurring "accent line + uppercase label" section eyebrow. */
function Eyebrow({
  label,
  color = "#b0413e",
  style,
}: {
  label: string;
  color?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "20px",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{ width: "44px", height: "1.5px", background: color }}
      />
      <span
        style={{
          color,
          fontSize: "11px",
          letterSpacing: "3px",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        {label}
      </span>
    </div>
  );
}

/** The smaller "thick accent line + tiny heading" used in About sub-blocks. */
function SubHeading({
  label,
  lineColor,
  icon,
}: {
  label: string;
  lineColor: string;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "28px",
      }}
    >
      <div
        aria-hidden="true"
        style={{ width: "36px", height: "3px", background: lineColor }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {icon}
        <h4
          style={{
            fontSize: "10px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            color: "#548687",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {label}
        </h4>
      </div>
    </div>
  );
}

function SkillTag({
  name,
  meta,
}: {
  name: string;
  meta: (typeof LEVEL_META)[SkillLevel];
}) {
  const { ripple, onMouseEnter, onMouseLeave, hovered } = useRipple();

  return (
    <span
      className="ui-text"
      style={{
        padding: "7px 14px",
        fontSize: "13px",
        fontWeight: 500,
        border: `1px solid ${meta.border}`,
        background: meta.bg,
        color: hovered ? "#ffffc7" : "#1a1a1a",
        transition:
          "color 0.22s 0.08s ease, transform 0.22s ease, box-shadow 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 6px 16px rgba(26,26,26,0.12)" : "none",
        cursor: "default",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <RippleFill ripple={ripple} color={meta.color} />
      <span
        style={{
          opacity: 0.55,
          position: "relative",
          zIndex: 1,
          display: "inline-flex",
        }}
      >
        <ShapeIcon shape={meta.shape} size={8} color="currentColor" />
      </span>
      <span style={{ position: "relative", zIndex: 1 }}>{name}</span>
    </span>
  );
}

function SkillCard({
  delay,
  children,
}: {
  delay: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      className="reveal skill-card"
      style={{ transitionDelay: `${delay}s` }}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
}

function ProjectsGlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} className="project-glow" onMouseMove={handleMouseMove}>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Electric low-poly cursor trail (Skills section)
   ──────────────────────────────────────────────────────────────── */

/**
 * Canvas overlay that chases the cursor with a crackling low-poly shard:
 * a jittered vertex ring lerps behind the pointer while jagged bolts arc
 * across the gap to where the cursor actually is. Draws only while the
 * pointer is inside the host section (its direct parent) and fades out
 * on leave, so the rAF loop isn't running the rest of the time.
 */
function ElectricTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    let raf = 0;
    let running = false;
    let inside = false;
    let energy = 0; // fades the whole effect in/out
    let lastJolt = 0;
    const target = { x: 0, y: 0 };
    const trail = { x: 0, y: 0 };

    // Ring vertices (angle + radius) and per-bolt jitter, regenerated on a
    // slow cadence so the shape crackles instead of vibrating every frame.
    let ring: { a: number; r: number }[] = [];
    let bolts: number[][] = [];
    const jolt = () => {
      const n = 7;
      ring = Array.from({ length: n }, (_, i) => ({
        a: (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.6,
        // Wide enough that snapped vertices spread across 1-2 grid cells
        r: 16 + Math.random() * 30,
      }));
      bolts = Array.from({ length: 3 }, () =>
        Array.from({ length: 5 }, () => Math.random() - 0.5),
      );
    };
    jolt();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(host.clientWidth * dpr);
      canvas.height = Math.round(host.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Snap to the .dot-grid lattice (28px tiles, dot at each tile center)
    // so vertices and bolt joints land exactly on the background dots.
    const GRID = 28;
    const snap = (v: number) =>
      Math.round((v - GRID / 2) / GRID) * GRID + GRID / 2;

    const path = (pts: [number, number][], close?: boolean) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      if (close) ctx.closePath();
    };

    const stroke = (color: string, width: number, alpha: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.globalAlpha = alpha;
      ctx.stroke();
    };

    const step = (t: number) => {
      // The shard trails the cursor; bolts bridge the remaining gap.
      trail.x += (target.x - trail.x) * 0.11;
      trail.y += (target.y - trail.y) * 0.11;
      energy += inside ? (1 - energy) * 0.09 : -energy * 0.07;
      if (t - lastJolt > 70) {
        jolt();
        lastJolt = t;
      }

      ctx.clearRect(0, 0, host.clientWidth, host.clientHeight);
      if (!inside && energy < 0.02) {
        running = false;
        return;
      }

      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      const teal = "#548687";
      const terracotta = "#b0413e";
      // Shard hub and ring vertices, snapped to grid dots (deduped, since
      // neighbouring vertices can land on the same dot).
      const hub: [number, number] = [snap(trail.x), snap(trail.y)];
      const pts: [number, number][] = [];
      ring.forEach(({ a, r }) => {
        const x = snap(trail.x + Math.cos(a) * r);
        const y = snap(trail.y + Math.sin(a) * r);
        if (!pts.some(([qx, qy]) => qx === x && qy === y)) pts.push([x, y]);
      });

      // Low-poly shard: faint fill, glow pass, crisp ring, inner mesh.
      path(pts, true);
      ctx.fillStyle = teal;
      ctx.globalAlpha = 0.08 * energy;
      ctx.fill();
      stroke(teal, 5, 0.14 * energy);
      stroke(teal, 1.4, 0.85 * energy);
      pts.forEach(([x, y], i) => {
        if (i % 2 === 0) {
          path([hub, [x, y]]);
          stroke(teal, 1, 0.3 * energy);
        }
      });

      // Bolts arcing from the shard to the grid dot nearest the cursor.
      const end: [number, number] = [snap(target.x), snap(target.y)];
      const dx = end[0] - hub[0];
      const dy = end[1] - hub[1];
      const dist = Math.hypot(dx, dy);
      if (dist > 0) {
        const px = -dy / dist;
        const py = dx / dist;
        const amp = Math.min(34, dist * 0.4);
        bolts.forEach((offsets, b) => {
          const boltPts: [number, number][] = [hub];
          offsets.forEach((off, i) => {
            const f = (i + 1) / (offsets.length + 1);
            const jx = snap(hub[0] + dx * f + px * off * amp);
            const jy = snap(hub[1] + dy * f + py * off * amp);
            const prev = boltPts[boltPts.length - 1];
            if (prev[0] !== jx || prev[1] !== jy) boltPts.push([jx, jy]);
          });
          boltPts.push(end);
          const color = b === 2 ? terracotta : teal;
          path(boltPts);
          stroke(color, 4, 0.12 * energy);
          stroke(color, 1.2, 0.75 * energy);
        });
      }

      // Spark nodes on a couple of vertices, terracotta for contrast.
      ctx.fillStyle = terracotta;
      ctx.globalAlpha = 0.8 * energy;
      pts.forEach(([x, y], i) => {
        if (i % 3 === 0) ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
      });
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      target.x = e.clientX - rect.left;
      target.y = e.clientY - rect.top;
      if (!inside) {
        inside = true;
        // Fresh entry: spawn at the cursor instead of flying across.
        if (energy < 0.02) {
          trail.x = target.x;
          trail.y = target.y;
        }
      }
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };
    const onLeave = () => {
      inside = false;
    };
    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Radio-style projects: at most one open at a time. Scrolling opens the
  // row being passed; a manual toggle briefly suppresses the auto-open so
  // the layout shift it causes can't immediately fight the user.
  const [openProject, setOpenProject] = useState<number | null>(null);
  const lastScrollY = useRef(0);
  const suppressAutoUntil = useRef(0);

  // Helper: skip entrance offsets when the visitor prefers reduced motion
  const entrance = useCallback(
    (initial: Record<string, number | string>) =>
      prefersReducedMotion ? false : initial,
    [prefersReducedMotion],
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll(); // sync immediately in case the page loads mid-scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Mobile menu: lock body scroll + close on Escape while open
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries, obs) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target); // one-shot reveal — stop watching once visible
          }
        }),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Auto-open projects one at a time as their rows scroll past, following
  // the scroll direction, so the open panel walks through the list like a
  // radio group.
  useEffect(() => {
    const rows = Array.from(
      document.querySelectorAll<HTMLElement>("#projects .project-toggle"),
    );
    const io = new IntersectionObserver(
      (entries) => {
        const y = window.scrollY;
        const down = y >= lastScrollY.current;
        lastScrollY.current = y;
        if (performance.now() < suppressAutoUntil.current) return;
        const entering = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset.index))
          .filter((idx) => !Number.isNaN(idx));
        if (entering.length === 0) return;
        // Advance to the nearest row in the scroll direction so rows open
        // strictly one by one, even when a fast scroll passes several rows.
        setOpenProject((prev) => {
          const ahead = entering.filter(
            (idx) => prev === null || (down ? idx > prev : idx < prev),
          );
          if (ahead.length === 0) return prev;
          return down ? Math.min(...ahead) : Math.max(...ahead);
        });
      },
      // Collapse the observed area to a thin band at the vertical center of
      // the viewport: a row triggers when its header crosses mid-screen.
      // (1% tall rather than a zero-height line, which some engines drop.)
      { threshold: 0, rootMargin: "-50% 0px -49% 0px" },
    );
    rows.forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, []);

  const toggleProject = (i: number, e: React.SyntheticEvent) => {
    // A manual toggle wins: pause the scroll auto-open while the layout
    // shift it causes settles, so it can't instantly reopen or move on.
    suppressAutoUntil.current = e.timeStamp + 700;
    setOpenProject((prev) => (prev === i ? null : i));
  };

  return (
    <main style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
      {/* Page-level polish: smooth anchor scrolling with room for the fixed
          nav, visible keyboard focus, and a reduced-motion escape hatch. */}
      <style>{`
        html { scroll-behavior: smooth; }
        section[id] { scroll-margin-top: 84px; }
        .skip-link {
          position: fixed;
          top: -100px;
          left: 16px;
          z-index: 1001;
          padding: 10px 18px;
          background: #b0413e;
          color: #ffffc7;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
          transition: top 0.2s ease;
        }
        .skip-link:focus-visible { top: 12px; }
        ::selection { background: #b0413e; color: #ffffc7; }
        /* Film-grain texture for the teal sections */
        .grain::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.055;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        /* Faint dotted grid on the cream skills section */
        .dot-grid {
          background-image: radial-gradient(rgba(26,26,26,0.12) 1px, transparent 1.5px);
          background-size: 28px 28px;
        }
        /* Nav links: terracotta underline sweeps in on hover/focus */
        .nav-link {
          position: relative;
          color: #ffffc7;
          text-decoration: none;
          font-size: 11px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          opacity: 0.75;
          transition: opacity 0.2s ease;
        }
        .nav-link:hover,
        .nav-link:focus-visible { opacity: 1; }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -6px;
          height: 1px;
          background: #b0413e;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.28s ease;
        }
        .nav-link:hover::after,
        .nav-link:focus-visible::after { transform: scaleX(1); }
        /* Hand-drawn underline under "Builder." draws in after the headline lands */
        .builder-underline {
          stroke-dasharray: 330;
          stroke-dashoffset: 330;
          animation: drawUnder 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.35s forwards;
        }
        @keyframes drawUnder { to { stroke-dashoffset: 0; } }
        /* Project numbers: hollow outline that fills with color on hover/open */
        .p-num {
          color: transparent;
          -webkit-text-stroke: 1.5px var(--accent);
          opacity: 0.75;
          transition: color 0.3s ease, opacity 0.3s ease;
        }
        .project-toggle:hover .p-num,
        .project-toggle:focus-visible .p-num,
        .project-toggle[aria-expanded="true"] .p-num {
          color: var(--accent);
          opacity: 1;
        }
        @supports not (-webkit-text-stroke: 1px #000) {
          .p-num { color: var(--accent); }
        }
        .project-toggle h3 { transition: transform 0.25s ease; }
        .project-toggle:hover h3 { transform: translateX(6px); }
        .project-toggle[aria-expanded="false"]:hover .project-plus {
          border-color: rgba(255,255,199,0.45) !important;
        }
        /* Sonar ring on the current (ongoing) education entry */
        .pulse-dot { position: relative; }
        .pulse-dot::after {
          content: "";
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 1px solid rgba(84,134,135,0.8);
          animation: pulseRing 2.6s ease-out infinite;
        }
        @keyframes pulseRing {
          0% { transform: scale(0.4); opacity: 0.8; }
          70%, 100% { transform: scale(1.5); opacity: 0; }
        }
        /* Mobile menu: fade the overlay, stagger the links */
        #mobile-menu { animation: menuFade 0.25s ease; }
        @keyframes menuFade { from { opacity: 0; } to { opacity: 1; } }
        .menu-link {
          opacity: 0;
          animation: menuLinkIn 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes menuLinkIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 0.9; transform: translateY(0); }
        }
        a:focus-visible,
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .reveal { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <a href="#about" className="skip-link">
        Skip to content
      </a>

      {/* SVG filter: builds one clean outline around the rendered silhouette
          of the KH mark (dilate alpha, subtract original), so overlapping
          glyph contours don't produce internal seams like text-stroke does. */}
      <svg
        width="0"
        height="0"
        style={{ position: "absolute" }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="kh-outline" x="-5%" y="-5%" width="110%" height="110%">
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="2"
              result="dilated"
            />
            <feComposite
              in="dilated"
              in2="SourceAlpha"
              operator="out"
              result="ring"
            />
            <feFlood floodColor="#ffffc7" floodOpacity="0.16" result="tint" />
            <feComposite in="tint" in2="ring" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Reading-progress bar — extends the hero's terracotta accent line */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "3px",
          background: "#b0413e",
          transform: `scaleX(${scrollProgress})`,
          transformOrigin: "left",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      />

      {/* ── NAV ── */}
      <motion.nav
        aria-label="Primary"
        initial={entrance({ y: -80, opacity: 0 })}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.25, ease: E }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: scrolled
            ? `14px ${isMobile ? "20px" : "56px"}`
            : `28px ${isMobile ? "20px" : "56px"}`,
          background: scrolled ? "rgba(61,100,101,0.20)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding 0.35s ease, background 0.35s ease",
          borderBottom: scrolled ? "1px solid rgba(255,255,199,0.12)" : "none",
          boxShadow: scrolled ? "0 8px 32px rgba(26,26,26,0.18)" : "none",
        }}
      >
        <a
          href="#hero"
          aria-label="Back to top"
          style={{
            fontSize: "26px",
            fontWeight: 900,
            color: "#ffffc7",
            letterSpacing: "-1px",
            fontStyle: "italic",
            textDecoration: "none",
          }}
        >
          KH
        </a>
        {isMobile ? (
          <Rippleable
            as="button"
            type="button"
            rippleColor="rgba(255,255,199,0.22)"
            onClick={() => setMenuOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              color: "#ffffc7",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span style={{ position: "relative", zIndex: 1, display: "flex" }}>
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </span>
          </Rippleable>
        ) : (
          <div style={{ display: "flex", gap: "36px" }}>
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="nav-link"
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </motion.nav>

      {/* ── MOBILE MENU OVERLAY ── */}
      {isMobile && menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 998,
            background: "rgba(84,134,135,0.98)",
            backdropFilter: "blur(12px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "44px",
          }}
        >
          {NAV_LINKS.map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="menu-link"
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#ffffc7",
                textDecoration: "none",
                fontSize: "36px",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "-0.5px",
                animationDelay: `${0.05 + i * 0.06}s`,
              }}
            >
              {link}
            </a>
          ))}
        </nav>
      )}

      {/* ── HERO ── */}
      <section
        id="hero"
        className="grain"
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(1100px 700px at 22% 42%, #5b9394 0%, #548687 55%)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Terracotta accent bar */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "#b0413e",
          }}
        />

        {/* Decorative vertical rails */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "56px",
            width: "1px",
            background: "rgba(255,255,199,0.12)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: "56px",
            width: "1px",
            background: "rgba(255,255,199,0.12)",
          }}
        />

        {/* Giant KH lettermark — solid cream slides in from center and fades
            to a ghost, revealing a crisp silhouette outline underneath */}
        <motion.div
          aria-hidden="true"
          initial={entrance({ x: "-30vw" })}
          animate={{ x: 0 }}
          transition={{ duration: 1.1, delay: 0.2, ease: E }}
          style={{
            position: "absolute",
            right: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "clamp(280px, 38vw, 560px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-16px",
            userSelect: "none",
            pointerEvents: "none",
            fontStyle: "italic",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              color: "#ffffc7",
              filter: "url(#kh-outline)",
            }}
          >
            KH
          </span>
          <motion.span
            initial={entrance({ opacity: 1 })}
            animate={{ opacity: 0.055 }}
            transition={{ duration: 1.1, delay: 0.2, ease: E }}
            style={{ position: "relative", color: "#ffffc7" }}
          >
            KH
          </motion.span>
        </motion.div>

        <div
          style={{
            padding: "clamp(80px, 12vw, 140px) clamp(32px, 7vw, 96px)",
            maxWidth: "900px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Eyebrow */}
          <motion.div
            initial={entrance({ x: -64, opacity: 0 })}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4, ease: E }}
          >
            <Eyebrow
              label="Portfolio · 2026"
              style={{ marginBottom: "36px" }}
            />
          </motion.div>

          {/* Display headline */}
          <motion.h1
            initial={entrance({ x: -90, opacity: 0 })}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: E }}
            style={{
              fontSize: "clamp(42px, 9vw, 116px)",
              fontWeight: 700,
              color: "#ffffc7",
              lineHeight: 0.95,
              marginBottom: "44px",
            }}
          >
            Developer.
            <br />
            Creator.
            <br />
            <span style={{ position: "relative", display: "inline-block" }}>
              <em style={{ color: "#b0413e", fontStyle: "italic" }}>
                Builder.
              </em>
              <svg
                viewBox="0 0 300 20"
                preserveAspectRatio="none"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: "-0.06em",
                  width: "100%",
                  height: "0.14em",
                  overflow: "visible",
                }}
              >
                <path
                  className="builder-underline"
                  d="M6 14 C 90 4, 200 5, 294 12"
                  stroke="rgba(255,255,199,0.85)"
                  strokeWidth="5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={entrance({ x: -70, opacity: 0 })}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.7, ease: E }}
            style={{
              fontSize: "clamp(15px, 1.8vw, 19px)",
              color: "rgba(255,255,199,0.72)",
              maxWidth: "440px",
              lineHeight: 1.85,
              marginBottom: "52px",
            }}
          >
            A developer passionate about full stack development, crafting clean
            and impactful digital experiences, and always eager to learn and
            grow through new challenges.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={entrance({ x: -50, opacity: 0 })}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85, ease: E }}
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <Rippleable
              as="a"
              href="#projects"
              rippleColor="rgba(255,255,199,0.2)"
              style={{
                padding: "15px 34px",
                background: "#b0413e",
                color: "#ffffc7",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(176,65,62,0.45)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                View Work{" "}
                <ArrowRight
                  size={14}
                  aria-hidden="true"
                  style={{
                    display: "inline",
                    verticalAlign: "middle",
                    marginLeft: "6px",
                  }}
                />
              </span>
            </Rippleable>
            <Rippleable
              as="a"
              href="#contact"
              rippleColor="rgba(255,255,199,0.14)"
              style={{
                padding: "15px 34px",
                border: "1px solid rgba(255,255,199,0.35)",
                color: "#ffffc7",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "border-color 0.2s, background 0.2s",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = "#ffffc7";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.borderColor = "rgba(255,255,199,0.35)";
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                Get in Touch
              </span>
            </Rippleable>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          aria-hidden="true"
          initial={entrance({ opacity: 0 })}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span
            style={{
              color: "rgba(255,255,199,0.45)",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <ChevronDown
            size={18}
            color="rgba(255,255,199,0.45)"
            style={{ animation: "scrollLine 2.2s ease infinite" }}
          />
        </motion.div>
      </section>

      {/* ── ABOUT ── */}
      <section
        id="about"
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          background: "#1a1a1a",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          {/* Header */}
          <div className="reveal" style={{ marginBottom: "80px" }}>
            <Eyebrow label="Background" />
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#ffffc7",
                lineHeight: 1.05,
              }}
            >
              <span style={{ color: "#548687" }}>Educational</span> Journey
            </h2>
          </div>

          {/* Timeline */}
          {EDUCATION.map((item, i) => (
            <div
              key={item.institution}
              className="reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {isMobile ? (
                /* Mobile: stacked with left accent border */
                <div
                  style={{
                    paddingLeft: "20px",
                    borderLeft: `2px solid ${item.accent}55`,
                    paddingBottom: i < EDUCATION.length - 1 ? "48px" : "0",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontSize: "11px",
                      letterSpacing: "1px",
                      color: item.accent,
                      fontWeight: 700,
                      fontStyle: "italic",
                      marginBottom: "10px",
                    }}
                  >
                    {item.years}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "10px",
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                      color: "rgba(255,255,199,0.35)",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    {item.type}
                  </span>
                  <h3
                    style={{
                      fontSize: "clamp(18px, 5vw, 26px)",
                      fontWeight: 700,
                      color: "#ffffc7",
                      lineHeight: 1.2,
                      marginBottom: "14px",
                    }}
                  >
                    {item.institution}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,199,0.6)",
                      fontSize: "15px",
                      lineHeight: 1.85,
                      marginBottom: "16px",
                    }}
                  >
                    {item.description}
                  </p>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "7px 14px",
                      border: `1px solid ${item.accent}40`,
                    }}
                  >
                    <div
                      aria-hidden="true"
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: item.accent,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: item.accent,
                        fontSize: "13px",
                        fontStyle: "italic",
                      }}
                    >
                      {item.highlight}
                    </span>
                  </div>
                </div>
              ) : (
                /* Desktop: 3-column grid with spine */
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(96px, 13vw, 152px) 32px 1fr",
                    gap: "0 28px",
                    paddingBottom: i < EDUCATION.length - 1 ? "60px" : "0",
                  }}
                >
                  {/* Year */}
                  <div style={{ textAlign: "right", paddingTop: "2px" }}>
                    <span
                      style={{
                        fontSize: "clamp(11px, 1.2vw, 13px)",
                        letterSpacing: "1px",
                        color: item.accent,
                        fontWeight: 700,
                        fontStyle: "italic",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.years}
                    </span>
                  </div>

                  {/* Timeline spine */}
                  <div
                    aria-hidden="true"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      className={
                        i === EDUCATION.length - 1 ? "pulse-dot" : undefined
                      }
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: item.accent,
                        flexShrink: 0,
                        marginTop: "3px",
                      }}
                    />
                    {i < EDUCATION.length - 1 && (
                      <div
                        style={{
                          width: "1px",
                          flex: 1,
                          marginTop: "10px",
                          background: `linear-gradient(to bottom, ${item.accent}50, rgba(255,255,199,0.06))`,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ paddingBottom: "4px" }}>
                    <span
                      style={{
                        display: "block",
                        fontSize: "10px",
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        color: "rgba(255,255,199,0.35)",
                        fontWeight: 600,
                        marginBottom: "10px",
                      }}
                    >
                      {item.type}
                    </span>
                    <h3
                      style={{
                        fontSize: "clamp(20px, 2.5vw, 30px)",
                        fontWeight: 700,
                        color: "#ffffc7",
                        lineHeight: 1.2,
                        marginBottom: "16px",
                      }}
                    >
                      {item.institution}
                    </h3>
                    <p
                      style={{
                        color: "rgba(255,255,199,0.6)",
                        fontSize: "16px",
                        lineHeight: 1.85,
                        maxWidth: "580px",
                        marginBottom: "18px",
                      }}
                    >
                      {item.description}
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "7px 14px",
                        border: `1px solid ${item.accent}40`,
                      }}
                    >
                      <div
                        aria-hidden="true"
                        style={{
                          width: "5px",
                          height: "5px",
                          borderRadius: "50%",
                          background: item.accent,
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          color: item.accent,
                          fontSize: "13px",
                          fontStyle: "italic",
                        }}
                      >
                        {item.highlight}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Personal details */}
          <div
            className="reveal"
            style={{
              marginTop: "80px",
              paddingTop: "64px",
              borderTop: "1px solid rgba(255,255,199,0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "56px",
            }}
          >
            {/* ── Row 1: Interests (full width, Gym + Gaming side by side) ── */}
            <div>
              <SubHeading label="Interests" lineColor="#548687" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "32px",
                }}
              >
                {/* Gym */}
                <Rippleable
                  as="div"
                  rippleColor="rgba(176,65,62,0.16)"
                  style={{
                    padding: "24px",
                    border: "1px solid rgba(176,65,62,0.2)",
                    background: "rgba(176,65,62,0.04)",
                    borderTop: "3px solid rgba(176,65,62,0.5)",
                    transition: "background 0.3s ease, border-color 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <Dumbbell size={16} color="#b0413e" aria-hidden="true" />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#ffffc7",
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontStyle: "italic",
                      }}
                    >
                      Gym
                    </span>
                  </div>
                  <p
                    className="ui-text"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      fontSize: "14px",
                      color: "rgba(255,255,199,0.55)",
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    Started out knowing nothing and building out to a result
                    I&apos;m proud of. The process of learning, improving, and
                    pushing limits is what hooked me — it&apos;s addicting,
                    honestly.
                  </p>
                </Rippleable>
                {/* Gaming */}
                <Rippleable
                  as="div"
                  rippleColor="rgba(84,134,135,0.18)"
                  style={{
                    padding: "24px",
                    border: "1px solid rgba(84,134,135,0.2)",
                    background: "rgba(84,134,135,0.04)",
                    borderTop: "3px solid rgba(84,134,135,0.5)",
                    transition: "background 0.3s ease, border-color 0.3s ease",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <Gamepad2 size={16} color="#548687" aria-hidden="true" />
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 700,
                        color: "#ffffc7",
                        fontFamily: "var(--font-playfair), Georgia, serif",
                        fontStyle: "italic",
                      }}
                    >
                      Gaming
                    </span>
                  </div>
                  <p
                    className="ui-text"
                    style={{
                      position: "relative",
                      zIndex: 1,
                      fontSize: "14px",
                      color: "rgba(255,255,199,0.55)",
                      lineHeight: 1.75,
                      margin: 0,
                    }}
                  >
                    Roguelites like <em>Hades</em> and{" "}
                    <em>The Binding of Isaac</em>, where every run reshapes the
                    experience. Competitive shooters like <em>CS2</em> for the
                    mechanical and strategic depth. Sandbox games like{" "}
                    <em>Minecraft</em>, especially technical modpacks with
                    complex automations.
                  </p>
                </Rippleable>
              </div>
            </div>

            {/* ── Row 2: Languages + Location ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "32px",
              }}
            >
              {/* Languages */}
              <div>
                <SubHeading
                  label="Languages"
                  lineColor="#b0413e"
                  icon={<Globe size={13} color="#548687" aria-hidden="true" />}
                />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                  }}
                >
                  {[
                    {
                      lang: "Dutch",
                      level: "Native",
                      pct: 100,
                      accent: "#548687",
                    },
                    {
                      lang: "English",
                      level: "Fluent",
                      pct: 90,
                      accent: "#b0413e",
                    },
                  ].map(({ lang, level, pct, accent }) => (
                    <div key={lang}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "10px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#ffffc7",
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontStyle: "italic",
                          }}
                        >
                          {lang}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                            color: accent,
                          }}
                        >
                          {level}
                        </span>
                      </div>
                      <div
                        aria-hidden="true"
                        style={{
                          height: "2px",
                          background: "rgba(255,255,199,0.08)",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: 0,
                            top: 0,
                            height: "100%",
                            width: `${pct}%`,
                            background: accent,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <SubHeading
                  label="Location"
                  lineColor="#548687"
                  icon={<MapPin size={13} color="#548687" aria-hidden="true" />}
                />
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(22px, 3vw, 32px)",
                    fontWeight: 700,
                    color: "#ffffc7",
                    fontFamily: "var(--font-playfair), Georgia, serif",
                    fontStyle: "italic",
                    lineHeight: 1.1,
                    marginBottom: "10px",
                  }}
                >
                  Rotterdam,
                  <br />
                  Netherlands
                </span>
                <span
                  className="ui-text"
                  style={{
                    fontSize: "13px",
                    color: "rgba(255,255,199,0.4)",
                    letterSpacing: "1px",
                  }}
                >
                  Available for remote &amp; on-site
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section
        id="skills"
        className="dot-grid"
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          backgroundColor: "#ffffc7",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* <ElectricTrail /> */}
        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="reveal" style={{ marginBottom: "72px" }}>
            <Eyebrow label="Expertise" />
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.05,
                marginBottom: "28px",
              }}
            >
              Skills &{" "}
              <em style={{ color: "#548687", fontStyle: "italic" }}>
                Technologies
              </em>
            </h2>
            {/* Legend */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
              }}
            >
              {(
                Object.entries(LEVEL_META) as [
                  SkillLevel,
                  (typeof LEVEL_META)[SkillLevel],
                ][]
              ).map(([, { label, bg, border, shape, color }]) => (
                <div
                  key={label}
                  className="ui-text"
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: "18px",
                      height: "14px",
                      background: bg,
                      border: `1px solid ${border}`,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShapeIcon shape={shape} size={9} color={color} />
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.5px",
                      color: "rgba(26,26,26,0.5)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "56px",
            }}
          >
            {Object.entries(SKILLS).map(([category, items], i) => (
              <SkillCard key={category} delay={i * 0.15}>
                <div
                  aria-hidden="true"
                  style={{
                    width: "36px",
                    height: "3px",
                    marginBottom: "18px",
                    background: i % 2 === 1 ? "#b0413e" : "#548687",
                  }}
                />
                <h3
                  style={{
                    fontSize: "10px",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: "#548687",
                    fontWeight: 700,
                    marginBottom: "22px",
                  }}
                >
                  {category}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {items.map(({ name, level }) => (
                    <SkillTag key={name} name={name} meta={LEVEL_META[level]} />
                  ))}
                </div>
              </SkillCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section
        id="projects"
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          background: "#1a1a1a",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
          <div className="reveal" style={{ marginBottom: "72px" }}>
            <Eyebrow label="Selected Work" />
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#ffffc7",
                lineHeight: 1.05,
              }}
            >
              Projects &{" "}
              <em style={{ color: "#548687", fontStyle: "italic" }}>Growth</em>
            </h2>
          </div>

          <ProjectsGlow>
            {PROJECTS.map((project, i) => {
              const isActive = openProject === i;
              const detailsId = `project-details-${project.num}`;
              return (
                <div
                  key={project.num}
                  className="reveal project-card"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,199,0.08)",
                      borderLeft: isActive
                        ? `2px solid ${project.accent}`
                        : "2px solid transparent",
                      padding: "44px 0",
                      paddingLeft: isActive ? "24px" : "0",
                      transition:
                        "padding-left 0.3s ease, border-left-color 0.3s ease",
                    }}
                  >
                    <div
                      data-index={i}
                      className="project-row project-toggle"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isActive}
                      aria-controls={detailsId}
                      onClick={(e) => toggleProject(i, e)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleProject(i, e);
                        }
                      }}
                      style={
                        {
                          display: "grid",
                          gridTemplateColumns: isMobile
                            ? "48px 1fr 40px"
                            : "clamp(64px, 9vw, 108px) 1fr 50px",
                          gap: isMobile ? "16px" : "28px",
                          alignItems: "center",
                          cursor: "pointer",
                          "--accent": project.accent,
                        } as React.CSSProperties
                      }
                    >
                      <span
                        className="project-num p-num"
                        aria-hidden="true"
                        style={{
                          fontSize: isMobile
                            ? "32px"
                            : "clamp(40px, 5vw, 56px)",
                          fontWeight: 700,
                          fontStyle: "italic",
                          lineHeight: 1,
                        }}
                      >
                        {project.num}
                      </span>

                      <div>
                        <span
                          style={{
                            color: "rgba(255,255,199,0.4)",
                            fontSize: "10px",
                            letterSpacing: "2.5px",
                            textTransform: "uppercase",
                            display: "block",
                            marginBottom: "8px",
                          }}
                        >
                          {project.subtitle}
                        </span>
                        <h3
                          style={{
                            fontSize: "clamp(20px, 3vw, 34px)",
                            fontWeight: 700,
                            color: "#ffffc7",
                            lineHeight: 1.2,
                            marginBottom: "14px",
                          }}
                        >
                          {project.title}
                        </h3>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                          }}
                        >
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="ui-text"
                              style={{
                                padding: "3px 10px",
                                fontSize: "10px",
                                letterSpacing: "1px",
                                textTransform: "uppercase",
                                border: `1px solid ${project.accent}55`,
                                background: `${project.accent}0d`,
                                color: project.accent,
                              }}
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        className="project-plus"
                        aria-hidden="true"
                        style={{
                          width: "42px",
                          height: "42px",
                          flexShrink: 0,
                          border: `1px solid rgba(255,255,199,${isActive ? "0" : "0.15"})`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffc7",
                          transform: isActive ? "rotate(45deg)" : "",
                          background: isActive ? "#b0413e" : "transparent",
                          transition:
                            "transform 0.3s ease, background 0.3s ease, border-color 0.25s ease",
                        }}
                      >
                        <Plus size={18} strokeWidth={1.5} />
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          key="details"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.45,
                            ease: E,
                          }}
                          style={{ overflow: "hidden" }}
                        >
                          <div style={{ height: "32px" }} />
                          <div
                            id={detailsId}
                            role="region"
                            aria-label={project.title}
                            style={{
                              position: "relative",
                              paddingTop: "32px",
                              borderTop: "1px solid rgba(255,255,199,0.06)",
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(260px, 1fr))",
                              gap: "48px",
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  letterSpacing: "2.5px",
                                  textTransform: "uppercase",
                                  color: "#548687",
                                  marginBottom: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                About this project
                              </div>
                              <p
                                style={{
                                  color: "rgba(255,255,199,0.65)",
                                  fontSize: "17px",
                                  lineHeight: 1.85,
                                }}
                              >
                                {project.description}
                              </p>
                            </div>
                            <div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  letterSpacing: "2.5px",
                                  textTransform: "uppercase",
                                  color: "#b0413e",
                                  marginBottom: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                What I learned
                              </div>
                              <p
                                style={{
                                  color: "rgba(255,255,199,0.65)",
                                  fontSize: "17px",
                                  lineHeight: 1.85,
                                }}
                              >
                                {project.learnings}
                              </p>
                            </div>
                            {/* Bottom-right corner: source link or closed-
                                source badge. Absolute on desktop so it adds
                                no extra height; in-flow on mobile where the
                                single column would otherwise overlap it. */}
                            <div
                              style={
                                isMobile
                                  ? {
                                      display: "flex",
                                      justifyContent: "flex-end",
                                    }
                                  : {
                                      position: "absolute",
                                      right: 0,
                                      bottom: 0,
                                    }
                              }
                            >
                              {project.github ? (
                                <Rippleable
                                  as="a"
                                  href={project.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  rippleColor="rgba(255,255,199,0.12)"
                                  aria-label={`${project.title} on GitHub (opens in a new tab)`}
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 26px",
                                    border: `1px solid ${project.accent}66`,
                                    background: "#1a1a1a",
                                    color: "#ffffc7",
                                    textDecoration: "none",
                                    fontSize: "11px",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                    transition:
                                      "border-color 0.2s ease, transform 0.2s ease",
                                  }}
                                  onMouseEnter={(
                                    e: React.MouseEvent<HTMLAnchorElement>,
                                  ) => {
                                    e.currentTarget.style.borderColor =
                                      project.accent;
                                    e.currentTarget.style.transform =
                                      "translateY(-2px)";
                                  }}
                                  onMouseLeave={(
                                    e: React.MouseEvent<HTMLAnchorElement>,
                                  ) => {
                                    e.currentTarget.style.borderColor = `${project.accent}66`;
                                    e.currentTarget.style.transform = "";
                                  }}
                                >
                                  <span
                                    style={{
                                      position: "relative",
                                      zIndex: 1,
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <svg
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      aria-hidden="true"
                                    >
                                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                    View on GitHub
                                  </span>
                                </Rippleable>
                              ) : (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 26px",
                                    border: "1px dashed rgba(255,255,199,0.25)",
                                    background: "#1a1a1a",
                                    color: "rgba(255,255,199,0.45)",
                                    fontSize: "11px",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    fontWeight: 700,
                                    cursor: "default",
                                  }}
                                >
                                  <Lock size={14} aria-hidden="true" />
                                  Closed Source
                                </span>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </ProjectsGlow>

          <div style={{ borderTop: "1px solid rgba(255,255,199,0.08)" }} />
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="grain"
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          background: "linear-gradient(165deg, #578b8c 0%, #4d7c7d 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "-60px",
            bottom: "-80px",
            fontSize: "clamp(240px, 35vw, 500px)",
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-16px",
            userSelect: "none",
            pointerEvents: "none",
            fontStyle: "italic",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              color: "#ffffc7",
              filter: "url(#kh-outline)",
            }}
          >
            KH
          </span>
          <span
            style={{ position: "relative", color: "rgba(255,255,199,0.05)" }}
          >
            KH
          </span>
        </div>

        <div
          style={{
            maxWidth: "1140px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div className="reveal" style={{ maxWidth: "560px" }}>
            <Eyebrow label="Contact" color="rgba(255,255,199,0.7)" />
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#ffffc7",
                lineHeight: 1.05,
                marginBottom: "24px",
              }}
            >
              Let&apos;s build
              <br />
              something
              <br />
              <em style={{ color: "#b0413e", fontStyle: "italic" }}>
                together.
              </em>
            </h2>
            <p
              style={{
                color: "rgba(255,255,199,0.72)",
                fontSize: "17px",
                lineHeight: 1.85,
                marginBottom: "52px",
              }}
            >
              Open to new opportunities, collaborations, and interesting
              projects. Don&apos;t hesitate to reach out.
            </p>
            <Rippleable
              as="a"
              href="https://www.linkedin.com/in/kieran-van-der-heijden-320166297/"
              target="_blank"
              rel="noopener noreferrer"
              rippleColor="rgba(255,255,199,0.2)"
              aria-label="LinkedIn (opens in a new tab)"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "16px 40px",
                background: "#b0413e",
                color: "#ffffc7",
                textDecoration: "none",
                fontSize: "11px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontWeight: 700,
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(176,65,62,0.5)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <span
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </span>
            </Rippleable>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "24px clamp(32px, 7vw, 96px)",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,199,0.06)",
        }}
      >
        <span
          style={{
            color: "#ffffc7",
            fontWeight: 900,
            fontSize: "22px",
            fontStyle: "italic",
          }}
        >
          KH
        </span>
        <span
          style={{
            color: "rgba(255,255,199,0.25)",
            fontSize: "11px",
            letterSpacing: "1.5px",
          }}
        >
          2026 Portfolio
        </span>
      </footer>
    </main>
  );
}
