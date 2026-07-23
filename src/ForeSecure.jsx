import React, { useEffect, useRef, useState } from "react";
import {
  Plane, CloudLightning, ShieldAlert, HeartPulse, ArrowRight, ArrowUpRight,
  MapPin, Clock, CheckCircle2, Menu, X, Mail, Globe2, Lock,
  Newspaper, MoreHorizontal, ChevronRight, ChevronDown, RefreshCw,
  MapPinned, ExternalLink, Flag, Megaphone, Plus, Trash2, Radio, Layers,
} from "lucide-react";
import ThreatGlobe from "./Globe";
import LiveMapPage from "./LiveMap";
import { T, FONTS } from "./theme";

/* ===========================================================================
   ForeSecure — Global Employee Safety & Risk Intelligence

   Design direction: "operations room after dark".
   - Surface is deep charcoal-navy, not cream. The product is a watch desk;
     it should feel like one.
   - Gold is brand + wayfinding. Red is reserved EXCLUSIVELY for live threat
     states, so its appearance always carries information.
   - Signature element: a real 3D globe (canvas, orthographic projection,
     zero dependencies) with lat/lng-accurate threat nodes and great-circle
     arcs. It is the hero, and it is draggable.
   - Structure encodes meaning: the four coverage domains are not numbered,
     because they are not a sequence. The escalation path IS numbered,
     because order is the whole point of it.
   =========================================================================== */

/* ---------------------------------------------------------------- content -- */

const tickerFeed = [
  { level: "WARNING",  loc: "Manila, PH",     type: "Typhoon track shift",           t: "00:12" },
  { level: "WATCH",    loc: "Lagos, NG",      type: "Civil demonstration planned",   t: "00:47" },
  { level: "ADVISORY", loc: "Lyon, FR",       type: "Rail strike, Line B",           t: "01:03" },
  { level: "WARNING",  loc: "São Paulo, BR",  type: "Flash flood alert",             t: "01:19" },
  { level: "WATCH",    loc: "Jakarta, ID",    type: "Air quality — hazardous",       t: "01:40" },
  { level: "ADVISORY", loc: "Austin, US",     type: "Severe thunderstorm cell",      t: "02:05" },
  { level: "WARNING",  loc: "Nairobi, KE",    type: "Road closure — main corridor",  t: "02:31" },
];

const levelColor = (lvl) =>
  lvl === "WARNING" ? T.red : lvl === "WATCH" ? T.amber : T.inkLow;

const officeLocations = [
  { city: "Bengaluru, India", role: "Primary operations & watch desk" },
];

const DOMAINS = [
  {
    icon: Plane,
    title: "Travel risk",
    desc: "Itineraries sync from your travel provider at booking. Origin, transit, and destination are all watched — nobody goes dark between legs.",
  },
  {
    icon: CloudLightning,
    title: "Weather & hazards",
    desc: "Storm, flood, wildfire, and seismic activity scored against your exact site footprint rather than a whole region.",
  },
  {
    icon: ShieldAlert,
    title: "Unrest & security",
    desc: "Protest movement, transit disruption, and security incidents ranked by proximity to your people and confirmed before dispatch.",
  },
  {
    icon: HeartPulse,
    title: "Health advisories",
    desc: "Outbreak surveillance and verified medical guidance for personnel deployed outside their home territory.",
  },
];

// This IS a sequence — order carries the information — so it gets numbered.
const ESCALATION = [
  { n: "01", title: "Signal", body: "A feed, sensor, or field report registers something anomalous. Raw, unconfirmed, timestamped." },
  { n: "02", title: "Corroborate", body: "An analyst matches it against a second independent source. Single-source events never dispatch." },
  { n: "03", title: "Scope", body: "We resolve who is actually exposed — which travelers, which sites, which radius. Not the whole company." },
  { n: "04", title: "Dispatch", body: "Alert goes to exactly those people, on the channels they'll see, with the action you want them to take." },
  { n: "05", title: "Account", body: "Two-way check-in confirms who is safe. The gaps are the only thing your desk has to chase." },
];

/* ------------------------------------------------------------------- nav -- */

const NAV_MENU = [
  {
    label: "Consulting",
    items: [
      { label: "Risk Consulting" },
      {
        label: "Security Design",
        items: [
          { label: "Physical Security Design and Project Management" },
          { label: "Physical Security Operations Center Design" },
          { label: "Enterprise Electronic Security Technology Transformation" },
          { label: "Enterprise Physical Security Master Plans" },
        ],
      },
      { label: "Protective Services" },
      { label: "Cybersecurity and Resilience" },
      { label: "Environmental, Social & Governance" },
      {
        label: "Climate & Disaster Risk Resilience",
        items: [
          { label: "Climate Risk Assessment and Resilience" },
          { label: "Disaster Risk Management" },
          { label: "Carbon Footprint Assessment" },
          { label: "Hydrological Assessment and Water Related Services" },
        ],
      },
    ],
  },
];

const OVERFLOW_MENU = [
  { label: "Resourcing" },
  { label: "Insights", items: [{ label: "Blogs" }, { label: "Special Advisory" }, { label: "Events" }] },
  { label: "Careers" },
  { label: "About us", items: [{ label: "Our Story" }, { label: "Our Team" }] },
];

/* Service copy — unchanged from your original, it reads well. */
const SERVICE_CONTENT = {
  "Risk Consulting": {
    category: "Consulting",
    summary: "Turning uncertainty into a plan you can act on.",
    body: [
      "Every organization carries exposure it can't always see — in its supply lines, its people's movements, its facilities, or the political weather around a market it operates in. ForeSecure's risk consulting practice starts by mapping that exposure properly: what could go wrong, how likely it is, and what it would actually cost the business if it did.",
      "From there, our analysts build a mitigation plan that fits the client rather than a generic playbook. That can mean rewriting an incident response procedure, running a tabletop exercise with leadership, or standing up a continuous monitoring feed so a threat is caught while it's still a rumor rather than a headline.",
      "We work across banking, manufacturing, energy, logistics, and technology — sectors where an operational, compliance, or reputational shock can move markets or shut a site down. The goal is always the same: give decision-makers enough warning and enough clarity to act early, not just react.",
    ],
  },
  "Physical Security Design and Project Management": {
    category: "Security Design",
    summary: "Designing protection into a building, not bolting it on afterward.",
    body: [
      "Retrofitting security into a finished building is expensive and full of compromises. Our design team works alongside architects and facility planners from the earliest drawings, positioning cameras, access points, barriers, and control rooms so they do their job without fighting the building's layout.",
      "Once a design is signed off, we stay involved through procurement and installation — managing vendors, checking work against spec, and testing systems before handover — so what gets built actually matches what was designed.",
    ],
  },
  "Physical Security Operations Center Design": {
    category: "Security Design",
    summary: "The room where every camera, alarm, and alert comes together.",
    body: [
      "A security operations center is only as good as the workflows built around it. We design the physical layout, technology stack, and staffing model of a client's control room so operators can spot a developing incident quickly and hand it to the right team without confusion.",
      "That includes everything from monitor-wall ergonomics and shift rostering to the escalation logic that decides when a flagged event becomes a phone call to a duty manager.",
    ],
  },
  "Enterprise Electronic Security Technology Transformation": {
    category: "Security Design",
    summary: "Replacing a patchwork of old systems with one that actually talks to itself.",
    body: [
      "Large organizations often accumulate security technology one acquisition or building at a time, ending up with a mismatched collection of access control, CCTV, and alarm systems that don't share data. We plan and run the transition to a unified platform, sequencing the rollout so sites stay protected throughout the changeover.",
      "The result is a single view of security posture across every site, instead of a dozen disconnected local ones.",
    ],
  },
  "Enterprise Physical Security Master Plans": {
    category: "Security Design",
    summary: "A long-range roadmap for protecting every site a company owns.",
    body: [
      "A master plan sets out, site by site and year by year, where security investment should go and why — based on a consistent risk methodology rather than whichever building shouted loudest last budget cycle.",
      "We build these plans to survive organizational change: new leadership, new geographies, and new threats can be absorbed without starting over.",
    ],
  },
  "Protective Services": {
    category: "Consulting",
    summary: "Keeping people safe as they move, not just where they sit.",
    body: [
      "Executives, project teams, and traveling staff are exposed the moment they leave a secured building. Our protective services cover close protection, journey management, and advance work — route recces, local liaison, and contingency planning — for movement through higher-risk environments.",
      "Every deployment starts with understanding the specific reason for travel and the specific risks of the destination, rather than applying a one-size-fits-all security detail.",
    ],
  },
  "Cybersecurity and Resilience": {
    category: "Consulting",
    summary: "Treating a breach as a business continuity problem, not just an IT one.",
    body: [
      "A cyberattack rarely stays contained to a server room — it can halt production lines, expose customer data, or freeze payment systems. Our cybersecurity and resilience practice works across both domains: hardening technical defenses and building the organizational response plan for when prevention isn't enough.",
      "That includes vulnerability assessments, incident response planning, and tabletop simulations that get technical and business teams rehearsing the same playbook together.",
    ],
  },
  "Environmental, Social & Governance": {
    category: "Consulting",
    summary: "Making ESG measurable instead of aspirational.",
    body: [
      "ESG commitments only mean something if they can be tracked, audited, and reported credibly. We help organizations build the assessment frameworks, data collection processes, and governance structures that turn sustainability goals into figures a board — and a regulator — can trust.",
      "This spans environmental impact assessments, social risk reviews across supply chains, and governance audits aligned to the standards clients are actually held to.",
    ],
  },
  "Climate Risk Assessment and Resilience": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Understanding how a changing climate touches a specific site.",
    body: [
      "Flood maps, heat projections, and storm-frequency data mean little until they're translated into what they imply for a specific factory, port, or office campus. We assess physical climate risk at the site level and build resilience plans — engineering, insurance, and operational — around what the data actually shows for that location.",
    ],
  },
  "Disaster Risk Management": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Planning for the event no one wants to plan for.",
    body: [
      "Earthquakes, cyclones, and industrial accidents don't wait for a convenient time. Our disaster risk management work builds the response plans, evacuation procedures, and recovery playbooks that let an organization act fast and coherently when the unexpected happens, rather than improvising under pressure.",
    ],
  },
  "Carbon Footprint Assessment": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Measuring emissions with enough rigor to report them publicly.",
    body: [
      "We calculate an organization's greenhouse gas footprint across its operations and supply chain using recognized accounting methods, so the resulting figures hold up to investor and regulatory scrutiny — and give the client a real baseline to reduce from.",
    ],
  },
  "Hydrological Assessment and Water Related Services": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Water risk, from flooding to scarcity.",
    body: [
      "Water is a two-sided risk: too much of it floods a site, too little disrupts operations that depend on it. We model local hydrology, flood exposure, and water availability to help clients plan facilities, insurance, and continuity measures around the water risk specific to their location.",
    ],
  },
  "Resourcing": {
    category: "Resourcing",
    summary: "Embedded security talent, without running a security recruitment desk.",
    body: [
      "Not every organization needs a full in-house security department, but most need reliable security expertise on-site. We place vetted security managers, analysts, and operations staff directly into client teams, handling recruitment, training, and quality oversight so the client gets the expertise without carrying the HR overhead.",
    ],
  },
  "Careers": {
    category: "Careers",
    summary: "Join the team keeping people and operations safe, worldwide.",
    body: [
      "ForeSecure hires analysts, field specialists, and engineers who want their work to matter the day something actually goes wrong. We look for people comfortable with ambiguity, careful under pressure, and genuinely curious about how risk moves around the world.",
    ],
  },
  "Blogs": {
    category: "Insights",
    summary: "Field notes from the analysts doing the work.",
    body: [
      "Our blog covers the trends, incidents, and lessons our own risk consultants are tracking — from emerging cyber threats to how climate risk is reshaping site selection. It's written by the people doing the assessments, not a marketing team repackaging headlines.",
    ],
  },
  "Special Advisory": {
    category: "Insights",
    summary: "Deep-dive briefings on a single, developing situation.",
    body: [
      "When a single event — a coup, a major storm system, a regulatory shift — has outsized implications for clients operating in the region, we publish a special advisory: a focused briefing on what's happening, what could happen next, and what it means operationally.",
    ],
  },
  "Events": {
    category: "Insights",
    summary: "Where our analysts meet the people managing risk on the ground.",
    body: [
      "From closed-door briefings for security leaders to public panels on emerging threats, our events are built around conversation, not just presentation. Check back for upcoming sessions, or get in touch to suggest a topic worth covering.",
    ],
  },
  "Our Story": {
    category: "About us",
    summary: "How a watch desk became a global risk practice.",
    body: [
      "ForeSecure grew out of a simple frustration: the organizations that most needed early warning of a crisis were usually the last to hear about it. What began as a small monitoring desk has grown into a global practice spanning consulting, protective services, and technology — but the original goal hasn't changed: get the right information to the right person before it's too late to act on it.",
    ],
  },
  "Our Team": {
    category: "About us",
    summary: "Analysts, engineers, and field operators — not consultants in suits.",
    body: [
      "Our team blends former military and law enforcement officers, security engineers, data analysts, and regional specialists who've actually worked in the markets they cover. That mix is deliberate: understanding a risk on paper and understanding it on the ground are different skills, and our clients need both.",
    ],
  },
  "Travel Tracker": {
    category: "Platform",
    summary: "Every traveler, every itinerary, matched against live conditions in real time.",
    body: [
      "Travel Tracker ingests itineraries directly from your travel management provider the moment they're booked — flights, hotels, ground transport — and plots each one against ForeSecure's live threat layer. There's no manual entry and no gap between a trip being booked and it being watched.",
      "If a traveler's route crosses an emerging risk — a storm system, a security incident, an airspace closure — the platform flags the exposure automatically and routes an alert to both the traveler and your duty-of-care team, with enough context to decide on a reroute or a hold before the situation develops further.",
      "Dashboards give your security desk a single map view of everyone currently in motion, filterable by region, risk level, or business unit, so a live headcount of exposed personnel is always one glance away.",
    ],
  },
  "Mass Communication": {
    category: "Platform",
    summary: "Reach the right people, at the right radius, in seconds — not the whole company.",
    body: [
      "When a situation demands a notification, speed and precision both matter. Mass Communication lets your team compose a single alert and dispatch it instantly to everyone inside a defined radius — a building, a city, a country — by SMS, app push, email, or automated voice call, with delivery and read receipts tracked in real time.",
      "Message templates are pre-approved by category (severe weather, security incident, facility lockdown, all-clear) so a response doesn't have to be drafted from scratch under pressure, and every dispatch is logged for after-action review.",
      "Two-way check-in requests can go out alongside the alert itself, so the same message that warns your people can also confirm they're safe — turning a one-way broadcast into a real accountability tool.",
    ],
  },
};

