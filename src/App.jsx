import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── THEME — DreamDo Africa brand colors ─────────────────────────────────────
const BLUE       = "#1a3896";   // primary — from logo
const DARK_BLUE  = "#0f2060";   // darker panel / navbar
const MID_BLUE   = "#2d54c5";   // accent buttons / highlights
const LIGHT_BLUE = "#dce6f9";   // soft backgrounds
const WHITE      = "#ffffff";

// ─── STAFF PASSWORD ───────────────────────────────────────────────────────────
const STAFF_PASSWORD = import.meta.env.PASSWORD;

// ─── FORM QUESTIONS ───────────────────────────────────────────────────────────
const QUESTIONS = [
  { id: "project_name",        label: "Project / Task Name",                    type: "text",     placeholder: "Enter your project or task name" },
  { id: "project_description", label: "Description",                            type: "textarea", placeholder: "Describe the project or task you worked on..." },
  { id: "challenges",          label: "Challenges Faced",                       type: "textarea", placeholder: "Describe any challenges you encountered..." },
  { id: "next_steps",          label: "Next Steps / Goals",                     type: "textarea", placeholder: "What are your plans for the next week?" },
  { id: "support_needed",      label: "Support Needed from DreamDo Staff",      type: "textarea", placeholder: "What support do you need?" },
];

