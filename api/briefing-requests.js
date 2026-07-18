// Briefing Requests — the leads that come in from the "Request a briefing"
// form. Anyone can submit (POST), but only your team can view the list
// (GET, gated by the same ADVISORY_PASSWORD you already use for Special
// Advisories — no new password to manage).
//
// Uses the same Redis store you already connected for Special Advisories —
// no new setup needed here.

import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});
const KEY = "foresecure:briefing-requests";
const MAX_ITEMS = 500;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { password } = req.query || {};
    if (!process.env.ADVISORY_PASSWORD || password !== process.env.ADVISORY_PASSWORD) {
      return res.status(401).json({ error: "Incorrect password." });
    }
    const items = (await redis.get(KEY)) || [];
    return res.status(200).json({ items });
  }

  if (req.method === "POST") {
    const { firstName, lastName, phone, email, organization, designation, message, website } = req.body || {};

    // Honeypot: real visitors never see or fill this field. If it has a
    // value, silently pretend to succeed rather than telling a bot it
    // tripped a filter.
    if (website) {
      return res.status(200).json({ ok: true });
    }

    if (!firstName || !lastName || !phone || !email || !organization || !designation) {
      return res.status(400).json({ error: "Please fill in all required fields." });
    }
    if (!email.includes("@")) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    const newItem = {
      id: randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      organization: organization.trim(),
      designation: designation.trim(),
      message: (message || "").trim() || null,
      submittedAt: new Date().toISOString(),
    };

    const existing = (await redis.get(KEY)) || [];
    const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
    await redis.set(KEY, updated);

    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method not allowed." });
}