function findSiblingServices(label) {
  for (const top of NAV_MENU) {
    if (!top.items) continue;
    for (const entry of top.items) {
      if (entry.items) {
        const match = entry.items.find((leaf) => leaf.label === label);
        if (match) return entry.items.map((l) => l.label).filter((l) => l !== label);
      }
    }
    const topLevelLabels = top.items.filter((e) => !e.items).map((e) => e.label);
    if (topLevelLabels.includes(label)) return topLevelLabels.filter((l) => l !== label);
  }
  return [];
}

/* -------------------------------------------------------------- primitives -- */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// Directional scroll reveal. `from` picks the axis the content travels along:
// "up" (default), "left", "right", or "scale". Distance is deliberately modest —
// large travel reads as a slideshow rather than as the page settling into place.
const OFFSETS = {
  up:    "translate3d(0, 26px, 0)",
  left:  "translate3d(-42px, 0, 0)",
  right: "translate3d(42px, 0, 0)",
  scale: "scale(.94)",
};

function Reveal({ children, delay = 0, from = "up", style = {} }) {
  const [ref, visible] = useReveal();
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible || reduced ? 1 : 0,
        transform: visible || reduced ? "none" : (OFFSETS[from] || OFFSETS.up),
        transition: reduced ? "none" :
          `opacity .8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        willChange: visible ? "auto" : "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Splits a heading into words and floats each one up in sequence. Used only on
// the largest headings — applied everywhere it would be noise rather than
// polish, and it costs a span per word.
function RevealWords({ text, className, style, delay = 0, stagger = 55 }) {
  const [ref, visible] = useReveal();
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = String(text).split(" ");

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", ...style }}>
      {words.map((w, i) => (
        // The mask needs vertical breathing room: with a tight line-height the
        // glyph box (ascender + descender) is taller than the line box, so a
        // flush overflow:hidden shears the tails off g, y, p, and q. Padding
        // opens the mask; the matching negative margin keeps layout identical.
        <span
          key={i}
          style={{
            display: "inline-block", overflow: "hidden", verticalAlign: "top",
            padding: "0.18em 0 0.22em", margin: "-0.18em 0 -0.22em",
          }}
        >
          <span
            style={{
              display: "inline-block",
              transform: visible || reduced ? "none" : "translateY(105%)",
              opacity: visible || reduced ? 1 : 0,
              transition: reduced ? "none" :
                `transform .75s cubic-bezier(.22,1,.36,1) ${delay + i * stagger}ms, opacity .75s ease ${delay + i * stagger}ms`,
            }}
          >
            {w}
          </span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  );
}

/* An eyebrow that means something: a live status lamp + a label. */
function Eyebrow({ children, tone = "gold", live = false }) {
  const c = tone === "red" ? T.red : T.gold;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {live ? (
        <span style={{ position: "relative", display: "flex", width: 7, height: 7, flexShrink: 0 }}>
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c, animation: "fs-ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
          <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: c }} />
        </span>
      ) : (
        <span style={{ width: 18, height: 1, background: c, flexShrink: 0 }} />
      )}
      <span className="fs-mono" style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: c, fontWeight: 500 }}>
        {children}
      </span>
    </div>
  );
}

/* Brand mark — a shield built from a stack of scan lines, so it reads as
   "layered monitoring" rather than generic security-badge. */
function ForeSecureMark({ size = 34 }) {
  return (
    <svg width={size} height={size * 1.14} viewBox="0 0 40 46" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="fsG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={T.gold} />
          <stop offset="100%" stopColor={T.goldDim} />
        </linearGradient>
        <clipPath id="fsClip">
          <path d="M20 1.5 L37 8 V21.5 C37 32 29.5 40.5 20 44.5 C10.5 40.5 3 32 3 21.5 V8 Z" />
        </clipPath>
      </defs>
      <path d="M20 1.5 L37 8 V21.5 C37 32 29.5 40.5 20 44.5 C10.5 40.5 3 32 3 21.5 V8 Z"
            fill="none" stroke="url(#fsG)" strokeWidth="1.7" />
      <g clipPath="url(#fsClip)">
        {[10, 15, 20, 25, 30, 35].map((y, i) => (
          <rect key={y} x="3" y={y} width="34" height="1.6"
                fill={T.gold} opacity={0.16 + i * 0.055} />
        ))}
        <circle cx="20" cy="22" r="4.2" fill={T.red} />
        <circle cx="20" cy="22" r="8" fill="none" stroke={T.red} strokeWidth="1" opacity="0.45" />
      </g>
    </svg>
  );
}

function BrandLogo({ height = 30, onDark = true }) {
  const ink = onDark ? T.ink : "#0B0E14";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: height * 0.36 }}>
      <ForeSecureMark size={height * 0.95} />
      <div style={{ display: "flex", alignItems: "baseline", gap: ".1em" }}>
        <span className="fs-display" style={{ fontSize: height * 0.72, fontWeight: 700, color: ink, letterSpacing: "-.02em", lineHeight: 1 }}>Fore</span>
        <span className="fs-display" style={{ fontSize: height * 0.72, fontWeight: 700, color: T.gold, letterSpacing: "-.02em", lineHeight: 1 }}>Secure</span>
      </div>
    </div>
  );
}

/* Procedural imagery: a layered topographic/contour field. Used as the visual
   for service pages so every page has real art without stock photography. */
function ContourArt({ seed = 1, height = 240, accent = T.gold }) {
  const lines = [];
  const rows = 22;
  for (let r = 0; r < rows; r++) {
    let d = `M 0 ${40 + r * 14}`;
    for (let x = 0; x <= 100; x += 4) {
      const y =
        40 + r * 14 +
        Math.sin((x / 100) * Math.PI * 2 + seed * 1.7 + r * 0.32) * (18 - r * 0.5) +
        Math.sin((x / 100) * Math.PI * 5 + seed * 0.6) * 5;
      d += ` L ${x * 8} ${y}`;
    }
    lines.push(d);
  }
  return (
    <div style={{ position: "relative", height, borderRadius: 14, overflow: "hidden", background: T.void, border: `1px solid ${T.ridge}` }}>
      <svg viewBox="0 0 800 340" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {lines.map((d, i) => (
          <path key={i} d={d} fill="none" stroke={accent} strokeWidth={i % 5 === 0 ? 1.1 : 0.55}
                opacity={i % 5 === 0 ? 0.42 : 0.16} />
        ))}
      </svg>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 20% 0%, transparent 20%, ${T.void} 92%)` }} />
    </div>
  );
}

/* ------------------------------------------------------------------ menus -- */

