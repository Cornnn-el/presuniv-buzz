import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate("/hub");
        }
    };

    return (
        <div style={{
            minHeight: "100vh", background: "#05070f",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Syne', 'DM Sans', sans-serif", position: "relative", overflow: "hidden",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        .lgi { width:100%; background:rgba(255,255,255,0.04); border:1px solid rgba(96,165,250,0.15);
          border-radius:10px; padding:12px 16px; color:#e2e8f0; font-size:14px; outline:none;
          transition:border-color .2s,box-shadow .2s; box-sizing:border-box;
          font-family:'DM Sans',sans-serif; }
        .lgi:focus { border-color:rgba(96,165,250,0.5); box-shadow:0 0 0 3px rgba(96,165,250,0.08); }
        .lgi::placeholder { color:#1e293b; }
      `}</style>

            {/* ambient orbs */}
            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle,rgba(37,99,235,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-5%", right: "-5%", width: 350, height: 350, background: "radial-gradient(circle,rgba(79,70,229,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

            {/* grid */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.025, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
                <defs><pattern id="g" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#60a5fa" strokeWidth="0.8" /></pattern></defs>
                <rect width="100%" height="100%" fill="url(#g)" />
            </svg>

            <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 480, padding: "0 24px", animation: "fadeUp .7s ease both" }}>

                {/* back link */}
                <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#334155", fontSize: 13, textDecoration: "none", marginBottom: 28, fontFamily: "'DM Sans',sans-serif" }}>
                    ← Back to home
                </Link>

                <div style={{
                    background: "rgba(255,255,255,0.025)", border: "1px solid rgba(96,165,250,0.1)",
                    borderRadius: 20, padding: "44px 40px",
                }}>
                    {/* logo */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 9, background: "linear-gradient(135deg,#2563eb,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 13 }}>PU</div>
                        <div>
                            <div style={{ color: "#e2e8f0", fontWeight: 700, fontSize: 14, letterSpacing: ".02em" }}>President University</div>
                            <div style={{ color: "#1e293b", fontSize: 10, letterSpacing: ".06em", textTransform: "uppercase" }}>Synapse Hub</div>
                        </div>
                    </div>

                    <h2 style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em" }}>Welcome back</h2>
                    <p style={{ color: "#334155", fontSize: 14, margin: "0 0 32px", fontFamily: "'DM Sans',sans-serif", fontWeight: 300 }}>
                        Sign in to access the announcements hub
                    </p>

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>
                                Email
                            </label>
                            <input className="lgi" type="email" placeholder="you@president.ac.id"
                                value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <label style={{ display: "block", color: "#475569", fontSize: 12, fontWeight: 600, marginBottom: 8, letterSpacing: ".05em", textTransform: "uppercase" }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input className="lgi" type={showPass ? "text" : "password"}
                                    placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    style={{ paddingRight: 44 }} required />
                                <button type="button" onClick={() => setShowPass(v => !v)} style={{
                                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                                    background: "none", border: "none", color: "#334155", cursor: "pointer", fontSize: 16,
                                }}>
                                    {showPass ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div style={{
                                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                                borderRadius: 8, padding: "11px 14px", color: "#fca5a5", fontSize: 13,
                                fontFamily: "'DM Sans',sans-serif",
                            }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{
                            background: loading ? "rgba(37,99,235,0.4)" : "linear-gradient(135deg,#2563eb,#4f46e5)",
                            border: "none", borderRadius: 10, padding: 14, color: "#fff",
                            fontWeight: 700, fontSize: 15, cursor: loading ? "default" : "pointer",
                            fontFamily: "'Syne',sans-serif", letterSpacing: ".02em", marginTop: 4,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                            transition: "opacity .2s",
                        }}>
                            {loading
                                ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Signing in...</>
                                : "Sign in →"
                            }
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ margin: "24px 0", borderTop: "1px solid rgba(96,165,250,0.08)" }} />

                    {/* Sign up link */}
                    <p style={{ textAlign: "center", color: "#334155", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>
                        Don't have an account?{" "}
                        <Link to="/signup" style={{ color: "#60a5fa", textDecoration: "none", fontWeight: 600 }}>
                            Sign up
                        </Link>
                    </p>
                </div>

                <p style={{ textAlign: "center", color: "#1e293b", fontSize: 12, marginTop: 20, fontFamily: "'DM Sans',sans-serif" }}>
                    © 2026 Synapse · President University
                </p>
            </div>
        </div>
    );
}
