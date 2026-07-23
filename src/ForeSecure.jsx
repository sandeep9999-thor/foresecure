import React, { useEffect, useRef, useState } from "react";
import {
  Plane, CloudLightning, ShieldAlert, HeartPulse, ArrowRight,
  MapPin, Clock, CheckCircle2, Menu, X, Mail, Globe2, Lock,
  Newspaper, MoreHorizontal, ChevronRight, ChevronDown, RefreshCw,
  MapPinned, ExternalLink, Flag, Megaphone, Plus, Trash2, Radio, Layers,
  Image as ImageIcon,
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
      { label: "Risk Assessment Services" },
      { label: "Security Operations Consulting" },
      { label: "Training & Awareness" },
      { label: "Protective Services" },
      { label: "Physical Security & Access Control Solutions" },
      { label: "GSOC / Command Center Design" },
      { label: "Environmental, Social & Governance" },
      {
        label: "Climate & Disaster Risk Resilience",
        items: [
          { label: "Climate Risk Assessment and Resilience" },
          { label: "Disaster Risk Management" },
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
  "Risk Assessment Services": {
    category: "Consulting",
    summary: "Three assessments, covering the people who move, the events you run, and the places you operate.",
    hero: "/images/services/risk-assessment-services.jpg",
    body: [
      "Exposure looks different depending on where it sits. A traveller crossing an unfamiliar city, a crowd filling a venue, and a facility standing empty overnight are three separate problems, and treating them with one generic checklist is how gaps get missed.",
      "Each assessment below is scoped to its own domain and delivered as findings you can act on — not a risk register that gets filed and forgotten.",
    ],
    sections: [
      {
        image: "/images/services/travel-risk.jpg",
        title: "Travel Risk Assessment",
        blurb: "For people moving through places they don't know well.",
        points: [
          "Pre-travel risk intelligence",
          "Country and city risk analysis",
          "Executive travel security planning",
          "Travel advisories and alerts",
          "Crisis support during travel",
        ],
      },
      {
        image: "/images/services/event-security.jpg",
        title: "Event Security Risk Assessment",
        blurb: "For the days when a venue fills up and the margin for error narrows.",
        points: [
          "Venue security assessment",
          "Threat and vulnerability assessment",
          "Crowd management planning",
          "Emergency response planning",
          "Security staffing recommendations",
        ],
      },
      {
        image: "/images/services/site-security.jpg",
        title: "Site Security Risk Assessment",
        blurb: "For the buildings and perimeters your operation depends on.",
        points: [
          "Office and facility security audits",
          "Physical security assessment",
          "Perimeter security review",
          "Vulnerability identification",
          "Risk mitigation recommendations",
        ],
      },
    ],
  },
  "GSOC / Command Center Design": {
    category: "Consulting",
    summary: "End-to-end command center consulting.",
    hero: "/images/services/gsoc-command-center-design.jpg",
    body: [
      "A global security operations center is the room where every camera, badge reader, alarm, and travel alert finally converges — and where a developing incident either gets caught early or gets missed entirely.",
      "We design that room end to end: the physical layout, the technology stack, the workflows that decide when a flagged event becomes a phone call, and the staffing model that keeps it running at three in the morning.",
    ],
    feature: {
      tag: "Command Center",
      title: "GSOC design and layout",
      image: "/images/services/gsoc-design.jpg",
      blurb: "From video wall sightlines to the escalation logic behind them — the room and the procedures designed together, not bolted to each other afterward.",
      points: [
        "Video wall planning",
        "Security technology integration",
        "Monitoring workstation design",
        "Incident management workflows",
        "SOC/GSOC architecture",
        "Technology selection and procurement support",
        "24×7 monitoring strategy",
      ],
    },
  },
  "Physical Security & Access Control Solutions": {
    category: "Consulting",
    summary: "Design and implementation of integrated security systems.",
    hero: "/images/services/physical-security-and-access-control-solutions.jpg",
    body: [
      "Access control, cameras, intrusion sensors, and fire safety are usually bought separately, installed by different vendors, and left unable to talk to each other. The result is a building that is monitored in four places at once and understood in none of them.",
      "We design these four systems as one, then manage the implementation — so a badge swipe, a camera feed, an alarm, and an evacuation route all resolve to the same picture of what is happening on site.",
    ],
    cards: [
      {
        tag: "Access Control",
        image: "/images/services/access-control.jpg",
        blurb: "Who gets in, where they can go, and a record of both.",
        points: [
          "Biometric access systems",
          "Smart card/RFID access",
          "Visitor Management Systems (VMS)",
          "Turnstiles and barriers",
          "Door controllers and access permissions",
        ],
      },
      {
        tag: "CCTV Surveillance",
        image: "/images/services/cctv-surveillance.jpg",
        blurb: "Coverage designed around sightlines, not camera count.",
        points: [
          "CCTV system design",
          "Camera placement planning",
          "IP Camera installation",
          "Video Management System (VMS)",
          "Remote monitoring solutions",
        ],
      },
      {
        tag: "Intrusion Detection",
        image: "/images/services/intrusion-detection.jpg",
        blurb: "Knowing the moment a perimeter is crossed.",
        points: [
          "Motion sensors",
          "Door/window sensors",
          "Panic buttons",
          "Alarm monitoring",
          "Security integration",
        ],
      },
      {
        tag: "Fire & Life Safety",
        image: "/images/services/fire-life-safety.jpg",
        blurb: "Detection, evacuation, and the compliance record behind both.",
        points: [
          "Fire alarm systems",
          "Smoke and heat detectors",
          "Emergency evacuation systems",
          "Fire suppression integration",
          "Compliance assessments",
        ],
      },
    ],
  },
  "Training & Awareness": {
    category: "Consulting",
    summary: "Procedure only works if the people holding it have practised.",
    hero: "/images/services/training-awareness.jpg",
    body: [
      "A response plan that has never been rehearsed is a document, not a capability. The gap between the two only shows up on the day it matters, which is the worst possible time to discover it.",
      "We train the people who operate your security function and the wider staff who have to act alongside them — from console operators running a live incident to executives making decisions under pressure with incomplete information.",
      "Sessions are built around your actual procedures and your actual sites, not a generic curriculum. The aim is that when something happens, the response is recognised rather than improvised.",
    ],
    points: [
      "GSOC operator training",
      "Security awareness programs",
      "Emergency drills",
      "Tabletop exercises",
      "Executive crisis management training",
      "Access control system training",
    ],
  },
  "Security Operations Consulting": {
    category: "Consulting",
    summary: "Building the operation that runs your security, not just the systems it runs on.",
    hero: "/images/services/security-operations.jpg",
    body: [
      "Most security programs accumulate rather than get designed. A camera system here, a travel policy there, a reporting format inherited from whoever held the role last — and no single view of whether any of it is working.",
      "We build the operating layer that ties those parts together: the processes that turn a flagged event into a decision, the reporting that tells leadership what it actually needs to know, and the monitoring that catches a developing situation while there is still time to act on it.",
      "The result is a security function that runs on defined practice rather than institutional memory — one that survives staff turnover and scales past the single site it started in.",
    ],
    points: [
      "GSOC setup and optimization",
      "Incident management processes",
      "Security reporting framework",
      "Risk intelligence operations",
      "Travel security program development",
      "Threat monitoring",
      "Security dashboards",
    ],
  },
  "Protective Services": {
    category: "Consulting",
    summary: "Keeping people safe as they move, not just where they sit.",
    hero: "/images/services/protective-services.jpg",
    body: [
      "Executives, project teams, and traveling staff are exposed the moment they leave a secured building. Our protective services cover close protection, journey management, and advance work — route recces, local liaison, and contingency planning — for movement through higher-risk environments.",
      "Every deployment starts with understanding the specific reason for travel and the specific risks of the destination, rather than applying a one-size-fits-all security detail.",
    ],
  },
  "Environmental, Social & Governance": {
    category: "Consulting",
    summary: "Making ESG measurable instead of aspirational.",
    hero: "/images/services/environmental-social-and-governance.jpg",
    body: [
      "ESG commitments only mean something if they can be tracked, audited, and reported credibly. We help organizations build the assessment frameworks, data collection processes, and governance structures that turn sustainability goals into figures a board — and a regulator — can trust.",
      "This spans environmental impact assessments, social risk reviews across supply chains, and governance audits aligned to the standards clients are actually held to.",
    ],
  },
  "Climate Risk Assessment and Resilience": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Understanding how a changing climate touches a specific site.",
    hero: "/images/services/climate-risk-assessment-and-resilience.jpg",
    body: [
      "Flood maps, heat projections, and storm-frequency data mean little until they're translated into what they imply for a specific factory, port, or office campus. We assess physical climate risk at the site level and build resilience plans — engineering, insurance, and operational — around what the data actually shows for that location.",
    ],
  },
  "Disaster Risk Management": {
    category: "Climate & Disaster Risk Resilience",
    summary: "Planning for the event no one wants to plan for.",
    hero: "/images/services/disaster-risk-management.jpg",
    body: [
      "Earthquakes, cyclones, and industrial accidents don't wait for a convenient time. Our disaster risk management work builds the response plans, evacuation procedures, and recovery playbooks that let an organization act fast and coherently when the unexpected happens, rather than improvising under pressure.",
    ],
  },
  "Resourcing": {
    category: "Resourcing",
    summary: "Embedded security talent, without running a security recruitment desk.",
    hero: "/images/services/resourcing.jpg",
    body: [
      "Not every organization needs a full in-house security department, but most need reliable security expertise on-site. We place vetted security managers, analysts, and operations staff directly into client teams, handling recruitment, training, and quality oversight so the client gets the expertise without carrying the HR overhead.",
    ],
  },
  "Careers": {
    category: "Careers",
    summary: "Join the team keeping people and operations safe, worldwide.",
    hero: "/images/services/careers.jpg",
    body: [
      "ForeSecure hires analysts, field specialists, and engineers who want their work to matter the day something actually goes wrong. We look for people comfortable with ambiguity, careful under pressure, and genuinely curious about how risk moves around the world.",
    ],
  },
  "Blogs": {
    category: "Insights",
    summary: "Field notes from the analysts doing the work.",
    hero: "/images/services/blogs.jpg",
    body: [
      "Our blog covers the trends, incidents, and lessons our own risk consultants are tracking — from emerging cyber threats to how climate risk is reshaping site selection. It's written by the people doing the assessments, not a marketing team repackaging headlines.",
    ],
  },
  "Special Advisory": {
    category: "Insights",
    summary: "Deep-dive briefings on a single, developing situation.",
    hero: "/images/services/special-advisory.jpg",
    body: [
      "When a single event — a coup, a major storm system, a regulatory shift — has outsized implications for clients operating in the region, we publish a special advisory: a focused briefing on what's happening, what could happen next, and what it means operationally.",
    ],
  },
  "Events": {
    category: "Insights",
    summary: "Where our analysts meet the people managing risk on the ground.",
    hero: "/images/services/events.jpg",
    body: [
      "From closed-door briefings for security leaders to public panels on emerging threats, our events are built around conversation, not just presentation. Check back for upcoming sessions, or get in touch to suggest a topic worth covering.",
    ],
  },
  "Our Story": {
    category: "About us",
    summary: "How a watch desk became a global risk practice.",
    hero: "/images/services/our-story.jpg",
    body: [
      "ForeSecure grew out of a simple frustration: the organizations that most needed early warning of a crisis were usually the last to hear about it. What began as a small monitoring desk has grown into a global practice spanning consulting, protective services, and technology — but the original goal hasn't changed: get the right information to the right person before it's too late to act on it.",
    ],
  },
  "Our Team": {
    category: "About us",
    summary: "Analysts, engineers, and field operators — not consultants in suits.",
    hero: "/images/services/our-team.jpg",
    body: [
      "Our team blends former military and law enforcement officers, security engineers, data analysts, and regional specialists who've actually worked in the markets they cover. That mix is deliberate: understanding a risk on paper and understanding it on the ground are different skills, and our clients need both.",
    ],
  },
  "Travel Tracker": {
    category: "Platform",
    summary: "Every traveler, every itinerary, matched against live conditions in real time.",
    hero: "/images/services/travel-tracker.jpg",
    body: [
      "Travel Tracker ingests itineraries directly from your travel management provider the moment they're booked — flights, hotels, ground transport — and plots each one against ForeSecure's live threat layer. There's no manual entry and no gap between a trip being booked and it being watched.",
      "If a traveler's route crosses an emerging risk — a storm system, a security incident, an airspace closure — the platform flags the exposure automatically and routes an alert to both the traveler and your duty-of-care team, with enough context to decide on a reroute or a hold before the situation develops further.",
      "Dashboards give your security desk a single map view of everyone currently in motion, filterable by region, risk level, or business unit, so a live headcount of exposed personnel is always one glance away.",
    ],
  },
  "SOPs / ERPs": {
    category: "Platform",
    title: "SOP & Emergency Response Planning",
    summary: "Develop standardized security procedures and crisis response frameworks.",
    hero: "/images/services/sops-erps.jpg",
    body: [
      "The worst time to decide who calls whom is while it is happening. Written procedure is what separates a coordinated response from five people improvising in parallel.",
      "We write both halves: the day-to-day procedures your security operation runs on, and the emergency plans it falls back to when the day stops being ordinary.",
    ],
    tiles: [
      {
        label: "SOPs",
        title: "Standard Operating Procedures",
        image: "/images/services/sops.jpg",
        blurb: "The procedures your security operation runs on every ordinary day — written down, agreed, and specific enough to follow under pressure.",
        points: [
          "Security operations SOPs",
          "Incident response procedures",
          "Access control procedures",
          "Visitor management SOPs",
          "Alarm response procedures",
        ],
      },
      {
        label: "ERPs",
        title: "Emergency Response Plans",
        image: "/images/services/erps.jpg",
        blurb: "What happens when the ordinary day ends — scenario by scenario, with the decisions made in advance rather than in the moment.",
        points: [
          "Fire emergencies",
          "Medical emergencies",
          "Natural disasters",
          "Active shooter response",
          "Bomb threats",
          "Civil unrest",
          "Business continuity support",
          "Crisis management playbooks",
        ],
      },
    ],
  },
  "Mass Communication": {
    category: "Platform",
    summary: "Reach the right people, at the right radius, in seconds — not the whole company.",
    hero: "/images/services/mass-communication.jpg",
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

// Same reveal behaviour as <Reveal>, but renders an <li> so it can sit directly
// inside a <ul> without breaking list semantics.
function RevealItem({ children, delay = 0, style = {} }) {
  const [ref, visible] = useReveal();
  const reduced = typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <li
      ref={ref}
      style={{
        display: "flex", alignItems: "baseline", gap: 12,
        padding: "13px 0", borderTop: `1px solid ${T.ridge}`,
        fontSize: 16, color: T.ink, lineHeight: 1.5,
        opacity: visible || reduced ? 1 : 0,
        transform: visible || reduced ? "none" : "translate3d(24px, 0, 0)",
        transition: reduced ? "none" :
          `opacity .7s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .7s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </li>
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




// Background image for a photographic service hero. Fails silently to the
// page background rather than showing a broken-image box behind the copy.
function HeroImage({ src }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      onError={() => setFailed(true)}
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center right",
        // Pulls the photo toward the page's tonal range so it reads as part of
        // the design rather than a picture pasted behind the text.
        filter: "saturate(.62) contrast(1.04)",
      }}
    />
  );
}

/* ---- Service tile ----------------------------------------------------------
   A large photographic tile with the copy laid over it. At rest it shows the
   label, title, and blurb; on hover the block lifts and the detail list slides
   up beneath it.

   Touch devices have no hover, so the same reveal is bound to tap — without it
   the points would be unreachable on a phone.
   -------------------------------------------------------------------------- */
function ServiceTile({ tile }) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const hasImage = tile.image && !failed;

  return (
    <div
      className={`fs-tile ${open ? "fs-tile--open" : ""}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onClick={() => setOpen((v) => !v)}
      tabIndex={0}
      role="group"
      aria-label={tile.title}
    >
      {hasImage ? (
        <img
          className="fs-tile-img"
          src={tile.image}
          alt=""
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="fs-tile-img fs-tile-fallback">
          <ImageIcon size={24} color={T.goldDim} />
          <div className="fs-mono" style={{ fontSize: 10, letterSpacing: ".06em", color: T.inkLow, marginTop: 10 }}>
            {tile.image ? tile.image.split("/").pop() : "no image set"}
          </div>
          <div style={{ fontSize: 11.5, color: T.inkLow, marginTop: 6 }}>
            Drop it in <span className="fs-mono" style={{ color: T.inkMid }}>public/images/services/</span>
          </div>
        </div>
      )}

      {/* Scrim: darkens on hover so the text stays legible over any photo. */}
      <div className="fs-tile-scrim" />

      <div className="fs-tile-body">
        <span className="fs-tile-label fs-mono">{tile.label}</span>

        <h3 className="fs-display fs-tile-title">{tile.title}</h3>

        {tile.blurb && <p className="fs-tile-blurb">{tile.blurb}</p>}

        {/* Collapsed to 0 height at rest; grid-template-rows animates cleanly
            where height:auto cannot. */}
        <div className="fs-tile-reveal">
          <div style={{ minHeight: 0, overflow: "hidden" }}>
            <ul className="fs-tile-points">
              {tile.points.map((pt, j) => (
                <li key={pt} style={{ transitionDelay: `${open ? 60 + j * 45 : 0}ms` }}>
                  <span className="fs-tile-dot" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Service photo slot ----------------------------------------------------
   Renders the real photo when the file exists. Until then it shows the exact
   path to drop the image at, rather than a broken-image icon or an empty box —
   the placeholder is a set of instructions, not filler.
   -------------------------------------------------------------------------- */
function ServicePhoto({ src, alt, ratio = "4/3" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div style={{
        position: "relative", width: "100%", aspectRatio: ratio, borderRadius: 14,
        background: T.panel, border: `1px dashed ${T.ridgeHi}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 10, padding: 24, textAlign: "center",
      }}>
        <ImageIcon size={22} color={T.goldDim} />
        {/* Just the filename at card size — the full path is unreadable when it
            wraps across three lines in a 257px column. */}
        <div className="fs-mono" style={{
          fontSize: 10, letterSpacing: ".06em", color: T.inkLow,
          lineHeight: 1.6, wordBreak: "break-word", maxWidth: "100%",
        }}>
          {src ? src.split("/").pop() : "no image set"}
        </div>
        <div style={{ fontSize: 11.5, color: T.inkLow, maxWidth: 220, lineHeight: 1.5 }}>
          Drop it in <span className="fs-mono" style={{ color: T.inkMid }}>public{src ? src.slice(0, src.lastIndexOf("/")) : ""}/</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", aspectRatio: ratio, borderRadius: 14, overflow: "hidden", border: `1px solid ${T.ridge}` }}>
      <img
        src={src}
        alt={alt}
        onError={() => setFailed(true)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {/* Keeps photographs sitting in the same tonal range as the rest of the
          page — a bright stock image against this palette reads as pasted on. */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: `linear-gradient(180deg, rgba(7,9,13,.12) 0%, rgba(7,9,13,.42) 100%)`,
      }} />
    </div>
  );
}

/* ------------------------------------------------------------------ menus -- */

function NavMenuItem({ item, isOpen, onOpen, onClose, onNavigate }) {
  const hasChildren = Boolean(item.items?.length);
  const [activeGroup, setActiveGroup] = useState(null);
  const [flyTop, setFlyTop] = useState(0);
  const listRef = useRef(null);
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
        <div className="fs-drop-list" ref={listRef}>
          {item.items.map((group, i) => {
            const kids = Boolean(group.items?.length);
            const on = activeGroup === group.label;
            return (
              <button
                key={group.label}
                className={`fs-drop-item ${on ? "fs-drop-item--on" : ""}`}
                style={{ transitionDelay: isOpen ? `${i * 28}ms` : "0ms" }}
                onMouseEnter={(e) => {
                  if (!kids) { setActiveGroup(null); return; }
                  // Record where this item sits so the flyout can open level
                  // with it. Without this the flyout is pinned to the top of
                  // the panel, so hovering the last item throws it far above
                  // the cursor and it cannot be reached.
                  const li = e.currentTarget.getBoundingClientRect();
                  const box = listRef.current?.getBoundingClientRect();
                  setFlyTop(box ? li.top - box.top : 0);
                  setActiveGroup(group.label);
                }}
                onClick={() => go(group.label)}
                role="menuitem"
              >
                <span>{group.label}</span>
                {kids && <ChevronRight size={13} style={{ flexShrink: 0, opacity: on ? 1 : .45 }} />}
              </button>
            );
          })}
        </div>

        {/* Flyout for the hovered group, opened level with it. */}
        {active && (
          <div
            className="fs-flyout"
            key={active.label}
            style={{ marginTop: flyTop }}
            onMouseEnter={cancelClose}
          >
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
          align-self: flex-start;
        }
        .fs-flyout {
          background: ${T.panel}; border: 1px solid ${T.ridge}; border-top: 2px solid ${T.gold};
          border-radius: 14px; box-shadow: 0 32px 80px -24px rgba(0,0,0,.88);
          padding: 14px 12px 12px; width: 300px; flex-shrink: 0;
          animation: fs-flyin .28s cubic-bezier(.22,1,.36,1) both;
          /* The visual 10px gap is created by a transparent border rather than
             a margin. A margin is dead space: the cursor crossing it leaves the
             panel entirely and the flyout closes before it can be reached. */
          margin-left: 0;
          border-left: 10px solid transparent;
          background-clip: padding-box;
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

        /* Alternating photo/copy rows. Equal columns so neither side
           dominates; collapses to a single column below 860px, where the
           photo always leads regardless of the desktop alternation. */
        /* Full-bleed photographic hero for service pages that supply one. */
        .fs-hero-photo { min-height: 460px; display: flex; align-items: center; }
        /* Matches the header's 28px gutter, so the hero copy stacks directly
           under the logo rather than sitting on its own margin. On very wide
           screens it eases outward slightly so the text is not pinned to the
           glass edge. */
        @media (min-width: 1600px) {
          .fs-hero-photo > div:last-child { padding-left: 48px !important; }
        }
        /* Below ~900px the copy is wider than the horizontal scrim's dark zone
           and starts sitting over the bright half of the photo. Swap to a flat
           overlay there — legibility beats the gradient. */
        @media (max-width: 900px) {
          .fs-hero-photo { min-height: 380px; }
          .fs-hero-photo > div[data-scrim="h"] {
            background: rgba(7,9,13,.88) !important;
          }
        }

        /* Two columns of points. Collapses early — at narrow widths the longer
           entries wrap and the rules stop lining up across the pair. */
        .fs-points-grid {
          list-style: none; padding: 0; margin: 0;
          display: grid; grid-template-columns: 1fr 1fr; column-gap: 40px;
        }
        @media (max-width: 780px) { .fs-points-grid { grid-template-columns: 1fr; } }

        /* ---- photographic tiles ---- */
        .fs-tile-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
        }
        .fs-tile-grid > * { min-width: 0; }
        /* Stacks at 1020px, not 900: between those widths a two-column tile is
           only ~430px wide and its 8-point list overflows the 4:5 box when open.
           Once stacked, the fixed ratio is dropped entirely — a wide short tile
           cannot hold eight points on a phone, so the tile sizes to its content
           and the image fills whatever height that produces. */
        @media (max-width: 1020px) {
          .fs-tile-grid { grid-template-columns: 1fr; }
          .fs-tile { aspect-ratio: auto; min-height: 420px; }
          .fs-tile-body { position: relative; padding-top: 180px; }
        }

        .fs-tile {
          position: relative; overflow: hidden; border-radius: 16px;
          aspect-ratio: 4/5; cursor: pointer; isolation: isolate;
          border: 1px solid ${T.ridge};
          transition: transform .5s cubic-bezier(.22,1,.36,1), border-color .4s, box-shadow .5s;
        }
        .fs-tile:hover, .fs-tile--open {
          transform: translateY(-6px);
          border-color: ${T.goldDim};
          box-shadow: 0 30px 70px -30px rgba(0,0,0,.9);
        }
        .fs-tile:focus-visible { outline: 2px solid ${T.gold}; outline-offset: 3px; }

        .fs-tile-img {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; display: block; z-index: 0;
          /* The slow zoom is what makes the tile feel alive rather than static. */
          transform: scale(1.02);
          transition: transform 1.1s cubic-bezier(.22,1,.36,1), filter .5s ease;
          filter: saturate(.85);
        }
        .fs-tile:hover .fs-tile-img, .fs-tile--open .fs-tile-img {
          transform: scale(1.09);
          filter: saturate(1.05);
        }
        .fs-tile-fallback {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: ${T.panel}; text-align: center; padding: 24px;
        }

        .fs-tile-scrim {
          position: absolute; inset: 0; z-index: 1; pointer-events: none;
          background: linear-gradient(180deg, rgba(4,6,10,.15) 0%, rgba(4,6,10,.62) 52%, rgba(4,6,10,.93) 100%);
          transition: opacity .45s ease;
        }
        .fs-tile:hover .fs-tile-scrim, .fs-tile--open .fs-tile-scrim { opacity: .96; }

        .fs-tile-body {
          position: absolute; inset: auto 0 0 0; z-index: 2;
          padding: 30px 30px 30px; display: flex; flex-direction: column;
          transition: transform .55s cubic-bezier(.22,1,.36,1);
        }
        .fs-tile-label {
          align-self: flex-start;
          font-size: 10px; letter-spacing: .16em; text-transform: uppercase;
          color: #14100A; background: ${T.gold};
          padding: 5px 11px; border-radius: 4px; font-weight: 500;
        }
        .fs-tile-title {
          font-size: clamp(21px, 2.2vw, 27px); font-weight: 700; letter-spacing: -.02em;
          line-height: 1.18; color: #fff; margin: 14px 0 0;
        }
        .fs-tile-blurb {
          font-size: 14.5px; line-height: 1.6; color: rgba(255,255,255,.78);
          margin: 12px 0 0; max-width: 42ch;
        }

        /* grid-template-rows animates between 0fr and 1fr, which height:auto
           cannot do — this is what lets the list slide open smoothly. */
        .fs-tile-reveal {
          display: grid; grid-template-rows: 0fr;
          transition: grid-template-rows .55s cubic-bezier(.22,1,.36,1);
        }
        .fs-tile:hover .fs-tile-reveal, .fs-tile--open .fs-tile-reveal {
          grid-template-rows: 1fr;
        }
        .fs-tile-points {
          list-style: none; padding: 0; margin: 18px 0 0;
          border-top: 1px solid rgba(255,255,255,.16);
        }
        .fs-tile-points li {
          display: flex; align-items: baseline; gap: 10px;
          padding: 8px 0; font-size: 13.5px; line-height: 1.45;
          color: rgba(255,255,255,.86);
          opacity: 0; transform: translateY(10px);
          transition: opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1);
        }
        .fs-tile:hover .fs-tile-points li, .fs-tile--open .fs-tile-points li {
          opacity: 1; transform: none;
        }
        .fs-tile-dot {
          width: 4px; height: 4px; border-radius: 50%; background: ${T.gold};
          flex-shrink: 0; transform: translateY(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .fs-tile-reveal { grid-template-rows: 1fr; }
          .fs-tile-points li { opacity: 1; transform: none; }
        }

        /* Single featured sub-service: photo and copy at equal weight. */
        .fs-feature-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
        }
        .fs-feature-row > * { min-width: 0; }
        /* One column, not two. At two columns each bullet gets ~249px, and the
           longer ones ("Technology selection and procurement support") wrap to
           a second line, leaving the rules across the pair misaligned. */
        .fs-feature-points { list-style: none; padding: 0; margin: 22px 0 0; }
        @media (max-width: 900px) {
          .fs-feature-row { grid-template-columns: 1fr; gap: 28px; }
        }

        /* Four peers across. Cards stretch to equal height so the rules above
           each bullet list line up across the row regardless of blurb length. */
        .fs-card-grid {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 26px;
          align-items: stretch;
        }
        .fs-card-grid > * { min-width: 0; height: 100%; }
        .fs-svc-card { display: flex; flex-direction: column; height: 100%; }
        @media (max-width: 1080px) { .fs-card-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; } }
        @media (max-width: 620px)  { .fs-card-grid { grid-template-columns: 1fr; } }

        .fs-svc-row {
          display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
        }
        /* Grid children default to min-width:auto, which refuses to shrink below
           their content's intrinsic width — that is what pushed the headings
           out past their column and clipped them at the left edge. */
        .fs-svc-row > * { min-width: 0; }
        @media (max-width: 860px) {
          .fs-svc-row { grid-template-columns: 1fr; gap: 24px; }
          .fs-svc-row > * { order: unset !important; }
        }

        .fs-hero-grid {
          /* The globe is the hero, so it gets the larger share. The negative
             right margin lets it bleed past the content gutter — the dead space
             around it was reading as emptiness rather than restraint. */
          display: grid; grid-template-columns: 1fr 1.15fr; gap: 24px; align-items: center;
        }
        .fs-hero-globe {
          position: relative; aspect-ratio: 1/1;
          /* The bleed is clamped rather than a flat -6vw: below ~1300px the
             viewport-relative value pushed the globe past the right edge and
             produced a horizontal scrollbar. This grows only when there is
             actually room for it. */
          margin-right: clamp(-70px, calc(1240px - 100vw), 0px);
          margin-top: -2vh; margin-bottom: -2vh;
        }
        /* Vertical scroll cue pinned to the right edge, as a reading affordance
           rather than decoration: it marks where the fold is. */
        .fs-scrollcue {
          position: absolute; right: 10px; bottom: 40px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        /* writing-mode is scoped to the label only. Applied to the flex parent
           it rotates the whole layout context, so column direction runs sideways
           and the rail's width/height swap. */
        .fs-scrollcue > span:first-child {
          writing-mode: vertical-rl; text-orientation: mixed;
        }
        .fs-scrollcue-rail {
          width: 1px; height: 54px; background: linear-gradient(180deg, ${T.ridgeHi}, transparent);
          position: relative; overflow: hidden;
        }
        .fs-scrollcue-rail::after {
          content: ""; position: absolute; left: 0; top: 0; width: 1px; height: 18px;
          background: ${T.gold};
          animation: fs-railrun 2.2s cubic-bezier(.6,0,.4,1) infinite;
        }
        @keyframes fs-railrun {
          0%   { transform: translateY(-20px); opacity: 0; }
          35%  { opacity: 1; }
          100% { transform: translateY(56px); opacity: 0; }
        }
        @media (max-width: 1000px) { .fs-scrollcue { display: none; } }

        :focus-visible { outline: 2px solid ${T.gold}; outline-offset: 3px; border-radius: 4px; }

        @media (max-width: 1000px) {
          .fs-hero-grid { grid-template-columns: 1fr; gap: 24px; }
          .fs-hero-globe { margin-right: 0; margin-top: 0; margin-bottom: 0; }
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
        {/* Full-bleed rather than .fs-wrap: the centred 1200px container was
            holding the logo ~120px in from the edge on wide screens. */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "16px 28px" }}>
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
            <button onClick={() => handleNavigate("SOPs / ERPs")} className="fs-navlink">SOPs / ERPs</button>

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
          <div style={{ padding: "8px 28px 22px", borderTop: `1px solid ${T.ridge}` }}>
            <MobileNavAccordion menu={NAV_MENU} onNavigate={handleNavigate} />
            <button onClick={() => handleNavigate("Travel Tracker")} className="fs-navlink" style={{ padding: "12px 0", textAlign: "left" }}>Travel Tracker</button>
            <button onClick={() => handleNavigate("Mass Communication")} className="fs-navlink" style={{ padding: "12px 0", display: "block", textAlign: "left" }}>Mass Communication</button>
            <button onClick={() => handleNavigate("SOPs / ERPs")} className="fs-navlink" style={{ padding: "12px 0", display: "block", textAlign: "left" }}>SOPs / ERPs</button>
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
            <div className="fs-scrollcue">
              <span className="fs-mono" style={{ fontSize: 9.5, letterSpacing: ".28em", textTransform: "uppercase", color: T.inkLow }}>
                Scroll
              </span>
              <span className="fs-scrollcue-rail" />
            </div>

            <div className="fs-wrap" style={{ position: "relative" }}>
              <div className="fs-hero-grid">
                <div style={{ animation: "fs-fade-up .9s cubic-bezier(.22,1,.36,1) both" }}>
                  <Eyebrow live>{activeCount ? `${activeCount} events on watch` : "Watch desk online"}</Eyebrow>

                  <h1 className="fs-display" style={{
                    fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, lineHeight: 1.03,
                    letterSpacing: "-.035em", marginTop: 18, marginBottom: 0,
                  }}>
                    Know your people<br />are safe.<br />
                    <span style={{ color: T.gold }}>Before you're asked.</span>
                  </h1>

                  {/* A second, quieter statement between headline and body copy.
                      Without it the jump from 60px to 17px lands too abruptly. */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14, marginTop: 20,
                    animation: "fs-fade-up 1s cubic-bezier(.22,1,.36,1) .2s both",
                  }}>
                    <span style={{ width: 34, height: 1, background: T.goldDim, flexShrink: 0 }} />
                    <span className="fs-display" style={{
                      fontSize: 17, fontWeight: 500, color: T.gold, letterSpacing: "-.01em",
                    }}>
                      Monitor. Assess. Respond.
                    </span>
                  </div>

                  <p style={{ fontSize: 16.5, color: T.inkMid, lineHeight: 1.62, marginTop: 18, maxWidth: 460 }}>
                    ForeSecure watches every site and every itinerary against live global conditions,
                    then alerts only the people actually exposed — with the action you want them to take.
                  </p>
                </div>

                {/* the globe */}
                <div className="fs-hero-globe" style={{ animation: "fs-fade-up 1.1s cubic-bezier(.22,1,.36,1) .15s both" }}>
                  <ThreatGlobe />
                  <div className="fs-mono" style={{
                    position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
                    fontSize: 9.5, letterSpacing: ".16em", textTransform: "uppercase", color: T.inkLow,
                    whiteSpace: "nowrap", opacity: .75,
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
          <section className={SERVICE_CONTENT[selectedService].hero ? "fs-hero-photo" : ""}
                   style={{ position: "relative", overflow: "hidden", padding: SERVICE_CONTENT[selectedService].hero ? "72px 0 88px" : "36px 0 56px" }}>
            {SERVICE_CONTENT[selectedService].hero ? (
              /* Photographic hero: the image sits behind the copy rather than
                 beside it. Two scrims do the work — a horizontal one so the
                 text side stays dark enough to read, and a vertical one to
                 blend the bottom edge into the page. */
              <>
                <HeroImage src={SERVICE_CONTENT[selectedService].hero} />
                <div data-scrim="h" style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, ${T.void} 0%, rgba(7,9,13,.94) 34%, rgba(7,9,13,.55) 68%, rgba(7,9,13,.35) 100%)` }} />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(7,9,13,.55) 0%, transparent 26%, transparent 62%, ${T.void} 100%)` }} />
              </>
            ) : (
              <div className="fs-grid-bg" style={{ position: "absolute", inset: 0, maskImage: "radial-gradient(60% 80% at 30% 20%, #000, transparent)", WebkitMaskImage: "radial-gradient(60% 80% at 30% 20%, #000, transparent)" }} />
            )}
            {/* A photographic hero is full-bleed, so its copy is left-aligned to
                the page edge like the header rather than centred in a 1160px
                container — centred text against a bleeding image reads as
                stranded in the middle of the screen. */}
            <div
              className={SERVICE_CONTENT[selectedService].hero ? "" : "fs-wrap"}
              style={
                SERVICE_CONTENT[selectedService].hero
                  ? { position: "relative", width: "100%", padding: "0 28px" }
                  : { position: "relative", maxWidth: 1000 }
              }
            >
              <button onClick={() => { setPage("home"); setSelectedService(null); }} className="fs-navlink"
                style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 26, fontWeight: 600 }}>
                <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Home
                <ChevronRight size={12} style={{ opacity: .5 }} />
                <span style={{ color: T.gold }}>{SERVICE_CONTENT[selectedService].category}</span>
              </button>

              <Reveal>
                <Eyebrow>{SERVICE_CONTENT[selectedService].category}</Eyebrow>
                <h1 className="fs-display" style={{ fontSize: "clamp(32px,4.4vw,52px)", fontWeight: 700, letterSpacing: "-.032em", marginTop: 18, lineHeight: 1.06, maxWidth: SERVICE_CONTENT[selectedService].hero ? 620 : 800 }}>
                  {SERVICE_CONTENT[selectedService].title || selectedService}
                </h1>
                <p style={{ fontSize: 18.5, color: T.inkMid, marginTop: 20, lineHeight: 1.6, maxWidth: SERVICE_CONTENT[selectedService].hero ? 540 : 620 }}>
                  {SERVICE_CONTENT[selectedService].summary}
                </p>
              </Reveal>
            </div>
          </section>

          {/* The abstract banner is a stand-in for imagery. A page with a real
              photographic hero already has its image, so showing both reads as
              two banners stacked. */}
          {!SERVICE_CONTENT[selectedService].hero && (
            <section className="fs-wrap" style={{ maxWidth: 1000 }}>
              <Reveal><ContourArt seed={selectedService.length % 7} height={260} /></Reveal>
            </section>
          )}

          <section className="fs-wrap" style={{ maxWidth: 1000, paddingTop: 52 }}>
            <div className="fs-service-layout" style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: 52 }}>
              <Reveal>
                {SERVICE_CONTENT[selectedService].placeholder ? (
                  /* Stubbed service: say so plainly rather than shipping filler
                     copy that reads as real. `body` is absent on these entries,
                     so mapping over it would throw. */
                  <div className="fs-card" style={{ padding: 32 }}>
                    <div className="fs-mono" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold }}>
                      In development
                    </div>
                    <p style={{ fontSize: 16.5, color: T.inkMid, lineHeight: 1.8, marginTop: 14 }}>
                      This page is still being written. In the meantime, an analyst can walk you
                      through how {selectedService} fits alongside the rest of the platform.
                    </p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                    {(SERVICE_CONTENT[selectedService].body || []).map((p, i) => (
                      <p key={i} style={{ fontSize: 16.5, color: T.inkMid, lineHeight: 1.82 }}>{p}</p>
                    ))}

                  </div>
                )}
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

          {/* Sub-services get their own full-width section. Nested inside the
              1fr/250px body grid they were squeezed to ~299px per side, which
              clipped the headings and shrank the photos. */}
          {/* Flat points list, for a service with no sub-services to split into.
              Two columns so seven items read as a block rather than a column
              running down one side of an empty page. */}
          {(SERVICE_CONTENT[selectedService].points || []).length > 0 && (
            <section className="fs-wrap" style={{ maxWidth: 1000, paddingTop: 8 }}>
              <Reveal>
                <div className="fs-mono" style={{ fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold, paddingBottom: 18 }}>
                  What this covers
                </div>
              </Reveal>
              <ul className="fs-points-grid">
                {SERVICE_CONTENT[selectedService].points.map((pt, j) => (
                  <RevealItem key={pt} delay={j * 60}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.gold, flexShrink: 0, transform: "translateY(-2px)" }} />
                    {pt}
                  </RevealItem>
                ))}
              </ul>
            </section>
          )}

          {/* Tile variant: copy sits on the image and lifts on hover. Two large
              tiles rather than a grid of small ones, so the photography carries
              weight instead of acting as a thumbnail. */}
          {(SERVICE_CONTENT[selectedService].tiles || []).length > 0 && (
            <section className="fs-wrap" style={{ maxWidth: 1160, paddingTop: 28 }}>
              <div className="fs-tile-grid">
                {SERVICE_CONTENT[selectedService].tiles.map((tile, i) => (
                  <Reveal key={tile.label} delay={i * 110} from={i === 0 ? "left" : "right"}>
                    <ServiceTile tile={tile} />
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {/* Feature variant: a single sub-service, given the full width. With
              only one item there is nothing to compare it against, so a grid
              would just leave three empty columns. */}
          {SERVICE_CONTENT[selectedService].feature && (
            <section className="fs-wrap" style={{ maxWidth: 1160, paddingTop: 28 }}>
              <div className="fs-feature-row">
                <Reveal from="left">
                  <ServicePhoto
                    src={SERVICE_CONTENT[selectedService].feature.image}
                    alt={SERVICE_CONTENT[selectedService].feature.title}
                    ratio="4/3"
                  />
                </Reveal>

                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Reveal from="right" delay={90}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 30, height: 1, background: T.goldDim, flexShrink: 0 }} />
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
                      <span className="fs-mono" style={{ fontSize: 10.5, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold }}>
                        {SERVICE_CONTENT[selectedService].feature.tag}
                      </span>
                    </div>

                    <h3 className="fs-display" style={{
                      fontSize: "clamp(28px, 3.2vw, 40px)", fontWeight: 700,
                      letterSpacing: "-.028em", marginTop: 16, lineHeight: 1.12, color: T.ink,
                    }}>
                      {SERVICE_CONTENT[selectedService].feature.title}
                    </h3>

                    {SERVICE_CONTENT[selectedService].feature.blurb && (
                      <p style={{ fontSize: 16.5, color: T.inkMid, marginTop: 16, lineHeight: 1.68 }}>
                        {SERVICE_CONTENT[selectedService].feature.blurb}
                      </p>
                    )}
                  </Reveal>

                  <ul className="fs-feature-points">
                    {SERVICE_CONTENT[selectedService].feature.points.map((pt, j) => (
                      <RevealItem key={pt} delay={180 + j * 60}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.gold, flexShrink: 0, transform: "translateY(-2px)" }} />
                        {pt}
                      </RevealItem>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Card grid variant: four sub-services scanned side by side. Used
              where the items are peers of equal weight, rather than a sequence
              worth walking through one at a time. */}
          {(SERVICE_CONTENT[selectedService].cards || []).length > 0 && (
            <section className="fs-wrap" style={{ maxWidth: 1160, paddingTop: 24 }}>
              <div className="fs-card-grid">
                {SERVICE_CONTENT[selectedService].cards.map((card, i) => (
                  <Reveal key={card.tag} delay={i * 90} from="up">
                    <div className="fs-svc-card">
                      <ServicePhoto src={card.image} alt={card.tag} ratio="4/3" />

                      <div className="fs-mono" style={{
                        fontSize: 10, letterSpacing: ".15em", textTransform: "uppercase",
                        color: T.gold, marginTop: 18,
                      }}>
                        {card.tag}
                      </div>

                      {card.blurb && (
                        <p style={{ fontSize: 15, color: T.ink, marginTop: 10, lineHeight: 1.45, fontWeight: 500 }}>
                          {card.blurb}
                        </p>
                      )}

                      <ul style={{ listStyle: "none", padding: 0, margin: "16px 0 0" }}>
                        {card.points.map((pt) => (
                          <li key={pt} style={{
                            display: "flex", alignItems: "baseline", gap: 10,
                            padding: "8px 0", borderTop: `1px solid ${T.ridge}`,
                            fontSize: 13.5, color: T.inkMid, lineHeight: 1.5,
                          }}>
                            <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.goldDim, flexShrink: 0, transform: "translateY(-2px)" }} />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                ))}
              </div>
            </section>
          )}

          {(SERVICE_CONTENT[selectedService].sections || []).length > 0 && (
            <section className="fs-wrap" style={{ maxWidth: 1160, paddingTop: 20 }}>
          {/* Sub-services: photo on one side, copy on the other,
              alternating down the page. Each side animates in from
              its own edge, and the bullets stagger after the heading
              so the block assembles rather than just appearing. */}
          {(SERVICE_CONTENT[selectedService].sections || []).map((sec, i) => {
            const flipped = i % 2 === 1;
            return (
              <div key={sec.title} className="fs-svc-row" style={{ marginTop: i === 0 ? 34 : 76 }}>
                {/* photo */}
                <Reveal
                  from={flipped ? "right" : "left"}
                  style={{ order: flipped ? 2 : 1 }}
                >
                  <ServicePhoto src={sec.image} alt={sec.title} />
                </Reveal>

                {/* copy */}
                <div style={{ order: flipped ? 1 : 2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <Reveal from={flipped ? "left" : "right"} delay={90}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ width: 30, height: 1, background: T.goldDim, flexShrink: 0 }} />
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.gold, flexShrink: 0 }} />
                      <span className="fs-mono" style={{ fontSize: 10, letterSpacing: ".16em", textTransform: "uppercase", color: T.gold }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="fs-display" style={{
                      fontSize: "clamp(26px, 2.9vw, 36px)", fontWeight: 700,
                      letterSpacing: "-.025em", marginTop: 16, lineHeight: 1.15, color: T.ink,
                    }}>
                      {sec.title}
                    </h3>

                    {sec.blurb && (
                      <p style={{ fontSize: 16.5, color: T.inkMid, marginTop: 14, lineHeight: 1.62 }}>{sec.blurb}</p>
                    )}
                  </Reveal>

                  {/* The stagger lives on RevealItem, which renders the
                      <li> itself. Wrapping each <li> in a Reveal <div>
                      would break the ul > li relationship — invalid
                      markup, and screen readers stop announcing it as
                      a list. */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0" }}>
                    {sec.points.map((pt, j) => (
                      <RevealItem key={pt} delay={180 + j * 70}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: T.gold, flexShrink: 0, transform: "translateY(-2px)" }} />
                        {pt}
                      </RevealItem>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
            </section>
          )}

          {/* With the CTA panel gone the last content block would butt straight
              into the footer. */}
          <div style={{ height: 90 }} />
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