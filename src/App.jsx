import React, { useEffect, useRef, useState } from "react";
import {
  Plane, CloudLightning, ShieldAlert, HeartPulse, ArrowRight,
  MapPin, Clock, CheckCircle2, Menu, X, Mail, Bell, Activity,
  Globe2, Lock, Building2, Newspaper, ArrowUpRight,
  MoreHorizontal, ChevronRight, ChevronDown, RefreshCw, MapPinned, ExternalLink,
  Image as ImageIcon, Flag, Megaphone, Plus, Trash2
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
  { city: "Bengaluru, India", role: "Primary operations & watch desk" },
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
];

// Moved out of the main nav bar into the "···" overflow panel.
const OVERFLOW_MENU = [
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

// Finds the other items in the same group as `label` within NAV_MENU, so a
// service detail page can show "related services" instead of a dead end.
function findSiblingServices(label) {
  for (const top of NAV_MENU) {
    if (!top.items) continue;
    for (const entry of top.items) {
      if (entry.items) {
        const match = entry.items.find((leaf) => leaf.label === label);
        if (match) return entry.items.map((l) => l.label).filter((l) => l !== label);
      }
    }
    // Also treat the top-level Consulting leaves themselves as one group.
    const topLevelLabels = top.items.filter((e) => !e.items).map((e) => e.label);
    if (topLevelLabels.includes(label)) {
      return topLevelLabels.filter((l) => l !== label);
    }
  }
  return [];
}

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

// Logo lockup: mark PNG has a transparent background, so it reads fine
// directly on the site's light header/footer — no dark chip needed.
// The wordmark itself is now rendered as real text (matching the
// FORE/SECURE brand reference) rather than an image, so it stays crisp at
// any size. `height` drives both the mark size and the text size.
function WordmarkText({ size = 34 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", gap: "0.22em" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size, color: COLORS.black, lineHeight: 1 }}>Fore</span>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size, color: COLORS.gold, lineHeight: 1 }}>Secure</span>
      </div>
      
      <img src="/images/brand/underline.jpg" alt="" style={{ width: "100%", height: Math.max(3, Math.round(size * 0.2)), display: "block", marginTop: 2 }} />
    </div>
  );
}

function BrandLogo({ height = 45 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: Math.round(height * 0.3) }}>
      <img
        src="/images/brand/mark.png"
        alt=""
        style={{ height: Math.round(height * 1.9), width: "auto", display: "block" }}
      />
      <WordmarkText size={height} />
    </div>
  );

}

