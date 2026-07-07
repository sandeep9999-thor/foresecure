// Vercel serverless function — runs on the server, never in the browser.
//
// Rewritten to pull directly from RSS feeds instead of a paid/rate-limited
// news API. Benefits:
//   - No API key, no daily request quota, nothing to expire.
//   - RSS feeds are updated continuously by the publishers themselves, so
//     results are genuinely real-time instead of whatever a cached search
//     index last indexed.
//   - We can pull region-specific feeds directly (BBC's dedicated regional
//     RSS editions) instead of guessing region from keyword matching alone.
//
// Regions covered: APAC, EMEA, North America, Latin America.

const CRISIS_KEYWORDS =
  '(crisis OR "civil unrest" OR earthquake OR flood OR cyclone OR typhoon OR hurricane OR wildfire OR "security threat" OR terrorism OR evacuation OR "state of emergency" OR protest OR riot)';

// Location terms appended to the Google News search query per region so the
// keyword-based feed is actually scoped to that part of the world.
const REGION_LOCATIONS = {
  APAC:
    '(Japan OR China OR India OR Australia OR Philippines OR Indonesia OR Vietnam OR "South Korea" OR Thailand OR Singapore OR Malaysia OR Pakistan OR Bangladesh OR Taiwan OR "Hong Kong" OR "New Zealand" OR Myanmar OR "Sri Lanka")',
  EMEA:
    '(UK OR Britain OR France OR Germany OR Italy OR Spain OR Poland OR Ukraine OR Russia OR Nigeria OR "South Africa" OR Egypt OR Kenya OR "Saudi Arabia" OR UAE OR Israel OR Gaza OR Lebanon OR Turkey OR Netherlands)',
  NORTH_AMERICA: '("United States" OR US OR America OR Canada)',
  LATIN_AMERICA:
    '(Mexico OR Brazil OR Argentina OR Colombia OR Chile OR Peru OR Venezuela OR Ecuador OR "Central America" OR Guatemala OR Honduras OR "Latin America")',
};

function googleNewsFeed(query) {
  const q = encodeURIComponent(`${CRISIS_KEYWORDS} ${query} when:2d`);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

// Direct regional RSS editions (broad world news, filtered/tagged after
// fetch) layered on top of the targeted crisis-keyword Google News search
// for each region — gives both breadth and precision.
const REGION_FEEDS = {
  APAC: [
    "https://feeds.bbci.co.uk/news/world/asia/rss.xml",
    googleNewsFeed(REGION_LOCATIONS.APAC),
  ],
  EMEA: [
    "https://feeds.bbci.co.uk/news/world/europe/rss.xml",
    "https://feeds.bbci.co.uk/news/world/africa/rss.xml",
    "https://feeds.bbci.co.uk/news/world/middle_east/rss.xml",
    googleNewsFeed(REGION_LOCATIONS.EMEA),
  ],
  NORTH_AMERICA: [
    "https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml",
    googleNewsFeed(REGION_LOCATIONS.NORTH_AMERICA),
  ],
  LATIN_AMERICA: [
    "https://feeds.bbci.co.uk/news/world/latin_america/rss.xml",
    googleNewsFeed(REGION_LOCATIONS.LATIN_AMERICA),
  ],
};

const REGION_LABELS = {
  APAC: "APAC",
  EMEA: "EMEA",
  NORTH_AMERICA: "North America",
  LATIN_AMERICA: "Latin America",
};

// ---- tiny hand-rolled RSS parser (no extra npm dependency required) ----

function stripCDATA(s) {
  const m = /^<!\[CDATA\[([\s\S]*)\]\]>$/.exec(s.trim());
  return m ? m[1] : s;
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'");
}

function stripTags(s) {
  return s.replace(/<[^>]*>/g, "").trim();
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = re.exec(block);
  if (!m) return "";
  return decodeEntities(stripTags(stripCDATA(m[1]).trim()));
}

function parseRSS(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    let source = extractTag(block, "source");

    // Google News titles are formatted "Headline - Source Name" when there's
    // no explicit <source> tag some feed readers expect.
    if (!source && title.includes(" - ")) {
      const idx = title.lastIndexOf(" - ");
      source = title.slice(idx + 3).trim();
    }

    if (title && link) {
      items.push({ title: title.split(" - " + source).join(""), link, pubDate, source });
    }
  }
  return items;
}

async function fetchFeed(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ForeSecureBot/1.0)" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSS(xml);
  } catch {
    return [];
  }
}

function categorize(text = "") {
  const t = text.toLowerCase();
  if (/(flood|cyclone|typhoon|hurricane|storm|wildfire|earthquake|weather)/.test(t)) return "Weather";
  if (/(protest|riot|unrest|terror|attack|security)/.test(t)) return "Security";
  if (/(flight|airport|airline|travel)/.test(t)) return "Travel";
  return "Crisis";
}

function normalizeForDedupe(title) {
  return title.toLowerCase().replace(/[^a-z0-9 ]/g, "").slice(0, 60);
}

function parseDate(pubDate) {
  const d = new Date(pubDate);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

async function fetchRegion(regionKey) {
  const feeds = REGION_FEEDS[regionKey];
  const results = await Promise.all(feeds.map(fetchFeed));
  const seen = new Set();
  const items = [];

  for (const list of results) {
    for (const item of list) {
      const key = normalizeForDedupe(item.title);
      if (seen.has(key)) continue;
      seen.add(key);
      items.push({
        title: item.title,
        url: item.link,
        source: item.source || "News wire",
        publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : null,
        region: REGION_LABELS[regionKey],
        tag: categorize(item.title),
        _sortDate: parseDate(item.pubDate),
      });
    }
  }

  items.sort((a, b) => b._sortDate - a._sortDate);
  return items.map(({ _sortDate, ...rest }) => rest);
}

export default async function handler(req, res) {
  try {
    const regionKeys = Object.keys(REGION_FEEDS);
    const regionResults = await Promise.all(regionKeys.map(fetchRegion));

    const regions = {};
    regionKeys.forEach((key, i) => {
      regions[key] = regionResults[i].slice(0, 8);
    });

    // Combined, deduped, most-recent-first feed for the homepage ticker.
    const seen = new Set();
    const all = [];
    for (const list of regionResults) {
      for (const item of list) {
        const key = normalizeForDedupe(item.title);
        if (seen.has(key)) continue;
        seen.add(key);
        all.push(item);
      }
    }
    all.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

    // Short cache window so the site stays close to real-time while still
    // shielding the RSS sources from a request on every single page load.
    res.setHeader("Cache-Control", "s-maxage=180, stale-while-revalidate=120");
    return res.status(200).json({
      regions,
      all: all.slice(0, 24),
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the news providers." });
  }
}