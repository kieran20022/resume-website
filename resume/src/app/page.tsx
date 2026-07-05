"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  Globe,
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
  },
  {
    num: "05",
    title: "New York Taxi Prediction",
    subtitle: "Minor Project — Data Science",
    tech: ["Python", "Pandas", "Matplotlib", "Scikit-learn"],
    description:
      "A data science project analyzing a dataset of New York City taxi trips to predict trip durations based on various features. The project involved data cleaning, exploratory analysis, feature engineering, and building models with linear regression, XGBoost and Prophet.",
    learnings:
      "The first step into Data Science — data cleaning, feature engineering, and the basics of predictive modeling. A great reminder that raw data is messy and insights come from the work put into understanding it.",
    accent: "#b0413e",
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
   Page
   ──────────────────────────────────────────────────────────────── */

export default function Home() {
  const prefersReducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);
  const [cursorOffsetX, setCursorOffsetX] = useState(0);
  const [cursorOffsetY, setCursorOffsetY] = useState(0);
  const [cursorClicking, setCursorClicking] = useState(false);
  const [cursorFading, setCursorFading] = useState(false);
  const [projectRipple, setProjectRipple] = useState(false);
  const firstProjectRef = useRef<HTMLDivElement>(null);
  const projectsTriggered = useRef(false);
  const cursorTrackingRef = useRef(false);

  // Helper: skip entrance offsets when the visitor prefers reduced motion
  const entrance = useCallback(
    (initial: Record<string, number | string>) =>
      prefersReducedMotion ? false : initial,
    [prefersReducedMotion],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
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

  // Scripted "ghost cursor" demo that opens the first project.
  // Skipped for reduced-motion users and touch devices (no cursor there).
  useEffect(() => {
    if (prefersReducedMotion) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const section = document.getElementById("projects");
    if (!section) return;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !projectsTriggered.current) {
          projectsTriggered.current = true;
          const t0 = setTimeout(() => {
            if (!firstProjectRef.current) return;
            const rect = firstProjectRef.current.getBoundingClientRect();
            setCursorX(rect.right - 25);
            setCursorY(rect.top + rect.height / 2);
            setCursorOffsetX(55);
            setCursorOffsetY(45);
            setCursorVisible(true);
            cursorTrackingRef.current = true;
            const t1 = setTimeout(() => {
              setCursorOffsetX(0);
              setCursorOffsetY(0);
            }, 60);
            const t2 = setTimeout(() => {
              cursorTrackingRef.current = false;
              setCursorClicking(true);
              setProjectRipple(true);
            }, 660);
            const t3 = setTimeout(() => {
              setActiveProject(0);
            }, 800);
            const t4 = setTimeout(() => {
              setCursorClicking(false);
            }, 950);
            const t5 = setTimeout(() => {
              setCursorFading(true);
            }, 1100);
            const t6 = setTimeout(() => {
              setCursorVisible(false);
              setCursorFading(false);
            }, 1550);
            timeouts.push(t1, t2, t3, t4, t5, t6);
          }, 400);
          timeouts.push(t0);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(section);
    return () => {
      io.disconnect();
      timeouts.forEach(clearTimeout);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!cursorVisible) return;
    const onScroll = () => {
      if (!cursorTrackingRef.current || !firstProjectRef.current) return;
      const rect = firstProjectRef.current.getBoundingClientRect();
      setCursorX(rect.right - 25);
      setCursorY(rect.top + rect.height / 2);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [cursorVisible]);

  const toggleProject = (i: number) =>
    setActiveProject((prev) => (prev === i ? null : i));

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
                style={{
                  color: "#ffffc7",
                  textDecoration: "none",
                  fontSize: "11px",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  opacity: 0.75,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
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
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#ffffc7",
                textDecoration: "none",
                fontSize: "36px",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: "-0.5px",
                opacity: 0.9,
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
        style={{
          minHeight: "100vh",
          background: "#548687",
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

        {/* Giant KH lettermark — slides from center, fades to ghost */}
        <motion.div
          aria-hidden="true"
          initial={entrance({ x: "-30vw", opacity: 1 })}
          animate={{ x: 0, opacity: 0.055 }}
          transition={{ duration: 1.1, delay: 0.2, ease: E }}
          style={{
            position: "absolute",
            right: "-40px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "clamp(280px, 38vw, 560px)",
            fontWeight: 900,
            color: "#ffffc7",
            lineHeight: 1,
            letterSpacing: "-16px",
            userSelect: "none",
            pointerEvents: "none",
            fontStyle: "italic",
          }}
        >
          KH
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
            <em style={{ color: "#b0413e", fontStyle: "italic" }}>Builder.</em>
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
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          background: "#ffffc7",
        }}
      >
        <div style={{ maxWidth: "1140px", margin: "0 auto" }}>
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
              const isActive = activeProject === i;
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
                      ref={i === 0 ? firstProjectRef : undefined}
                      className="project-row"
                      role="button"
                      tabIndex={0}
                      aria-expanded={isActive}
                      aria-controls={detailsId}
                      onClick={() => toggleProject(i)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleProject(i);
                        }
                      }}
                      style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                          ? "48px 1fr 40px"
                          : "clamp(64px, 9vw, 108px) 1fr 50px",
                        gap: isMobile ? "16px" : "28px",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <span
                        className="project-num"
                        aria-hidden="true"
                        style={{
                          fontSize: isMobile
                            ? "32px"
                            : "clamp(40px, 5vw, 56px)",
                          fontWeight: 700,
                          fontStyle: "italic",
                          color: project.accent,
                          opacity: isActive ? 1 : 0.55,
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
                        }}
                      >
                        <Plus size={18} strokeWidth={1.5} />
                      </div>
                    </div>

                    {isActive && (
                      <div
                        id={detailsId}
                        role="region"
                        aria-label={project.title}
                        style={{
                          marginTop: "32px",
                          paddingTop: "32px",
                          borderTop: "1px solid rgba(255,255,199,0.06)",
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(260px, 1fr))",
                          gap: "48px",
                          animation: "expandDown 0.35s ease both",
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
                      </div>
                    )}
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
        style={{
          padding: "clamp(80px, 10vw, 130px) clamp(32px, 7vw, 96px)",
          background: "#548687",
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
            color: "rgba(255,255,199,0.05)",
            lineHeight: 1,
            letterSpacing: "-16px",
            userSelect: "none",
            pointerEvents: "none",
            fontStyle: "italic",
          }}
        >
          KH
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

      {/* ── GHOST CURSOR (demo) ── */}
      {cursorVisible && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: cursorX,
            top: cursorY,
            pointerEvents: "none",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              transform: `translate(${cursorOffsetX}px, ${cursorOffsetY}px)`,
              transition:
                "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.4s ease",
              opacity: cursorFading ? 0 : 1,
            }}
          >
            <div
              style={{
                transform: `translate(-50%, -50%) scale(${cursorClicking ? 0.65 : 1})`,
                transition: "transform 0.13s ease, background 0.13s ease",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: "1.5px solid rgba(255,255,199,0.8)",
                background: cursorClicking
                  ? "rgba(255,255,199,0.22)"
                  : "rgba(255,255,199,0.06)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "4px",
                  height: "4px",
                  borderRadius: "50%",
                  background: "rgba(255,255,199,0.9)",
                }}
              />
            </div>
          </div>
        </div>
      )}
      {projectRipple && (
        <div
          aria-hidden="true"
          style={{
            position: "fixed",
            left: cursorX - 20,
            top: cursorY - 20,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,199,0.4)",
            pointerEvents: "none",
            zIndex: 9998,
            animation: "rippleOut 0.7s ease forwards",
          }}
          onAnimationEnd={() => setProjectRipple(false)}
        />
      )}
    </main>
  );
}