function NavMenuItem({ item, isOpen, onOpen, onClose, onNavigate }) {
  const hasChildren = Boolean(item.items?.length);
  const [activeGroup, setActiveGroup] = useState(null);
  // Hover menus that close the instant the cursor leaves are hostile: the gap
  // between the trigger and the panel, or a diagonal move toward a flyout,
  // both cause an accidental close. A short close delay, cancelled on
  // re-entry, makes the whole thing forgiving.
  const closeTimer = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      onClose();
      setActiveGroup(null);
    }, 220);
  };

  useEffect(() => cancelClose, []);
  useEffect(() => { if (!isOpen) setActiveGroup(null); }, [isOpen]);

  const go = (label) => {
    cancelClose();
    setActiveGroup(null);
    onNavigate(label);
  };

  if (!hasChildren) {
    return (
      <button onClick={() => onNavigate(item.label)} className="fs-navlink">
        {item.label}
      </button>
    );
  }

  const active = item.items.find((g) => g.label === activeGroup);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => { cancelClose(); onOpen(); }}
      onMouseLeave={scheduleClose}
    >
      <button
        onClick={() => (isOpen ? onClose() : onOpen())}
        className="fs-navlink"
        style={{ display: "flex", alignItems: "center", gap: 5, color: isOpen ? T.gold : T.inkMid }}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          size={13}
          style={{ transition: "transform .3s cubic-bezier(.22,1,.36,1)", transform: isOpen ? "rotate(180deg)" : "none" }}
        />
      </button>

      {/* Bridges the gap between trigger and panel so a downward cursor move
          never passes through dead space and closes the menu. */}
      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 18, pointerEvents: isOpen ? "auto" : "none" }} />

      <div
        className={`fs-drop ${isOpen ? "fs-drop--on" : ""}`}
        role="menu"
      >
        <div className="fs-drop-list">
          {item.items.map((group, i) => {
            const kids = Boolean(group.items?.length);
            const on = activeGroup === group.label;
            return (
              <button
                key={group.label}
                className={`fs-drop-item ${on ? "fs-drop-item--on" : ""}`}
                style={{ transitionDelay: isOpen ? `${i * 28}ms` : "0ms" }}
                onMouseEnter={() => setActiveGroup(kids ? group.label : null)}
                onClick={() => go(group.label)}
                role="menuitem"
              >
                <span>{group.label}</span>
                {kids && <ChevronRight size={13} style={{ flexShrink: 0, opacity: on ? 1 : .45 }} />}
              </button>
            );
          })}
        </div>

        {/* Flyout for the hovered group. Rendered inside the panel so the
            cursor never has to cross a gap to reach it. */}
        {active && (
          <div className="fs-flyout" key={active.label}>
            <div className="fs-flyout-head">{active.label}</div>
            {active.items.map((leaf, i) => (
              <button
                key={leaf.label}
                className="fs-drop-item"
                style={{ animationDelay: `${i * 35}ms` }}
                onClick={() => go(leaf.label)}
                role="menuitem"
              >
                {leaf.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MobileNavAccordion({ menu, onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {menu.map((item) => {
        if (!item.items?.length) {
          return (
            <button key={item.label} onClick={() => onNavigate(item.label)} className="fs-navlink" style={{ padding: "12px 0", textAlign: "left" }}>
              {item.label}
            </button>
          );
        }
        return (
          <details key={item.label} className="fs-details">
            <summary className="fs-navlink">{item.label}</summary>
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: 14 }}>
              {item.items.map((sub) => {
                if (!sub.items?.length) {
                  return (
                    <button key={sub.label} onClick={() => onNavigate(sub.label)} className="fs-navlink" style={{ padding: "9px 0", fontSize: 13.5, textAlign: "left" }}>
                      {sub.label}
                    </button>
                  );
                }
                return (
                  <details key={sub.label} className="fs-details">
                    <summary className="fs-navlink" style={{ fontSize: 13.5 }}>{sub.label}</summary>
                    <div style={{ display: "flex", flexDirection: "column", paddingLeft: 14 }}>
                      {sub.items.map((leaf) => (
                        <button key={leaf.label} onClick={() => onNavigate(leaf.label)} className="fs-navlink" style={{ padding: "9px 0", fontSize: 12.5, textAlign: "left" }}>
                          {leaf.label}
                        </button>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}

function FullScreenMenu({ open, onClose, onNavigate, onRequestBriefing }) {
  const [expanded, setExpanded] = useState(null);
  const go = (label) => { onNavigate(label); onClose(); setExpanded(null); };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: T.hull, zIndex: 100,
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform .5s cubic-bezier(.76,0,.24,1)",
        display: "flex", flexDirection: "column",
      }}
      aria-hidden={!open}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: `1px solid ${T.ridge}` }}>
        <BrandLogo height={26} />
        <button onClick={onClose} className="fs-icon-btn" aria-label="Close menu"><X size={24} /></button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {OVERFLOW_MENU.map((item) => {
          const kids = Boolean(item.items?.length);
          const isX = expanded === item.label;
          return (
            <div key={item.label} style={{ borderBottom: `1px solid ${T.ridge}` }}>
              <button
                onClick={() => (kids ? setExpanded(isX ? null : item.label) : go(item.label))}
                className="fs-display"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "24px 28px", background: "none", border: "none", cursor: "pointer",
                  color: T.ink, fontSize: 24, fontWeight: 600, textAlign: "left", letterSpacing: "-.01em",
                }}
              >
                {item.label}
                {kids && <ChevronDown size={22} color={T.inkLow} style={{ transition: "transform .25s", transform: isX ? "rotate(180deg)" : "none" }} />}
              </button>
              {kids && isX && (
                <div style={{ padding: "0 28px 22px", display: "flex", flexDirection: "column", gap: 2 }}>
                  {item.items.map((sub) => (
                    <button key={sub.label} onClick={() => go(sub.label)} className="fs-droplink" style={{ fontSize: 15, padding: "11px 12px" }}>
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ padding: 28, borderTop: `1px solid ${T.ridge}` }}>
        <button className="fs-btn" style={{ width: "100%", justifyContent: "center" }} onClick={() => { onRequestBriefing(); onClose(); }}>
          Request a briefing <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- modals -- */

function LocationModal({ data, onClose }) {
  if (!data) return null;
  const { title, url, source, location } = data;
  const mapSrc = location ? `https://www.google.com/maps?q=${location.lat},${location.lng}&z=9&output=embed` : null;
  const mapsLink = location ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}` : null;

  return (
    <div className="fs-scrim" onClick={onClose}>
      <div className="fs-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.ridge}`, display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h3 className="fs-display" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, margin: 0, color: T.ink }}>{title}</h3>
            {source && <div className="fs-mono" style={{ fontSize: 11.5, color: T.inkLow, marginTop: 7, letterSpacing: ".05em" }}>{source}</div>}
          </div>
          <button onClick={onClose} className="fs-icon-btn" aria-label="Close"><X size={19} /></button>
        </div>
        {mapSrc ? (
          <iframe title="Article location" src={mapSrc} width="100%" height="290" style={{ border: 0, display: "block", filter: "invert(.92) hue-rotate(180deg) saturate(.7)" }} loading="lazy" />
        ) : (
          <div style={{ padding: "48px 24px", textAlign: "center", color: T.inkLow, fontSize: 13.5 }}>
            <MapPinned size={28} style={{ marginBottom: 10 }} />
            <div>No precise location identified for this report.</div>
          </div>
        )}
        <div style={{ padding: "18px 24px", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {mapsLink && <a href={mapsLink} target="_blank" rel="noreferrer" className="fs-btn-ghost" style={{ fontSize: 13.5 }}><MapPinned size={15} /> Open in Maps</a>}
          {url && <a href={url} target="_blank" rel="noreferrer" className="fs-btn" style={{ fontSize: 13.5 }}>Read full report <ExternalLink size={14} /></a>}
        </div>
      </div>
    </div>
  );
}

function AdvisoryModal({ open, form, setForm, password, setPassword, submitting, error, onSubmit, onClose }) {
  if (!open) return null;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  return (
    <div className="fs-scrim" onClick={onClose}>
      <div className="fs-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 540, maxHeight: "88vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${T.ridge}`, display: "flex", justifyContent: "space-between", gap: 16, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Megaphone size={17} color={T.gold} />
            <h3 className="fs-display" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: T.ink }}>Publish a special advisory</h3>
          </div>
          <button onClick={onClose} className="fs-icon-btn" aria-label="Close"><X size={19} /></button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 17, overflowY: "auto" }}>
          <label className="fs-field"><span>Headline</span>
            <input required value={form.title} onChange={set("title")} placeholder="Curfew declared in central district" />
          </label>
          <label className="fs-field"><span>What happened</span>
            <textarea value={form.description} onChange={set("description")} rows={4} placeholder="Details, who is affected, and guidance for personnel" />
          </label>
          <label className="fs-field"><span>Impact analysis</span>
            <textarea value={form.impact} onChange={set("impact")} rows={4} placeholder="Operational, safety, or business impact — and the recommended response" />
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label className="fs-field" style={{ flex: 1 }}><span>Risk level</span>
              <select value={form.risk} onChange={set("risk")}><option value="HIGH">High</option><option value="MEDIUM">Medium</option></select>
            </label>
            <label className="fs-field" style={{ flex: 1 }}><span>Region</span>
              <select value={form.region} onChange={set("region")}>
                <option value="APAC">APAC</option><option value="INDIA">India</option>
                <option value="EMEA">EMEA</option><option value="AMERICAS">Americas</option>
              </select>
            </label>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <label className="fs-field" style={{ flex: 1 }}><span>Incident type</span>
              <input value={form.incidentType} onChange={set("incidentType")} placeholder="Crisis" />
            </label>
            <label className="fs-field" style={{ flex: 1 }}><span>Date and time</span>
              <input type="datetime-local" value={form.dateTime} onChange={set("dateTime")} />
            </label>
          </div>
          <label className="fs-field"><span>Location</span>
            <input value={form.location} onChange={set("location")} placeholder="Manila, Philippines" />
          </label>

          <div style={{ border: `1px solid ${T.ridge}`, borderRadius: 10, padding: 16, background: T.void }}>
            <div className="fs-mono" style={{ fontSize: 10.5, letterSpacing: ".14em", textTransform: "uppercase", color: T.gold, marginBottom: 6 }}>Mass communication</div>
            <div style={{ fontSize: 12.5, color: T.inkLow, marginBottom: 12 }}>Send this advisory out to affected personnel?</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["yes", "no"].map((opt) => (
                <button key={opt} type="button" onClick={() => setForm((f) => ({ ...f, massCommunication: opt }))}
                  className={form.massCommunication === opt ? "fs-seg fs-seg--on" : "fs-seg"}>
                  {opt === "yes" ? "Send" : "Hold"}
                </button>
              ))}
            </div>
          </div>

          <label className="fs-field"><span>Source</span>
            <input value={form.source} onChange={set("source")} placeholder="Internal briefing" />
          </label>
          <label className="fs-field"><span>Link (optional)</span>
            <input value={form.url} onChange={set("url")} placeholder="https://" />
          </label>

          <div style={{ borderTop: `1px solid ${T.ridge}`, paddingTop: 17 }}>
            <label className="fs-field">
              <span><Lock size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Publishing password</span>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Authorized team members only" />
            </label>
          </div>

          {error && <div className="fs-error">{error}</div>}
          <button type="submit" disabled={submitting} className="fs-btn" style={{ justifyContent: "center", opacity: submitting ? .65 : 1 }}>
            {submitting ? "Publishing…" : "Publish advisory"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DeleteAdvisoryModal({ target, password, setPassword, submitting, error, onConfirm, onClose }) {
  if (!target) return null;
  return (
    <div className="fs-scrim" onClick={onClose} style={{ zIndex: 210 }}>
      <div className="fs-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 430, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Trash2 size={17} color={T.red} />
          <h3 className="fs-display" style={{ fontSize: 17, fontWeight: 600, margin: 0, color: T.ink }}>Delete this advisory?</h3>
        </div>
        <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 12, lineHeight: 1.6 }}>
          “{target.title}” will be removed for every visitor. This can't be undone.
        </p>
        <label className="fs-field" style={{ marginTop: 18 }}>
          <span><Lock size={11} style={{ verticalAlign: -1, marginRight: 5 }} />Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Authorized team members only" />
        </label>
        {error && <div className="fs-error" style={{ marginTop: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} className="fs-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Keep it</button>
          <button onClick={onConfirm} disabled={submitting} className="fs-btn fs-btn--danger" style={{ flex: 1, justifyContent: "center", opacity: submitting ? .65 : 1 }}>
            {submitting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- escalation --
   The spine fills as you scroll and each step lights when the fill reaches it,
   so the light visibly travels 01 -> 05. Driven by scroll position rather than
   a timer: the animation tracks the reader instead of running ahead of them.
   ---------------------------------------------------------------------------- */
function EscalationPath({ steps }) {
  const wrapRef = useRef(null);
  const [progress, setProgress] = useState(0);   // 0..1 down the spine

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }

    let ticking = false;
    const compute = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Start filling once the block's top passes 78% of the viewport, and
      // finish by the time its bottom reaches 45%. Those bounds mean the fill
      // completes while the list is still comfortably on screen.
      const start = vh * 0.78;
      const end = vh * 0.45;
      const p = (start - r.top) / Math.max(1, (r.height + start - end));
      setProgress(Math.max(0, Math.min(1, p)));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(compute); }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const n = steps.length;

  return (
    <div ref={wrapRef} style={{ marginTop: 48, position: "relative" }}>
      {/* dim spine */}
      <div style={{
        position: "absolute", left: 25, top: 12, bottom: 12, width: 2,
        background: T.ridge, borderRadius: 2,
      }} />

      {/* lit spine — height tracks scroll, with a bright head at the leading edge */}
      <div style={{
        position: "absolute", left: 25, top: 12, width: 2,
        height: `calc(${progress * 100}% - 24px * ${progress})`,
        background: `linear-gradient(180deg, ${T.gold} 0%, ${T.gold} 85%, #FFF1C9 100%)`,
        borderRadius: 2,
        boxShadow: `0 0 12px ${T.gold}, 0 0 28px rgba(212,169,71,.45)`,
        transition: "height .15s linear",
      }} />

      {steps.map((s, i) => {
        // A step lights when the fill has passed its own position on the spine.
        const threshold = n === 1 ? 0 : i / (n - 1) * 0.92;
        const lit = progress >= threshold;
        return (
          <div key={s.n} style={{
            display: "flex", gap: 26,
            paddingBottom: i === n - 1 ? 0 : 30,
            position: "relative",
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: "50%", flexShrink: 0, zIndex: 1,
              background: lit ? "rgba(212,169,71,.12)" : T.hull,
              border: `1px solid ${lit ? T.gold : T.ridgeHi}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: lit ? `0 0 22px rgba(212,169,71,.35)` : "none",
              transform: lit ? "scale(1.06)" : "scale(1)",
              transition: "background .45s ease, border-color .45s ease, box-shadow .5s ease, transform .5s cubic-bezier(.34,1.56,.64,1)",
            }}>
              <span className="fs-mono" style={{
                fontSize: 13, fontWeight: 500,
                color: lit ? T.gold : T.inkLow,
                transition: "color .45s ease",
              }}>{s.n}</span>
            </div>

            <div style={{
              paddingTop: 10, maxWidth: 620,
              opacity: lit ? 1 : 0.42,
              transform: lit ? "none" : "translateX(-10px)",
              transition: "opacity .55s ease, transform .55s cubic-bezier(.22,1,.36,1)",
            }}>
              <h3 className="fs-display" style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.015em" }}>{s.title}</h3>
              <p style={{ fontSize: 14.5, color: T.inkMid, marginTop: 8, lineHeight: 1.65 }}>{s.body}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* =========================================================== main component */

export default function ForeSecure() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotMenuOpen, setDotMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [liveArticles, setLiveArticles] = useState(null);
  const [regionNews, setRegionNews] = useState(null);
  const [newsError, setNewsError] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null);
  const [locationModal, setLocationModal] = useState(null);
  const [page, setPage] = useState("home"); // home | alerts | livemap | service | briefing | leads
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertRegionFilter, setAlertRegionFilter] = useState("ALL");
  const [specialAdvisories, setSpecialAdvisories] = useState([]);
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [advisoryPassword, setAdvisoryPassword] = useState("");
  const [advisorySubmitting, setAdvisorySubmitting] = useState(false);
  const [advisoryError, setAdvisoryError] = useState(null);
  const [advisoryForm, setAdvisoryForm] = useState({
    title: "", description: "", impact: "", risk: "HIGH", incidentType: "Crisis",
    region: "APAC", location: "", dateTime: "", massCommunication: "no", source: "", url: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [briefingForm, setBriefingForm] = useState({
    firstName: "", lastName: "", phone: "", email: "", organization: "", designation: "", message: "", website: "",
  });
  const [briefingSubmitting, setBriefingSubmitting] = useState(false);
  const [briefingError, setBriefingError] = useState(null);
  const [briefingSubmitted, setBriefingSubmitted] = useState(false);
  const [leadsPassword, setLeadsPassword] = useState("");
  const [leadsItems, setLeadsItems] = useState(null);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleNavigate(label) {
    setSelectedService(label);
    setPage("service");
    setOpenMenu(null);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  useEffect(() => {
    if (!openMenu) return;
    const onClick = (e) => { if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null); };
    const onKey = (e) => { if (e.key === "Escape") setOpenMenu(null); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, [openMenu]);

  function loadNews() {
    setNewsLoading(true);
    setNewsError(null);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setNewsError(data.error);
        else {
          setLiveArticles(data.all || []);
          setRegionNews(data.regions || null);
          setNewsUpdatedAt(data.updatedAt || new Date().toISOString());
        }
      })
      .catch(() => setNewsError("Live feed unreachable. Retrying automatically."))
      .finally(() => setNewsLoading(false));
  }

  useEffect(() => {
    loadNews();
    const id = setInterval(loadNews, 90 * 1000);
    return () => clearInterval(id);
  }, []);

  function loadAdvisories() {
    fetch("/api/advisories")
      .then((r) => r.json())
      .then((d) => setSpecialAdvisories(Array.isArray(d.items) ? d.items : []))
      .catch(() => {});
  }
  useEffect(() => { loadAdvisories(); }, []);

  function submitAdvisory(e) {
    e.preventDefault();
    setAdvisorySubmitting(true);
    setAdvisoryError(null);
    fetch("/api/advisories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...advisoryForm, password: advisoryPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "That password wasn't accepted. Check it and try again.");
        }
        return res.json();
      })
      .then((data) => {
        setSpecialAdvisories(Array.isArray(data.items) ? data.items : []);
        setAdvisoryForm({ title: "", description: "", impact: "", risk: "HIGH", incidentType: "Crisis", region: "APAC", location: "", dateTime: "", massCommunication: "no", source: "", url: "" });
        setAdvisoryPassword("");
        setAdvisoryModalOpen(false);
      })
      .catch((err) => setAdvisoryError(err.message))
      .finally(() => setAdvisorySubmitting(false));
  }

  function deleteAdvisory() {
    if (!deleteTarget) return;
    setDeleteSubmitting(true);
    setDeleteError(null);
    fetch("/api/advisories", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id, password: deletePassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "That password wasn't accepted. Check it and try again.");
        }
        return res.json();
      })
      .then((data) => {
        setSpecialAdvisories(Array.isArray(data.items) ? data.items : []);
        setDeleteTarget(null);
        setDeletePassword("");
        if (selectedAlert && selectedAlert.id === deleteTarget.id) setSelectedAlert(null);
      })
      .catch((err) => setDeleteError(err.message))
      .finally(() => setDeleteSubmitting(false));
  }

  function handleGoToBriefing() {
    setPage("briefing");
    setSelectedService(null);
    setSelectedAlert(null);
    setBriefingSubmitted(false);
    setBriefingError(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function submitBriefing(e) {
    e.preventDefault();
    setBriefingSubmitting(true);
    setBriefingError(null);
    fetch("/api/briefing-requests", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(briefingForm),
    })
      .then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "That didn't send. Check your details and try again.");
        }
        return res.json();
      })
      .then(() => {
        setBriefingSubmitted(true);
        setBriefingForm({ firstName: "", lastName: "", phone: "", email: "", organization: "", designation: "", message: "", website: "" });
      })
      .catch((err) => setBriefingError(err.message))
      .finally(() => setBriefingSubmitting(false));
  }

  function fetchLeads(e) {
    e.preventDefault();
    setLeadsLoading(true);
    setLeadsError(null);
    fetch(`/api/briefing-requests?password=${encodeURIComponent(leadsPassword)}`)
      .then(async (res) => {
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b.error || "That password wasn't accepted.");
        }
        return res.json();
      })
      .then((d) => setLeadsItems(Array.isArray(d.items) ? d.items : []))
      .catch((err) => setLeadsError(err.message))
      .finally(() => setLeadsLoading(false));
  }

  const REGION_ORDER = ["APAC", "INDIA", "EMEA", "AMERICAS"];
  const REGION_LABELS = { APAC: "APAC", INDIA: "India", EMEA: "EMEA", AMERICAS: "Americas" };
  const REGION_ICONS = { APAC: Globe2, INDIA: Flag, EMEA: Globe2, AMERICAS: Globe2 };

  function timeAgo(iso) {
    const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const h = Math.floor(mins / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const dedupedAlerts = (() => {
    const pool = regionNews ? Object.values(regionNews).flat() : (liveArticles || []);
    const seen = new Set();
    return pool
      .filter((a) => { if (!a.url || seen.has(a.url)) return false; seen.add(a.url); return true; })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  })();

  const activeCount = dedupedAlerts.length;
  const highCount = dedupedAlerts.filter((a) => a.risk === "HIGH").length;

  /* ------------------------------------------------------------------ view */
  return (
    <div className="fs-root">
      <style>{`
        @import url('${FONTS}');

        .fs-root {
          background: ${T.void};
          color: ${T.ink};
          font-family: 'Inter', system-ui, sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          overflow-x: hidden;
        }
        .fs-display { font-family: 'Space Grotesk', sans-serif; }
        .fs-mono { font-family: 'IBM Plex Mono', monospace; }

        .fs-wrap { max-width: 1200px; margin: 0 auto; padding-left: 28px; padding-right: 28px; }

        /* ---- buttons ---- */
        .fs-btn {
          background: ${T.gold}; color: #14100A; border: none; border-radius: 8px;
          padding: 13px 22px; font-weight: 600; font-size: 14.5px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 8px; font-family: inherit;
          transition: transform .18s cubic-bezier(.22,1,.36,1), box-shadow .25s, background .2s;
          box-shadow: 0 0 0 0 rgba(212,169,71,0);
        }
        .fs-btn:hover { background: #E4BB5C; transform: translateY(-2px); box-shadow: 0 10px 30px -10px rgba(212,169,71,.5); }
        .fs-btn--danger { background: ${T.red}; color: #fff; }
        .fs-btn--danger:hover { background: #F04E5E; box-shadow: 0 10px 30px -10px rgba(224,59,76,.5); }

        .fs-btn-ghost {
          background: transparent; color: ${T.ink}; border: 1px solid ${T.ridgeHi};
          border-radius: 8px; padding: 12px 21px; font-weight: 600; font-size: 14.5px;
          cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit;
          transition: border-color .22s, background .22s, transform .18s;
        }
        .fs-btn-ghost:hover { border-color: ${T.gold}; background: ${T.goldWash}; transform: translateY(-2px); }

        .fs-icon-btn {
          background: none; border: none; cursor: pointer; padding: 6px; display: flex;
          color: ${T.inkMid}; border-radius: 6px; transition: color .2s, background .2s;
        }
        .fs-icon-btn:hover { color: ${T.ink}; background: rgba(255,255,255,.05); }

        .fs-navlink {
          background: none; border: none; padding: 0; cursor: pointer;
          font-family: inherit; font-size: 14px; font-weight: 500; color: ${T.inkMid};
          transition: color .2s; text-decoration: none;
        }
        .fs-navlink:hover { color: ${T.ink}; }

        /* ---- surfaces ---- */
        .fs-card {
          background: ${T.panel}; border: 1px solid ${T.ridge}; border-radius: 14px;
          transition: border-color .3s, transform .3s cubic-bezier(.22,1,.36,1), background .3s;
        }
        .fs-card--hover:hover { border-color: ${T.ridgeHi}; transform: translateY(-3px); }

        /* ---- hairline grid, used as page texture ---- */
        .fs-grid-bg {
          background-image:
            linear-gradient(${T.ridge} 1px, transparent 1px),
            linear-gradient(90deg, ${T.ridge} 1px, transparent 1px);
          background-size: 64px 64px;
          opacity: .35;
        }

        /* ---- ticker ---- */
        .fs-ticker-track { display: flex; width: max-content; animation: fs-scroll 44s linear infinite; }
        .fs-ticker-track:hover { animation-play-state: paused; }
        @keyframes fs-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes fs-spin { to { transform: rotate(360deg); } }
        @keyframes fs-ping { 75%,100% { transform: scale(2.6); opacity: 0; } }
        @keyframes fs-fade-up { from { opacity:0; transform: translateY(24px);} to {opacity:1; transform:none;} }

        /* ---- dropdown ---- */
        .fs-drop {
          /* Anchored left, not centred. A centred panel grows outward in both
             directions when the flyout opens, sliding the list ~156px sideways
             out from under the cursor. Anchoring the left edge means the list
             stays put and only the flyout appears beside it. */
          position: absolute; top: calc(100% + 18px); left: -14px;
          display: flex; align-items: flex-start; z-index: 60;
          transform: translateY(-8px) scale(.97);
          transform-origin: top left;
          opacity: 0; pointer-events: none;
          transition: opacity .2s ease, transform .34s cubic-bezier(.34,1.56,.64,1);
        }
        /* The overshoot in that cubic-bezier is the "pop": the panel scales
           slightly past 1 before settling. Subtle on purpose — a big bounce
           reads as a toy, a small one reads as responsive. */
        .fs-drop--on {
          opacity: 1; pointer-events: auto;
          transform: translateY(0) scale(1);
        }
        .fs-drop-list {
          background: ${T.panel}; border: 1px solid ${T.ridge}; border-top: 2px solid ${T.gold};
          border-radius: 14px; box-shadow: 0 32px 80px -24px rgba(0,0,0,.88);
          padding: 10px; width: 268px; flex-shrink: 0;
        }
        .fs-flyout {
          background: ${T.panel}; border: 1px solid ${T.ridge}; border-top: 2px solid ${T.gold};
          border-radius: 14px; box-shadow: 0 32px 80px -24px rgba(0,0,0,.88);
          padding: 14px 12px 12px; width: 300px; margin-left: 10px; flex-shrink: 0;
          animation: fs-flyin .28s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes fs-flyin {
          from { opacity: 0; transform: translateX(-10px) scale(.97); }
          to   { opacity: 1; transform: none; }
        }
        .fs-flyout-head {
          font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; color: ${T.gold};
          letter-spacing: .16em; text-transform: uppercase;
          padding: 0 10px 10px; margin-bottom: 6px; border-bottom: 1px solid ${T.ridge};
        }
        .fs-drop-item {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          width: 100%; text-align: left; background: none; border: none; font: inherit;
          padding: 10px 12px; border-radius: 8px; cursor: pointer;
          font-size: 13.5px; line-height: 1.4; color: ${T.inkMid};
          transition: background .18s, color .18s, padding-left .18s;
        }
        .fs-drop-item:hover, .fs-drop-item--on {
          background: ${T.goldWash}; color: ${T.ink}; padding-left: 16px;
        }
        .fs-flyout .fs-drop-item {
          animation: fs-flyin .3s cubic-bezier(.22,1,.36,1) both;
        }
        .fs-droplink {
          display: block; text-align: left; background: none; border: none; font-family: inherit;
          width: 100%; padding: 7px 9px; margin: 0 -9px; border-radius: 7px;
          font-size: 13px; color: ${T.inkMid}; cursor: pointer; line-height: 1.45;
          transition: background .18s, color .18s;
        }
        .fs-droplink:hover { background: ${T.goldWash}; color: ${T.ink}; }
        .fs-droplink--top {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px; color: ${T.ink};
        }

        .fs-details summary { cursor: pointer; padding: 12px 0; list-style: none; }
        .fs-details summary::-webkit-details-marker { display: none; }
        .fs-details summary::after { content: "+"; float: right; color: ${T.inkLow}; }
        .fs-details[open] summary::after { content: "–"; }

        /* ---- forms ---- */
        .fs-field { display: flex; flex-direction: column; gap: 7px; }
        .fs-field > span {
          font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: .13em;
          text-transform: uppercase; color: ${T.inkLow};
        }
        .fs-field input, .fs-field textarea, .fs-field select {
          width: 100%; padding: 11px 13px; border-radius: 8px;
          border: 1px solid ${T.ridge}; background: ${T.void}; color: ${T.ink};
          font-size: 14px; font-family: inherit; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .fs-field textarea { resize: vertical; line-height: 1.55; }
        .fs-field input::placeholder, .fs-field textarea::placeholder { color: ${T.inkLow}; }
        .fs-field input:focus, .fs-field textarea:focus, .fs-field select:focus {
          border-color: ${T.gold}; box-shadow: 0 0 0 3px ${T.goldWash};
        }
        .fs-seg {
          flex: 1; padding: 10px 0; border-radius: 7px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; font-family: inherit; background: transparent; color: ${T.inkMid};
          border: 1px solid ${T.ridge}; transition: all .2s;
        }
        .fs-seg--on { background: ${T.gold}; color: #14100A; border-color: ${T.gold}; }
        .fs-error { font-size: 13px; color: ${T.red}; }

        /* ---- modals ---- */
        .fs-scrim {
          position: fixed; inset: 0; background: rgba(4,6,9,.82); backdrop-filter: blur(6px);
          z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px;
          animation: fs-fade-up .25s ease;
        }
        .fs-modal {
          background: ${T.panel}; border: 1px solid ${T.ridge}; border-radius: 16px;
          width: 100%; overflow: hidden; box-shadow: 0 40px 100px -20px rgba(0,0,0,.9);
        }

        /* ---- layout helpers ---- */
        .fs-g4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
        .fs-g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .fs-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .fs-split { display: grid; grid-template-columns: 1fr 1fr; }

        .fs-hero-grid {
          display: grid; grid-template-columns: 1.05fr .95fr; gap: 40px; align-items: center;
        }

        :focus-visible { outline: 2px solid ${T.gold}; outline-offset: 3px; border-radius: 4px; }

        @media (max-width: 1000px) {
          .fs-hero-grid { grid-template-columns: 1fr; gap: 24px; }
          .fs-desktop-nav { display: none !important; }
          .fs-mobile-toggle { display: flex !important; }
          .fs-g4 { grid-template-columns: repeat(2, 1fr); }
          .fs-g3 { grid-template-columns: 1fr; }
          .fs-split { grid-template-columns: 1fr; }
          .fs-service-layout { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 620px) {
          .fs-g4, .fs-g2 { grid-template-columns: 1fr; }
          .fs-wrap { padding-left: 20px; padding-right: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      `}</style>

      {/* ============================================================ HEADER */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 40,
          borderBottom: `1px solid ${scrolled ? T.ridge : "transparent"}`,
          background: scrolled ? "rgba(7,9,13,.85)" : "transparent",
          backdropFilter: scrolled ? "blur(14px)" : "none",
          transition: "background .3s, border-color .3s",
        }}
      >
        <div className="fs-wrap" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, paddingTop: 16, paddingBottom: 16 }}>
          <button
            onClick={() => { setPage("home"); setSelectedAlert(null); setSelectedService(null); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
            aria-label="ForeSecure home"
          >
            <BrandLogo height={30} />
          </button>

          <nav ref={navRef} className="fs-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28, flex: 1, justifyContent: "center" }}>
            {NAV_MENU.map((item) => (
              <NavMenuItem
                key={item.label}
                item={item}
                isOpen={openMenu === item.label}
                onOpen={() => setOpenMenu(item.label)}
                onClose={() => setOpenMenu((m) => (m === item.label ? null : m))}
                onNavigate={handleNavigate}
              />
            ))}
            <button onClick={() => handleNavigate("Travel Tracker")} className="fs-navlink">Travel Tracker</button>
            <button onClick={() => handleNavigate("Mass Communication")} className="fs-navlink">Mass Communication</button>

            <button
              onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 9, cursor: "pointer", fontFamily: "inherit",
                background: page === "alerts" ? T.redWash : "transparent",
                color: page === "alerts" ? T.red : T.inkMid,
                border: `1px solid ${page === "alerts" ? T.redDim : T.ridge}`,
                borderRadius: 40, padding: "7px 15px 7px 12px", fontSize: 12.5, fontWeight: 600,
                transition: "all .22s",
              }}
            >
              <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.red, animation: "fs-ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.red }} />
              </span>
              Live alerts
            </button>

            <button
              onClick={() => { setPage("livemap"); setSelectedAlert(null); setSelectedService(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: "inherit",
                background: page === "livemap" ? T.goldWash : "transparent",
                color: page === "livemap" ? T.gold : T.inkMid,
                border: `1px solid ${page === "livemap" ? T.goldDim : T.ridge}`,
                borderRadius: 40, padding: "7px 15px 7px 12px", fontSize: 12.5, fontWeight: 600,
                transition: "all .22s",
              }}
            >
              <MapPinned size={13} />
              Live location alerts
            </button>
          </nav>

          <div className="fs-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <a href="#" className="fs-navlink">Sign in</a>
            <button onClick={() => setDotMenuOpen(true)} className="fs-icon-btn" aria-label="More"><MoreHorizontal size={21} /></button>
          </div>

          <div className="fs-mobile-toggle" style={{ display: "none", alignItems: "center", gap: 2 }}>
            <button onClick={() => setDotMenuOpen(true)} className="fs-icon-btn" aria-label="More"><MoreHorizontal size={21} /></button>
            <button onClick={() => setMenuOpen((v) => !v)} className="fs-icon-btn" aria-label="Menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          </div>
        </div>

        {menuOpen && (
          <div className="fs-wrap" style={{ paddingTop: 8, paddingBottom: 22, borderTop: `1px solid ${T.ridge}` }}>
            <MobileNavAccordion menu={NAV_MENU} onNavigate={handleNavigate} />
            <button onClick={() => handleNavigate("Travel Tracker")} className="fs-navlink" style={{ padding: "12px 0", textAlign: "left" }}>Travel Tracker</button>
            <button onClick={() => handleNavigate("Mass Communication")} className="fs-navlink" style={{ padding: "12px 0", display: "block", textAlign: "left" }}>Mass Communication</button>
            <button onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); setMenuOpen(false); }} className="fs-navlink" style={{ padding: "12px 0", display: "block", textAlign: "left", color: T.red }}>Live alerts</button>
            <button onClick={() => { setPage("livemap"); setSelectedAlert(null); setSelectedService(null); setMenuOpen(false); }} className="fs-navlink" style={{ padding: "12px 0", display: "block", textAlign: "left", color: T.gold }}>Live location alerts</button>
          </div>
        )}
      </header>

      <FullScreenMenu open={dotMenuOpen} onClose={() => setDotMenuOpen(false)} onNavigate={handleNavigate} onRequestBriefing={handleGoToBriefing} />
      <LocationModal data={locationModal} onClose={() => setLocationModal(null)} />
      <AdvisoryModal open={advisoryModalOpen} form={advisoryForm} setForm={setAdvisoryForm}
        password={advisoryPassword} setPassword={setAdvisoryPassword} submitting={advisorySubmitting}
        error={advisoryError} onSubmit={submitAdvisory}
        onClose={() => { setAdvisoryModalOpen(false); setAdvisoryError(null); }} />
      <DeleteAdvisoryModal target={deleteTarget} password={deletePassword} setPassword={setDeletePassword}
        submitting={deleteSubmitting} error={deleteError} onConfirm={deleteAdvisory}
        onClose={() => { setDeleteTarget(null); setDeleteError(null); }} />

      {/* ============================================================== HOME */}
      {page === "home" && (
        <>
          {/* ---- HERO: the globe is the thesis ---- */}
          <section style={{ position: "relative", overflow: "hidden", paddingTop: 24, paddingBottom: 40 }}>
            <div className="fs-grid-bg" style={{ position: "absolute", inset: 0, maskImage: "radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)", WebkitMaskImage: "radial-gradient(70% 60% at 50% 30%, #000 0%, transparent 100%)" }} />
            <div className="fs-wrap" style={{ position: "relative" }}>
              <div className="fs-hero-grid">
                <div style={{ animation: "fs-fade-up .9s cubic-bezier(.22,1,.36,1) both" }}>
                  <Eyebrow live>{activeCount ? `${activeCount} events on watch` : "Watch desk online"}</Eyebrow>

                  <h1 className="fs-display" style={{
                    fontSize: "clamp(38px, 5.6vw, 68px)", fontWeight: 700, lineHeight: 1.02,
                    letterSpacing: "-.035em", marginTop: 22, marginBottom: 0,
                  }}>
                    Know your people<br />are safe.<br />
                    <span style={{ color: T.gold }}>Before you're asked.</span>
                  </h1>

                  <p style={{ fontSize: 17.5, color: T.inkMid, lineHeight: 1.65, marginTop: 24, maxWidth: 500 }}>
                    ForeSecure watches every site and every itinerary against live global conditions,
                    then alerts only the people actually exposed — with the action you want them to take.
                  </p>
                </div>

                {/* the globe */}
                <div style={{ position: "relative", aspectRatio: "1/1", minHeight: 340, animation: "fs-fade-up 1.1s cubic-bezier(.22,1,.36,1) .15s both" }}>
                  <ThreatGlobe />
                  <div className="fs-mono" style={{
                    position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                    fontSize: 10, letterSpacing: ".14em", textTransform: "uppercase", color: T.inkLow,
                    whiteSpace: "nowrap",
                  }}>
                    Drag to rotate
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ---- TICKER ---- */}
          <section style={{ background: T.hull, borderTop: `1px solid ${T.ridge}`, borderBottom: `1px solid ${T.ridge}`, padding: "14px 0", overflow: "hidden" }}>
            <div className="fs-ticker-track">
              {[...tickerFeed, ...tickerFeed].map((it, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 26px", borderRight: `1px solid ${T.ridge}`, whiteSpace: "nowrap" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: levelColor(it.level), flexShrink: 0 }} />
                  <span className="fs-mono" style={{ fontSize: 10.5, letterSpacing: ".12em", color: levelColor(it.level), fontWeight: 500 }}>{it.level}</span>
                  <span style={{ fontSize: 13, color: T.ink, fontWeight: 500 }}>{it.loc}</span>
                  <span style={{ fontSize: 13, color: T.inkMid }}>{it.type}</span>
                  <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>T+{it.t}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ---- COVERAGE DOMAINS (not numbered — not a sequence) ---- */}
          <section className="fs-wrap" style={{ paddingTop: 100 }}>
            <Reveal>
              <Eyebrow>Coverage</Eyebrow>
              <h2 className="fs-display" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-.028em", marginTop: 16, maxWidth: 640, lineHeight: 1.12 }}>
                <RevealWords text="Four threat domains, one chain of command." />
              </h2>
            </Reveal>

            <div className="fs-g4" style={{ marginTop: 44 }}>
              {DOMAINS.map(({ icon: Icon, title, desc }, i) => (
                <Reveal key={title} delay={i * 90} from={i % 2 ? "right" : "left"}>
                  <div className="fs-card fs-card--hover" style={{ padding: 26, height: "100%", display: "flex", flexDirection: "column" }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: T.goldWash,
                      border: `1px solid ${T.goldDim}`, display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={18} color={T.gold} />
                    </div>
                    <h3 className="fs-display" style={{ fontSize: 17, fontWeight: 600, marginTop: 20, letterSpacing: "-.01em" }}>{title}</h3>
                    <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 10, lineHeight: 1.6, flex: 1 }}>{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---- ESCALATION PATH (numbered — order IS the information) ---- */}
          <section className="fs-wrap" style={{ paddingTop: 110 }}>
            <Reveal>
              <Eyebrow>Escalation path</Eyebrow>
              <h2 className="fs-display" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-.028em", marginTop: 16, maxWidth: 700, lineHeight: 1.12 }}>
                <RevealWords text="A signal becomes an alert in five steps — and never skips one." />
              </h2>
              <p style={{ fontSize: 15.5, color: T.inkMid, marginTop: 16, maxWidth: 560, lineHeight: 1.65 }}>
                The order matters more than the speed. Most false alarms come from dispatching before step two.
              </p>
            </Reveal>

            <EscalationPath steps={ESCALATION} />
          </section>

          {/* ---- PLATFORM SPLIT ---- */}
          <section className="fs-wrap" style={{ paddingTop: 110 }}>
            <div className="fs-g2" style={{ gap: 18 }}>
              {[
                { key: "Travel Tracker", icon: Plane, line: "Itineraries sync at booking. Nobody goes dark between legs." },
                { key: "Mass Communication", icon: Megaphone, line: "One message, one radius, delivery receipts in real time." },
              ].map(({ key, icon: Icon, line }, i) => (
                <Reveal key={key} delay={i * 100} from={i === 0 ? "left" : "right"}>
                  <button onClick={() => handleNavigate(key)} className="fs-card fs-card--hover"
                    style={{ display: "block", width: "100%", textAlign: "left", cursor: "pointer", padding: 0, overflow: "hidden", fontFamily: "inherit" }}>
                    <ContourArt seed={i + 2} height={190} accent={i === 0 ? T.gold : T.red} />
                    <div style={{ padding: 26 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                          <Icon size={17} color={T.gold} />
                          <h3 className="fs-display" style={{ fontSize: 20, fontWeight: 600, color: T.ink, letterSpacing: "-.02em" }}>{key}</h3>
                        </div>
                        <ArrowUpRight size={19} color={T.inkLow} />
                      </div>
                      <p style={{ fontSize: 14.5, color: T.inkMid, marginTop: 10, lineHeight: 1.6 }}>{line}</p>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ---- LIVE FEED PREVIEW ---- */}
          <section className="fs-wrap" style={{ paddingTop: 110 }}>
            <Reveal>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
                <div>
                  <Eyebrow tone="red" live>Live feed</Eyebrow>
                  <h2 className="fs-display" style={{ fontSize: "clamp(28px,3.6vw,42px)", fontWeight: 700, letterSpacing: "-.028em", marginTop: 16, lineHeight: 1.12 }}>
                    <RevealWords text="What the desk is watching right now." />
                  </h2>
                </div>
                <button className="fs-btn-ghost" onClick={() => { setPage("alerts"); setSelectedAlert(null); }}>
                  All alerts <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>

            <div className="fs-g3" style={{ marginTop: 36 }}>
              {dedupedAlerts.slice(0, 3).map((item, i) => (
                <Reveal key={item.url} delay={i * 90} from="up">
                  <button onClick={() => { setSelectedAlert(item); setPage("alerts"); window.scrollTo({ top: 0 }); }}
                    className="fs-card fs-card--hover"
                    style={{ display: "block", width: "100%", padding: 24, height: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="fs-mono" style={{
                        fontSize: 9.5, fontWeight: 500, letterSpacing: ".12em",
                        color: item.risk === "HIGH" ? T.red : T.amber,
                        background: item.risk === "HIGH" ? T.redWash : "rgba(232,163,61,.1)",
                        border: `1px solid ${item.risk === "HIGH" ? T.redDim : "rgba(232,163,61,.3)"}`,
                        padding: "3px 8px", borderRadius: 4,
                      }}>{item.risk}</span>
                      <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{item.tag}</span>
                      <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow, marginLeft: "auto" }}>{timeAgo(item.publishedAt)}</span>
                    </div>
                    <h3 className="fs-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 15, lineHeight: 1.42, color: T.ink }}>{item.title}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 12.5, color: T.inkLow }}>
                      {item.location ? <MapPin size={13} /> : <Newspaper size={13} />}
                      {item.location ? item.location.name : item.source}
                    </div>
                  </button>
                </Reveal>
              ))}

              {dedupedAlerts.length === 0 && (
                <div className="fs-card" style={{ padding: 30, gridColumn: "1 / -1", textAlign: "center" }}>
                  <Radio size={22} color={T.inkLow} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 14, color: T.inkMid }}>
                    {newsLoading ? "Connecting to the feed…" : newsError ? newsError : "No high or medium-risk events active. The desk is quiet."}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* ---- NEWSLETTER + CTA ---- */}
          <section className="fs-wrap" style={{ paddingTop: 110 }}>
            <Reveal from="scale">
              <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: `1px solid ${T.ridge}`, background: T.hull }}>
                <div className="fs-grid-bg" style={{ position: "absolute", inset: 0, opacity: .25 }} />
                <div style={{ position: "relative", padding: "48px 44px", display: "flex", flexWrap: "wrap", gap: 28, alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ maxWidth: 440 }}>
                    <Eyebrow>Monday briefing</Eyebrow>
                    <h3 className="fs-display" style={{ fontSize: 25, fontWeight: 700, marginTop: 14, letterSpacing: "-.025em", lineHeight: 1.2 }}>
                      The five threats worth your attention, every Monday.
                    </h3>
                  </div>
                  {subscribed ? (
                    <div style={{ color: T.gold, fontSize: 14.5, display: "flex", alignItems: "center", gap: 9 }}>
                      <CheckCircle2 size={18} /> You're on the distribution list.
                    </div>
                  ) : (
                    <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubscribed(true); }}
                      style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", background: T.void, borderRadius: 8, padding: "0 14px", border: `1px solid ${T.ridge}` }}>
                        <Mail size={15} color={T.inkLow} />
                        <input type="email" required placeholder="you@company.com" value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ background: "transparent", border: "none", color: T.ink, padding: "12px 10px", fontSize: 14, width: 210, outline: "none", fontFamily: "inherit" }} />
                      </div>
                      <button type="submit" className="fs-btn">Subscribe</button>
                    </form>
                  )}
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div style={{ textAlign: "center", marginTop: 60 }}>
                <h3 className="fs-display" style={{ fontSize: "clamp(24px,3vw,34px)", fontWeight: 700, letterSpacing: "-.028em" }}>
                  Talk to an analyst, not a sales queue.
                </h3>
                <p style={{ fontSize: 15, color: T.inkMid, marginTop: 12, maxWidth: 420, marginInline: "auto", lineHeight: 1.6 }}>
                  Tell us where your people go. We'll show you what we'd be watching.
                </p>
                <button className="fs-btn" style={{ marginTop: 24 }} onClick={handleGoToBriefing}>
                  Request a briefing <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ============================================================ ALERTS */}
      {page === "alerts" && (
        <section className="fs-wrap" style={{ paddingTop: 40, paddingBottom: 100 }}>
          {!selectedAlert ? (
            <>
              <Reveal>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
                  <div>
                    <Eyebrow tone="red" live>Live alerts</Eyebrow>
                    <h1 className="fs-display" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 16, lineHeight: 1.08 }}>
                      Every active briefing.
                    </h1>
                    {activeCount > 0 && (
                      <p style={{ fontSize: 14.5, color: T.inkMid, marginTop: 12 }}>
                        {activeCount} events on watch · <span style={{ color: T.red }}>{highCount} high risk</span>
                      </p>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <button onClick={loadNews} disabled={newsLoading} className="fs-navlink"
                      style={{ display: "flex", alignItems: "center", gap: 7, color: T.gold, fontWeight: 600, opacity: newsLoading ? .6 : 1 }}>
                      <RefreshCw size={14} style={{ animation: newsLoading ? "fs-spin 1s linear infinite" : "none" }} />
                      {newsLoading ? "Refreshing…" : "Refresh"}
                    </button>
                    <div className="fs-mono" style={{ fontSize: 10.5, color: T.inkLow, display: "flex", alignItems: "center", gap: 7, letterSpacing: ".08em" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: newsLoading ? T.amber : T.green }} />
                      {newsUpdatedAt ? `Updated ${timeAgo(newsUpdatedAt)}` : "Live"}
                    </div>
                  </div>
                </div>
              </Reveal>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 32 }}>
                {["ALL", ...REGION_ORDER].map((key) => {
                  const Ic = key === "ALL" ? Layers : (REGION_ICONS[key] || Globe2);
                  const on = alertRegionFilter === key;
                  return (
                    <button key={key} onClick={() => setAlertRegionFilter(key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit",
                        background: on ? T.goldWash : "transparent",
                        color: on ? T.gold : T.inkMid,
                        border: `1px solid ${on ? T.goldDim : T.ridge}`,
                        borderRadius: 40, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                        transition: "all .2s",
                      }}>
                      <Ic size={13} />
                      {key === "ALL" ? "All regions" : REGION_LABELS[key]}
                    </button>
                  );
                })}
                <button onClick={() => setAlertRegionFilter("SPECIAL")}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit",
                    background: alertRegionFilter === "SPECIAL" ? T.goldWash : "transparent",
                    color: alertRegionFilter === "SPECIAL" ? T.gold : T.inkMid,
                    border: `1px solid ${alertRegionFilter === "SPECIAL" ? T.goldDim : T.ridge}`,
                    borderRadius: 40, padding: "8px 16px", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                    transition: "all .2s",
                  }}>
                  <Megaphone size={13} /> Special advisory
                </button>
              </div>

              {alertRegionFilter === "SPECIAL" ? (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 22 }}>
                    <button onClick={() => setAdvisoryModalOpen(true)} className="fs-btn-ghost" style={{ fontSize: 13.5, padding: "10px 18px" }}>
                      <Plus size={15} /> New advisory
                    </button>
                  </div>
                  <div className="fs-g3" style={{ marginTop: 18 }}>
                    {specialAdvisories.map((item, i) => (
                      <Reveal key={item.id || item.title + i} delay={Math.min(i, 8) * 60}>
                        <div style={{ position: "relative", height: "100%" }}>
                          <button onClick={() => setSelectedAlert(item)} className="fs-card fs-card--hover"
                            style={{ display: "block", width: "100%", padding: 24, height: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingRight: 30 }}>
                              <span className="fs-mono" style={{
                                fontSize: 9.5, fontWeight: 500, letterSpacing: ".12em",
                                color: item.risk === "HIGH" ? T.red : T.amber,
                                background: item.risk === "HIGH" ? T.redWash : "rgba(232,163,61,.1)",
                                border: `1px solid ${item.risk === "HIGH" ? T.redDim : "rgba(232,163,61,.3)"}`,
                                padding: "3px 8px", borderRadius: 4,
                              }}>{item.risk}</span>
                              <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{item.incidentType}</span>
                              <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{timeAgo(item.publishedAt)}</span>
                            </div>
                            <h3 className="fs-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 15, lineHeight: 1.42, color: T.ink }}>{item.title}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 12.5, color: T.inkLow }}>
                              {item.location ? <MapPin size={13} /> : <Newspaper size={13} />}
                              {item.location ? item.location.name : item.source}
                            </div>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setDeleteError(null); setDeletePassword(""); setDeleteTarget(item); }}
                            className="fs-icon-btn" aria-label="Delete advisory"
                            style={{ position: "absolute", top: 14, right: 14, background: T.void, border: `1px solid ${T.ridge}` }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  {specialAdvisories.length === 0 && (
                    <div className="fs-card" style={{ padding: 40, marginTop: 24, textAlign: "center" }}>
                      <Megaphone size={22} color={T.inkLow} style={{ marginBottom: 12 }} />
                      <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 500 }}>No advisories published yet.</p>
                      <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 6 }}>Publish one when a single situation needs its own briefing.</p>
                      <button onClick={() => setAdvisoryModalOpen(true)} className="fs-btn" style={{ marginTop: 20 }}>
                        <Plus size={15} /> New advisory
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="fs-g3" style={{ marginTop: 30 }}>
                    {dedupedAlerts
                      .filter((a) => alertRegionFilter === "ALL" || a.region === alertRegionFilter)
                      .map((item, i) => (
                        <Reveal key={item.url} delay={Math.min(i, 8) * 55}>
                          <button onClick={() => setSelectedAlert(item)} className="fs-card fs-card--hover"
                            style={{ display: "block", width: "100%", padding: 24, height: "100%", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span className="fs-mono" style={{
                                fontSize: 9.5, fontWeight: 500, letterSpacing: ".12em",
                                color: item.risk === "HIGH" ? T.red : T.amber,
                                background: item.risk === "HIGH" ? T.redWash : "rgba(232,163,61,.1)",
                                border: `1px solid ${item.risk === "HIGH" ? T.redDim : "rgba(232,163,61,.3)"}`,
                                padding: "3px 8px", borderRadius: 4,
                              }}>{item.risk}</span>
                              <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{item.tag}</span>
                              <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow, marginLeft: "auto" }}>{timeAgo(item.publishedAt)}</span>
                            </div>
                            <h3 className="fs-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 15, lineHeight: 1.42, color: T.ink }}>{item.title}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 18, fontSize: 12.5, color: T.inkLow }}>
                              {item.location ? <MapPin size={13} /> : <Newspaper size={13} />}
                              {item.location ? item.location.name : item.source}
                            </div>
                          </button>
                        </Reveal>
                      ))}
                  </div>
                  {dedupedAlerts.length === 0 && (
                    <div className="fs-card" style={{ padding: 44, marginTop: 30, textAlign: "center" }}>
                      <Radio size={24} color={T.inkLow} style={{ marginBottom: 12 }} />
                      <p style={{ fontSize: 15, color: T.ink, fontWeight: 500 }}>
                        {newsLoading ? "Connecting to the feed…" : newsError ? "Feed unreachable" : "The desk is quiet."}
                      </p>
                      <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 6 }}>
                        {newsLoading ? "This takes a few seconds." : newsError ? "Retrying automatically every 90 seconds." : "No high or medium-risk events are active right now."}
                      </p>
                      {newsError && <button onClick={loadNews} className="fs-btn-ghost" style={{ marginTop: 20 }}><RefreshCw size={14} /> Retry now</button>}
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <div>
              <button onClick={() => setSelectedAlert(null)} className="fs-navlink"
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, fontWeight: 600 }}>
                <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} /> All alerts
              </button>

              <div className="fs-split fs-card" style={{ overflow: "hidden", minHeight: "66vh" }}>
                <div style={{ padding: "34px 36px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="fs-mono" style={{
                      fontSize: 9.5, fontWeight: 500, letterSpacing: ".12em",
                      color: selectedAlert.risk === "HIGH" ? T.red : T.amber,
                      background: selectedAlert.risk === "HIGH" ? T.redWash : "rgba(232,163,61,.1)",
                      border: `1px solid ${selectedAlert.risk === "HIGH" ? T.redDim : "rgba(232,163,61,.3)"}`,
                      padding: "3px 8px", borderRadius: 4,
                    }}>{selectedAlert.risk} RISK</span>
                    <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{selectedAlert.tag || selectedAlert.incidentType}</span>
                  </div>

                  <h2 className="fs-display" style={{ fontSize: 26, fontWeight: 700, marginTop: 18, lineHeight: 1.28, letterSpacing: "-.025em" }}>
                    {selectedAlert.title}
                  </h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 20, fontSize: 13.5, color: T.inkMid }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Clock size={14} color={T.inkLow} /> Reported {timeAgo(selectedAlert.publishedAt)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Newspaper size={14} color={T.inkLow} /> {selectedAlert.source}</div>
                    {selectedAlert.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: 9 }}><MapPin size={14} color={T.inkLow} /> {selectedAlert.location.name}</div>
                    )}
                  </div>

                  <div style={{ borderTop: `1px solid ${T.ridge}`, marginTop: 26, paddingTop: 26, flex: 1 }}>
                    <div className="fs-mono" style={{ fontSize: 10.5, color: T.gold, textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 12 }}>What happened</div>
                    <p style={{ fontSize: 15, color: T.inkMid, lineHeight: 1.72 }}>
                      {selectedAlert.description || "The source published no summary. Open the full report for details."}
                    </p>
                    {selectedAlert.impact && (
                      <>
                        <div className="fs-mono" style={{ fontSize: 10.5, color: T.gold, textTransform: "uppercase", letterSpacing: ".14em", marginTop: 26, marginBottom: 12 }}>Impact analysis</div>
                        <p style={{ fontSize: 15, color: T.inkMid, lineHeight: 1.72 }}>{selectedAlert.impact}</p>
                      </>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
                    {selectedAlert.url && (
                      <a href={selectedAlert.url} target="_blank" rel="noreferrer" className="fs-btn" style={{ fontSize: 13.5 }}>
                        Read full report <ExternalLink size={14} />
                      </a>
                    )}
                    {selectedAlert.location && (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${selectedAlert.location.lat},${selectedAlert.location.lng}`}
                        target="_blank" rel="noreferrer" className="fs-btn-ghost" style={{ fontSize: 13.5 }}>
                        <MapPinned size={15} /> Open in Maps
                      </a>
                    )}
                  </div>
                </div>

                <div style={{ background: T.void, minHeight: 340, borderLeft: `1px solid ${T.ridge}` }}>
                  {selectedAlert.location ? (
                    <iframe title="Alert location"
                      src={`https://www.google.com/maps?q=${selectedAlert.location.lat},${selectedAlert.location.lng}&z=8&output=embed`}
                      width="100%" height="100%"
                      style={{ border: 0, display: "block", minHeight: 340, filter: "invert(.92) hue-rotate(180deg) saturate(.7)" }}
                      loading="lazy" />
                  ) : (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: T.inkLow, fontSize: 13.5, padding: 40, textAlign: "center" }}>
                      <MapPinned size={28} style={{ marginBottom: 12 }} />
                      No precise location identified for this alert.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* =========================================================== LIVE MAP */}
      {page === "livemap" && (
        <LiveMapPage
          alerts={dedupedAlerts}
          loading={newsLoading}
          error={newsError}
          updatedAt={newsUpdatedAt}
          onRefresh={loadNews}
          timeAgo={timeAgo}
        />
      )}

      {/* =========================================================== SERVICE */}
      {page === "service" && selectedService && SERVICE_CONTENT[selectedService] && (
        <>
          <section style={{ position: "relative", overflow: "hidden", padding: "36px 0 56px" }}>
            <div className="fs-grid-bg" style={{ position: "absolute", inset: 0, maskImage: "radial-gradient(60% 80% at 30% 20%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 80% at 30% 20%, #000, transparent)" }} />
            <div className="fs-wrap" style={{ position: "relative", maxWidth: 1000 }}>
              <button onClick={() => { setPage("home"); setSelectedService(null); }} className="fs-navlink"
                style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 26, fontWeight: 600 }}>
                <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Home
                <ChevronRight size={12} style={{ opacity: .5 }} />
                <span style={{ color: T.gold }}>{SERVICE_CONTENT[selectedService].category}</span>
              </button>

              <Reveal>
                <Eyebrow>{SERVICE_CONTENT[selectedService].category}</Eyebrow>
                <h1 className="fs-display" style={{ fontSize: "clamp(32px,4.4vw,52px)", fontWeight: 700, letterSpacing: "-.032em", marginTop: 18, lineHeight: 1.06, maxWidth: 800 }}>
                  {selectedService}
                </h1>
                <p style={{ fontSize: 18.5, color: T.inkMid, marginTop: 20, lineHeight: 1.6, maxWidth: 620 }}>
                  {SERVICE_CONTENT[selectedService].summary}
                </p>
                <button className="fs-btn" style={{ marginTop: 28 }} onClick={handleGoToBriefing}>
                  Request a briefing <ArrowRight size={15} />
                </button>
              </Reveal>
            </div>
          </section>

          <section className="fs-wrap" style={{ maxWidth: 1000 }}>
            <Reveal><ContourArt seed={selectedService.length % 7} height={260} /></Reveal>
          </section>

          <section className="fs-wrap" style={{ maxWidth: 1000, paddingTop: 52 }}>
            <div className="fs-service-layout" style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: 52 }}>
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                  {SERVICE_CONTENT[selectedService].body.map((p, i) => (
                    <p key={i} style={{ fontSize: 16.5, color: T.inkMid, lineHeight: 1.82 }}>{p}</p>
                  ))}
                </div>
              </Reveal>

              <div>
                {(() => {
                  const sib = findSiblingServices(selectedService);
                  if (!sib.length) return null;
                  return (
                    <Reveal delay={140}>
                      <div className="fs-card" style={{ padding: 22, position: "sticky", top: 96 }}>
                        <div className="fs-mono" style={{ fontSize: 10, color: T.gold, letterSpacing: ".14em", textTransform: "uppercase", marginBottom: 14 }}>Related</div>
                        {sib.map((label) => (
                          <button key={label} onClick={() => handleNavigate(label)} className="fs-droplink"
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                            <span>{label}</span>
                            <ChevronRight size={12} color={T.inkLow} style={{ flexShrink: 0 }} />
                          </button>
                        ))}
                      </div>
                    </Reveal>
                  );
                })()}
              </div>
            </div>
          </section>

          <section className="fs-wrap" style={{ maxWidth: 1000, paddingTop: 88, paddingBottom: 100 }}>
            <Reveal>
              <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", border: `1px solid ${T.ridge}`, background: T.hull, padding: "42px 40px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
                <div className="fs-grid-bg" style={{ position: "absolute", inset: 0, opacity: .22 }} />
                <div style={{ position: "relative", maxWidth: 460 }}>
                  <h3 className="fs-display" style={{ fontSize: 23, fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.25 }}>
                    Want to see this applied to your organization?
                  </h3>
                  <p style={{ color: T.inkMid, fontSize: 14.5, marginTop: 10, lineHeight: 1.6 }}>
                    An analyst will walk through what this looks like for your sites and your people specifically.
                  </p>
                </div>
                <button className="fs-btn" style={{ position: "relative", flexShrink: 0 }} onClick={handleGoToBriefing}>
                  Request a briefing <ArrowRight size={15} />
                </button>
              </div>
            </Reveal>
          </section>
        </>
      )}

      {/* ========================================================== BRIEFING */}
      {page === "briefing" && (
        <section className="fs-wrap" style={{ paddingTop: 44, paddingBottom: 100 }}>
          <button onClick={() => setPage("home")} className="fs-navlink"
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontWeight: 600 }}>
            <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} /> Back
          </button>

          <div className="fs-split fs-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "42px 42px" }}>
              <Reveal>
                <Eyebrow>Get in touch</Eyebrow>
                <h1 className="fs-display" style={{ fontSize: "clamp(28px,3.4vw,38px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 16, lineHeight: 1.1 }}>
                  Request a briefing
                </h1>
                <p style={{ fontSize: 14.5, color: T.inkMid, marginTop: 12, lineHeight: 1.65 }}>
                  Tell us where your people go and what keeps you up at night. An analyst follows up directly.
                </p>
              </Reveal>

              {briefingSubmitted ? (
                <Reveal delay={100}>
                  <div style={{ marginTop: 34, padding: 22, borderRadius: 12, background: T.goldWash, border: `1px solid ${T.goldDim}`, display: "flex", gap: 13 }}>
                    <CheckCircle2 size={20} color={T.gold} style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, color: T.ink }}>Request sent.</div>
                      <div style={{ fontSize: 13.5, color: T.inkMid, marginTop: 5, lineHeight: 1.55 }}>
                        An analyst will be in touch at the details you gave us.
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setBriefingSubmitted(false)} className="fs-btn-ghost" style={{ marginTop: 20, fontSize: 13.5 }}>
                    Send another
                  </button>
                </Reveal>
              ) : (
                <Reveal delay={100}>
                  <form onSubmit={submitBriefing} style={{ marginTop: 30, display: "flex", flexDirection: "column", gap: 18 }}>
                    <input type="text" name="website" value={briefingForm.website} tabIndex={-1} autoComplete="off" aria-hidden="true"
                      onChange={(e) => setBriefingForm((f) => ({ ...f, website: e.target.value }))}
                      style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>First name</span>
                        <input required value={briefingForm.firstName} onChange={(e) => setBriefingForm((f) => ({ ...f, firstName: e.target.value }))} />
                      </label>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>Last name</span>
                        <input required value={briefingForm.lastName} onChange={(e) => setBriefingForm((f) => ({ ...f, lastName: e.target.value }))} />
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>Phone</span>
                        <input required type="tel" value={briefingForm.phone} onChange={(e) => setBriefingForm((f) => ({ ...f, phone: e.target.value }))} />
                      </label>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>Work email</span>
                        <input required type="email" value={briefingForm.email} onChange={(e) => setBriefingForm((f) => ({ ...f, email: e.target.value }))} />
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>Organization</span>
                        <input required value={briefingForm.organization} onChange={(e) => setBriefingForm((f) => ({ ...f, organization: e.target.value }))} />
                      </label>
                      <label className="fs-field" style={{ flex: "1 1 190px" }}><span>Your role</span>
                        <input required value={briefingForm.designation} onChange={(e) => setBriefingForm((f) => ({ ...f, designation: e.target.value }))} />
                      </label>
                    </div>
                    <label className="fs-field"><span>Anything else</span>
                      <textarea rows={4} value={briefingForm.message} onChange={(e) => setBriefingForm((f) => ({ ...f, message: e.target.value }))}
                        placeholder="Where your people travel, how many sites, what you're currently using" />
                    </label>

                    {briefingError && <div className="fs-error">{briefingError}</div>}

                    <button type="submit" disabled={briefingSubmitting} className="fs-btn"
                      style={{ justifyContent: "center", opacity: briefingSubmitting ? .65 : 1, marginTop: 6 }}>
                      {briefingSubmitting ? "Sending…" : "Send request"} <ArrowRight size={15} />
                    </button>
                  </form>
                </Reveal>
              )}
            </div>

            <div style={{ position: "relative", background: T.hull, overflow: "hidden", minHeight: 440, borderLeft: `1px solid ${T.ridge}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, opacity: .9 }}>
                <ThreatGlobe interactive={false} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, transparent 40%, ${T.hull} 96%)` }} />
              <div style={{ position: "absolute", bottom: 0, padding: 40 }}>
                <Eyebrow>Say hello</Eyebrow>
                <h2 className="fs-display" style={{ fontSize: 26, fontWeight: 700, marginTop: 12, letterSpacing: "-.025em", lineHeight: 1.2 }}>
                  Real analysts. Real answers.
                </h2>
                <p style={{ color: T.inkMid, fontSize: 14, marginTop: 12, lineHeight: 1.65, maxWidth: 330 }}>
                  Every request reaches a person on the desk. No ticket queue, no chatbot.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================================= LEADS */}
      {page === "leads" && (
        <section className="fs-wrap" style={{ maxWidth: 880, paddingTop: 44, paddingBottom: 100 }}>
          <button onClick={() => setPage("home")} className="fs-navlink"
            style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28, fontWeight: 600 }}>
            <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} /> Back
          </button>

          <Eyebrow>Internal</Eyebrow>
          <h1 className="fs-display" style={{ fontSize: 30, fontWeight: 700, marginTop: 14, letterSpacing: "-.03em" }}>Briefing requests</h1>
          <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 10 }}>Same password as advisory publishing.</p>

          {leadsItems === null ? (
            <form onSubmit={fetchLeads} style={{ marginTop: 26, display: "flex", gap: 10, maxWidth: 400, alignItems: "flex-end" }}>
              <label className="fs-field" style={{ flex: 1 }}><span>Password</span>
                <input type="password" required value={leadsPassword} onChange={(e) => setLeadsPassword(e.target.value)} />
              </label>
              <button type="submit" disabled={leadsLoading} className="fs-btn" style={{ opacity: leadsLoading ? .65 : 1 }}>
                {leadsLoading ? "Checking…" : "View"}
              </button>
            </form>
          ) : (
            <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 12 }}>
              {leadsItems.length === 0 && (
                <div className="fs-card" style={{ padding: 36, textAlign: "center" }}>
                  <Mail size={22} color={T.inkLow} style={{ marginBottom: 10 }} />
                  <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 500 }}>No requests yet.</p>
                  <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 6 }}>They'll appear here as soon as someone submits the briefing form.</p>
                </div>
              )}
              {leadsItems.map((lead) => (
                <div key={lead.id} className="fs-card" style={{ padding: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 15.5, color: T.ink }}>{lead.firstName} {lead.lastName}</div>
                    <div className="fs-mono" style={{ fontSize: 11, color: T.inkLow }}>{timeAgo(lead.submittedAt)}</div>
                  </div>
                  <div style={{ fontSize: 13.5, color: T.inkMid, marginTop: 7 }}>{lead.designation} at {lead.organization}</div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12, fontSize: 13 }}>
                    <a href={`mailto:${lead.email}`} style={{ color: T.gold, fontWeight: 600, textDecoration: "none" }}>{lead.email}</a>
                    <a href={`tel:${lead.phone}`} style={{ color: T.inkMid, textDecoration: "none" }}>{lead.phone}</a>
                  </div>
                  {lead.message && <p style={{ fontSize: 13.5, color: T.inkMid, marginTop: 12, lineHeight: 1.6 }}>{lead.message}</p>}
                </div>
              ))}
            </div>
          )}
          {leadsError && <div className="fs-error" style={{ marginTop: 14 }}>{leadsError}</div>}
        </section>
      )}

      {/* ============================================================ FOOTER */}
      <footer className="fs-wrap" style={{ paddingTop: 90, paddingBottom: 44 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 36, borderTop: `1px solid ${T.ridge}`, paddingTop: 40 }}>
          <div style={{ maxWidth: 260 }}>
            <BrandLogo height={30} />
            <p style={{ fontSize: 13, color: T.inkLow, marginTop: 16, lineHeight: 1.6 }}>
              Global employee safety and risk intelligence, watched around the clock.
            </p>
          </div>
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap", fontSize: 13.5 }}>
            {[
              { head: "Platform", links: ["Travel Tracker", "Mass Communication"] },
              { head: "Company", links: ["Our Story", "Our Team", "Careers"] },
              { head: "Insights", links: ["Blogs", "Special Advisory", "Events"] },
            ].map((col) => (
              <div key={col.head} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <span className="fs-mono" style={{ color: T.gold, fontSize: 10, textTransform: "uppercase", letterSpacing: ".14em" }}>{col.head}</span>
                {col.links.map((l) => (
                  <button key={l} onClick={() => handleNavigate(l)} className="fs-navlink" style={{ textAlign: "left" }}>{l}</button>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 40, paddingTop: 28, borderTop: `1px solid ${T.ridge}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.green }} />
            <span className="fs-mono" style={{ fontSize: 10.5, color: T.inkLow, textTransform: "uppercase", letterSpacing: ".13em" }}>Watch desk</span>
          </div>
          {officeLocations.map(({ city, role }) => (
            <div key={city} style={{ display: "flex", alignItems: "baseline", gap: 9 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{city}</span>
              <span style={{ fontSize: 12.5, color: T.inkLow }}>— {role}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 30, fontSize: 12, color: T.inkLow, display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Globe2 size={13} /> ForeSecure is a demonstration brand — content generated for demonstration purposes.
          </span>
          <button onClick={() => setPage("leads")} className="fs-navlink"
            style={{ fontSize: 12, textDecoration: "underline", textUnderlineOffset: 3 }}>
            Team
          </button>
        </div>
      </footer>
    </div>
  );
}