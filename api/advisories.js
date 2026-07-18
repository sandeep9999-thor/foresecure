// Special Advisories — visible to everyone, but only publishable by
// whoever knows ADVISORY_PASSWORD (set that in Vercel → Project →
// Settings → Environment Variables; give it to your host/handlers only).
//
// Storage: Vercel's Upstash integration provisions Redis but names the env
// vars KV_REST_API_URL / KV_REST_API_TOKEN (legacy @vercel/kv naming, kept
// for compatibility) rather than UPSTASH_REDIS_REST_URL / TOKEN — so we
// point @upstash/redis at those explicitly instead of using Redis.fromEnv().
//   1. Vercel dashboard → your project → Storage → Upstash → Create →
//      Redis → connect to this project (adds the KV_REST_API_* env vars)
//   2. `npm install @upstash/redis`
//   3. Add ADVISORY_PASSWORD as an env var with whatever password you
//      want your team to use to publish
//   4. Redeploy

import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
const KEY = "foresecure:special-advisories";
const MAX_ITEMS = 60;
const VALID_REGIONS = ["APAC", "INDIA", "EMEA", "AMERICAS"];

export default async function handler(req, res) {
  if (req.method === "GET") {
    const items = (await redis.get(KEY)) || [];
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const { password, title, description, impact, risk, incidentType, region, location, dateTime, massCommunication, source, url } = req.body || {};

    if (!process.env.ADVISORY_PASSWORD) {
      return res.status(500).json({ error: "Publishing isn't configured yet — ADVISORY_PASSWORD is missing." });
    }
    if (!password || password !== process.env.ADVISORY_PASSWORD) {
      return res.status(401).json({ error: "Incorrect publishing password." });
    }
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "A headline is required." });
    }

    // dateTime comes from a <input type="datetime-local"> (local time, no
    // timezone) — fall back to "now" if left blank, otherwise parse it as
    // local time and store as a proper ISO timestamp.
    const parsedDate = dateTime ? new Date(dateTime) : new Date();
    const publishedAt = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();

    const newItem = {
      id: randomUUID(),
      title: title.trim(),
      description: (description || "").trim() || null,
      impact: (impact || "").trim() || null,
      risk: risk === "MEDIUM" ? "MEDIUM" : "HIGH",
      incidentType: (incidentType || "Crisis").trim() || "Crisis",
      region: VALID_REGIONS.includes(region) ? region : "APAC",
      location: location && location.trim() ? { name: location.trim() } : null,
      massCommunication: massCommunication === "yes",
      source: (source || "Special Advisory").trim() || "Special Advisory",
      url: (url || "").trim() || null,
      publishedAt,
    };

    const existing = (await redis.get(KEY)) || [];
    const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
    await redis.set(KEY, updated);

    return res.status(200).json({ items: updated });
  }

  if (req.method === "DELETE") {
    const { password, id } = req.body || {};

    if (!process.env.ADVISORY_PASSWORD) {
      return res.status(500).json({ error: "Deletion isn't configured yet — ADVISORY_PASSWORD is missing." });
    }
    if (!password || password !== process.env.ADVISORY_PASSWORD) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    if (!id) {
      return res.status(400).json({ error: "Missing advisory id." });
    }

    const existing = (await redis.get(KEY)) || [];
    const updated = existing.filter((item) => item.id !== id);
    await redis.set(KEY, updated);

    return res.status(200).json({ items: updated });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "Method not allowed." });
}