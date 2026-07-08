import React, { useEffect, useRef, useState } from "react";
import {
  Plane, CloudLightning, ShieldAlert, HeartPulse, ArrowRight,
  MapPin, Clock, CheckCircle2, Menu, X, Mail, Bell, Activity,
  Globe2, Radio, Lock, Building2, Newspaper, ArrowUpRight,
  MoreHorizontal, ChevronRight, ChevronDown, RefreshCw, MapPinned, ExternalLink,
  Image as ImageIcon, Flag
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

// Maps the /api/news categorizer's tag to a ticker severity level.
const tagToLevel = (tag) => {
  if (tag === "Security" || tag === "Weather") return "WARNING";
  if (tag === "Travel") return "WATCH";
  return "ADVISORY";
};

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

// ---- Top navigation menu structure (dropdowns, click-to-open) ----
const NAV_MENU = [
  {
    label: "Consulting",
    href: "#",
    items: [
      { label: "Risk Consulting", href: "#" },
      {
        label: "Security Design",
        href: "#",
        items: [
          { label: "Physical Security Design and Project Management", href: "#" },
          { label: "Physical Security Operations Center Design", href: "#" },
          { label: "Enterprise Electronic Security Technology Transformation", href: "#" },
          { label: "Enterprise Physical Security Master Plans", href: "#" },
        ],
      },
      { label: "Protective Services", href: "#" },
      { label: "Cybersecurity and Resilience", href: "#" },
      { label: "Environmental, Social & Governance", href: "#" },
      {
        label: "Climate & Disaster Risk Resilience",
        href: "#",
        items: [
          { label: "Climate Risk Assessment and Resilience", href: "#" },
          { label: "Disaster Risk Management", href: "#" },
          { label: "Carbon Footprint Assessment", href: "#" },
          { label: "Hydrological Assessment and Water Related Services", href: "#" },
        ],
      },
      { label: "Geospatial Solutions", href: "#" },
      { label: "Investigations", href: "#" },
      {
        label: "Others",
        href: "#",
        items: [
          { label: "Counter Drone Consulting", href: "#" },
          { label: "Vehicle Dynamics Assessment (VDA) / Hostile Vehicle Attack Assessment", href: "#" },
          { label: "Assessment of Blast / Explosive / High Impact Risk", href: "#" },
        ],
      },
    ],
  },
  { label: "Resourcing", href: "#" },
  {
    label: "Insights",
    href: "#",
    items: [
      { label: "Blogs", href: "#" },
      { label: "Special Advisory", href: "#" },
      { label: "Events", href: "#" },
    ],
  },
  { label: "Careers", href: "#" },
  {
    label: "About us",
    href: "#",
    items: [
      { label: "Our Story", href: "#" },
      { label: "Our Team", href: "#" },
    ],
  },
];

// ---- Content shown when a nav dropdown leaf item is clicked. Image slots
// are left as empty placeholders for real photography to be dropped in later. ----
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
  "Geospatial Solutions": {
    category: "Consulting",
    summary: "Putting risk on a map, literally.",
    body: [
      "Spreadsheets don't show you that three suppliers sit in the same flood plain. Our geospatial team layers threat data, asset locations, and terrain analysis onto interactive maps, so patterns that are invisible in a table become obvious at a glance — and decisions about where to build, route, or evacuate get easier to make.",
    ],
  },
  "Investigations": {
    category: "Consulting",
    summary: "Finding out what actually happened, discreetly and defensibly.",
    body: [
      "Fraud, IP theft, insider misconduct, and vendor due diligence all call for investigative work that can withstand later scrutiny — whether that's an internal disciplinary process, a court case, or a regulator's questions. Our investigators combine fieldwork with digital forensics and background research to build findings a client can act on with confidence.",
    ],
  },
  "Counter Drone Consulting": {
    category: "Others",
    summary: "Defending airspace that most security plans still ignore.",
    body: [
      "Unauthorized drones can carry cameras, payloads, or simply disrupt operations at airports, stadiums, and industrial sites. We assess a site's exposure to drone-based threats and design detection and mitigation strategies — sensor placement, response protocols, and coordination with local authorities — suited to what's actually flying overhead.",
    ],
  },
  "Vehicle Dynamics Assessment (VDA) / Hostile Vehicle Attack Assessment": {
    category: "Others",
    summary: "Stress-testing a site against a vehicle used as a weapon.",
    body: [
      "Vehicle-borne attacks on crowded or high-value sites are a recognized and studied threat. We assess approach routes, speeds, and barrier performance to determine whether a site's perimeter can actually stop or slow a hostile vehicle, and recommend the bollards, planters, or standoff distances that close the gap.",
    ],
  },
  "Assessment of Blast / Explosive / High Impact Risk": {
    category: "Others",
    summary: "Understanding what an explosion would do to a structure — before it happens.",
    body: [
      "We model blast loads and structural response to identify which parts of a building are most vulnerable to an explosive event, and recommend hardening measures — from glazing upgrades to structural reinforcement — that reduce injury and damage if the worst occurs.",
    ],
  },
  "Resourcing": {
    category: "Resourcing",
    summary: "Embedded security talent, without the client running a security recruitment desk.",
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
    summary: "Analysts, engineers, and field operators — not just consultants in suits.",
    body: [
      "Our team blends former military and law enforcement officers, security engineers, data analysts, and regional specialists who've actually worked in the markets they cover. That mix is deliberate: understanding a risk on paper and understanding it on the ground are different skills, and our clients need both.",
    ],
  },
};

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

