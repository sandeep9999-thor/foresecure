// Vercel serverless function — runs on the server, never in the browser.
// The API key lives only here, read from an environment variable, so it's
// never exposed to anyone visiting the site.

const QUERY =
  '(crisis OR "civil unrest" OR earthquake OR flood OR cyclone OR typhoon OR hurricane OR wildfire OR "security threat" OR terrorism OR evacuation OR "state of emergency" OR protest OR riot) NOT quote NOT divorce NOT movie NOT celebrity NOT trivia NOT podcast NOT quiz';

const TRUSTED_DOMAINS = [
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "aljazeera.com",
  "theguardian.com",
  "npr.org",
  "cnn.com",
  "nbcnews.com",
  "news.sky.com",
  "bloomberg.com",
  "channelnewsasia.com",
  "straitstimes.com",
].join(",");

function categorize(text = "") {
  const t = text.toLowerCase();
  if (/(flood|cyclone|typhoon|hurricane|storm|wildfire|earthquake|weather)/.test(t)) return "Weather";
  if (/(protest|riot|unrest|terror|attack|security)/.test(t)) return "Security";
  if (/(flight|airport|airline|travel)/.test(t)) return "Travel";
  return "Crisis";
}

const PLACES = [
  { name: "Tokyo", region: "APAC", lat: 35.6762, lng: 139.6503 },
  { name: "Japan", region: "APAC", lat: 36.2048, lng: 138.2529 },
  { name: "Beijing", region: "APAC", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", region: "APAC", lat: 31.2304, lng: 121.4737 },
  { name: "China", region: "APAC", lat: 35.8617, lng: 104.1954 },
  { name: "Hong Kong", region: "APAC", lat: 22.3193, lng: 114.1694 },
  { name: "Manila", region: "APAC", lat: 14.5995, lng: 120.9842 },
  { name: "Philippines", region: "APAC", lat: 12.8797, lng: 121.7740 },
  { name: "Jakarta", region: "APAC", lat: -6.2088, lng: 106.8456 },
  { name: "Indonesia", region: "APAC", lat: -0.7893, lng: 113.9213 },
  { name: "Singapore", region: "APAC", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", region: "APAC", lat: 13.7563, lng: 100.5018 },
  { name: "Thailand", region: "APAC", lat: 15.8700, lng: 100.9925 },
  { name: "Seoul", region: "APAC", lat: 37.5665, lng: 126.9780 },
  { name: "South Korea", region: "APAC", lat: 35.9078, lng: 127.7669 },
  { name: "Mumbai", region: "APAC", lat: 19.0760, lng: 72.8777 },
  { name: "New Delhi", region: "APAC", lat: 28.6139, lng: 77.2090 },
  { name: "India", region: "APAC", lat: 20.5937, lng: 78.9629 },
  { name: "Sydney", region: "APAC", lat: -33.8688, lng: 151.2093 },
  { name: "Australia", region: "APAC", lat: -25.2744, lng: 133.7751 },
  { name: "Kuala Lumpur", region: "APAC", lat: 3.1390, lng: 101.6869 },
  { name: "Malaysia", region: "APAC", lat: 4.2105, lng: 101.9758 },
  { name: "Taipei", region: "APAC", lat: 25.0330, lng: 121.5654 },
  { name: "Taiwan", region: "APAC", lat: 23.6978, lng: 120.9605 },
  { name: "Hanoi", region: "APAC", lat: 21.0285, lng: 105.8542 },
  { name: "Vietnam", region: "APAC", lat: 14.0583, lng: 108.2772 },
  { name: "Pakistan", region: "APAC", lat: 30.3753, lng: 69.3451 },
  { name: "Bangladesh", region: "APAC", lat: 23.6850, lng: 90.3563 },
  { name: "Myanmar", region: "APAC", lat: 21.9162, lng: 95.9560 },

  { name: "London", region: "EMEA", lat: 51.5072, lng: -0.1276 },
  { name: "United Kingdom", region: "EMEA", lat: 55.3781, lng: -3.4360 },
  { name: "Paris", region: "EMEA", lat: 48.8566, lng: 2.3522 },
  { name: "France", region: "EMEA", lat: 46.2276, lng: 2.2137 },
  { name: "Berlin", region: "EMEA", lat: 52.5200, lng: 13.4050 },
  { name: "Germany", region: "EMEA", lat: 51.1657, lng: 10.4515 },
  { name: "Madrid", region: "EMEA", lat: 40.4168, lng: -3.7038 },
  { name: "Spain", region: "EMEA", lat: 40.4637, lng: -3.7492 },
  { name: "Rome", region: "EMEA", lat: 41.9028, lng: 12.4964 },
  { name: "Italy", region: "EMEA", lat: 41.8719, lng: 12.5674 },
  { name: "Moscow", region: "EMEA", lat: 55.7558, lng: 37.6173 },
  { name: "Russia", region: "EMEA", lat: 61.5240, lng: 105.3188 },
  { name: "Kyiv", region: "EMEA", lat: 50.4501, lng: 30.5234 },
  { name: "Ukraine", region: "EMEA", lat: 48.3794, lng: 31.1656 },
  { name: "Istanbul", region: "EMEA", lat: 41.0082, lng: 28.9784 },
  { name: "Turkey", region: "EMEA", lat: 38.9637, lng: 35.2433 },
  { name: "Cairo", region: "EMEA", lat: 30.0444, lng: 31.2357 },
  { name: "Egypt", region: "EMEA", lat: 26.8206, lng: 30.8025 },
  { name: "Lagos", region: "EMEA", lat: 6.5244, lng: 3.3792 },
  { name: "Nigeria", region: "EMEA", lat: 9.0820, lng: 8.6753 },
  { name: "Nairobi", region: "EMEA", lat: -1.2921, lng: 36.8219 },
  { name: "Kenya", region: "EMEA", lat: -0.0236, lng: 37.9062 },
  { name: "Johannesburg", region: "EMEA", lat: -26.2041, lng: 28.0473 },
  { name: "South Africa", region: "EMEA", lat: -30.5595, lng: 22.9375 },
  { name: "Dubai", region: "EMEA", lat: 25.2048, lng: 55.2708 },
  { name: "UAE", region: "EMEA", lat: 23.4241, lng: 53.8478 },
  { name: "Riyadh", region: "EMEA", lat: 24.7136, lng: 46.6753 },
  { name: "Saudi Arabia", region: "EMEA", lat: 23.8859, lng: 45.0792 },
  { name: "Tel Aviv", region: "EMEA", lat: 32.0853, lng: 34.7818 },
  { name: "Israel", region: "EMEA", lat: 31.0461, lng: 34.8516 },
  { name: "Gaza", region: "EMEA", lat: 31.5017, lng: 34.4668 },
  { name: "Brussels", region: "EMEA", lat: 50.8503, lng: 4.3517 },
  { name: "Poland", region: "EMEA", lat: 51.9194, lng: 19.1451 },
  { name: "Iran", region: "EMEA", lat: 32.4279, lng: 53.6880 },
  { name: "Iraq", region: "EMEA", lat: 33.2232, lng: 43.6793 },
  { name: "Syria", region: "EMEA", lat: 34.8021, lng: 38.9968 },
  { name: "Sudan", region: "EMEA", lat: 12.8628, lng: 30.2176 },

  { name: "New York", region: "NORTH_AMERICA", lat: 40.7128, lng: -74.0060 },
  { name: "Washington", region: "NORTH_AMERICA", lat: 38.9072, lng: -77.0369 },
  { name: "Los Angeles", region: "NORTH_AMERICA", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", region: "NORTH_AMERICA", lat: 41.8781, lng: -87.6298 },
  { name: "Houston", region: "NORTH_AMERICA", lat: 29.7604, lng: -95.3698 },
  { name: "Miami", region: "NORTH_AMERICA", lat: 25.7617, lng: -80.1918 },
  { name: "San Francisco", region: "NORTH_AMERICA", lat: 37.7749, lng: -122.4194 },
  { name: "United States", region: "NORTH_AMERICA", lat: 37.0902, lng: -95.7129 },
  { name: "Toronto", region: "NORTH_AMERICA", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", region: "NORTH_AMERICA", lat: 49.2827, lng: -123.1207 },
  { name: "Canada", region: "NORTH_AMERICA", lat: 56.1304, lng: -106.3468 },
  { name: "Mexico City", region: "NORTH_AMERICA", lat: 19.4326, lng: -99.1332 },
  { name: "Mexico", region: "NORTH_AMERICA", lat: 23.6345, lng: -102.5528 },

  { name: "São Paulo", region: "LATIN_AMERICA", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", region: "LATIN_AMERICA", lat: -22.9068, lng: -43.1729 },
  { name: "Brazil", region: "LATIN_AMERICA", lat: -14.2350, lng: -51.9253 },
  { name: "Buenos Aires", region: "LATIN_AMERICA", lat: -34.6037, lng: -58.3816 },
  { name: "Argentina", region: "LATIN_AMERICA", lat: -38.4161, lng: -63.6167 },
  { name: "Bogotá", region: "LATIN_AMERICA", lat: 4.7110, lng: -74.0721 },
  { name: "Colombia", region: "LATIN_AMERICA", lat: 4.5709, lng: -74.2973 },
  { name: "Lima", region: "LATIN_AMERICA", lat: -12.0464, lng: -77.0428 },
  { name: "Peru", region: "LATIN_AMERICA", lat: -9.1900, lng: -75.0152 },
  { name: "Santiago", region: "LATIN_AMERICA", lat: -33.4489, lng: -70.6693 },
  { name: "Chile", region: "LATIN_AMERICA", lat: -35.6751, lng: -71.5430 },
  { name: "Caracas", region: "LATIN_AMERICA", lat: 10.4806, lng: -66.9036 },
  { name: "Venezuela", region: "LATIN_AMERICA", lat: 6.4238, lng: -66.5897 },
  { name: "Quito", region: "LATIN_AMERICA", lat: -0.1807, lng: -78.4678 },
  { name: "Ecuador", region: "LATIN_AMERICA", lat: -1.8312, lng: -78.1834 },
];

const SORTED_PLACES = [...PLACES].sort((a, b) => b.name.length - a.name.length);

function findLocation(text = "") {
  for (const place of SORTED_PLACES) {
    const escaped = place.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`\\b${escaped}\\b`, "i");
    if (re.test(text)) {
      return { name: place.name, lat: place.lat, lng: place.lng, region: place.region };
    }
  }
  return null;
}

const REGION_KEYS = ["APAC", "EMEA", "NORTH_AMERICA", "LATIN_AMERICA"];

export default async function handler(req, res) {
  const apiKey = process.env.NEWS_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing NEWS_API_KEY. Add it in your environment variables." });
  }

  const url =
    "https://newsapi.org/v2/everything" +
    `?q=${encodeURIComponent(QUERY)}` +
    `&domains=${encodeURIComponent(TRUSTED_DOMAINS)}` +
    "&language=en" +
    "&sortBy=publishedAt" +
    "&pageSize=60" +
    `&apiKey=${apiKey}`;

  try {
    const upstream = await fetch(url);
    const data = await upstream.json();

    if (data.status !== "ok") {
      return res.status(502).json({ error: data.message || "News provider returned an error." });
    }

    const all = (data.articles || [])
      .filter((a) => a.title && a.url)
      .map((a) => {
        const location = findLocation(`${a.title} ${a.description || ""}`);
        return {
          title: a.title,
          description: a.description || "",
          url: a.url,
          source: a.source?.name || "Unknown source",
          publishedAt: a.publishedAt,
          image: a.urlToImage || null,
          tag: categorize(`${a.title} ${a.description || ""}`),
          location: location ? { name: location.name, lat: location.lat, lng: location.lng } : null,
          region: location ? location.region : null,
        };
      });

    const regions = {};
    for (const key of REGION_KEYS) {
      regions[key] = all.filter((a) => a.region === key).slice(0, 8);
    }

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
    return res.status(200).json({
      all: all.slice(0, 24),
      regions,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the news provider." });
  }
}
