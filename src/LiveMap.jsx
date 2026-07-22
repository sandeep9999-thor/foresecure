import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  MapPin, Newspaper, Clock, ExternalLink, MapPinned, RefreshCw,
  X, Layers, AlertTriangle, Crosshair, List,
} from "lucide-react";
import { T } from "./theme";

/* ===========================================================================
   LiveMapPage — every geolocated alert on one world map.

   Leaflet is loaded from a CDN at runtime rather than bundled, so this file
   adds no npm dependency and no build step. If the CDN is unreachable the
   page degrades to the list view instead of showing a broken map.

   Honest by design: alerts whose headline never matched the gazetteer have
   no coordinates and cannot be plotted. Rather than hide them, the page
   counts them and offers them in a separate "not on the map" drawer.
   =========================================================================== */

const LEAFLET_CSS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
const LEAFLET_JS = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";

// Dark raster tiles, no API key, free for low volume.
const TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const RISK_COLOR = (risk) => (risk === "HIGH" ? T.red : T.amber);

// A coordinate is usable only if it is a real number in range. Empty strings,
// null, and undefined all coerce to 0 through Number(), so they are screened
// out before conversion rather than after.
function coord(v, limit) {
  if (typeof v === "number") {
    return Number.isFinite(v) && Math.abs(v) <= limit ? v : null;
  }
  // Strings are the common case from a JSON gazetteer. Trim first: Number("  ")
  // is 0, not NaN, so whitespace would otherwise pass as a valid coordinate.
  if (typeof v === "string") {
    const t = v.trim();
    if (t === "") return null;
    const n = Number(t);
    return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
  }
  return null;
}

function isPlottable(loc) {
  return Boolean(loc) && coord(loc.lat, 90) !== null && coord(loc.lng, 180) !== null;
}

/* Loads Leaflet once and resolves with the global L. */
let leafletPromise = null;
function loadLeaflet() {
  if (leafletPromise) return leafletPromise;
  leafletPromise = new Promise((resolve, reject) => {
    if (window.L) return resolve(window.L);

    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(script);
  });
  return leafletPromise;
}

/* A marker whose size and colour encode risk, with a CSS ping for HIGH. */
function markerHtml(risk) {
  const c = RISK_COLOR(risk);
  const size = risk === "HIGH" ? 16 : 12;
  const ping =
    risk === "HIGH"
      ? `<span style="position:absolute;inset:0;border-radius:50%;background:${c};opacity:.55;animation:fsm-ping 1.9s cubic-bezier(0,0,.2,1) infinite"></span>`
      : "";
  return `
    <span style="position:relative;display:block;width:${size}px;height:${size}px">
      ${ping}
      <span style="position:absolute;inset:0;border-radius:50%;background:${c};border:1.5px solid rgba(255,255,255,.75);box-shadow:0 0 10px ${c}"></span>
    </span>`;
}