// ---- Desktop dropdown nav item (click to open, supports one nested flyout level) ----
function NavMenuItem({ item, isOpen, onToggle, onNavigate }) {
  const [subOpen, setSubOpen] = useState(null);
  const hasChildren = Boolean(item.items && item.items.length);

  return (
    <div style={{ position: "relative" }}>
      {hasChildren ? (
        <button
          onClick={onToggle}
          className="sl-nav-link"
          style={{
            display: "flex", alignItems: "center", gap: 5, background: "none", border: "none",
            cursor: "pointer", padding: 0, font: "inherit", color: isOpen ? COLORS.black : COLORS.slate,
          }}
        >
          {item.label}
          <ChevronDown size={14} style={{ transition: "transform 0.2s ease", transform: isOpen ? "rotate(180deg)" : "none" }} />
        </button>
      ) : (
        <button
          onClick={() => onNavigate(item.label)}
          className="sl-nav-link"
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}
        >
          {item.label}
        </button>
      )}

      {hasChildren && isOpen && (
        <div
          className="sl-card sl-dropdown-panel"
          style={{ position: "absolute", top: "calc(100% + 16px)", left: 0 }}
        >
          {item.items.map((sub) => {
            const subHasChildren = Boolean(sub.items && sub.items.length);
            return (
              <div
                key={sub.label}
                style={{ position: "relative" }}
                onMouseEnter={() => subHasChildren && setSubOpen(sub.label)}
                onMouseLeave={() => subHasChildren && setSubOpen(null)}
              >
                <button
                  className="sl-dropdown-link"
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}
                  onClick={() => {
                    if (subHasChildren) {
                      setSubOpen((s) => (s === sub.label ? null : sub.label));
                    } else {
                      onNavigate(sub.label);
                    }
                  }}
                >
                  <span>{sub.label}</span>
                  {subHasChildren && <ChevronRight size={14} color={COLORS.slateLight} style={{ flexShrink: 0 }} />}
                </button>

                {subHasChildren && subOpen === sub.label && (
                  <div className="sl-card sl-dropdown-panel sl-dropdown-panel--flyout">
                    {sub.items.map((leaf) => (
                      <button
                        key={leaf.label}
                        className="sl-dropdown-link"
                        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "inherit" }}
                        onClick={() => onNavigate(leaf.label)}
                      >
                        <span>{leaf.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ---- Mobile accordion nav (click to expand, nests naturally with <details>) ----
function MobileNavAccordion({ menu, onNavigate }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {menu.map((item) => {
        const hasChildren = Boolean(item.items && item.items.length);
        if (!hasChildren) {
          return (
            <button key={item.label} onClick={() => onNavigate(item.label)} className="sl-nav-link" style={{ padding: "10px 0", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
              {item.label}
            </button>
          );
        }
        return (
          <details key={item.label} className="sl-mobile-details">
            <summary className="sl-nav-link">{item.label}</summary>
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: 14 }}>
              {item.items.map((sub) => {
                const subHasChildren = Boolean(sub.items && sub.items.length);
                if (!subHasChildren) {
                  return (
                    <button key={sub.label} onClick={() => onNavigate(sub.label)} className="sl-nav-link" style={{ padding: "8px 0", fontSize: 13.5, textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
                      {sub.label}
                    </button>
                  );
                }
                return (
                  <details key={sub.label} className="sl-mobile-details">
                    <summary className="sl-nav-link" style={{ fontSize: 13.5 }}>{sub.label}</summary>
                    <div style={{ display: "flex", flexDirection: "column", paddingLeft: 14 }}>
                      {sub.items.map((leaf) => (
                        <button key={leaf.label} onClick={() => onNavigate(leaf.label)} className="sl-nav-link" style={{ padding: "8px 0", fontSize: 12.5, textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>
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

function NetworkBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    let width, height;
    let nodes = [];

    const palette = ["#B3212E", "#C99A1E", "#5C6470"];

    function resize() {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const count = Math.max(24, Math.floor((width * height) / 26000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.8,
        color: palette[Math.floor(Math.random() * palette.length)],
        pulse: Math.random() * Math.PI * 2,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.pulse += 0.02;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(120,130,145,${0.14 * (1 - d / 130)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const glow = 0.5 + 0.5 * Math.sin(n.pulse);
        ctx.beginPath();
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.35 + glow * 0.35;
        ctx.arc(n.x, n.y, n.r + glow * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
    />
  );
}

const heroSlides = [
  { src: "/images/hero/slide-1.jpg", label: "MONITOR" },
  { src: "/images/hero/slide-2.png", label: "ASSESS" },
  { src: "/images/hero/slide-3.jpg", label: "RESPOND" },
  { src: "/images/hero/slide-4.jpg", label: "PROTECT" },
];

function HeroSlideshow({ slides = heroSlides, intervalMs = 1000, onIndexChange }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!slides.length) return;
    const id = setInterval(() => {
      setIndex((i) => {
        const next = (i + 1) % slides.length;
        if (onIndexChange) onIndexChange(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides, intervalMs, onIndexChange]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} aria-hidden="true">
      {slides.map((slide, i) => (
        <img
          key={slide.src}
          src={slide.src}
          alt=""
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1.06)" : "scale(1)",
            transition: "opacity 1.2s ease, transform 8s ease-out",
          }}
        />
      ))}
    </div>
  );
}

const videoCaptions = [
  { start: 0, end: 2.5, text: "Crisis Management" },
  { start: 3, end: 6.5, text: "Weather Warnings" },
  { start: 7, end: 11.5, text: "Civil Unrest" },
];

function HeroVideo({ src = "/videos/hero.mp4", captions = videoCaptions, onCaptionChange }) {
  const videoRef = useRef(null);
  const [captionIndex, setCaptionIndex] = useState(-1);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    const playPromise = video.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Autoplay was blocked — retry once on first user interaction anywhere on the page
        const retry = () => {
          video.play().catch(() => {});
          window.removeEventListener("click", retry);
        };
        window.addEventListener("click", retry, { once: true });
      });
    }
    const handleTimeUpdate = () => {
      const t = video.currentTime;
      const idx = captions.findIndex((c) => t >= c.start && t < c.end);
      setCaptionIndex((prev) => {
        if (prev !== idx) {
          if (onCaptionChange) onCaptionChange(idx);
          return idx;
        }
        return prev;
      });
    };
    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [captions, onCaptionChange]);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  );
}

function RotatingLabel({ words, index }) {
  return (
    <div style={{ position: "relative", minHeight: 90 }}>
      {words.map((w, i) => (
        <h1
          key={w}
          className="sl-display"
          style={{
            position: "absolute", left: 0, top: 0, margin: 0,
            fontSize: "clamp(34px, 5.2vw, 64px)", fontWeight: 700, letterSpacing: "-0.02em",
            color: "#fff", lineHeight: 1.05, textShadow: "0 2px 24px rgba(0,0,0,0.45)",
            opacity: i === index ? 1 : 0,
            transform: i === index ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {w}
        </h1>
      ))}
    </div>
  );
}

const dotMenuItems = [
  { label: "Consulting", chevron: true },
  { label: "Resourcing", chevron: false },
  { label: "Insights", chevron: true },
  { label: "Careers", chevron: false },
  { label: "About us", chevron: true },
  { label: "Get in Touch", chevron: false },
];

function FullScreenMenu({ open, onClose }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#fff", zIndex: 100,
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s ease",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderBottom: `1px solid ${COLORS.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ForeSecureMark size={24} />
          <span className="sl-display" style={{ fontWeight: 700, fontSize: 17 }}>ForeSecure</span>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }} aria-label="Close menu">
          <X size={26} color={COLORS.black} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {dotMenuItems.map(({ label, chevron }) => (
          <a
            key={label}
            href="#"
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "22px 28px", borderBottom: `1px solid ${COLORS.line}`,
              textDecoration: "none", color: COLORS.black, fontSize: 22,
            }}
            className="sl-display"
          >
            {label}
            {chevron && <ChevronRight size={22} color={COLORS.slateLight} />}
          </a>
        ))}
      </div>
    </div>
  );
}

function LocationModal({ data, onClose }) {
  if (!data) return null;
  const { title, url, source, location } = data;
  const mapSrc = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}&z=9&output=embed`
    : null;
  const mapsLink = location
    ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
    : null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,23,28,0.72)", zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, maxWidth: 560, width: "100%", overflow: "hidden", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
      >
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${COLORS.line}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, lineHeight: 1.4, margin: 0 }}>{title}</h3>
            {source && <div style={{ fontSize: 12.5, color: COLORS.slateLight, marginTop: 6 }}>{source}</div>}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }} aria-label="Close">
            <X size={20} color={COLORS.slateLight} />
          </button>
        </div>

        {mapSrc ? (
          <iframe
            title="Article location"
            src={mapSrc}
            width="100%"
            height="280"
            style={{ border: 0, display: "block" }}
            loading="lazy"
          />
        ) : (
          <div style={{ padding: "40px 22px", textAlign: "center", color: COLORS.slateLight, fontSize: 13.5 }}>
            <MapPinned size={28} color={COLORS.slateLight} style={{ marginBottom: 10 }} />
            <div>No precise location could be identified for this article.</div>
          </div>
        )}

        <div style={{ padding: "16px 22px", display: "flex", gap: 12, flexWrap: "wrap" }}>
          {mapsLink && (
            <a href={mapsLink} target="_blank" rel="noreferrer" className="sl-btn-ghost" style={{ fontSize: 13.5 }}>
              <MapPinned size={15} /> Open in Google Maps
            </a>
          )}
          {url && (
            <a href={url} target="_blank" rel="noreferrer" className="sl-btn-primary" style={{ fontSize: 13.5 }}>
              Read full article <ExternalLink size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ForeSecure() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dotMenuOpen, setDotMenuOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(-1);
  const [liveArticles, setLiveArticles] = useState(null);
  const [regionNews, setRegionNews] = useState(null);
  const [newsError, setNewsError] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null);
  const [locationModal, setLocationModal] = useState(null);
  const [page, setPage] = useState("home"); // "home" | "alerts" | "service"
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertRegionFilter, setAlertRegionFilter] = useState("ALL");
  const [selectedService, setSelectedService] = useState(null);

  function handleNavigate(label) {
    setSelectedService(label);
    setPage("service");
    setOpenMenu(null);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  // Close the open nav dropdown on outside click or Escape.
  useEffect(() => {
    if (!openMenu) return;
    function handleClick(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpenMenu(null);
    }
    function handleKey(e) {
      if (e.key === "Escape") setOpenMenu(null);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [openMenu]);

  function loadNews() {
    setNewsLoading(true);
    setNewsError(null);
    fetch("/api/news")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setNewsError(data.error);
        } else {
          setLiveArticles(data.all || []);
          setRegionNews(data.regions || null);
          setNewsUpdatedAt(data.updatedAt || new Date().toISOString());
        }
      })
      .catch(() => {
        setNewsError("Could not load live news.");
      })
      .finally(() => setNewsLoading(false));
  }

  // Load once on mount, then keep the feed genuinely "live" by refreshing
  // in the background every 90 seconds without any user action required —
  // matched to the API's cache window so we're not polling faster than
  // the data actually changes.
  useEffect(() => {
    loadNews();
    const id = setInterval(loadNews, 90 * 1000);
    return () => clearInterval(id);
  }, []);

  const REGION_ORDER = ["APAC", "INDIA", "EMEA", "AMERICAS"];
  const REGION_LABELS = {
    APAC: "APAC",
    INDIA: "India",
    EMEA: "EMEA",
    AMERICAS: "Americas",
  };
  const REGION_ICONS = {
    APAC: Globe2,
    INDIA: Flag,
    EMEA: Globe2,
    AMERICAS: Globe2,
  };

  function timeAgo(iso) {
    const diffMs = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }

  // Feed the scrolling ticker from live /api/news results once they've loaded;
  // fall back to the placeholder feed while loading or if the request failed.
  // Capped to a fixed count and given a duration proportional to that count so
  // the scroll speed stays readable regardless of how many live items come back.
  const tickerSource =
    liveArticles && liveArticles.length > 0
      ? liveArticles.slice(0, 10).map((a) => ({
          level: tagToLevel(a.tag),
          loc: a.location ? a.location.name : a.source,
          type: a.title,
          timeLabel: a.publishedAt ? timeAgo(a.publishedAt) : "",
          url: a.url,
          location: a.location,
          source: a.source,
        }))
      : tickerFeed.map((item) => ({
          level: item.level,
          loc: item.loc,
          type: item.type,
          timeLabel: `${item.t} ago`,
          url: null,
          location: null,
          source: null,
        }));
  const tickerData = tickerSource;
  const tickerDuration = Math.max(28, tickerData.length * 6);

  // Flatten every region's alerts into one deduped, most-recent-first list
  // for the Live Alerts page.
  const dedupedAlerts = (() => {
    const pool = regionNews ? Object.values(regionNews).flat() : (liveArticles || []);
    const seen = new Set();
    return pool
      .filter((a) => {
        if (!a.url || seen.has(a.url)) return false;
        seen.add(a.url);
        return true;
      })
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  })();

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
        .sl-ticker-track { display: flex; width: max-content; animation: sl-scroll linear infinite; }
        .sl-ticker-track:hover { animation-play-state: paused; }
        @keyframes sl-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes sl-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes sl-pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(2.6); opacity: 0; } }
        .sl-nav-link { color: ${COLORS.slate}; text-decoration: none; font-size: 14.5px; font-weight: 500; }
        .sl-nav-link:hover { color: ${COLORS.black}; }
        .sl-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .sl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .sl-split-view { display: grid; grid-template-columns: 1fr 1fr; }
        .sl-dropdown-panel {
          box-shadow: 0 20px 45px -18px rgba(20,23,28,0.28);
          padding: 10px; min-width: 300px; max-width: 340px; z-index: 60;
        }
        .sl-dropdown-panel--flyout { position: absolute; top: 0; left: 100%; margin-left: 8px; }
        .sl-dropdown-link {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 12px; border-radius: 6px; font-size: 13.5px; color: ${COLORS.black};
          text-decoration: none; line-height: 1.4;
        }
        .sl-dropdown-link:hover { background: ${COLORS.goldLight}; }
        .sl-mobile-details summary { cursor: pointer; padding: 10px 0; list-style: none; }
        .sl-mobile-details summary::-webkit-details-marker { display: none; }
        .sl-mobile-details summary::after { content: "+"; float: right; color: ${COLORS.slateLight}; }
        .sl-mobile-details[open] summary::after { content: "–"; }
        @media (max-width: 900px) {
          .sl-split-view { grid-template-columns: 1fr; }
        }
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
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <button
              onClick={() => { setPage("home"); setSelectedAlert(null); setSelectedService(null); }}
              style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", textAlign: "left" }}
              aria-label="ForeSecure home"
            >
              <ForeSecureMark size={28} />
              <div>
                <div style={{ display: "inline-block" }}>
                  <span className="sl-display" style={{ fontWeight: 700, fontSize: 19, letterSpacing: "-0.02em", display: "block", color: COLORS.black }}>ForeSecure</span>
                  <img
                    src="/images/brand/underline.jpg"
                    alt=""
                    style={{ display: "block", width: 130, height: 9, objectFit: "fill", borderRadius: 1, marginTop: 3 }}
                  />
                </div>
                <span className="sl-mono" style={{ fontSize: 9.5, color: COLORS.red, fontWeight: 700, letterSpacing: "0.12em", display: "block", marginTop: 3 }}>MONITOR · ASSESS · PROTECT</span>
              </div>
            </button>
            <button
              onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); }}
              style={{
                display: "flex", alignItems: "center", gap: 8, cursor: "pointer", font: "inherit",
                background: page === "alerts" ? COLORS.black : "#fff",
                color: page === "alerts" ? "#fff" : COLORS.black,
                border: `1.5px solid ${page === "alerts" ? COLORS.black : COLORS.line}`,
                borderRadius: 20, padding: "7px 14px 7px 10px", fontSize: 13, fontWeight: 600,
              }}
            >
              <span style={{ position: "relative", display: "flex", width: 8, height: 8 }}>
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COLORS.red, animation: "sl-pulse 1.6s ease-out infinite" }} />
                <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: COLORS.red }} />
              </span>
              Live Alerts
            </button>
          </div>
          <nav ref={navRef} className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {NAV_MENU.map((item) => (
              <NavMenuItem
                key={item.label}
                item={item}
                isOpen={openMenu === item.label}
                onToggle={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                onNavigate={handleNavigate}
              />
            ))}
          </nav>
          <div className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="#" className="sl-nav-link">Sign in</a>
            <button className="sl-btn-primary">Request briefing <ArrowRight size={15} /></button>
            <button
              onClick={() => setDotMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex" }}
              aria-label="More options"
            >
              <MoreHorizontal size={22} color={COLORS.black} />
            </button>
          </div>
          <div className="sl-mobile-toggle" style={{ display: "none", alignItems: "center", gap: 4 }}>
            <button
              onClick={() => setDotMenuOpen(true)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex" }}
              aria-label="More options"
            >
              <MoreHorizontal size={22} color={COLORS.black} />
            </button>
            <button
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, display: "flex" }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div style={{ padding: "8px 24px 20px", display: "flex", flexDirection: "column", gap: 6, borderTop: `1px solid ${COLORS.line}` }}>
            <MobileNavAccordion menu={NAV_MENU} onNavigate={handleNavigate} />
            <button className="sl-btn-primary" style={{ justifyContent: "center", marginTop: 10 }}>Request briefing <ArrowRight size={15} /></button>
          </div>
        )}
      </header>
      <FullScreenMenu open={dotMenuOpen} onClose={() => setDotMenuOpen(false)} />

      {page === "home" && (
      <>
      {/* HERO — full viewport: nav (above) + slideshow + single tagline. Rest of the page lives below, reached by scrolling. */}
      <section style={{ position: "relative", background: COLORS.black, overflow: "hidden", height: "calc(100vh - 73px)", minHeight: 520, display: "flex", alignItems: "flex-end" }}>
        <HeroVideo onCaptionChange={setCaptionIndex} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,23,28,0.15) 0%, rgba(20,23,28,0.75) 100%)" }} />
        <div style={{ position: "relative", maxWidth: 1160, margin: "0 auto", padding: "0 24px 64px", width: "100%" }}>
          <Reveal>
            <RotatingLabel words={videoCaptions.map((c) => c.text)} index={captionIndex} />
          </Reveal>
        </div>
        <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)" }}>
          <ChevronDown size={22} />
        </div>
      </section>
      </>
      )}

      {/* TICKER — signature element, driven by live /api/news when available; shown on both pages */}
      <section style={{ background: COLORS.black, padding: "16px 0", overflow: "hidden", borderTop: "1px solid #24272E" }}>
        <div className="sl-ticker-track" style={{ animationDuration: `${tickerDuration}s` }}>
          {[...tickerData, ...tickerData].map((item, i) => {
            const clickable = Boolean(item.url);
            return (
              <button
                key={i}
                onClick={() => clickable && setLocationModal({
                  title: item.type,
                  url: item.url,
                  source: item.source,
                  location: item.location,
                  publishedAt: null,
                })}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "0 28px",
                  borderRight: "1px solid #2A2E36", whiteSpace: "nowrap",
                  textDecoration: "none", cursor: clickable ? "pointer" : "default",
                  background: "none", border: "none", borderRightWidth: 1, borderRightColor: "#2A2E36", borderRightStyle: "solid",
                  font: "inherit", textAlign: "left",
                }}
              >
                <span className="sl-mono" style={{ fontSize: 11, fontWeight: 600, color: item.level === "WARNING" ? "#F0A8A8" : item.level === "WATCH" ? "#EBCE8A" : "#B9BCC2", background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: 3 }}>
                  {item.level}
                </span>
                <MapPin size={13} color="#7A7E86" />
                <span className="sl-mono" style={{ fontSize: 13, color: "#DAD8D0" }}>{item.loc}</span>
                <span style={{ fontSize: 13, color: "#9A9DA3", maxWidth: 420, overflow: "hidden", textOverflow: "ellipsis" }}>{item.type}</span>
                <span className="sl-mono" style={{ fontSize: 11.5, color: "#63666D" }}>{item.timeLabel}</span>
              </button>
            );
          })}
        </div>
      </section>
      <LocationModal data={locationModal} onClose={() => setLocationModal(null)} />

      {page === "home" && (
      <>
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

      {/* REGIONAL WATCH — live RSS feed split into four boxes side by side */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "96px 24px 0" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Regional watch</div>
              <h2 className="sl-display" style={{ fontSize: "clamp(26px, 3vw, 34px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
                Live coverage, by region.
              </h2>
            </div>
            <div className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: newsLoading ? COLORS.gold : "#3FA65B", flexShrink: 0 }} />
              {newsLoading ? "Refreshing…" : newsUpdatedAt ? `Updated ${timeAgo(newsUpdatedAt)}` : "Live"}
            </div>
          </div>
        </Reveal>
        <div className="sl-grid-4" style={{ marginTop: 32, alignItems: "stretch" }}>
          {REGION_ORDER.map((key, i) => {
            const items = (regionNews && regionNews[key]) || [];
            const RegionIcon = REGION_ICONS[key] || Globe2;
            return (
              <Reveal key={key} delay={i * 90}>
                <div className="sl-card" style={{ padding: 20, height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 12, borderBottom: `1px solid ${COLORS.line}` }}>
                    <span className="sl-display" style={{ fontWeight: 700, fontSize: 15 }}>{REGION_LABELS[key]}</span>
                    <RegionIcon size={15} color={COLORS.slateLight} />
                  </div>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 4, maxHeight: 340, overflowY: "auto", paddingRight: 4 }}>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <button
                          key={item.url}
                          onClick={() => setLocationModal({ title: item.title, url: item.url, source: item.source, location: item.location })}
                          style={{ display: "block", width: "100%", padding: "10px 0", borderBottom: `1px solid ${COLORS.line}`, textDecoration: "none", color: "inherit", background: "none", border: "none", borderBottomWidth: 1, borderBottomColor: COLORS.line, borderBottomStyle: "solid", textAlign: "left", cursor: "pointer", font: "inherit" }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span className="sl-mono" style={{ fontSize: 10, color: COLORS.red, background: COLORS.goldLight, padding: "2px 7px", borderRadius: 3, fontWeight: 600 }}>{item.tag}</span>
                            <span className="sl-mono" style={{ fontSize: 10.5, color: COLORS.slateLight }}>
                              {item.publishedAt ? timeAgo(item.publishedAt) : ""}
                            </span>
                          </div>
                          <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 6, lineHeight: 1.4 }}>{item.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: COLORS.slateLight, marginTop: 4 }}>
                            {item.location && <MapPin size={11} />}
                            {item.location ? item.location.name : item.source}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div style={{ fontSize: 13, color: COLORS.slateLight, padding: "16px 0" }}>
                        {newsLoading ? "Loading live coverage…" : "No active reports right now."}
                      </div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
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

      {/* INSIGHTS / NEWS — moved to its own Live Alerts page; this is just a teaser */}
      <section style={{ maxWidth: 1160, margin: "0 auto", padding: "100px 24px 0" }}>
        <Reveal>
          <div className="sl-card" style={{ padding: "40px 36px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Intelligence desk</div>
              <h2 className="sl-display" style={{ fontSize: "clamp(24px, 3vw, 30px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
                Live, high and medium-risk alerts — updated continuously.
              </h2>
              <p style={{ fontSize: 14.5, color: COLORS.slate, marginTop: 10, maxWidth: 520 }}>
                {liveArticles && liveArticles.length > 0
                  ? `${liveArticles.length} active briefings across APAC, India, EMEA and the Americas.`
                  : "Loading the latest briefings…"}
              </p>
            </div>
            <button onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); }} className="sl-btn-primary" style={{ flexShrink: 0 }}>
              View Live Alerts <ArrowUpRight size={16} />
            </button>
          </div>
        </Reveal>
      </section>

      </>
      )}

      {/* LIVE ALERTS PAGE */}
      {page === "alerts" && (
        <section style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px 100px" }}>
          {!selectedAlert ? (
            <>
              <Reveal>
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                  <div>
                    <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Live Alerts</div>
                    <h1 className="sl-display" style={{ fontSize: "clamp(28px, 3.4vw, 38px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
                      Every active high and medium-risk briefing.
                    </h1>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <button
                      onClick={loadNews}
                      disabled={newsLoading}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
                        color: COLORS.red, fontWeight: 600, fontSize: 14, cursor: newsLoading ? "default" : "pointer",
                        opacity: newsLoading ? 0.6 : 1,
                      }}
                    >
                      <RefreshCw size={15} style={{ animation: newsLoading ? "sl-spin 1s linear infinite" : "none" }} />
                      {newsLoading ? "Refreshing…" : "Refresh"}
                    </button>
                    <div className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: newsLoading ? COLORS.gold : "#3FA65B" }} />
                      {newsUpdatedAt ? `Updated ${timeAgo(newsUpdatedAt)}` : "Live"}
                    </div>
                  </div>
                </div>
              </Reveal>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 28 }}>
                {["ALL", ...REGION_ORDER].map((key) => {
                  const TabIcon = key === "ALL" ? null : (REGION_ICONS[key] || Globe2);
                  return (
                    <button
                      key={key}
                      onClick={() => setAlertRegionFilter(key)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        background: alertRegionFilter === key ? COLORS.black : "#fff",
                        color: alertRegionFilter === key ? "#fff" : COLORS.slate,
                        border: `1.5px solid ${alertRegionFilter === key ? COLORS.black : COLORS.line}`,
                        borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                      }}
                    >
                      {TabIcon && <TabIcon size={13} />}
                      {key === "ALL" ? "All regions" : REGION_LABELS[key]}
                    </button>
                  );
                })}
              </div>

              <div className="sl-grid-4" style={{ marginTop: 28, gridTemplateColumns: "repeat(3, 1fr)" }}>
                {dedupedAlerts
                  .filter((a) => alertRegionFilter === "ALL" || a.region === alertRegionFilter)
                  .map((item, i) => (
                    <Reveal key={item.url} delay={Math.min(i, 8) * 60}>
                      <button
                        onClick={() => setSelectedAlert(item)}
                        className="sl-card"
                        style={{ display: "block", width: "100%", padding: 22, height: "100%", textAlign: "left", cursor: "pointer", font: "inherit", background: "#fff" }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span className="sl-mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.03em", color: item.risk === "HIGH" ? "#fff" : COLORS.red, background: item.risk === "HIGH" ? COLORS.red : COLORS.goldLight, padding: "3px 9px", borderRadius: 3 }}>
                            {item.risk} RISK
                          </span>
                          <span className="sl-mono" style={{ fontSize: 11, color: COLORS.red, background: COLORS.goldLight, padding: "3px 9px", borderRadius: 3, fontWeight: 600 }}>{item.tag}</span>
                          <span className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight }}>{timeAgo(item.publishedAt)}</span>
                        </div>
                        <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 14, lineHeight: 1.4 }}>{item.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 12.5, color: COLORS.slateLight }}>
                          {item.location ? <MapPin size={14} /> : <Newspaper size={14} />}
                          {item.location ? item.location.name : item.source}
                        </div>
                      </button>
                    </Reveal>
                  ))}
              </div>
              {dedupedAlerts.length === 0 && (
                <p style={{ fontSize: 13.5, color: COLORS.slateLight, marginTop: 24 }}>
                  {newsLoading ? "Loading live alerts…" : "No active high or medium-risk alerts right now."}
                </p>
              )}
            </>
          ) : (
            <div>
              <button
                onClick={() => setSelectedAlert(null)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.slate, fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 20, font: "inherit" }}
              >
                <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /> Back to Live Alerts
              </button>

              <div className="sl-split-view sl-card" style={{ overflow: "hidden", minHeight: "68vh" }}>
                {/* LEFT — the news */}
                <div style={{ padding: "32px 34px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span className="sl-mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.03em", color: selectedAlert.risk === "HIGH" ? "#fff" : COLORS.red, background: selectedAlert.risk === "HIGH" ? COLORS.red : COLORS.goldLight, padding: "3px 9px", borderRadius: 3 }}>
                      {selectedAlert.risk} RISK
                    </span>
                    <span className="sl-mono" style={{ fontSize: 11, color: COLORS.red, background: COLORS.goldLight, padding: "3px 9px", borderRadius: 3, fontWeight: 600 }}>{selectedAlert.tag}</span>
                  </div>

                  <h2 className="sl-display" style={{ fontSize: 24, fontWeight: 700, marginTop: 18, lineHeight: 1.35 }}>{selectedAlert.title}</h2>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 18, fontSize: 13.5, color: COLORS.slate }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Clock size={15} color={COLORS.slateLight} /> Reported {timeAgo(selectedAlert.publishedAt)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Newspaper size={15} color={COLORS.slateLight} /> {selectedAlert.source}
                    </div>
                    {selectedAlert.location && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <MapPin size={15} color={COLORS.slateLight} /> {selectedAlert.location.name}
                      </div>
                    )}
                  </div>

                  <div style={{ borderTop: `1px solid ${COLORS.line}`, marginTop: 24, paddingTop: 24, flex: 1 }}>
                    <div className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>Description</div>
                    <p style={{ fontSize: 14.5, color: COLORS.slate, lineHeight: 1.65 }}>
                      {selectedAlert.description || "No summary was provided by the source. Read the full report for details."}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
                    {selectedAlert.url && (
                      <a href={selectedAlert.url} target="_blank" rel="noreferrer" className="sl-btn-primary" style={{ fontSize: 13.5 }}>
                        Read full article <ExternalLink size={14} />
                      </a>
                    )}
                    {selectedAlert.location && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${selectedAlert.location.lat},${selectedAlert.location.lng}`}
                        target="_blank" rel="noreferrer" className="sl-btn-ghost" style={{ fontSize: 13.5 }}
                      >
                        <MapPinned size={15} /> Open in Google Maps
                      </a>
                    )}
                  </div>
                </div>

                {/* RIGHT — the map */}
                <div style={{ background: COLORS.bg, minHeight: 320 }}>
                  {selectedAlert.location ? (
                    <iframe
                      title="Alert location"
                      src={`https://www.google.com/maps?q=${selectedAlert.location.lat},${selectedAlert.location.lng}&z=8&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, display: "block", minHeight: 320 }}
                      loading="lazy"
                    />
                  ) : (
                    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: COLORS.slateLight, fontSize: 13.5, padding: 40, textAlign: "center" }}>
                      <MapPinned size={30} color={COLORS.slateLight} style={{ marginBottom: 10 }} />
                      No precise location could be identified for this alert.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SERVICE / INSIGHTS DETAIL PAGE — shown when a nav dropdown leaf item is clicked */}
      {page === "service" && selectedService && SERVICE_CONTENT[selectedService] && (
        <section style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 100px" }}>
          <button
            onClick={() => { setPage("home"); setSelectedService(null); }}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: COLORS.slate, fontSize: 14, fontWeight: 600, padding: 0, marginBottom: 28, font: "inherit" }}
          >
            <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} /> Back
          </button>

          <Reveal>
            <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.red, fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              {SERVICE_CONTENT[selectedService].category}
            </div>
            <h1 className="sl-display" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 10 }}>
              {selectedService}
            </h1>
            <p style={{ fontSize: 17, color: COLORS.slate, marginTop: 16, lineHeight: 1.55, maxWidth: 640 }}>
              {SERVICE_CONTENT[selectedService].summary}
            </p>
          </Reveal>

          {/* Image placeholder — left empty intentionally, drop real photography in later */}
          <Reveal delay={80}>
            <div
              style={{
                marginTop: 32, height: 280, borderRadius: 12, border: `1.5px dashed ${COLORS.line}`,
                background: COLORS.white, display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 8, color: COLORS.slateLight,
              }}
            >
              <ImageIcon size={28} color={COLORS.slateLight} />
              <span className="sl-mono" style={{ fontSize: 11.5, letterSpacing: "0.04em", textTransform: "uppercase" }}>Image placeholder</span>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
              {SERVICE_CONTENT[selectedService].body.map((para, i) => (
                <p key={i} style={{ fontSize: 15.5, color: COLORS.slate, lineHeight: 1.75 }}>{para}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={180}>
            <div style={{ marginTop: 40, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button className="sl-btn-primary">Request briefing <ArrowRight size={15} /></button>
              <button onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); }} className="sl-btn-ghost">
                View Live Alerts
              </button>
            </div>
          </Reveal>
        </section>
      )}

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