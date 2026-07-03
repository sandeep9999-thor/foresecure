import React, { useEffect, useRef, useState } from "react";
import {
  Plane, CloudLightning, ShieldAlert, HeartPulse, ArrowRight,
  MapPin, Clock, CheckCircle2, Menu, X, Mail, Bell, Activity,
  Globe2, Radio, Lock, Building2, Newspaper, ArrowUpRight
} from "lucide-react";

const FONT_IMPORT_URL =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";

const COLORS = {
  bg: "#F7F6F3",
  white: "#FFFFFF",
  black: "#14171C",
  red: "#B3212E",
  redDark: "#8C1A24",
  gold: "#C99A1E",
  goldLight: "#F4E9CB",
  slate: "#52565C",
  slateLight: "#8B8E93",
  line: "#E4E1D8",
};

const tickerFeed = [
  { level: "WARNING", loc: "Manila, PH", type: "Typhoon track shift", t: "00:12" },
  { level: "WATCH", loc: "Lagos, NG", type: "Civil demonstration planned", t: "00:47" },
  { level: "ADVISORY", loc: "Lyon, FR", type: "Rail strike, Line B", t: "01:03" },
  { level: "WARNING", loc: "São Paulo, BR", type: "Flash flood alert", t: "01:19" },
  { level: "WATCH", loc: "Jakarta, ID", type: "Air quality — hazardous", t: "01:40" },
  { level: "ADVISORY", loc: "Austin, US", type: "Severe thunderstorm cell", t: "02:05" },
  { level: "WARNING", loc: "Nairobi, KE", type: "Road closure — main corridor", t: "02:31" },
];

const levelColor = (lvl) =>
  lvl === "WARNING" ? COLORS.red : lvl === "WATCH" ? COLORS.gold : "#5C6470";

const trustedByStats = [
  { fig: "8/10", label: "top logistics networks operate on ForeSecure" },
  { fig: "2003", label: "year the watch desk stood up" },
  { fig: "140+", label: "field analysts and regional specialists" },
  { fig: "6,200+", label: "sites and itineraries under active watch" },
];

const insightsArticles = [
  { tag: "Weather", date: "Jun 28, 2026", title: "Why cyclone lead-time is shrinking across the Bay of Bengal", read: "6 min read" },
  { tag: "Security", date: "Jun 21, 2026", title: "Reading unrest indicators before a protest becomes a shutdown", read: "5 min read" },
  { tag: "Travel", date: "Jun 14, 2026", title: "The itinerary gap: why most duty-of-care programs miss layovers", read: "4 min read" },
];

const officeLocations = [
  { city: "Singapore", role: "Asia-Pacific watch desk" },
  { city: "London", role: "EMEA operations" },
  { city: "New York", role: "Americas operations" },
  { city: "Nairobi", role: "Field intelligence hub" },
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ForeSecureMark({ size = 30 }) {
  // Shield + lock mark, echoing the ForeSecure crest
  return (
    <svg width={size} height={size} viewBox="0 0 40 44" fill="none">
      <path d="M20 2 L36 8 V20 C36 30 29 38 20 42 C11 38 4 30 4 20 V8 Z" fill={COLORS.black} />
      <path d="M20 2 L36 8 V20 C36 30 29 38 20 42 Z" fill={COLORS.red} />
      <rect x="14" y="21" width="12" height="10" rx="2" fill={COLORS.gold} />
      <path d="M16.5 21 V17.5 a3.5 3.5 0 0 1 7 0 V21" stroke={COLORS.gold} strokeWidth="2" fill="none" />
    </svg>
  );
}

function MapIllustration() {
  const nodes = [
    { x: 110, y: 82, level: "WARNING" },   // West Africa / Atlantic
    { x: 300, y: 70, level: "WATCH" },     // East Asia
    { x: 355, y: 130, level: "ADVISORY" }, // SE Asia
    { x: 88, y: 150, level: "ADVISORY" },  // South America
    { x: 210, y: 110, level: "WARNING" },  // North Africa / Med
    { x: 250, y: 165, level: "WATCH" },    // Indian Ocean rim
  ];
  // Stylized, simplified continent silhouettes (low-poly world map, equirectangular-ish layout)
  const continents = [
    // North America
    "M40,45 C55,38 78,40 92,50 C102,58 100,72 95,82 C102,90 98,102 88,106 C78,112 66,108 60,98 C48,100 36,92 32,80 C26,68 30,54 40,45 Z",
    // South America
    "M78,128 C90,124 100,132 102,146 C104,164 98,182 88,196 C82,206 72,204 68,192 C62,178 62,160 66,146 C68,138 72,132 78,128 Z",
    // Europe
    "M188,44 C200,40 214,42 222,50 C228,56 224,64 216,66 C220,72 214,78 206,76 C196,80 186,74 184,64 C182,56 182,48 188,44 Z",
    // Africa
    "M190,88 C206,84 222,90 228,104 C234,118 232,134 226,150 C222,164 214,178 204,186 C198,190 192,184 192,176 C186,162 182,146 182,130 C182,114 184,98 190,88 Z",
    // Asia
    "M234,38 C258,30 288,32 312,42 C334,50 352,62 362,78 C368,90 360,100 348,98 C352,108 344,116 334,112 C324,120 310,118 302,110 C288,114 274,108 268,96 C254,96 240,88 234,76 C228,64 228,50 234,38 Z",
    // SE Asia / Indonesia
    "M320,120 C336,116 352,120 360,130 C364,138 356,146 346,144 C336,148 326,144 320,136 C316,130 316,124 320,120 Z",
    // Australia
    "M330,168 C348,162 368,166 378,178 C384,188 378,200 364,202 C350,206 336,200 330,190 C326,182 326,174 330,168 Z",
  ];
  return (
    <svg viewBox="0 0 420 260" width="100%" height="100%" style={{ display: "block" }}>
      <rect x="0" y="0" width="420" height="260" rx="16" fill={COLORS.black} />
      <g fill="#23262E" stroke="#2E323B" strokeWidth="0.75">
        {continents.map((d, i) => <path key={i} d={d} />)}
      </g>
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="10" fill={levelColor(n.level)} opacity="0.18">
            <animate attributeName="r" values="8;16;8" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
            <animate attributeName="opacity" values="0.28;0;0.28" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
          </circle>
          <circle cx={n.x} cy={n.y} r="4" fill={levelColor(n.level)} />
        </g>
      ))}
    </svg>
  );
}