export default function LiveMapPage({
  alerts = [],
  loading,
  error,
  updatedAt,
  onRefresh,
  timeAgo,
}) {
  const mapRef = useRef(null);
  const mapObj = useRef(null);
  const layerRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [showUnmapped, setShowUnmapped] = useState(false);

  // Split the feed by whether the gazetteer resolved a location.
  //
  // Number("") and Number(null) both coerce to 0, not NaN — so a blank or
  // null latitude would otherwise pass a naive isFinite check and drop a
  // false pin at 0,0 in the Gulf of Guinea. Reject non-numbers explicitly,
  // and reject out-of-range values while we're here.
  const { mapped, unmapped } = useMemo(() => {
    const m = [];
    const u = [];
    for (const a of alerts) {
      (isPlottable(a.location) ? m : u).push(a);
    }
    return { mapped: m, unmapped: u };
  }, [alerts]);

  const visible = useMemo(
    () => (riskFilter === "ALL" ? mapped : mapped.filter((a) => a.risk === riskFilter)),
    [mapped, riskFilter]
  );

  const coverage = alerts.length ? Math.round((mapped.length / alerts.length) * 100) : 0;

  /* --- init map once --- */
  useEffect(() => {
    let cancelled = false;
    loadLeaflet()
      .then((L) => {
        if (cancelled || !mapRef.current || mapObj.current) return;
        const map = L.map(mapRef.current, {
          center: [20, 10],
          zoom: 2,
          minZoom: 2,
          maxZoom: 12,
          worldCopyJump: true,
          zoomControl: false,
          attributionControl: true,
        });
        L.tileLayer(TILE_URL, { attribution: TILE_ATTR, subdomains: "abcd" }).addTo(map);
        L.control.zoom({ position: "bottomright" }).addTo(map);
        mapObj.current = map;
        layerRef.current = L.layerGroup().addTo(map);
        setReady(true);
      })
      .catch(() => !cancelled && setMapError("The map library could not be loaded."));
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- redraw markers whenever the visible set changes --- */
  useEffect(() => {
    const L = window.L;
    if (!ready || !L || !layerRef.current) return;
    layerRef.current.clearLayers();

    visible.forEach((a) => {
      const lat = coord(a.location.lat, 90);
      const lng = coord(a.location.lng, 180);
      if (lat === null || lng === null) return;
      const icon = L.divIcon({
        html: markerHtml(a.risk),
        className: "fsm-marker",
        iconSize: a.risk === "HIGH" ? [16, 16] : [12, 12],
        iconAnchor: a.risk === "HIGH" ? [8, 8] : [6, 6],
      });
      L.marker([lat, lng], { icon, riseOnHover: true })
        .addTo(layerRef.current)
        .on("click", () => setSelected(a));
    });
  }, [ready, visible]);

  /* --- fly to a selection made from the list --- */
  function focus(a) {
    setSelected(a);
    const map = mapObj.current;
    if (map && a.location) {
      map.flyTo([coord(a.location.lat, 90), coord(a.location.lng, 180)], 6, { duration: 0.8 });
    }
  }

  function resetView() {
    mapObj.current?.flyTo([20, 10], 2, { duration: 0.7 });
    setSelected(null);
  }

  const chip = (active) => ({
    display: "flex", alignItems: "center", gap: 7, fontFamily: "inherit",
    background: active ? T.goldWash : "transparent",
    color: active ? T.gold : T.inkMid,
    border: `1px solid ${active ? T.goldDim : T.ridge}`,
    borderRadius: 40, padding: "8px 16px", fontSize: 12.5, fontWeight: 600,
    cursor: "pointer", transition: "all .2s",
  });

  return (
    <section className="fs-wrap" style={{ paddingTop: 40, paddingBottom: 90 }}>
      <style>{`
        @keyframes fsm-ping { 75%,100% { transform: scale(2.4); opacity: 0; } }
        .fsm-marker { background: none; border: none; }
        .fsm-shell { position: relative; border-radius: 16px; overflow: hidden;
          border: 1px solid ${T.ridge}; background: ${T.hull}; }
        .fsm-canvas { width: 100%; height: 100%; background: ${T.void}; }
        .leaflet-container { background: ${T.void} !important; font-family: 'Inter', sans-serif; }
        .leaflet-control-attribution {
          background: rgba(7,9,13,.82) !important; color: ${T.inkLow} !important;
          font-size: 10px !important; border: none !important;
        }
        .leaflet-control-attribution a { color: ${T.inkMid} !important; }
        .leaflet-bar a {
          background: ${T.panel} !important; color: ${T.ink} !important;
          border-color: ${T.ridge} !important;
        }
        .leaflet-bar a:hover { background: ${T.ridge} !important; }
        .fsm-layout { display: grid; grid-template-columns: 330px 1fr; gap: 16px; }
        @media (max-width: 900px) {
          .fsm-layout { grid-template-columns: 1fr; }
          .fsm-shell { height: 420px !important; }
        }
      `}</style>

      {/* --- header --- */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ position: "relative", display: "flex", width: 7, height: 7 }}>
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.red, animation: "fs-ping 1.8s cubic-bezier(0,0,.2,1) infinite" }} />
              <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.red }} />
            </span>
            <span className="fs-mono" style={{ fontSize: 11, letterSpacing: ".16em", textTransform: "uppercase", color: T.red, fontWeight: 500 }}>
              Live location alerts
            </span>
          </div>
          <h1 className="fs-display" style={{ fontSize: "clamp(30px,4vw,46px)", fontWeight: 700, letterSpacing: "-.03em", marginTop: 16, lineHeight: 1.08 }}>
            Every located event, on one map.
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <button onClick={onRefresh} disabled={loading} className="fs-navlink"
            style={{ display: "flex", alignItems: "center", gap: 7, color: T.gold, fontWeight: 600, opacity: loading ? .6 : 1 }}>
            <RefreshCw size={14} style={{ animation: loading ? "fs-spin 1s linear infinite" : "none" }} />
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <div className="fs-mono" style={{ fontSize: 10.5, color: T.inkLow, display: "flex", alignItems: "center", gap: 7, letterSpacing: ".08em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: loading ? T.amber : T.green }} />
            {updatedAt ? `Updated ${timeAgo(updatedAt)}` : "Live"}
          </div>
        </div>
      </div>

      {/* --- coverage bar: states plainly how much of the feed is plottable --- */}
      <div className="fs-card" style={{ marginTop: 24, padding: "14px 18px", display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <MapPin size={15} color={T.gold} />
          <span style={{ fontSize: 13.5, color: T.ink, fontWeight: 600 }}>
            {mapped.length} on the map
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 120, height: 4, borderRadius: 4, background: T.ridge, overflow: "hidden" }}>
          <div style={{ width: `${coverage}%`, height: "100%", background: T.gold, transition: "width .5s" }} />
        </div>
        <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow, letterSpacing: ".08em" }}>
          {coverage}% of {alerts.length}
        </span>
        {unmapped.length > 0 && (
          <button onClick={() => setShowUnmapped((v) => !v)} className="fs-navlink"
            style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: T.inkMid }}>
            <AlertTriangle size={13} color={T.amber} />
            {unmapped.length} without a location
          </button>
        )}
      </div>

      {/* --- unmapped drawer --- */}
      {showUnmapped && (
        <div className="fs-card" style={{ marginTop: 12, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 className="fs-display" style={{ fontSize: 15.5, fontWeight: 600 }}>Not on the map</h3>
              <p style={{ fontSize: 13, color: T.inkMid, marginTop: 5, lineHeight: 1.55, maxWidth: 620 }}>
                No recognised place name appeared in these headlines, so they have no coordinates to plot.
                They are still live in the alerts feed.
              </p>
            </div>
            <button onClick={() => setShowUnmapped(false)} className="fs-icon-btn" aria-label="Close"><X size={17} /></button>
          </div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", maxHeight: 260, overflowY: "auto" }}>
            {unmapped.map((a) => (
              <div key={a.url || a.id} style={{ padding: "11px 0", borderTop: `1px solid ${T.ridge}`, display: "flex", gap: 12, alignItems: "baseline" }}>
                <span className="fs-mono" style={{ fontSize: 9.5, letterSpacing: ".1em", color: RISK_COLOR(a.risk), flexShrink: 0 }}>{a.risk}</span>
                <span style={{ fontSize: 13.5, color: T.inkMid, lineHeight: 1.5 }}>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- filters --- */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 20, alignItems: "center" }}>
        {["ALL", "HIGH", "MEDIUM"].map((k) => (
          <button key={k} onClick={() => setRiskFilter(k)} style={chip(riskFilter === k)}>
            {k === "ALL" ? <Layers size={13} /> : <span style={{ width: 7, height: 7, borderRadius: "50%", background: RISK_COLOR(k) }} />}
            {k === "ALL" ? "All risk" : k === "HIGH" ? "High only" : "Medium only"}
          </button>
        ))}
        <button onClick={resetView} style={{ ...chip(false), marginLeft: "auto" }}>
          <Crosshair size={13} /> Reset view
        </button>
      </div>

      {/* --- map + list --- */}
      <div className="fsm-layout" style={{ marginTop: 16 }}>
        {/* list rail */}
        <div className="fs-card" style={{ padding: 0, height: 560, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${T.ridge}`, display: "flex", alignItems: "center", gap: 9 }}>
            <List size={14} color={T.gold} />
            <span className="fs-mono" style={{ fontSize: 10.5, letterSpacing: ".13em", textTransform: "uppercase", color: T.inkLow }}>
              {visible.length} located
            </span>
          </div>
          <div style={{ flex: 1, overflowY: "auto" }}>
            {visible.map((a) => {
              const on = selected && (selected.url || selected.id) === (a.url || a.id);
              return (
                <button key={a.url || a.id} onClick={() => focus(a)}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "14px 16px",
                    background: on ? T.goldWash : "transparent", border: "none",
                    borderBottom: `1px solid ${T.ridge}`, cursor: "pointer", fontFamily: "inherit",
                    borderLeft: `2px solid ${on ? T.gold : "transparent"}`, transition: "background .18s",
                  }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: RISK_COLOR(a.risk), flexShrink: 0 }} />
                    <span className="fs-mono" style={{ fontSize: 10.5, color: T.inkLow, letterSpacing: ".08em" }}>{a.location.name}</span>
                    <span className="fs-mono" style={{ fontSize: 10, color: T.inkLow, marginLeft: "auto" }}>{timeAgo(a.publishedAt)}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: T.ink, marginTop: 7, lineHeight: 1.45, fontWeight: 500 }}>{a.title}</div>
                </button>
              );
            })}
            {visible.length === 0 && (
              <div style={{ padding: 30, textAlign: "center", color: T.inkMid, fontSize: 13.5 }}>
                {loading ? "Loading…" : "No located alerts match this filter."}
              </div>
            )}
          </div>
        </div>

        {/* map */}
        <div className="fsm-shell" style={{ height: 560 }}>
          {mapError ? (
            <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
              <MapPinned size={26} color={T.inkLow} style={{ marginBottom: 12 }} />
              <p style={{ fontSize: 14.5, color: T.ink, fontWeight: 500 }}>{mapError}</p>
              <p style={{ fontSize: 13, color: T.inkMid, marginTop: 6, maxWidth: 320, lineHeight: 1.55 }}>
                The alert list beside this map still works. Check your connection and refresh.
              </p>
            </div>
          ) : (
            <div ref={mapRef} className="fsm-canvas" style={{ height: "100%" }} />
          )}

          {!ready && !mapError && (
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: T.void, pointerEvents: "none" }}>
              <span className="fs-mono" style={{ fontSize: 11, color: T.inkLow, letterSpacing: ".14em", textTransform: "uppercase" }}>
                Loading map…
              </span>
            </div>
          )}

          {/* selection card floating over the map */}
          {selected && (
            <div className="fs-card" style={{
              position: "absolute", left: 16, bottom: 16, right: 16, maxWidth: 420,
              padding: 18, zIndex: 500, boxShadow: "0 24px 60px -20px rgba(0,0,0,.9)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span className="fs-mono" style={{
                    fontSize: 9.5, letterSpacing: ".12em", color: RISK_COLOR(selected.risk),
                    background: selected.risk === "HIGH" ? T.redWash : "rgba(232,163,61,.1)",
                    border: `1px solid ${selected.risk === "HIGH" ? T.redDim : "rgba(232,163,61,.3)"}`,
                    padding: "3px 8px", borderRadius: 4,
                  }}>{selected.risk}</span>
                  <span className="fs-mono" style={{ fontSize: 10.5, color: T.inkLow }}>{selected.tag}</span>
                </div>
                <button onClick={() => setSelected(null)} className="fs-icon-btn" aria-label="Close"><X size={16} /></button>
              </div>
              <h3 className="fs-display" style={{ fontSize: 15.5, fontWeight: 600, marginTop: 11, lineHeight: 1.42 }}>{selected.title}</h3>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginTop: 12, fontSize: 12, color: T.inkLow }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={12} /> {selected.location.name}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={12} /> {timeAgo(selected.publishedAt)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Newspaper size={12} /> {selected.source}</span>
              </div>
              {selected.url && (
                <a href={selected.url} target="_blank" rel="noreferrer" className="fs-btn" style={{ fontSize: 13, marginTop: 14, padding: "10px 16px" }}>
                  Read full report <ExternalLink size={13} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fs-card" style={{ marginTop: 16, padding: 18, display: "flex", alignItems: "center", gap: 11 }}>
          <AlertTriangle size={16} color={T.amber} />
          <span style={{ fontSize: 13.5, color: T.inkMid }}>{error} Retrying automatically every 90 seconds.</span>
        </div>
      )}
    </section>
  );
}