// ─── DREAMDO LOGO ─────────────────────────────────────────────────────────────
function DreamDoLogo({ size = "md" }) {
  const scale = size === "lg" ? 1.4 : 1;
  return (
    <img
      src="/dreamdo-logo.png"
      alt="DreamDo"
      style={{ height: 44 * scale, objectFit: "contain" }}
    />
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function NavBar({ onLogoClick }) {
  return (
    <nav style={{ background: DARK_BLUE, padding: "0 2.5rem", display: "flex", alignItems: "center", height: 68, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
      <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 900, color: WHITE, cursor: "pointer" }} onClick={onLogoClick}>
        DreamDo
      </div>
      <div style={{ flex: 1 }} />
      <span
        onClick={onLogoClick}
        style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Arial, sans-serif", fontSize: "clamp(11px, 2vw, 12px)", fontWeight: 700, letterSpacing: 0.8, cursor: "pointer", marginLeft: "2rem" }}>
        HOME
      </span>
      <div style={{ background: MID_BLUE, color: WHITE, fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: "clamp(10px, 2vw, 11px)", letterSpacing: 1, padding: "10px 16px", marginLeft: "2rem", lineHeight: 1.3, textAlign: "center", textTransform: "uppercase", borderRadius: 2 }}>
        INTERN<br />PORTAL
      </div>
    </nav>
  );
}

// ─── SIGN IN PAGE ─────────────────────────────────────────────────────────────
function SignInPage({ onBack, onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (!email.trim() || !password) {
      setError("Please enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error: err } = await supabase
        .from("volunteers")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (err || !data) {
        setLoading(false);
        setError("Email not found. Please sign up first.");
        return;
      }

      const passwordMatch = await bcrypt.compare(password, data.password_hash);
      if (!passwordMatch) {
        setLoading(false);
        setError("Incorrect password. Please try again.");
        return;
      }

      setLoading(false);
      onSignIn(data);
    } catch (err) {
      setLoading(false);
      setError("An error occurred during sign in");
    }
  }

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f0f4fc", paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ background: DARK_BLUE, padding: "2.5rem 5vw" }}>
        <div style={{ color: LIGHT_BLUE, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>INTERN LOGIN</div>
        <h1 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 28, fontWeight: 900, color: WHITE, margin: 0 }}>Sign In to Your Account</h1>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: WHITE, borderTop: `5px solid ${BLUE}`, padding: "2.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Email *</label>
            <input type="email" placeholder="your.email@school.edu" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Password *</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSignIn()}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          {error && <p style={{ color: "#cc0000", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, marginBottom: "1rem" }}>{error}</p>}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
            <button onClick={onBack} style={{ flex: 1, padding: "13px", background: WHITE, color: BLUE, border: `2px solid ${BLUE}`, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
              ← BACK
            </button>
            <button onClick={handleSignIn} disabled={loading}
              style={{ flex: 2, padding: "13px", background: loading ? "#999" : BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: loading ? "default" : "pointer" }}>
              {loading ? "SIGNING IN…" : "SIGN IN"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIGN UP PAGE ─────────────────────────────────────────────────────────────
function SignUpPage({ onBack, onSignUp }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSignUp() {
    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPass) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const { error: err } = await supabase.from("volunteers").insert({
        name: fullName,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        approved: false,
      });

      setLoading(false);
      if (err) {
        if (err.message.includes("unique")) {
          setError("Email already registered");
        } else {
          setError("Sign up failed. Please try again.");
        }
        return;
      }

      setSuccess(true);
      setTimeout(() => onSignUp(), 2000);
    } catch (err) {
      setLoading(false);
      setError("An error occurred during sign up");
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: "calc(100vh - 68px)", background: "#f0f4fc", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: WHITE, padding: "3rem", maxWidth: 480, width: "100%", textAlign: "center", borderTop: `6px solid ${BLUE}` }}>
          <div style={{ width: 64, height: 64, background: "#e6f4ea", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d7a3a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, fontSize: 22, margin: "0 0 0.75rem", fontWeight: 900, textTransform: "uppercase" }}>Sign Up Successful!</h2>
          <p style={{ fontFamily: "Arial, sans-serif", color: "#555", fontSize: 15, lineHeight: 1.7, margin: "0" }}>
            Thank you for signing up! An admin will review your account and notify you once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f0f4fc", paddingBottom: "3rem" }}>
      {/* Header */}
      <div style={{ background: DARK_BLUE, padding: "2.5rem 5vw" }}>
        <div style={{ color: LIGHT_BLUE, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>INTERN REGISTRATION</div>
        <h1 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 28, fontWeight: 900, color: WHITE, margin: 0 }}>Create Your Account</h1>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 500, margin: "2rem auto", padding: "0 1.5rem" }}>
        <div style={{ background: WHITE, borderTop: `5px solid ${BLUE}`, padding: "2.5rem" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Full Name *</label>
            <input type="text" placeholder="John Doe" value={fullName} onChange={e => { setFullName(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>School Email *</label>
            <input type="email" placeholder="your.email@school.edu" value={email} onChange={e => { setEmail(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Password *</label>
            <input type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.8 }}>Confirm Password *</label>
            <input type="password" placeholder="••••••••" value={confirmPass} onChange={e => { setConfirmPass(e.target.value); setError(""); }}
              style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
              onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
              onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
          </div>

          {error && <p style={{ color: "#cc0000", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, marginBottom: "1rem" }}>{error}</p>}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
            <button onClick={onBack} style={{ flex: 1, padding: "13px", background: WHITE, color: BLUE, border: `2px solid ${BLUE}`, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
              ← BACK
            </button>
            <button onClick={handleSignUp} disabled={loading}
              style={{ flex: 2, padding: "13px", background: loading ? "#999" : BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: loading ? "default" : "pointer" }}>
              {loading ? "SIGNING UP…" : "CREATE ACCOUNT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ volunteers, onVolunteer, onStaff, onSignUp, onSignIn }) {
  const [showVolOptions, setShowVolOptions] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passErr,  setPassErr]  = useState("");

  function tryStaffLogin() {
    if (password === STAFF_PASSWORD) onStaff();
    else setPassErr("Incorrect password. Please try again.");
  }

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ position: "relative", background: BLUE, minHeight: "88vh", overflow: "hidden", display: "flex", alignItems: "center" }}>
        {/* Dark angled panel */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "52%", height: "100%", background: DARK_BLUE, clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }} />
        {/* Hex shape */}
        <div style={{ position: "absolute", top: "8%", right: "12%", width: 320, height: 320, background: "rgba(255,255,255,0.06)", transform: "rotate(25deg)", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", zIndex: 1 }} />
        {/* Gold hex replaced by lighter blue hex */}
        <div style={{ position: "absolute", bottom: "5%", right: "30%", width: 180, height: 180, background: MID_BLUE, opacity: 0.7, clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", zIndex: 1 }} />
        {/* Texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(135deg,rgba(255,255,255,0.03) 0px,rgba(255,255,255,0.03) 1px,transparent 1px,transparent 55px)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 2, padding: "4rem 5vw", maxWidth: 680 }}>
          <div style={{ color: LIGHT_BLUE, fontFamily: "Arial, sans-serif", fontSize: "clamp(11px, 2vw, 13px)", fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", marginBottom: "1.25rem" }}>
            DREAMDO AFRICA · INTERN MANAGEMENT SYSTEM
          </div>
          <h1 style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)", color: WHITE, fontWeight: 900, lineHeight: 1.08, margin: "0 0 2rem" }}>
            DreamDo Africa<br />
            <span style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>Intern Management System</span>
          </h1>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {/* Intern access */}
            {!showVolOptions ? (
              <button
                onClick={() => setShowVolOptions(true)}
                style={{ display: "flex", alignItems: "center", gap: 10, background: WHITE, color: BLUE, border: "none", padding: "15px 28px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" }}
                onMouseOver={e => e.currentTarget.style.background = LIGHT_BLUE}
                onMouseOut={e => e.currentTarget.style.background = WHITE}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ACCESS AS INTERN
              </button>
            ) : (
              <div style={{ background: WHITE, padding: "1.5rem", minWidth: 300, borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>Intern Login</div>
                <button onClick={onSignIn}
                  style={{ width: "100%", padding: "12px", background: BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}>
                  SIGN IN
                </button>
                <button onClick={onSignUp}
                  style={{ width: "100%", padding: "12px", background: MID_BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", marginBottom: "0.75rem" }}>
                  NEW INTERN SIGNUP
                </button>
                <button onClick={() => setShowVolOptions(false)}
                  style={{ width: "100%", padding: "12px", background: WHITE, color: BLUE, border: `2px solid ${BLUE}`, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                  BACK
                </button>
              </div>
            )}

            {/* Staff access */}
            <div>
              {!showPassModal ? (
                <button
                  onClick={() => setShowPassModal(true)}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.12)", color: WHITE, border: "2px solid rgba(255,255,255,0.55)", padding: "15px 28px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: 1, cursor: "pointer", textTransform: "uppercase" }}
                  onMouseOver={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
                  onMouseOut={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  ACCESS AS DREAMDO STAFF
                </button>
              ) : (
                <div style={{ background: WHITE, padding: "1rem 1.25rem", minWidth: 280 }}>
                  <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Staff Authentication</div>
                  <input type="password" placeholder="Enter staff password" value={password}
                    onChange={e => { setPassword(e.target.value); setPassErr(""); }}
                    onKeyDown={e => e.key === "Enter" && tryStaffLogin()}
                    style={{ width: "100%", padding: "10px 12px", border: `2px solid ${passErr ? "#cc0000" : BLUE}`, fontFamily: "Arial, sans-serif", fontSize: 14, marginBottom: passErr ? "0.4rem" : "0.75rem", boxSizing: "border-box", outline: "none" }} />
                  {passErr && <p style={{ color: "#cc0000", fontSize: 12, margin: "0 0 0.6rem", fontFamily: "Arial, sans-serif", fontWeight: 700 }}>{passErr}</p>}
                  <button onClick={tryStaffLogin}
                    style={{ width: "100%", padding: "12px", background: BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                    AUTHENTICATE →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Info strip ── */}
      <div style={{ background: DARK_BLUE, padding: "2rem 5vw", display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}></div>
    </div>
  );
}

// ─── VOLUNTEER PAGE ───────────────────────────────────────────────────────────
function VolunteerPage({ name, volunteerData, onBack, onSubmit }) {
  const [form,      setForm]      = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [error,     setError]     = useState("");
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  if (volunteerData && !volunteerData.approved) {
    return (
      <div style={{ minHeight: "calc(100vh - 68px)", background: "#f0f4fc", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ background: WHITE, padding: "3rem", maxWidth: 480, width: "100%", textAlign: "center", borderTop: `6px solid ${BLUE}` }}>
          <div style={{ width: 64, height: 64, background: "#fef3cd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffa500" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, fontSize: 22, margin: "0 0 0.75rem", fontWeight: 900, textTransform: "uppercase" }}>Pending Approval</h2>
          <p style={{ fontFamily: "Arial, sans-serif", color: "#555", fontSize: 15, lineHeight: 1.7, margin: "0" }}>
            Your account is currently pending approval from the DreamDo Africa team. You'll be able to submit reports once your account is approved.
          </p>
          <button onClick={onBack} style={{ marginTop: "2rem", background: BLUE, color: WHITE, border: "none", padding: "12px 28px", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
            BACK TO HOME
          </button>
        </div>
      </div>
    );
  }

  function handleChange(id, value) { setForm(p => ({ ...p, [id]: value })); }

  async function handleSubmit() {
    const missing = QUESTIONS.filter(q => !form[q.id]);
    if (missing.length) { alert(`Please fill in: ${missing.map(q => q.label).join(", ")}`); return; }
    setSaving(true); setError("");
    const { error: err } = await supabase.from("reports").insert({
      volunteer:           name,
      project_name:        form.project_name,
      project_description: form.project_description,
      spd_staff:           form.spd_staff,
      challenges:          form.challenges,
      next_steps:          form.next_steps,
      support_needed:      form.support_needed,
    });
    setSaving(false);
    if (err) { setError("Failed to submit report. Please try again."); return; }
    onSubmit();
    setSubmitted(true);
  }

  if (submitted) return (
    <div style={{ minHeight: "calc(100vh - 68px)", background: "#f0f4fc", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ background: WHITE, padding: "3rem", maxWidth: 480, width: "100%", textAlign: "center", borderTop: `6px solid ${BLUE}` }}>
        <div style={{ width: 64, height: 64, background: "#e6f4ea", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2d7a3a" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, fontSize: 22, margin: "0 0 0.75rem", fontWeight: 900, textTransform: "uppercase" }}>Report Submitted!</h2>
        <p style={{ fontFamily: "Arial, sans-serif", color: "#555", fontSize: 15, lineHeight: 1.7, margin: "0 0 2rem" }}>
          Thank you, <strong>{name}</strong>! Your weekly progress report has been saved and will be reviewed by the DreamDo Africa team.
        </p>
        <button onClick={onBack} style={{ background: BLUE, color: WHITE, border: "none", padding: "14px 36px", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
          BACK TO HOME
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#f0f4fc", minHeight: "calc(100vh - 68px)", paddingBottom: "3rem" }}>
      {/* Greeting banner */}
      <div style={{ background: DARK_BLUE, padding: "2.5rem 5vw", display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <div style={{ width: 62, height: 62, background: MID_BLUE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial Black, sans-serif", fontSize: 20, fontWeight: 900, color: WHITE, flexShrink: 0 }}>{initials}</div>
        <div>
          <div style={{ color: LIGHT_BLUE, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>WELCOME BACK · DREAMDO AFRICA INTERN</div>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 26, fontWeight: 900, color: WHITE }}>Hello, {name.split(" ")[0]}!</div>
          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>Complete your weekly progress report below</div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: 700, margin: "2rem auto 0", padding: "0 1.5rem" }}>
        <div style={{ background: WHITE, borderTop: `5px solid ${BLUE}`, padding: "2rem 2.5rem" }}>
          <h2 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, fontSize: 17, fontWeight: 900, margin: "0 0 2rem", textTransform: "uppercase", letterSpacing: 0.5 }}>Weekly Progress Report</h2>

          {QUESTIONS.map(q => (
            <div key={q.id} style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 800, color: BLUE, marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8 }}>
                {q.label} <span style={{ color: MID_BLUE }}>*</span>
              </label>
              {q.type === "text" && (
                <input type="text" placeholder={q.placeholder} value={form[q.id] || ""} onChange={e => handleChange(q.id, e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", outline: "none" }}
                  onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
                  onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
              )}
              {q.type === "textarea" && (
                <textarea placeholder={q.placeholder} value={form[q.id] || ""} onChange={e => handleChange(q.id, e.target.value)} rows={3}
                  style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #ccc", fontFamily: "Arial, sans-serif", fontSize: 14, boxSizing: "border-box", resize: "vertical", outline: "none" }}
                  onFocus={e => e.target.style.border = `1.5px solid ${BLUE}`}
                  onBlur={e => e.target.style.border = "1.5px solid #ccc"} />
              )}
            </div>
          ))}

          {error && <p style={{ color: "#cc0000", fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, marginBottom: "1rem" }}>{error}</p>}

          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
            <button onClick={onBack} style={{ flex: 1, padding: "13px", background: WHITE, color: BLUE, border: `2px solid ${BLUE}`, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
              ← BACK
            </button>
            <button onClick={handleSubmit} disabled={saving}
              style={{ flex: 2, padding: "13px", background: saving ? "#999" : BLUE, color: WHITE, border: "none", fontFamily: "Arial, sans-serif", fontWeight: 900, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", cursor: saving ? "default" : "pointer" }}>
              {saving ? "SUBMITTING…" : "SUBMIT PROGRESS REPORT"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STAFF DASHBOARD ──────────────────────────────────────────────────────────
function StaffDashboard({ volunteers, reports, onAddVolunteer, onDeleteVolunteer, onBack }) {
  const [activeTab,  setActiveTab]  = useState("overview");

  function triggerDownload(doc, filename) {
    try {
      const dataUri = doc.output("datauristring");
      const a = document.createElement("a");
      a.href = dataUri; a.download = filename; a.style.display = "none";
      document.body.appendChild(a); a.click();
      setTimeout(() => document.body.removeChild(a), 300);
    } catch {
      try { window.open(doc.output("datauristring"), "_blank"); }
      catch { alert("Could not download PDF."); }
    }
  }

  const byVol = {};
  volunteers.forEach(v => { byVol[v.name] = []; });
  reports.forEach(r => { if (!byVol[r.volunteer]) byVol[r.volunteer] = []; byVol[r.volunteer].push(r); });
  const maxCount = Math.max(...volunteers.map(v => (byVol[v.name] || []).length), 1);

  const byMonth = {};
  [...reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).forEach(r => {
    const d = new Date(r.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "long", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = { label, reports: [] };
    byMonth[key].reports.push(r);
  });
  const monthKeys = Object.keys(byMonth).sort((a, b) => b.localeCompare(a));

  async function handleApproveVolunteer(volId) {
    const { data, error } = await supabase.from("volunteers").update({ approved: true }).eq("id", volId).select().single();
    if (error) { alert("Failed to approve volunteer."); return; }
    if (data) onAddVolunteer(data);
  }

  async function handleRejectVolunteer(volId) {
    const { error } = await supabase.from("volunteers").delete().eq("id", volId);
    if (error) { alert("Failed to reject volunteer."); return; }
    onDeleteVolunteer(volId);
  }

  async function handleDelete(vol) {
    if (!confirm(`Are you sure you want to remove ${vol.name}?`)) return;
    const { error } = await supabase.from("volunteers").delete().eq("id", vol.id);
    if (error) { alert("Failed to remove volunteer."); return; }
    onDeleteVolunteer(vol.id);
  }

  function buildPDFHeader(doc, title) {
    doc.setFillColor(15, 32, 96);   doc.rect(0, 0, 210, 18, "F");
    doc.setFillColor(45, 84, 197);  doc.rect(0, 18, 210, 4, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(13);
    doc.text(title, 18, 12);
  }

  function buildPDFFooter(doc) {
    doc.setFillColor(15, 32, 96); doc.rect(0, 287, 210, 10, "F");
    doc.setTextColor(180, 200, 240); doc.setFontSize(8);
    doc.text("DreamDo Africa · Intern Management System", 18, 293);
  }

  function downloadReportPDF(r) {
    const doc = new jsPDF(); const m = 18; let y = 20;
    buildPDFHeader(doc, "DreamDo Africa — Intern Progress Report");
    y = 34;
    doc.setTextColor(26, 56, 150); doc.setFontSize(16); doc.setFont("helvetica", "bold");
    doc.text(r.volunteer, m, y); y += 7;
    doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(100, 100, 100);
    doc.text(new Date(r.created_at).toLocaleString(), m, y); y += 10;
    doc.setDrawColor(45, 84, 197); doc.setLineWidth(0.8);
    doc.line(m, y, 210 - m, y); y += 8;
    const fields = [
      ["Project / Task Name",           r.project_name],
      ["Description",                   r.project_description],
      ["DreamDo Staff Member Worked With", r.spd_staff],
      ["Challenges Faced",              r.challenges],
      ["Next Steps / Goals",            r.next_steps],
      ["Support Needed",                r.support_needed],
    ];
    fields.forEach(([label, value]) => {
      if (!value) return;
      doc.setFont("helvetica", "bold"); doc.setFontSize(9); doc.setTextColor(26, 56, 150);
      doc.text(label.toUpperCase(), m, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(40, 40, 40);
      const lines = doc.splitTextToSize(value, 170);
      doc.text(lines, m, y); y += lines.length * 5 + 6;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    buildPDFFooter(doc);
    triggerDownload(doc, `${r.volunteer.replace(/ /g, "_")}_report_${new Date(r.created_at).toISOString().slice(0, 10)}.pdf`);
  }

  function downloadMonthPDF(monthKey) {
    const doc = new jsPDF(); const m = 18; let y = 20;
    const { label: monthLabel, reports: monthReports } = byMonth[monthKey];
    buildPDFHeader(doc, `DreamDo Africa — ${monthLabel} Reports`);
    y = 34;
    monthReports.forEach((r, idx) => {
      if (idx > 0) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(m, y, 210 - m, y); y += 6;
      }
      doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(26, 56, 150);
      doc.text(r.volunteer, m, y); y += 6;
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(130, 130, 130);
      doc.text(new Date(r.created_at).toLocaleString(), m, y); y += 7;
      const fields = [
        ["Project / Task",  r.project_name],
        ["Description",     r.project_description],
        ["DreamDo Staff",   r.spd_staff],
        ["Challenges",      r.challenges],
        ["Next Steps",      r.next_steps],
        ["Support Needed",  r.support_needed],
      ];
      fields.forEach(([label, value]) => {
        if (!value) return;
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(45, 84, 197);
        doc.text(label + ":", m, y); y += 4;
        doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(40, 40, 40);
        const lines = doc.splitTextToSize(value, 170);
        doc.text(lines, m, y); y += lines.length * 4.5 + 3;
        if (y > 275) { doc.addPage(); y = 20; }
      });
      y += 4;
    });
    buildPDFFooter(doc);
    triggerDownload(doc, `DreamDo_Reports_${monthLabel.replace(/ /g, "_")}.pdf`);
  }

  const Tab = ({ id, label }) => (
    <button onClick={() => setActiveTab(id)}
      style={{ padding: "12px 24px", border: "none", background: activeTab === id ? BLUE : "transparent", color: activeTab === id ? WHITE : "#555", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer", transition: "background 0.2s" }}>
      {label}
    </button>
  );

  return (
    <div style={{ background: "#f0f4fc", minHeight: "calc(100vh - 68px)" }}>
      {/* Header */}
      <div style={{ background: DARK_BLUE, padding: "1.75rem 5vw", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: LIGHT_BLUE, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>DREAMDO AFRICA · STAFF PORTAL</div>
          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 24, fontWeight: 900, color: WHITE }}>Intern Dashboard</div>
        </div>
        <button onClick={onBack} style={{ background: "transparent", color: "rgba(255,255,255,0.75)", border: "1.5px solid rgba(255,255,255,0.4)", padding: "10px 20px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
          SIGN OUT
        </button>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {[[volunteers.length, "Total Interns", BLUE], [reports.length, "Reports Submitted", MID_BLUE]].map(([val, label, color]) => (
            <div key={label} style={{ background: WHITE, borderTop: `5px solid ${color}`, padding: "1.5rem" }}>
              <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 38, fontWeight: 900, color }}>{val}</div>
              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, fontWeight: 700, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ background: WHITE, borderBottom: `3px solid ${BLUE}`, display: "flex" }}>
          <Tab id="approvals" label="Pending Approvals" />
          <Tab id="overview" label="Progress Overview" />
          <Tab id="reports"  label="All Reports" />
          <Tab id="manage"   label="Manage Interns" />
        </div>

        <div style={{ background: WHITE, padding: "2rem" }}>

          {/* ── PENDING APPROVALS ── */}
          {activeTab === "approvals" && (
            <div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, margin: "0 0 1.5rem", fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>Pending Intern Approvals</h3>
              {volunteers.length === 0
                ? <p style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>No pending interns.</p>
                : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {volunteers.filter(v => !v.approved).map(v => (
                      <div key={v.id} style={{ background: "#f8faff", border: "1px solid #d0dcf5", borderLeft: `4px solid ${MID_BLUE}`, padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div>
                          <div style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 15, color: BLUE }}>{v.name}</div>
                          <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#666", marginTop: 4 }}>{v.email}</div>
                          {v.created_at && <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#999", marginTop: 4 }}>Applied: {new Date(v.created_at).toLocaleString()}</div>}
                        </div>
                        <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button onClick={() => handleApproveVolunteer(v.id)}
                            style={{ display: "flex", alignItems: "center", gap: 5, background: "#2d7a3a", color: WHITE, border: "none", padding: "8px 16px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                            Approve
                          </button>
                          <button onClick={() => handleRejectVolunteer(v.id)}
                            style={{ display: "flex", alignItems: "center", gap: 5, background: "#cc0000", color: WHITE, border: "none", padding: "8px 16px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── OVERVIEW ── */}
          {activeTab === "overview" && (
            <div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, margin: "0 0 1.5rem", fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>Reports Submitted per Intern</h3>
              {volunteers.length === 0
                ? <p style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>No interns yet.</p>
                : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {volunteers.map(v => {
                      const count = (byVol[v.name] || []).length;
                      const pct   = Math.round((count / maxCount) * 100);
                      return (
                        <div key={v.id}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 14, fontWeight: 700, color: BLUE }}>{v.name}</span>
                            <span style={{ fontWeight: 900, color: BLUE, fontFamily: "Arial, sans-serif", fontSize: 12 }}>{count} report{count !== 1 ? "s" : ""}</span>
                          </div>
                          <div style={{ background: LIGHT_BLUE, height: 22 }}>
                            <div style={{ width: `${count === 0 ? 0 : Math.max(pct, 3)}%`, height: "100%", background: BLUE, transition: "width 0.6s ease", display: "flex", alignItems: "center", paddingLeft: 6 }}>
                              {count > 0 && <span style={{ fontFamily: "Arial, sans-serif", fontSize: 10, fontWeight: 700, color: WHITE }}>{pct}%</span>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}

          {/* ── ALL REPORTS ── */}
          {activeTab === "reports" && (
            <div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, margin: "0 0 1.5rem", fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>All Reports</h3>
              {reports.length === 0
                ? <p style={{ color: "#666", fontFamily: "Arial, sans-serif" }}>No reports submitted yet.</p>
                : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    {monthKeys.map(mk => (
                      <div key={mk}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: DARK_BLUE, padding: "10px 16px", marginBottom: "0.75rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 20, background: MID_BLUE }} />
                            <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontSize: 14, fontWeight: 900, color: WHITE }}>{byMonth[mk].label}</span>
                            <span style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{byMonth[mk].reports.length} report{byMonth[mk].reports.length !== 1 ? "s" : ""}</span>
                          </div>
                          <button onClick={() => downloadMonthPDF(mk)}
                            style={{ display: "flex", alignItems: "center", gap: 6, background: MID_BLUE, color: WHITE, border: "none", padding: "7px 14px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 1, textTransform: "uppercase", cursor: "pointer" }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Month PDF
                          </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                          {byMonth[mk].reports.map((r, i) => (
                            <div key={r.id || i} style={{ border: "1px solid #d0dcf5", borderLeft: `4px solid ${BLUE}`, padding: "1.25rem", background: "#f8faff" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem", flexWrap: "wrap", gap: 8 }}>
                                <div>
                                  <span style={{ fontFamily: "Arial Black, Arial, sans-serif", fontWeight: 900, fontSize: 15, color: BLUE }}>{r.volunteer}</span>
                                  <span style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#666", marginLeft: 10 }}>· {r.project_name}</span>
                                </div>
                                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                  {r.spd_staff && <span style={{ background: BLUE, color: WHITE, padding: "3px 10px", fontSize: 11, fontFamily: "Arial, sans-serif", fontWeight: 700 }}>With: {r.spd_staff}</span>}
                                  <button onClick={() => downloadReportPDF(r)}
                                    style={{ display: "flex", alignItems: "center", gap: 5, background: MID_BLUE, color: WHITE, border: "none", padding: "6px 12px", fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", cursor: "pointer" }}>
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    PDF
                                  </button>
                                </div>
                              </div>
                              {r.project_description && <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#444", margin: "0 0 0.4rem", lineHeight: 1.6 }}><strong>Description:</strong> {r.project_description}</p>}
                              {r.challenges          && <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#444", margin: "0 0 0.4rem", lineHeight: 1.6 }}><strong>Challenges:</strong> {r.challenges}</p>}
                              {r.next_steps          && <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#444", margin: "0 0 0.4rem", lineHeight: 1.6 }}><strong>Next Steps:</strong> {r.next_steps}</p>}
                              {r.support_needed      && <p style={{ fontFamily: "Arial, sans-serif", fontSize: 13, color: "#444", margin: 0,           lineHeight: 1.6 }}><strong>Support Needed:</strong> {r.support_needed}</p>}
                              <p style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#999", margin: "0.75rem 0 0" }}>{new Date(r.created_at).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
            </div>
          )}

          {/* ── MANAGE INTERNS ── */}
          {activeTab === "manage" && (
            <div>
              <h3 style={{ fontFamily: "Arial Black, Arial, sans-serif", color: BLUE, margin: "0 0 1.25rem", fontSize: 14, fontWeight: 900, textTransform: "uppercase", letterSpacing: 0.5 }}>Intern Roster</h3>

              {volunteers.length === 0
                ? <p style={{ color: "#666", fontFamily: "Arial, sans-serif", marginTop: "1rem" }}>No interns in roster.</p>
                : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "0.75rem", marginTop: "1.5rem" }}>
                    {volunteers.map(v => {
                      const count = (byVol[v.name] || []).length;
                      const ini   = v.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                      return (
                        <div key={v.id} style={{ background: "#f8faff", border: "1px solid #d0dcf5", borderLeft: `3px solid ${BLUE}`, padding: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 38, height: 38, background: BLUE, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial Black, sans-serif", fontSize: 12, fontWeight: 900, color: WHITE, flexShrink: 0 }}>{ini}</div>
                            <div>
                              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 13, fontWeight: 700, color: BLUE }}>{v.name}</div>
                              <div style={{ fontFamily: "Arial, sans-serif", fontSize: 11, color: "#888" }}>{count} report{count !== 1 ? "s" : ""}</div>
                            </div>
                          </div>
                          <button onClick={() => handleDelete(v)}
                            style={{ display: "flex", alignItems: "center", gap: 5, background: MID_BLUE, border: "none", padding: "7px 12px", cursor: "pointer", color: WHITE, fontFamily: "Arial, sans-serif", fontWeight: 800, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" }}>
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page,       setPage]       = useState("landing");
  const [volunteers, setVolunteers] = useState([]);
  const [reports,    setReports]    = useState([]);
  const [selVol,     setSelVol]     = useState(null);
  const [loaded,     setLoaded]     = useState(false);
  const [dbError,    setDbError]    = useState(false);

  useEffect(() => {
    async function load() {
      const { data: vols, error: vErr } = await supabase.from("volunteers").select("*").order("created_at");
      const { data: reps, error: rErr } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
      if (vErr || rErr) setDbError(true);
      if (vols) setVolunteers(vols);
      if (reps) setReports(reps);
      setLoaded(true);
    }
    load();
  }, []);

  if (!loaded) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: DARK_BLUE }}>
      <div style={{ color: WHITE, fontFamily: "Arial, sans-serif", fontSize: 16, letterSpacing: 1 }}>Connecting to database…</div>
    </div>
  );

  if (dbError) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: DARK_BLUE, gap: "1rem", padding: "2rem", textAlign: "center" }}>
      <div style={{ color: LIGHT_BLUE, fontFamily: "Arial Black, sans-serif", fontSize: 20, fontWeight: 900 }}>Database Connection Error</div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: "Arial, sans-serif", fontSize: 14, maxWidth: 420, lineHeight: 1.7 }}>
        Could not connect to Supabase. Make sure you have set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your .env file.
      </div>
    </div>
  );

  return (
    <div>
      <NavBar onLogoClick={() => setPage("landing")} />

      {page === "landing" && (
        <LandingPage
          volunteers={volunteers}
          onVolunteer={name => { setSelVol(name); setPage("volunteer"); }}
          onStaff={() => setPage("staff")}
          onSignUp={() => setPage("signup")}
          onSignIn={() => setPage("signin")}
        />
      )}

      {page === "signin" && (
        <SignInPage
          onBack={() => setPage("landing")}
          onSignIn={(volunteer) => {
            // Update volunteers state with fresh data from sign-in
            setVolunteers(prev => {
              const exists = prev.find(v => v.id === volunteer.id);
              return exists ? prev.map(v => v.id === volunteer.id ? volunteer : v) : [...prev, volunteer];
            });
            setSelVol(volunteer.name);
            setPage("volunteer");
          }}
        />
      )}

      {page === "signup" && (
        <SignUpPage
          onBack={() => setPage("landing")}
          onSignUp={() => {
            setPage("landing");
            window.location.reload();
          }}
        />
      )}

      {page === "volunteer" && (
        <VolunteerPage
          name={selVol}
          volunteerData={volunteers.find(v => v.name === selVol)}
          onBack={() => setPage("landing")}
          onSubmit={async () => {
            const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
            if (data) setReports(data);
          }}
        />
      )}

      {page === "staff" && (
        <StaffDashboard
          volunteers={volunteers}
          reports={reports}
          onAddVolunteer={vol => setVolunteers(prev => prev.map(v => v.id === vol.id ? { ...v, ...vol } : v))}
          onDeleteVolunteer={id => setVolunteers(prev => prev.filter(v => v.id !== id))}
          onBack={() => setPage("landing")}
        />
      )}
    </div>
  );
}