// ---- Desktop mega-menu (click to open). Renders every group as a column
// with its leaf items listed underneath — no hover flyouts, which is what
// made the old version feel like a default dropdown. ----
function NavMenuItem({ item, isOpen, onToggle, onNavigate }) {
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

      {hasChildren && (
        <div
          className="sl-card sl-megamenu"
          style={{
            position: "absolute", top: "calc(100% + 16px)", left: "50%",
            transform: isOpen ? "translate(-50%, 0)" : "translate(-50%, -8px)",
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.22s ease, transform 0.22s ease",
          }}
        >
          <div className="sl-megamenu-grid">
            {item.items.map((group) => {
              const groupHasChildren = Boolean(group.items && group.items.length);
              return (
                <div key={group.label} className="sl-megamenu-col">
                  {groupHasChildren ? (
                    <>
                      <div className="sl-megamenu-heading">{group.label}</div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {group.items.map((leaf) => (
                          <button
                            key={leaf.label}
                            className="sl-dropdown-link"
                            onClick={() => onNavigate(leaf.label)}
                          >
                            {leaf.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <button
                      className="sl-dropdown-link sl-dropdown-link--top"
                      onClick={() => onNavigate(group.label)}
                    >
                      {group.label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
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

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Tries a real photo at a predictable path per service; if none has been
// uploaded yet, falls back to a clean branded graphic instead of a broken
// image icon or an empty gray box. Drop real photography into
// /public/images/services/{slug}.jpg (same slug shown in the fallback) and
// it'll pick it up automatically — no code changes needed.
function ServiceImage({ label }) {
  const [failed, setFailed] = useState(false);
  const slug = slugify(label);

  if (failed) {
    return (
      <div style={{
        width: "100%", aspectRatio: "21/8", borderRadius: 12, overflow: "hidden",
        background: `linear-gradient(135deg, ${COLORS.black} 0%, #2A2E36 100%)`,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.3 }}>
          <MapIllustration />
        </div>
        <div style={{ position: "relative", textAlign: "center", color: "rgba(255,255,255,0.6)", padding: "0 20px" }}>
          <ImageIcon size={26} color={COLORS.gold} style={{ marginBottom: 8 }} />
          <div className="sl-mono" style={{ fontSize: 10.5, letterSpacing: "0.03em" }}>
            Add photography at /images/services/{slug}.jpg
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={`/images/services/${slug}.jpg`}
      alt={label}
      onError={() => setFailed(true)}
      style={{ width: "100%", aspectRatio: "21/8", objectFit: "cover", borderRadius: 12, display: "block" }}
    />
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

// Drop your own hero video file into /public/videos/hero.mp4 (or pass a
// different `src` below) — that's the only thing you need to change here.
function HeroVideo({ src = "/videos/hero.mp4" }) {
  const videoRef = useRef(null);

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
  }, []);

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

function FullScreenMenu({ open, onClose, onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  function handleLeafClick(label) {
    onNavigate(label);
    onClose();
    setExpanded(null);
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "#fff", zIndex: 100,
        transform: open ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s ease",
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderBottom: `1px solid ${COLORS.line}` }}>
        <BrandLogo height={26} />
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }} aria-label="Close menu">
          <X size={26} color={COLORS.black} />
        </button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {OVERFLOW_MENU.map((item) => {
          const hasChildren = Boolean(item.items && item.items.length);
          const isExpanded = expanded === item.label;
          return (
            <div key={item.label} style={{ borderBottom: `1px solid ${COLORS.line}` }}>
              <button
                onClick={() => (hasChildren ? setExpanded(isExpanded ? null : item.label) : handleLeafClick(item.label))}
                className="sl-display"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                  padding: "22px 28px", background: "none", border: "none", cursor: "pointer",
                  color: COLORS.black, fontSize: 22, font: "inherit", fontWeight: 500, textAlign: "left",
                }}
              >
                {item.label}
                {hasChildren && (
                  <ChevronDown size={22} color={COLORS.slateLight} style={{ transition: "transform 0.2s ease", transform: isExpanded ? "rotate(180deg)" : "none" }} />
                )}
              </button>
              {hasChildren && isExpanded && (
                <div style={{ padding: "0 28px 20px", display: "flex", flexDirection: "column", gap: 4 }}>
                  {item.items.map((sub) => (
                    <button
                      key={sub.label}
                      onClick={() => handleLeafClick(sub.label)}
                      style={{
                        background: "none", border: "none", cursor: "pointer", textAlign: "left", font: "inherit",
                        padding: "10px 12px", borderRadius: 6, fontSize: 15, color: COLORS.slate,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.goldLight)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ padding: 28, borderTop: `1px solid ${COLORS.line}` }}>
        <button className="sl-btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={onClose}>
          Request briefing <ArrowRight size={15} />
        </button>
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

// Anyone can view Special Advisories — this modal is just how a permitted
// team member (host / handler) publishes one. The password field isn't
// enforced client-side; it's sent to /api/advisories and checked against
// ADVISORY_PASSWORD on the server, so a wrong password just gets a normal
// rejected-request error back rather than a fake client-side gate.
function AdvisoryModal({ open, form, setForm, password, setPassword, submitting, error, onSubmit, onClose }) {
  if (!open) return null;
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const inputStyle = {
    width: "100%", padding: "10px 12px", borderRadius: 6, border: `1.5px solid ${COLORS.line}`,
    fontSize: 14, fontFamily: "inherit", color: COLORS.black, background: "#fff",
  };
  const labelStyle = { display: "block", fontSize: 12.5, fontWeight: 600, color: COLORS.slate, marginBottom: 6 };

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
        style={{
          background: "#fff", borderRadius: 14, maxWidth: 520, width: "100%",
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", overflow: "hidden",
        }}
      >
        <div style={{ padding: "18px 22px", borderBottom: `1px solid ${COLORS.line}`, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Megaphone size={18} color={COLORS.gold} />
            <h3 className="sl-display" style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Publish a Special Advisory</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }} aria-label="Close">
            <X size={20} color={COLORS.slateLight} />
          </button>
        </div>

        <form onSubmit={onSubmit} style={{ padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16, overflowY: "auto" }}>
          <div>
            <label style={labelStyle}>Headline</label>
            <input required value={form.title} onChange={set("title")} placeholder="e.g. Curfew declared in central district" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Incident overview</label>
            <textarea
              value={form.description}
              onChange={set("description")}
              placeholder="Full details of what happened, who's affected, and any guidance for personnel…"
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5, fontFamily: "inherit" }}
            />
          </div>

          <div>
            <label style={labelStyle}>Impact analysis</label>
            <textarea
              value={form.impact}
              onChange={set("impact")}
              placeholder="Likely operational, safety, or business impact — and any recommended response…"
              rows={4}
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5, fontFamily: "inherit" }}
            />
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Risk level</label>
              <select value={form.risk} onChange={set("risk")} style={inputStyle}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Region</label>
              <select value={form.region} onChange={set("region")} style={inputStyle}>
                <option value="APAC">APAC</option>
                <option value="INDIA">India</option>
                <option value="EMEA">EMEA</option>
                <option value="AMERICAS">Americas</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Incident type</label>
              <input value={form.incidentType} onChange={set("incidentType")} placeholder="e.g. Crisis" style={inputStyle} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Date &amp; time</label>
              <input type="datetime-local" value={form.dateTime} onChange={set("dateTime")} style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Location</label>
            <input value={form.location} onChange={set("location")} placeholder="e.g. Manila, Philippines" style={inputStyle} />
          </div>

          <div style={{ border: `1.5px solid ${COLORS.line}`, borderRadius: 8, padding: 14 }}>
            <label style={labelStyle}>Mass Communication</label>
            <div style={{ fontSize: 12, color: COLORS.slateLight, marginBottom: 10 }}>Advised by ForeSecure — send this advisory out to people?</div>
            <div style={{ display: "flex", gap: 10 }}>
              {["yes", "no"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, massCommunication: opt }))}
                  style={{
                    flex: 1, padding: "9px 0", borderRadius: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                    textTransform: "capitalize",
                    background: form.massCommunication === opt ? COLORS.black : "#fff",
                    color: form.massCommunication === opt ? "#fff" : COLORS.slate,
                    border: `1.5px solid ${form.massCommunication === opt ? COLORS.black : COLORS.line}`,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={labelStyle}>Source</label>
            <input value={form.source} onChange={set("source")} placeholder="e.g. Internal briefing" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Link (optional)</label>
            <input value={form.url} onChange={set("url")} placeholder="https://…" style={inputStyle} />
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.line}`, paddingTop: 16 }}>
            <label style={labelStyle}>
              <Lock size={12} style={{ verticalAlign: -1, marginRight: 5 }} />
              Publishing password
            </label>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Only for authorized team members" style={inputStyle} />
          </div>

          {error && <div style={{ fontSize: 13, color: COLORS.red }}>{error}</div>}

          <button type="submit" disabled={submitting} className="sl-btn-primary" style={{ justifyContent: "center", opacity: submitting ? 0.7 : 1 }}>
            {submitting ? "Publishing…" : "Publish advisory"}
          </button>
        </form>
      </div>
    </div>
  );
}

// Small password-gated confirmation for removing a Special Advisory —
// same server-side password check as publishing, via DELETE /api/advisories.
function DeleteAdvisoryModal({ target, password, setPassword, submitting, error, onConfirm, onClose }) {
  if (!target) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(20,23,28,0.72)", zIndex: 210,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 14, maxWidth: 420, width: "100%", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)", padding: "22px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Trash2 size={18} color={COLORS.red} />
          <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, margin: 0 }}>Delete this advisory?</h3>
        </div>
        <p style={{ fontSize: 13.5, color: COLORS.slate, marginTop: 12, lineHeight: 1.5 }}>
          "{target.title}" will be permanently removed for all visitors. This can't be undone.
        </p>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: COLORS.slate, marginBottom: 6 }}>
            <Lock size={12} style={{ verticalAlign: -1, marginRight: 5 }} />
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Only for authorized team members"
            style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1.5px solid ${COLORS.line}`, fontSize: 14, fontFamily: "inherit" }}
          />
        </div>
        {error && <div style={{ fontSize: 13, color: COLORS.red, marginTop: 10 }}>{error}</div>}
        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer", background: "#fff", color: COLORS.slate, border: `1.5px solid ${COLORS.line}` }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            style={{ flex: 1, padding: "10px 0", borderRadius: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer", background: COLORS.red, color: "#fff", border: `1.5px solid ${COLORS.red}`, opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Deleting…" : "Delete"}
          </button>
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
  const [liveArticles, setLiveArticles] = useState(null);
  const [regionNews, setRegionNews] = useState(null);
  const [newsError, setNewsError] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null);
  const [locationModal, setLocationModal] = useState(null);
  const [page, setPage] = useState("home"); // "home" | "alerts" | "service"
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertRegionFilter, setAlertRegionFilter] = useState("ALL");
  const [specialAdvisories, setSpecialAdvisories] = useState([]);
  const [advisoryModalOpen, setAdvisoryModalOpen] = useState(false);
  const [advisoryPassword, setAdvisoryPassword] = useState("");
  const [advisorySubmitting, setAdvisorySubmitting] = useState(false);
  const [advisoryError, setAdvisoryError] = useState(null);
  const [advisoryForm, setAdvisoryForm] = useState({
    title: "", description: "", impact: "", risk: "HIGH", incidentType: "Crisis", region: "APAC", location: "",
    dateTime: "", massCommunication: "no", source: "", url: "",
  });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
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

  // Special Advisories are host/handler-published items, stored server-side
  // via /api/advisories so every visitor sees the same list — unlike the
  // scraped news feed above, this one only changes when someone with the
  // publishing password submits something.
  function loadAdvisories() {
    fetch("/api/advisories")
      .then((res) => res.json())
      .then((data) => setSpecialAdvisories(Array.isArray(data.items) ? data.items : []))
      .catch(() => {});
  }

  useEffect(() => {
    loadAdvisories();
  }, []);

  function submitAdvisory(e) {
    e.preventDefault();
    setAdvisorySubmitting(true);
    setAdvisoryError(null);
    fetch("/api/advisories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...advisoryForm, password: advisoryPassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Could not publish advisory. Check the password and try again.");
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
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id, password: deletePassword }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Could not delete advisory. Check the password and try again.");
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
        .sl-megamenu {
          box-shadow: 0 24px 60px -20px rgba(20,23,28,0.32);
          padding: 28px 30px; width: min(760px, 88vw); z-index: 60;
          border-top: 3px solid ${COLORS.red};
        }
        .sl-megamenu-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px 28px;
        }
        .sl-megamenu-col { display: flex; flex-direction: column; gap: 2px; }
        .sl-megamenu-heading {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13px;
          color: ${COLORS.black}; margin-bottom: 6px; padding-bottom: 8px;
          border-bottom: 1px solid ${COLORS.line};
        }
        .sl-dropdown-link {
          display: block; text-align: left; background: none; border: none; font: inherit;
          width: 100%; padding: 7px 8px; margin: 0 -8px; border-radius: 6px;
          font-size: 13px; color: ${COLORS.slate}; cursor: pointer; line-height: 1.4;
        }
        .sl-dropdown-link:hover { background: ${COLORS.goldLight}; color: ${COLORS.black}; }
        .sl-dropdown-link--top {
          font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 13.5px;
          color: ${COLORS.black}; padding: 7px 8px;
        }
        .sl-mobile-details summary { cursor: pointer; padding: 10px 0; list-style: none; }
        .sl-mobile-details summary::-webkit-details-marker { display: none; }
        .sl-mobile-details summary::after { content: "+"; float: right; color: ${COLORS.slateLight}; }
        .sl-mobile-details[open] summary::after { content: "–"; }
        @media (max-width: 900px) {
          .sl-split-view { grid-template-columns: 1fr; }
          .sl-service-layout { grid-template-columns: 1fr !important; }
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
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
          <button
            onClick={() => { setPage("home"); setSelectedAlert(null); setSelectedService(null); }}
            style={{ display: "flex", alignItems: "center", background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", textAlign: "left", flexShrink: 0 }}
            aria-label="ForeSecure home"
          >
            <BrandLogo height={30} />
          </button>

          <nav ref={navRef} className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 30, flex: 1, justifyContent: "center" }}>
            {NAV_MENU.map((item) => (
              <NavMenuItem
                key={item.label}
                item={item}
                isOpen={openMenu === item.label}
                onToggle={() => setOpenMenu((m) => (m === item.label ? null : item.label))}
                onNavigate={handleNavigate}
              />
            ))}
            <button onClick={() => handleNavigate("Travel Tracker")} className="sl-nav-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>
              Travel Tracker
            </button>
            <button onClick={() => handleNavigate("Mass Communication")} className="sl-nav-link" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit" }}>
              Mass Communication
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
          </nav>

          <div className="sl-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <a href="#" className="sl-nav-link">Sign in</a>
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
            <button onClick={() => handleNavigate("Travel Tracker")} className="sl-nav-link" style={{ padding: "10px 0", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>Travel Tracker</button>
            <button onClick={() => handleNavigate("Mass Communication")} className="sl-nav-link" style={{ padding: "10px 0", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>Mass Communication</button>
            <button onClick={() => { setPage("alerts"); setSelectedAlert(null); setSelectedService(null); setMenuOpen(false); }} className="sl-nav-link" style={{ padding: "10px 0", textAlign: "left", background: "none", border: "none", cursor: "pointer", font: "inherit" }}>Live Alerts</button>
            <a href="#" className="sl-nav-link" style={{ padding: "10px 0" }}>Sign in</a>
          </div>
        )}
      </header>
      <FullScreenMenu open={dotMenuOpen} onClose={() => setDotMenuOpen(false)} onNavigate={handleNavigate} />

      {page === "home" && (
      <>
      {/* HERO — full viewport video (nav sits above it). Drop your own file into
          /public/videos/hero.mp4, or pass a different src to <HeroVideo src="..." />. */}
      <section style={{ position: "relative", background: COLORS.black, overflow: "hidden", height: "calc(100vh - 73px)", minHeight: 520, display: "flex", alignItems: "flex-end" }}>
        <HeroVideo />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,23,28,0.15) 0%, rgba(20,23,28,0.75) 100%)" }} />
        <div style={{ position: "absolute", bottom: 18, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.6)" }}>
          <ChevronDown size={22} />
        </div>
      </section>
      </>
      )}

      {/* TICKER — signature element, now a simple scrolling brand statement */}
      <section style={{ background: COLORS.black, padding: "16px 0", overflow: "hidden", borderTop: "1px solid #24272E" }}>
        <div className="sl-ticker-track" style={{ animationDuration: "22s" }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "0 28px", borderRight: "1px solid #2A2E36", whiteSpace: "nowrap" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.gold, flexShrink: 0 }} />
              <span className="sl-display" style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "#EDEBE4" }}>
                Advanced Technology
              </span>
            </div>
          ))}
        </div>
      </section>
      <LocationModal data={locationModal} onClose={() => setLocationModal(null)} />
      <AdvisoryModal
        open={advisoryModalOpen}
        form={advisoryForm}
        setForm={setAdvisoryForm}
        password={advisoryPassword}
        setPassword={setAdvisoryPassword}
        submitting={advisorySubmitting}
        error={advisoryError}
        onSubmit={submitAdvisory}
        onClose={() => { setAdvisoryModalOpen(false); setAdvisoryError(null); }}
      />
      <DeleteAdvisoryModal
        target={deleteTarget}
        password={deletePassword}
        setPassword={setDeletePassword}
        submitting={deleteSubmitting}
        error={deleteError}
        onConfirm={deleteAdvisory}
        onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
      />

      {page === "home" && (
      <>
     

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
                <button
                  onClick={() => setAlertRegionFilter("SPECIAL")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: alertRegionFilter === "SPECIAL" ? COLORS.gold : "#fff",
                    color: COLORS.black,
                    border: `1.5px solid ${alertRegionFilter === "SPECIAL" ? COLORS.gold : COLORS.line}`,
                    borderRadius: 20, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}
                >
                  <Megaphone size={13} />
                  Special Advisory
                </button>
              </div>

              {alertRegionFilter === "SPECIAL" ? (
                <>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
                    <button onClick={() => setAdvisoryModalOpen(true)} className="sl-btn-ghost" style={{ fontSize: 13.5 }}>
                      <Plus size={15} /> Add advisory
                    </button>
                  </div>
                  <div className="sl-grid-4" style={{ marginTop: 16, gridTemplateColumns: "repeat(3, 1fr)" }}>
                    {specialAdvisories.map((item, i) => (
                      <Reveal key={item.id || item.url || item.title + i} delay={Math.min(i, 8) * 60}>
                        <div style={{ position: "relative" }}>
                          <button
                            onClick={() => setSelectedAlert(item)}
                            className="sl-card"
                            style={{ display: "block", width: "100%", padding: 22, height: "100%", textAlign: "left", cursor: "pointer", font: "inherit", background: "#fff" }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingRight: 26 }}>
                              <span className="sl-mono" style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.03em", color: item.risk === "HIGH" ? "#fff" : COLORS.red, background: item.risk === "HIGH" ? COLORS.red : COLORS.goldLight, padding: "3px 9px", borderRadius: 3 }}>
                                {item.risk} RISK
                              </span>
                              <span className="sl-mono" style={{ fontSize: 11, color: COLORS.red, background: COLORS.goldLight, padding: "3px 9px", borderRadius: 3, fontWeight: 600 }}>{item.incidentType}</span>
                              <span className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight }}>{timeAgo(item.publishedAt)}</span>
                            </div>
                            <h3 className="sl-display" style={{ fontSize: 16.5, fontWeight: 600, marginTop: 14, lineHeight: 1.4 }}>{item.title}</h3>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16, fontSize: 12.5, color: COLORS.slateLight }}>
                              {item.location ? <MapPin size={14} /> : <Newspaper size={14} />}
                              {item.location ? item.location.name : item.source}
                            </div>
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteError(null); setDeletePassword(""); setDeleteTarget(item); }}
                            title="Delete advisory"
                            aria-label="Delete advisory"
                            style={{ position: "absolute", top: 14, right: 14, background: "#fff", border: `1px solid ${COLORS.line}`, borderRadius: 6, padding: 6, cursor: "pointer", display: "flex" }}
                          >
                            <Trash2 size={13} color={COLORS.slateLight} />
                          </button>
                        </div>
                      </Reveal>
                    ))}
                  </div>
                  {specialAdvisories.length === 0 && (
                    <p style={{ fontSize: 13.5, color: COLORS.slateLight, marginTop: 24 }}>
                      No special advisories published yet.
                    </p>
                  )}
                </>
              ) : (
                <>
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
                    {selectedAlert.impact && (
                      <>
                        <div className="sl-mono" style={{ fontSize: 11.5, color: COLORS.slateLight, textTransform: "uppercase", letterSpacing: "0.04em", marginTop: 22, marginBottom: 10 }}>Impact analysis</div>
                        <p style={{ fontSize: 14.5, color: COLORS.slate, lineHeight: 1.65 }}>
                          {selectedAlert.impact}
                        </p>
                      </>
                    )}
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
        <>
        {/* Hero band */}
        <section style={{ position: "relative", background: COLORS.black, overflow: "hidden", padding: "44px 24px 56px" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
            <MapIllustration />
          </div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(20,23,28,0.55) 0%, rgba(20,23,28,0.92) 100%)" }} />
          <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
            <button
              onClick={() => { setPage("home"); setSelectedService(null); }}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.65)", fontSize: 13.5, fontWeight: 600, padding: 0, marginBottom: 22, font: "inherit" }}
            >
              <ArrowRight size={15} style={{ transform: "rotate(180deg)" }} /> Home
              <ChevronRight size={13} style={{ opacity: 0.6 }} />
              <span style={{ color: "rgba(255,255,255,0.9)" }}>{SERVICE_CONTENT[selectedService].category}</span>
            </button>
            <Reveal>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(201,154,30,0.14)", border: `1px solid ${COLORS.gold}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldAlert size={19} color={COLORS.gold} />
                </div>
                <div className="sl-mono" style={{ fontSize: 12.5, color: COLORS.gold, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {SERVICE_CONTENT[selectedService].category}
                </div>
              </div>
              <h1 className="sl-display" style={{ fontSize: "clamp(30px, 4vw, 46px)", fontWeight: 700, letterSpacing: "-0.01em", marginTop: 16, color: "#fff", lineHeight: 1.1 }}>
                {selectedService}
              </h1>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.88)", marginTop: 18, lineHeight: 1.6, maxWidth: 640 }}>
                {SERVICE_CONTENT[selectedService].summary}
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
                <button className="sl-btn-primary">Request a briefing <ArrowRight size={15} /></button>
              </div>
            </Reveal>
          </div>
        </section>

        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 0" }}>
          <Reveal>
            <ServiceImage label={selectedService} />
          </Reveal>
        </section>

        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 48 }} className="sl-service-layout">
            <div>
              <Reveal>
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {SERVICE_CONTENT[selectedService].body.map((para, i) => (
                    <p key={i} style={{ fontSize: 16.5, fontWeight: 400, color: "#22252B", lineHeight: 1.8 }}>{para}</p>
                  ))}
                </div>
              </Reveal>
            </div>

            <div>
              {(() => {
                const siblings = findSiblingServices(selectedService);
                if (siblings.length === 0) return null;
                return (
                  <Reveal delay={140}>
                    <div className="sl-card" style={{ padding: 20, position: "sticky", top: 90 }}>
                      <div className="sl-mono" style={{ fontSize: 11, color: COLORS.slateLight, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 12 }}>
                        Related services
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        {siblings.map((label) => (
                          <button
                            key={label}
                            onClick={() => handleNavigate(label)}
                            className="sl-dropdown-link"
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}
                          >
                            <span>{label}</span>
                            <ChevronRight size={13} color={COLORS.slateLight} style={{ flexShrink: 0 }} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })()}
            </div>
          </div>
        </section>

        {/* Page-specific CTA — deliberately not the newsletter box, which stays home-only */}
        <section style={{ maxWidth: 1000, margin: "0 auto", padding: "80px 24px 100px" }}>
          <Reveal>
            <div style={{ background: COLORS.black, borderRadius: 14, padding: "40px 40px", display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ maxWidth: 460 }}>
                <h3 className="sl-display" style={{ color: "#fff", fontSize: 21, fontWeight: 700 }}>
                  Ready to talk through {selectedService.toLowerCase()}?
                </h3>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14.5, marginTop: 8, lineHeight: 1.55 }}>
                  A member of our team can walk through what this looks like for your organization specifically.
                </p>
              </div>
              <button className="sl-btn-primary" style={{ flexShrink: 0 }}>Request a briefing <ArrowRight size={15} /></button>
            </div>
          </Reveal>
        </section>
        </>
      )}

      {/* NEWSLETTER */}
      {page === "home" && (
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
      )}

      {/* FOOTER */}
      <footer style={{ maxWidth: 1160, margin: "0 auto", padding: "80px 24px 40px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 32, borderTop: `1px solid ${COLORS.line}`, paddingTop: 36 }}>
          <BrandLogo height={32} />
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
        <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${COLORS.line}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Building2 size={15} color={COLORS.slateLight} />
            <span style={{ fontSize: 12, color: COLORS.slateLight, textTransform: "uppercase", letterSpacing: "0.04em" }}>Operations center</span>
          </div>
          {officeLocations.map(({ city, role }) => (
            <div key={city} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{city}</span>
              <span style={{ fontSize: 12.5, color: COLORS.slateLight }}>— {role}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 32, fontSize: 12.5, color: COLORS.slateLight, display: "flex", gap: 16, alignItems: "center" }}>
          <Globe2 size={14} /> ForeSecure is a demonstration brand — content generated for demonstration purposes.
        </div>
      </footer>
    </div>
  );
}