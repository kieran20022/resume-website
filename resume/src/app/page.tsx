"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Dumbbell,
  Gamepad2,
  Globe,
  Mail,
  MapPin,
  Plus,
} from "lucide-react";

// Shared easing for all welcome animations
const E = [0.25, 0.46, 0.45, 0.94] as const;


const NAV_LINKS = ["About", "Skills", "Projects", "Contact"];

const SKILLS = {
  Languages: ["Python", "JavaScript", "C#", "Java"],
  Frameworks: ["React", "Flask", "ASP.Net"],
  Tools: ["Adobe Photoshop", "Docker", "Git", "GCP"],
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
      "Currently studying Computer Science with a focus on full stack development. Every project, every course, and every late debugging session has sharpened both the skill set and the drive to build things that matter.",
    highlight: "Currently enrolled — full stack development",
    accent: "#548687",
  },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
      {/* ── NAV ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, delay: 0.25, ease: E }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: scrolled ? "14px 56px" : "28px 56px",
          background: scrolled ? "rgba(84,134,135,0.96)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "padding 0.35s ease, background 0.35s ease",
          borderBottom: scrolled ? "1px solid rgba(255,255,199,0.12)" : "none",
        }}
      >
        <span
          style={{
            fontSize: "26px",
            fontWeight: 900,
            color: "#ffffc7",
            letterSpacing: "-1px",
            fontStyle: "italic",
          }}
        >
          KH
        </span>
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
      </motion.nav>

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
          initial={{ x: "-30vw", opacity: 1 }}
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
            initial={{ x: -64, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.65, delay: 0.4, ease: E }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "36px",
            }}
          >
            <div
              style={{ width: "44px", height: "1.5px", background: "#b0413e" }}
            />
            <span
              style={{
                color: "#b0413e",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Portfolio · 2026
            </span>
          </motion.div>

          {/* Display headline */}
          <motion.h1
            initial={{ x: -90, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55, ease: E }}
            style={{
              fontSize: "clamp(52px, 9vw, 116px)",
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
            initial={{ x: -70, opacity: 0 }}
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
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85, ease: E }}
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="#projects"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 28px rgba(176,65,62,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              View Work{" "}
              <ArrowRight
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginLeft: "6px",
                }}
              />
            </a>
            <a
              href="#contact"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#ffffc7";
                e.currentTarget.style.background = "rgba(255,255,199,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,199,0.35)";
                e.currentTarget.style.background = "";
              }}
            >
              Get in Touch
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "1.5px",
                  background: "#b0413e",
                }}
              />
              <span
                style={{
                  color: "#b0413e",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Background
              </span>
            </div>
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
              key={i}
              className="reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "32px",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "3px",
                    background: "#548687",
                  }}
                />
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
                  Interests
                </h4>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "32px",
                }}
              >
                {/* Gym */}
                <div
                  style={{
                    padding: "24px",
                    border: "1px solid rgba(176,65,62,0.2)",
                    background: "rgba(176,65,62,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <Dumbbell size={16} color="#b0413e" />
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
                </div>
                {/* Gaming */}
                <div
                  style={{
                    padding: "24px",
                    border: "1px solid rgba(84,134,135,0.2)",
                    background: "rgba(84,134,135,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "12px",
                    }}
                  >
                    <Gamepad2 size={16} color="#548687" />
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
                </div>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "3px",
                      background: "#b0413e",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Globe size={13} color="#548687" />
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
                      Languages
                    </h4>
                  </div>
                </div>
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
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "28px",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "3px",
                      background: "#548687",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <MapPin size={13} color="#548687" />
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
                      Location
                    </h4>
                  </div>
                </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "1.5px",
                  background: "#b0413e",
                }}
              />
              <span
                style={{
                  color: "#b0413e",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Expertise
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.05,
              }}
            >
              Skills & <span style={{ color: "#548687" }}>Technologies</span>
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "56px",
            }}
          >
            {Object.entries(SKILLS).map(([category, items], i) => (
              <div
                key={category}
                className="reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "3px",
                    marginBottom: "18px",
                    background: i === 1 ? "#b0413e" : "#548687",
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
                  {items.map((skill) => (
                    <span
                      key={skill}
                      className="ui-text"
                      style={{
                        padding: "7px 14px",
                        fontSize: "13px",
                        fontWeight: 500,
                        border: "1px solid rgba(84,134,135,0.28)",
                        color: "#1a1a1a",
                        transition: "all 0.22s ease",
                        cursor: "default",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#548687";
                        e.currentTarget.style.color = "#ffffc7";
                        e.currentTarget.style.borderColor = "#548687";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "";
                        e.currentTarget.style.color = "#1a1a1a";
                        e.currentTarget.style.borderColor =
                          "rgba(84,134,135,0.28)";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "1.5px",
                  background: "#b0413e",
                }}
              />
              <span
                style={{
                  color: "#b0413e",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Selected Work
              </span>
            </div>
            <h2
              style={{
                fontSize: "clamp(38px, 5.5vw, 72px)",
                fontWeight: 700,
                color: "#ffffc7",
                lineHeight: 1.05,
              }}
            >
              Projects & <span style={{ color: "#548687" }}>Growth</span>
            </h2>
          </div>

          {PROJECTS.map((project, i) => (
            <div
              key={project.num}
              className="reveal"
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,199,0.08)",
                  padding: "44px 0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "clamp(64px, 9vw, 108px) 1fr 50px",
                    gap: "28px",
                    alignItems: "center",
                    cursor: "pointer",
                    paddingLeft: activeProject === i ? "20px" : "0",
                    transition: "padding-left 0.3s ease",
                  }}
                  onClick={() =>
                    setActiveProject(activeProject === i ? null : i)
                  }
                >
                  <span
                    style={{
                      fontSize: "clamp(40px, 5vw, 56px)",
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: project.accent,
                      opacity: 0.6,
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
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
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
                            color: project.accent,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      flexShrink: 0,
                      border: `1px solid rgba(255,255,199,${activeProject === i ? "0" : "0.15"})`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffc7",
                      transition:
                        "transform 0.3s, background 0.3s, border-color 0.3s",
                      transform: activeProject === i ? "rotate(45deg)" : "",
                      background:
                        activeProject === i ? "#b0413e" : "transparent",
                    }}
                  >
                    <Plus size={18} strokeWidth={1.5} />
                  </div>
                </div>

                {activeProject === i && (
                  <div
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
                          fontSize: "10px",
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
                          fontSize: "16px",
                          lineHeight: 1.85,
                        }}
                      >
                        {project.description}
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "10px",
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
                          fontSize: "16px",
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
          ))}

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "1.5px",
                  background: "rgba(255,255,199,0.7)",
                }}
              />
              <span
                style={{
                  color: "rgba(255,255,199,0.7)",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                Contact
              </span>
            </div>
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
            <a
              href="mailto:hello@kh.dev"
              style={{
                display: "inline-block",
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
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 32px rgba(176,65,62,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <Mail
                size={14}
                style={{
                  display: "inline",
                  verticalAlign: "middle",
                  marginRight: "8px",
                }}
              />
              Say Hello
            </a>
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
          © 2025 — All Rights Reserved
        </span>
      </footer>
    </main>
  );
}