const NAV_LINKS = ["Platform", "Solutions", "Intelligence", "Resources"];

export default function ForeSecure() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <div style={{ background: COLORS.bg, color: COLORS.black, fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
      <style>{`
        @import url('${FONT_IMPORT_URL}');
        .sl-display { font-family: 'Space Grotesk', sans-serif; }
        .sl-mono { font-family: 'IBM Plex Mono', monospace; }
        .sl-btn-primary {
          background: ${COLORS.red}; color: #fff; border: none; border-radius: 6px;
          padding: 13px 22px; font-weight: 600; font-size: 14.5px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; transition: background 0.2s ease, transform 0.15s ease;
        }
        .sl-btn-primary:hover { background: ${COLORS.redDark}; transform: translateY(-1px); }
        .sl-btn-ghost {
          background: transparent; color: ${COLORS.black}; border: 1.5px solid ${COLORS.line};
          border-radius: 6px; padding: 12px 20px; font-weight: 600; font-size: 14.5px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; transition: border-color 0.2s ease, background 0.2s ease;
        }
        .sl-btn-ghost:hover { border-color: ${COLORS.gold}; background: ${COLORS.goldLight}; }
        .sl-card { background: #fff; border: 1px solid ${COLORS.line}; border-radius: 10px; }
        .sl-ticker-track { display: flex; width: max-content; animation: sl-scroll 32s linear infinite; }
        @keyframes sl-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .sl-nav-link { color: ${COLORS.slate}; text-decoration: none; font-size: 14.5px; font-weight: 500; }
        .sl-nav-link:hover { color: ${COLORS.black}; }
        .sl-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .sl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 900px) {
          .sl-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .sl-grid-2 { grid-template-columns: 1fr; }
          .sl-hero-split { grid-template-columns: 1fr !important; }
          .sl-desktop-nav { display: none !important; }
          .sl-mobile-toggle { display: flex !important; }
        }
        @media (max-width: 560px) {
          .sl-grid-4 { grid-template-columns: 1fr; }
        }
        input:focus, button:focus { outline: 2px solid ${COLORS.red}; outline-offset: 2px; }
      `}</style>

      {/* NAV */}
      <header style={{ borderBottom: `1px solid ${COLORS.line}`, background: "rgba(247,246,243,0.94)", backdropFilter: "blur(6px)", position: "sticky", top: 0, zIndex: 40 }}>
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ForeSecureMark size={28} />
            <div>
              <span className="sl-display" style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em", display: "block" }}>ForeSecure</span>
              <span className="sl-mono" style={{ fontSize: 9.5, color: COLORS.slateLight, letterSpacing: "0.12em" }}>MONITOR · ASSESS · PROTECT</span>
            </div>
          </div>
          <nav className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {NAV_LINKS.map((l) => <a key={l} href="#" className="sl-nav-link">{l}</a>)}
          </nav>
          <div className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#" className="sl-nav-link">Sign in</a>
            <button className="sl-btn-primary">Request briefing <ArrowRight size={15} /></button>
          </div>
          <button
            className="sl-mobile-toggle"
            style={{ display: "none", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div style={{ padding: "8px 24px 20px", display: "flex", flexDirection: "column", gap: 14, borderTop: `1px solid ${COLORS.line}` }}>
            {NAV_LINKS.map((l) => <a key={l} href="#" className="sl-nav-link">{l}</a>)}
            <button className="sl-btn-primary" style={{ justifyContent: "center", marginTop: 6 }}>Request briefing <ArrowRight size={15} /></button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "72px 24px 0" }}>
        <div className="sl-hero-split" style={{ display: "grid", gridTemplateColumns: "1.05fr 0.95fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.black,
              color: COLORS.gold, padding: "6px 12px", borderRadius: 3, fontSize: 12.5, fontWeight: 600, marginBottom: 22,
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em",
            }}>
              <Activity size={13} /> OPERATIONAL STATUS: ACTIVE — 6,200+ SITES MONITORED
            </div>
            <h1 className="sl-display" style={{ fontSize: "clamp(32px, 4.2vw, 50px)", lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
              See the threat first. Move your people before it arrives.
            </h1>
            <p style={{ fontSize: 17.5, color: COLORS.slate, marginTop: 20, lineHeight: 1.6, maxWidth: 480 }}>
              ForeSecure fuses global monitoring, verified analysis, and rapid alerting into a single operational picture — built for organizations that cannot afford to learn about a threat from the news.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
              <button className="sl-btn-primary">Request a briefing <ArrowRight size={15} /></button>
              <button className="sl-btn-ghost">View operations platform</button>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 40, flexWrap: "wrap" }}>
              {[["48 SEC", "avg. dispatch time"], ["24/7", "watch desk"], ["190+", "territories covered"]].map(([n, l]) => (
                <div key={l}>
                  <div className="sl-display" style={{ fontSize: 24, fontWeight: 700 }}>{n}</div>
                  <div style={{ fontSize: 13, color: COLORS.slateLight }}>{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 20px 50px -20px rgba(20,23,28,0.35)" }}>
              <MapIllustration />
            </div>
          </Reveal>
        </div>
      </section>

      {/* TICKER — signature element */}
      <section style={{ marginTop: 56, background: COLORS.black, padding: "16px 0", overflow: "hidden" }}>
        <div className="sl-ticker-track">
          {[...tickerFeed, ...tickerFeed].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 28px", borderRight: "1px solid #2A2E36", whiteSpace: "nowrap" }}>
              <span className="sl-mono" style={{ fontSize: 11, fontWeight: 600, color: item.level === "WARNING" ? "#F0A8A8" : item.level === "WATCH" ? "#EBCE8A" : "#B9BCC2", background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 3 }}>
                {item.level}
              </span>
              <MapPin size={13} color="#7A7E86" />
              <span className="sl-mono" style={{ fontSize: 13, color: "#DAD8D0" }}>{item.loc}</span>
              <span style={{ fontSize: 13, color: "#9A9DA3" }}>{item.type}</span>
              <span className="sl-mono" style={{ fontSize: 11.5, color: "#63666D" }}>{item.t} ago</span>
            </div>
          ))}
        </div>
      </section>

      {/* TRUSTED-BY STATS BAR */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "56px 24px 0" }}>
        <Reveal>
          <div className="sl-grid-4">
            {trustedByStats.map(({ fig, label }) => (
              <div key={label} style={{ borderLeft: `2px solid ${COLORS.gold}`, paddingLeft: 16 }}>
                <div className="sl-display" style={{ fontSize: 26, fontWeight: 700 }}>{fig}</div>
                <div style={{ fontSize: 13, color: COLORS.slate, marginTop: 4, lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* SOLUTIONS GRID */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "96px 24px 0" }}>
        <Reveal>
          <div style={{ maxWidth: 560 }}>
            <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Coverage domains</div>
            <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
              Four threat domains. One chain of command.
            </h2>
          </div>
        </Reveal>
        <div className="sl-grid-4" style={{ marginTop: 36 }}>
          {[
            { icon: Plane, title: "Travel risk monitoring", desc: "Every itinerary tracked against live conditions at origin, transit, and destination — no traveler goes dark." },
            { icon: CloudLightning, title: "Severe weather & hazards", desc: "Storm, flood, wildfire, and seismic activity assessed against your exact site footprint, not the whole region." },
            { icon: ShieldAlert, title: "Civil unrest & security", desc: "Protest movements, transit disruption, and security incidents scored by proximity and confirmed before action." },
            { icon: HeartPulse, title: "Health & medical advisories", desc: "Outbreak surveillance and verified medical guidance for personnel deployed away from home territory." },
          ].map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="sl-card" style={{ padding: 24, height: "100%" }}>
                <div style={{ width: 42, height: 42, borderRadius: 6, background: COLORS.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={20} color={COLORS.gold} />
                </div>
                <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 16 }}>{title}</h3>
                <p style={{ fontSize: 14, color: COLORS.slate, marginTop: 8, lineHeight: 1.55 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PLATFORM */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <div className="sl-hero-split" style={{ display: "grid", gridTemplateColumns: "0.95fr 1.05fr", gap: 48, alignItems: "center" }}>
          <Reveal>
            <div className="sl-card" style={{ padding: 22 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Radio size={16} color={COLORS.red} />
                  <span className="sl-display" style={{ fontWeight: 600, fontSize: 14.5 }}>Active incidents</span>
                </div>
                <span className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight }}>updated 12s ago</span>
              </div>
              {tickerFeed.slice(0, 4).map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderTop: i === 0 ? "none" : `1px solid ${COLORS.line}` }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: levelColor(item.level), flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{item.type}</div>
                    <div className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight }}>{item.loc}</div>
                  </div>
                  <span className="sl-mono" style={{ fontSize: 11, color: COLORS.slateLight }}>{item.t}</span>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>The platform</div>
            <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
              One operational picture. Zero blind spots.
            </h2>
            <p style={{ fontSize: 15.5, color: COLORS.slate, marginTop: 16, lineHeight: 1.6 }}>
              ForeSecure plots every traveler and every fixed site against a continuously updated threat layer, so exposure is established before a headline ever runs.
            </p>
            <ul style={{ listStyle: "none", padding: 0, marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
              {["Automatic itinerary ingestion from your travel provider", "Geofenced alerts scoped to site radius, not entire countries", "One-command mass notification with delivery confirmation"].map((t) => (
                <li key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14.5 }}>
                  <CheckCircle2 size={17} color={COLORS.red} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <Reveal>
          <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Chain of custody</div>
          <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
            From raw signal to a confirmed order, in four steps.
          </h2>
        </Reveal>
        <div className="sl-grid-4" style={{ marginTop: 36 }}>
          {[
            ["01", "Detect", "Thousands of open, licensed, and field-sourced channels are scanned around the clock for emerging activity."],
            ["02", "Verify", "Trained analysts confirm severity, location, and credibility before anything reaches a client feed."],
            ["03", "Notify", "Alerts are dispatched only to personnel inside the affected radius — by SMS, app, or direct call."],
            ["04", "Support", "The watch desk remains reachable for guidance until the situation is confirmed resolved."],
          ].map(([num, title, desc], i) => (
            <Reveal key={num} delay={i * 90}>
              <div style={{ padding: "0 2px" }}>
                <div className="sl-mono" style={{ fontSize: 13, color: COLORS.gold, fontWeight: 600 }}>{num}</div>
                <h3 className="sl-display" style={{ fontSize: 17, fontWeight: 600, marginTop: 8 }}>{title}</h3>
                <p style={{ fontSize: 14, color: COLORS.slate, marginTop: 8, lineHeight: 1.55 }}>{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <div className="sl-grid-2">
          {[
            { quote: "Our travelers were rerouted two hours before the airport closure hit the wire services. That margin is the entire mandate.", name: "Director, Global Security Operations", org: "Meridian Freight Group" },
            { quote: "Alerts are scoped tightly enough that personnel act on them instead of dismissing them. That discipline is rare.", name: "Head of Duty of Care", org: "Harlow & Vance" },
          ].map(({ quote, name, org }) => (
            <Reveal key={name}>
              <div className="sl-card" style={{ padding: 28 }}>
                <p className="sl-display" style={{ fontSize: 18, fontWeight: 500, lineHeight: 1.45 }}>&ldquo;{quote}&rdquo;</p>
                <div style={{ marginTop: 18, fontSize: 13.5, color: COLORS.slate }}>
                  <div style={{ fontWeight: 600, color: COLORS.black }}>{name}</div>
                  <div>{org}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <Reveal>
          <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>After-action reports</div>
          <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>Field record</h2>
        </Reveal>
        <div className="sl-grid-2" style={{ marginTop: 32 }}>
          {[
            { tag: "Severe weather", title: "340 personnel evacuated ahead of a coastal cyclone", stat: "6 hrs of lead time secured" },
            { tag: "Civil unrest", title: "Field teams rerouted around a fast-moving protest corridor", stat: "0 incidents recorded" },
          ].map(({ tag, title, stat }) => (
            <Reveal key={title}>
              <div className="sl-card" style={{ padding: 26 }}>
                <span className="sl-mono" style={{ fontSize: 11.5, color: COLORS.red, background: COLORS.goldLight, padding: "4px 10px", borderRadius: 3 }}>{tag}</span>
                <h3 className="sl-display" style={{ fontSize: 18, fontWeight: 600, marginTop: 14, lineHeight: 1.35 }}>{title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 13.5, color: COLORS.slate }}>
                  <Clock size={15} color={COLORS.slateLight} />{stat}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* INSIGHTS / NEWS */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Intelligence desk</div>
              <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>Latest briefings</h2>
            </div>
            <a href="#" className="sl-nav-link" style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
              View all briefings <ArrowUpRight size={15} />
            </a>
          </div>
        </Reveal>
        <div className="sl-grid-4" style={{ marginTop: 32, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {insightsArticles.map(({ tag, date, title, read }, i) => (
            <Reveal key={title} delay={i * 90}>
              <a href="#" className="sl-card" style={{ display: "block", padding: 22, height: "100%", textDecoration: "none", color: "inherit" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span className="sl-mono" style={{ fontSize: 11, color: COLORS.red, background: COLORS.goldLight, padding: "3px 9px", borderRadius: 3, fontWeight: 600 }}>{tag}</span>
                  <span className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight }}>{date}</span>
                </div>
                <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 14, lineHeight: 1.4 }}>{title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 12.5, color: COLORS.slateLight }}>
                  <Newspaper size={14} />{read}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <Reveal>
          <div style={{ background: COLORS.black, borderRadius: 14, padding: "48px 40px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ maxWidth: 420 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: COLORS.gold }}>
                <Bell size={16} /> <span className="sl-mono" style={{ fontSize: 12.5, letterSpacing: "0.04em", textTransform: "uppercase" }}>Weekly briefing</span>
              </div>
              <h3 className="sl-display" style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginTop: 10 }}>
                The five threats worth your attention, every Monday.
              </h3>
            </div>
            {subscribed ? (
              <div style={{ color: COLORS.gold, fontSize: 14.5, display: "flex", alignItems: "center", gap: 8 }}>
                <CheckCircle2 size={18} /> Confirmed. You're on the distribution list.
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubscribed(true); }}
                style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
              >
                <div style={{ display: "flex", alignItems: "center", background: "#1F232B", borderRadius: 6, padding: "0 14px", border: "1px solid #34383F" }}>
                  <Mail size={15} color="#797D85" />
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ background: "transparent", border: "none", color: "#fff", padding: "12px 10px", fontSize: 14, width: 220, outline: "none" }}
                  />
                </div>
                <button type="submit" className="sl-btn-primary">Subscribe</button>
              </form>
            )}
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, borderTop: `1px solid ${COLORS.line}`, paddingTop: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ForeSecureMark size={24} />
            <span className="sl-display" style={{ fontWeight: 700, fontSize: 16 }}>ForeSecure</span>
          </div>
          <div style={{ display: "flex", gap: 40, flexWrap: "wrap", fontSize: 13.5, color: COLORS.slate }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ color: COLORS.slateLight, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Product</span>
              <a href="#" className="sl-nav-link">Platform</a>
              <a href="#" className="sl-nav-link">Solutions</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ color: COLORS.slateLight, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Company</span>
              <a href="#" className="sl-nav-link">About</a>
              <a href="#" className="sl-nav-link">Careers</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <span style={{ color: COLORS.slateLight, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>Resources</span>
              <a href="#" className="sl-nav-link">Intelligence desk</a>
              <a href="#" className="sl-nav-link">Field record</a>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${COLORS.line}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Building2 size={15} color={COLORS.slateLight} />
            <span style={{ fontSize: 12, color: COLORS.slateLight, textTransform: "uppercase", letterSpacing: "0.04em" }}>Operations centers</span>
          </div>
          <div className="sl-grid-4">
            {officeLocations.map(({ city, role }) => (
              <div key={city}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{city}</div>
                <div style={{ fontSize: 12.5, color: COLORS.slateLight, marginTop: 2 }}>{role}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 32, fontSize: 12.5, color: COLORS.slateLight, display: "flex", gap: 16, alignItems: "center" }}>
          <Globe2 size={14} /> ForeSecure is a demonstration brand — content generated for demonstration purposes.
        </div>
      </footer>
    </div>
  );
}
