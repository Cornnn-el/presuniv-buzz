import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import logoPU from "@/assets/PU_Logo.png";

/* ── tiny hook: viewport-enter animation trigger ── */
function useReveal() {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return { ref, visible };
}

/* ── animated counter ── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);
    const { ref, visible } = useReveal();
    useEffect(() => {
        if (!visible) return;
        let start = 0;
        const step = Math.ceil(target / 60);
        const t = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(t); }
            else setCount(start);
        }, 16);
        return () => clearInterval(t);
    }, [visible, target]);
    return <span ref={ref}>{count}{suffix}</span>;
}

/* ── grid background svg ── */
const GridBg = () => (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.035, pointerEvents: "none" }}
        xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#60a5fa" strokeWidth="0.8" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);

/* ── category pill ── */
const Pill = ({ label, color, bg }: { label: string; color: string; bg: string }) => (
    <span style={{
        background: bg, color, border: `1px solid ${color}30`,
        borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600,
        letterSpacing: "0.04em",
    }}>{label}</span>
);

/* ══════════════════════════════════════════════════
   LANDING PAGE
══════════════════════════════════════════════════ */
export default function Landing() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    /* redirect already-logged-in users straight to /hub */
    // useEffect(() => {
    //     supabase.auth.getSession().then(({ data }) => {
    //         if (data.session) navigate("/hub", { replace: true });
    //     });
    // }, [navigate]);

    useEffect(() => {
        const fn = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", fn);
        return () => window.removeEventListener("scroll", fn);
    }, []);

    const feat1 = useReveal();
    const feat2 = useReveal();
    const statsRow = useReveal();
    const cta = useReveal();

    const features = [
        { icon: "🤝", label: "Organization", desc: "Official university organization and association announcements.", color: "#547db6", bg: "rgba(148,163,184,0.08)" },
        { icon: "🏆", label: "Contests", desc: "Competitions, hackathons and awards open to all students.", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
        { icon: "🎓", label: "Academic", desc: "Course updates, exam schedules and faculty announcements.", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
        { icon: "💼", label: "Career", desc: "Internships, job fairs and professional development opportunities.", color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
        { icon: "📅", label: "Events", desc: "Workshops, seminars and campus life activities.", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
        { icon: "🎯", label: "Scholarships", desc: "Funding opportunities, grants and financial aid programs.", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
        { icon: "🔑", label: "Admin", desc: "Official university notices, policy updates and announcements.", color: "#94a3b8", bg: "rgba(148,163,184,0.08)" },
    ];

    return (
        <div style={{ background: "#05070f", minHeight: "100vh", fontFamily: "'Syne', 'DM Sans', sans-serif", overflowX: "hidden" }}>

            {/* Google fonts */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp   { from { opacity:0; transform:translateY(32px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes shimmer  { 0%,100% { opacity:.5 } 50% { opacity:1 } }
        @keyframes floatY   { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-18px) } }
        @keyframes rotateSlow { to { transform:rotate(360deg) } }
        @keyframes pulse2   { 0%,100%{opacity:.6} 50%{opacity:1} }

        .nav-link {
          color: #64748b; font-size: 14px; text-decoration: none; font-weight: 500;
          transition: color .2s; letter-spacing: .02em;
        }
        .nav-link:hover { color: #e2e8f0; }

        .btn-primary {
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          border: none; border-radius: 10px; padding: 13px 28px;
          color: #fff; font-weight: 700; font-size: 15px; cursor: pointer;
          font-family: 'Syne', sans-serif; letter-spacing: .02em;
          transition: opacity .2s, transform .15s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { opacity: .88; transform: translateY(-1px); }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          padding: 12px 28px; color: #94a3b8; font-weight: 500;
          font-size: 15px; cursor: pointer; font-family: 'Syne', sans-serif;
          transition: border-color .2s, color .2s, transform .15s;
          text-decoration: none; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-ghost:hover { border-color: rgba(96,165,250,.4); color: #e2e8f0; transform: translateY(-1px); }

        .feat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 28px 24px;
          transition: border-color .25s, background .25s, transform .25s;
          cursor: default;
        }
        .feat-card:hover {
          border-color: rgba(96,165,250,0.25);
          background: rgba(96,165,250,0.04);
          transform: translateY(-4px);
        }

        .reveal { opacity:0; transform:translateY(28px); transition: opacity .6s ease, transform .6s ease; }
        .reveal.on { opacity:1; transform:translateY(0); }

        .glow-line {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(96,165,250,0.4), transparent);
        }
      `}</style>

            {/* ── HEADER ───────────────────────────────────── */}
            <header style={{
                position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
                background: scrolled ? "rgba(5,7,15,0.9)" : "transparent",
                backdropFilter: scrolled ? "blur(16px)" : "none",
                borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "1px solid transparent",
                transition: "all .3s",
            }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", height: 68, gap: 32 }}>

                    {/* Logo */}
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 10,
                            background: "linear-gradient(135deg,#2563eb,#4f46e5)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 800, color: "#fff", fontSize: 14, fontFamily: "'Syne', sans-serif",
                            letterSpacing: ".04em",
                        }}>
                            <img
                                src={logoPU}
                                alt="President University Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <div>
                            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, fontFamily: "'Syne', sans-serif", letterSpacing: ".02em" }}>
                                President University
                            </div>
                            <div style={{ color: "#374151", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>
                                Announcements Hub
                            </div>
                        </div>
                    </Link>

                    {/* Nav */}
                    <nav style={{ display: "flex", gap: 28, marginLeft: 24 }}>
                        <a href="#features" className="nav-link">Features</a>
                        <a href="#categories" className="nav-link">Categories</a>
                        <a href="#about" className="nav-link">About</a>
                    </nav>

                    {/* CTA */}
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                        <Link to="/login" className="btn-ghost" style={{ padding: "9px 22px", fontSize: 14 }}>
                            Sign in
                        </Link>
                        <Link to="/login" className="btn-primary" style={{ padding: "9px 22px", fontSize: 14 }}>
                            Get started →
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── HERO ─────────────────────────────────────── */}
            <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <GridBg />

                {/* ambient orbs */}
                <div style={{ position: "absolute", top: "15%", left: "10%", width: 520, height: 520, background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)", pointerEvents: "none", animation: "floatY 9s ease-in-out infinite" }} />
                <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 400, height: 400, background: "radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%)", pointerEvents: "none", animation: "floatY 12s ease-in-out infinite reverse" }} />
                <div style={{ position: "absolute", top: "40%", right: "20%", width: 200, height: 200, background: "radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

                {/* rotating ring */}
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 700, height: 700,
                    border: "1px solid rgba(96,165,250,0.04)",
                    borderRadius: "50%", animation: "rotateSlow 40s linear infinite",
                    pointerEvents: "none",
                }} />
                <div style={{
                    position: "absolute", top: "50%", left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 900, height: 900,
                    border: "1px solid rgba(96,165,250,0.025)",
                    borderRadius: "50%", animation: "rotateSlow 60s linear infinite reverse",
                    pointerEvents: "none",
                }} />

                <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: 800, padding: "0 32px", animation: "fadeUp .9s ease both" }}>
                    {/* eyebrow */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)",
                        borderRadius: 20, padding: "6px 16px", marginBottom: 28,
                        animation: "fadeIn .6s .2s ease both", opacity: 0,
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3b82f6", animation: "shimmer 2s infinite" }} />
                        <span style={{ color: "#60a5fa", fontSize: 12, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" }}>
                            President University · Cikarang
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 800,
                        lineHeight: 1.08, letterSpacing: "-0.03em",
                        fontFamily: "'Syne', sans-serif",
                        animation: "fadeUp .7s .3s ease both", opacity: 0,
                    }}>
                        <span style={{ color: "#f1f5f9" }}>Everything campus.</span>
                        <br />
                        <span style={{ background: "linear-gradient(90deg,#3b82f6,#818cf8,#6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                            One place.
                        </span>
                    </h1>

                    <p style={{
                        color: "#475569", fontSize: 18, lineHeight: 1.75, marginTop: 24, marginBottom: 40,
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                        animation: "fadeUp .7s .5s ease both", opacity: 0,
                    }}>
                        Stay ahead of every announcement, deadline, and opportunity
                        <br />at President University — in real time.
                    </p>

                    <div style={{
                        display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
                        animation: "fadeUp .7s .7s ease both", opacity: 0,
                    }}>
                        <Link to="/login" className="btn-primary" style={{ fontSize: 16, padding: "15px 34px" }}>
                            Enter the Hub →
                        </Link>
                        <a href="#features" className="btn-ghost" style={{ fontSize: 16, padding: "15px 34px" }}>
                            Learn more
                        </a>
                    </div>

                    {/* pill tags */}
                    <div style={{
                        display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginTop: 36,
                        animation: "fadeUp .7s .9s ease both", opacity: 0,
                    }}>
                        {[
                            { label: "Events", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
                            { label: "Contests", color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
                            { label: "Scholarships", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
                            { label: "Career", color: "#c084fc", bg: "rgba(192,132,252,0.08)" },
                            { label: "Academic", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
                            { label: "Admin", color: "#94a3b8", bg: "rgba(148,163,184,0.08)" },
                        ].map(p => <Pill key={p.label} {...p} />)}
                    </div>
                </div>

                {/* scroll cue */}
                <div style={{
                    position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                    animation: "pulse2 2s infinite",
                }}>
                    <span style={{ color: "#1e293b", fontSize: 11, letterSpacing: ".1em", textTransform: "uppercase" }}>Scroll</span>
                    <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, #1e293b, transparent)" }} />
                </div>
            </section>

            <div className="glow-line" />

            {/* ── STATS ────────────────────────────────────── */}
            <section style={{ padding: "80px 32px" }}>
                <div
                    ref={statsRow.ref}
                    className={`reveal${statsRow.visible ? " on" : ""}`}
                    style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2 }}
                >
                    {[
                        { n: 30, s: "+", label: "Announcements per month" },
                        { n: 7, s: "", label: "Content categories" },
                        { n: 3, s: "k+", label: "Students reached" },
                        { n: 100, s: "%", label: "Free to access" },
                    ].map(({ n, s, label }, i) => (
                        <div key={label} style={{
                            textAlign: "center", padding: "32px 24px",
                            borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.05)",
                        }}>
                            <div style={{ fontSize: 48, fontWeight: 800, color: "#f1f5f9", fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em", lineHeight: 1 }}>
                                <Counter target={n} suffix={s} />
                            </div>
                            <div style={{ color: "#334155", fontSize: 13, marginTop: 8, fontFamily: "'DM Sans', sans-serif" }}>{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="glow-line" />

            {/* ── FEATURES ─────────────────────────────────── */}
            <section id="features" style={{ padding: "100px 32px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>

                    <div
                        ref={feat1.ref}
                        className={`reveal${feat1.visible ? " on" : ""}`}
                        style={{ textAlign: "center", marginBottom: 64 }}
                    >
                        <span style={{ color: "#3b82f6", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>
                            Why Synapse
                        </span>
                        <h2 style={{ color: "#f1f5f9", fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, fontFamily: "'Syne', sans-serif", marginTop: 12, letterSpacing: "-0.02em" }}>
                            Built for campus life
                        </h2>
                        <p style={{ color: "#475569", fontSize: 16, marginTop: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                            One dashboard to track every event, deadline, and opportunity that matters.
                        </p>
                    </div>

                    {/* 3-column feature highlight */}
                    <div
                        ref={feat2.ref}
                        className={`reveal${feat2.visible ? " on" : ""}`}
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, marginBottom: 20 }}
                    >
                        {[
                            { icon: "⚡", title: "Real-time updates", desc: "Announcements go live the moment they're published. No more missing critical notices.", accent: "#3b82f6" },
                            { icon: "🔔", title: "Deadline alerts", desc: "Smart badge system highlights items closing within 7 days so nothing slips past.", accent: "#f87171" },
                            { icon: "📆", title: "Calendar view", desc: "See all events, start dates and deadlines laid out on a monthly calendar at a glance.", accent: "#34d399" },
                        ].map(({ icon, title, desc, accent }) => (
                            <div key={title} className="feat-card">
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 18 }}>
                                    {icon}
                                </div>
                                <h3 style={{ color: "#e2e8f0", fontSize: 17, fontWeight: 700, fontFamily: "'Syne', sans-serif", marginBottom: 10 }}>{title}</h3>
                                <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CATEGORIES ───────────────────────────────── */}
            <section id="categories" style={{ padding: "80px 32px", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ textAlign: "center", marginBottom: 56 }}>
                        <span style={{ color: "#3b82f6", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" }}>Content</span>
                        <h2 style={{ color: "#f1f5f9", fontSize: "clamp(26px,4vw,40px)", fontWeight: 800, fontFamily: "'Syne', sans-serif", marginTop: 12, letterSpacing: "-0.02em" }}>
                            Six categories, zero noise
                        </h2>
                    </div>

                    {/* First 6 categories in grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                        {features.slice(0, 6).map(({ icon, label, desc, color, bg }) => (
                            <div key={label} className="feat-card" style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                                    {icon}
                                </div>
                                <div>
                                    <div style={{ color, fontSize: 13, fontWeight: 700, letterSpacing: ".04em", marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
                                    <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Admin card centered below */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
                        {(() => {
                            const { icon, label, desc, color, bg } = features[6];
                            return (
                                <div className="feat-card" style={{ display: "flex", gap: 18, alignItems: "flex-start", width: "calc(33.33% - 11px)", minWidth: 300 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
                                        {icon}
                                    </div>
                                    <div>
                                        <div style={{ color, fontSize: 13, fontWeight: 700, letterSpacing: ".04em", marginBottom: 5, textTransform: "uppercase" }}>{label}</div>
                                        <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            </section>

            <div className="glow-line" />

            {/* ── CTA BAND ─────────────────────────────────── */}
            <section id="about" style={{ padding: "120px 32px" }}>
                <div
                    ref={cta.ref}
                    className={`reveal${cta.visible ? " on" : ""}`}
                    style={{
                        maxWidth: 1100, margin: "0 auto",
                        background: "rgba(37,99,235,0.05)", border: "1px solid rgba(37,99,235,0.15)",
                        borderRadius: 24, overflow: "hidden", position: "relative",
                        display: "grid", gridTemplateColumns: "1fr 1fr",
                    }}
                >
                    {/* inner glow */}
                    <div style={{ position: "absolute", top: "50%", left: "25%", transform: "translate(-50%,-50%)", width: 500, height: 500, background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

                    {/* LEFT — text content */}
                    <div style={{ padding: "72px 48px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 1 }}>
                        <div style={{ fontSize: 40, marginBottom: 20 }}>🎓</div>
                        <h2 style={{ color: "#f1f5f9", fontSize: "clamp(24px,3vw,38px)", fontWeight: 800, fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em", marginBottom: 16 }}>
                            Ready to stay in the loop?
                        </h2>
                        <p style={{ color: "#475569", fontSize: 15, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: 36 }}>
                            Sign in with your university credentials and get instant access to every announcement, event, and opportunity on campus.
                        </p>
                        <div>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <Link to="/login" className="btn-primary" style={{ fontSize: 15, padding: "14px 36px" }}>
                                    Sign in →
                                </Link>
                                <Link to="/signup" className="btn-ghost" style={{ fontSize: 15, padding: "14px 36px" }}>
                                    Create account
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Google Map */}
                    <div style={{ position: "relative", minHeight: 420 }}>
                        <iframe
                            title="President University Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.5!2d107.1679714!3d-6.2850003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6984caf54df305%3Ab7156354ad963e4d!2sPresident%20University%2C%20Jababeka%20Education%20Park%2C%20Cikarang%2C%20Bekasi!5e0!3m2!1sen!2sid!4v1700000000000"
                            style={{
                                width: "100%", height: "100%",
                                border: "none", display: "block",
                                filter: "invert(90%) hue-rotate(180deg)",  /* dark-mode style map */
                                minHeight: 420,
                            }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                        {/* subtle overlay to blend with card border */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", boxShadow: "inset -1px 0 0 rgba(37,99,235,0.15), inset 0 1px 0 rgba(37,99,235,0.15)" }} />
                    </div>
                </div>
            </section>

            {/* ── FOOTER ───────────────────────────────────── */}
            <footer style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "40px 32px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 7, background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 11 }}>
                            <img
                                src={logoPU}
                                alt="President University Logo"
                                className="h-full w-full object-contain"
                            />
                        </div>
                        <span style={{ color: "#475569", fontSize: 13, fontFamily: "'Syne', sans-serif" }}>
                            © 2026 Synapse · President University
                        </span>
                    </div>
                    <div style={{ display: "flex", gap: 24 }}>
                        <Link to="/login" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}>Sign in</Link>
                        <a href="#features" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}>Features</a>
                        <a href="#categories" style={{ color: "#475569", fontSize: 13, textDecoration: "none" }}>Categories</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
