import React, { useEffect, useRef } from "react";
import { T } from "./theme";

// ---------------------------------------------------------------------------
// ThreatGlobe — a genuine 3D globe rendered to canvas with an orthographic
// projection. No Three.js, no WebGL, no dependencies: it runs anywhere React
// runs and costs nothing to install.
//
// Points are defined in real lat/lng, rotated about the Y axis each frame,
// then projected. Anything with a negative Z is on the far side of the sphere
// and is either hidden or dimmed, which is what sells the illusion of depth.
// ---------------------------------------------------------------------------

// Coarse landmass outlines as lat/lng rings. Deliberately low-poly — this is a
// signal-intelligence display, not an atlas.
const LANDMASS = [
  // North America
  [[70,-165],[72,-120],[68,-95],[62,-75],[50,-58],[45,-62],[42,-70],[35,-76],[30,-81],[25,-80],[26,-97],[29,-95],[26,-110],[32,-117],[40,-124],[48,-125],[55,-131],[60,-145],[70,-165]],
  // South America
  [[12,-72],[10,-61],[5,-52],[-2,-45],[-10,-37],[-23,-42],[-33,-53],[-42,-63],[-52,-69],[-46,-74],[-33,-72],[-18,-70],[-5,-81],[2,-79],[8,-77],[12,-72]],
  // Europe
  [[71,26],[66,32],[60,30],[55,21],[54,10],[58,5],[62,6],[68,15],[71,26]],
  [[52,-9],[50,2],[43,-2],[36,-6],[38,-9],[43,-9],[48,-4],[52,-9]],
  // Africa
  [[37,10],[32,25],[30,33],[16,39],[11,51],[-1,42],[-12,40],[-26,33],[-34,26],[-34,19],[-23,14],[-12,13],[-2,9],[5,4],[10,-8],[15,-17],[27,-13],[33,-8],[37,10]],
  // Asia
  [[73,70],[75,105],[72,140],[66,170],[60,163],[54,142],[45,135],[39,127],[30,122],[22,115],[10,105],[8,98],[16,95],[22,90],[20,73],[24,68],[30,60],[26,52],[36,50],[40,53],[45,60],[55,65],[65,68],[73,70]],
  // India
  [[30,72],[22,70],[15,74],[8,77],[13,80],[20,86],[26,90],[30,80],[30,72]],
  // Australia
  [[-11,131],[-13,143],[-20,149],[-28,153],[-37,150],[-38,141],[-35,135],[-32,116],[-22,114],[-14,127],[-11,131]],
];

// Live watch nodes. `sev` drives colour; real coordinates so they sit correctly.
const NODES = [
  { lat: 14.6,  lng: 120.9, sev: "high", label: "Manila" },
  { lat: 6.5,   lng: 3.4,   sev: "med",  label: "Lagos" },
  { lat: 45.8,  lng: 4.8,   sev: "low",  label: "Lyon" },
  { lat: -23.5, lng: -46.6, sev: "high", label: "Sao Paulo" },
  { lat: -6.2,  lng: 106.8, sev: "med",  label: "Jakarta" },
  { lat: 30.3,  lng: -97.7, sev: "low",  label: "Austin" },
  { lat: -1.3,  lng: 36.8,  sev: "high", label: "Nairobi" },
  { lat: 15.9,  lng: 74.5,  sev: "med",  label: "Belagavi" },
  { lat: 51.5,  lng: -0.1,  sev: "low",  label: "London" },
  { lat: 35.7,  lng: 139.7, sev: "med",  label: "Tokyo" },
];

// Arcs connecting the watch desk to active nodes.
const HOME = { lat: 15.9, lng: 74.5 };
const ARCS = [
  { to: { lat: 14.6, lng: 120.9 } },
  { to: { lat: -23.5, lng: -46.6 } },
  { to: { lat: -1.3, lng: 36.8 } },
  { to: { lat: 51.5, lng: -0.1 } },
];

const SEV_COLOR = { high: T.red, med: T.amber, low: T.inkLow };

// Resting pitch. Enough axial tilt that the sphere never reads as a flat
// spinning disc, but not so much that the poles dominate.
const DEFAULT_TILT = -0.38;

// Pitch is clamped well short of +/- PI/2. An orthographic projection has no
// concept of "upside down", so without this you can drag the globe past
// vertical and it turns inside out.
const TILT_LIMIT = 1.2;

// lat/lng (degrees) -> unit sphere xyz, then rotate about Y by `spin` radians.
function project(lat, lng, spin, tilt = DEFAULT_TILT) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180) + spin;
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  const yT = y * Math.cos(tilt) - z * Math.sin(tilt);
  const zT = y * Math.sin(tilt) + z * Math.cos(tilt);
  return { x, y: yT, z: zT };
}

// Great-circle interpolation between two lat/lng points, lifted off the
// surface so the arc visibly bows away from the sphere.
function arcPoints(a, b, spin, tilt, steps = 48) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = a.lat + (b.lat - a.lat) * t;
    // shortest-path longitude interpolation
    let dLng = b.lng - a.lng;
    if (dLng > 180) dLng -= 360;
    if (dLng < -180) dLng += 360;
    const lng = a.lng + dLng * t;
    const p = project(lat, lng, spin, tilt);
    const lift = 1 + Math.sin(t * Math.PI) * 0.22;
    pts.push({ x: p.x * lift, y: p.y * lift, z: p.z * lift });
  }
  return pts;
}

export default function ThreatGlobe({ size = 560, interactive = true }) {
  const canvasRef = useRef(null);
  const dragRef = useRef({
    active: false, lastX: 0, lastY: 0,
    velocity: -0.0016, spin: 0, tilt: DEFAULT_TILT,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf;
    let W = 0, H = 0, R = 0, cx = 0, cy = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W, H) * 0.40;
      cx = W / 2;
      cy = H / 2;
    }

    const toScreen = (p) => ({ x: cx + p.x * R, y: cy - p.y * R, z: p.z });

    function draw(time) {
      const st = dragRef.current;
      if (!st.active && !reduced) st.spin += st.velocity;

      ctx.clearRect(0, 0, W, H);

      // --- atmosphere: soft radial bloom behind the sphere -----------------
      const halo = ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.55);
      halo.addColorStop(0, "rgba(212,169,71,0.11)");
      halo.addColorStop(0.55, "rgba(212,169,71,0.035)");
      halo.addColorStop(1, "rgba(212,169,71,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.55, 0, Math.PI * 2);
      ctx.fill();

      // --- sphere body: subtle top-left lit gradient -----------------------
      const body = ctx.createRadialGradient(
        cx - R * 0.35, cy - R * 0.4, R * 0.1,
        cx, cy, R
      );
      body.addColorStop(0, "#1B2231");
      body.addColorStop(0.6, "#111621");
      body.addColorStop(1, "#080B11");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // --- graticule: lat/lng wireframe ------------------------------------
      ctx.lineWidth = 0.6;
      // parallels
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = project(lat, lng, st.spin, st.tilt);
          if (p.z < 0) { started = false; continue; }
          const s = toScreen(p);
          if (!started) { ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        }
        ctx.strokeStyle = "rgba(154,164,182,0.13)";
        ctx.stroke();
      }
      // meridians
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -90; lat <= 90; lat += 4) {
          const p = project(lat, lng, st.spin, st.tilt);
          if (p.z < 0) { started = false; continue; }
          const s = toScreen(p);
          if (!started) { ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        }
        ctx.strokeStyle = "rgba(154,164,182,0.10)";
        ctx.stroke();
      }

      // --- landmasses ------------------------------------------------------
      // A ring that crosses the horizon can't be filled: closePath() would
      // join the two visible ends straight through the sphere and paint a
      // solid blob. So fill only fully-front-facing rings, and draw the
      // partially-visible ones as open strokes that fade at the limb.
      for (const ring of LANDMASS) {
        const projected = ring.map(([lat, lng]) => project(lat, lng, st.spin, st.tilt));
        const fullyVisible = projected.every((p) => p.z >= 0.02);

        if (fullyVisible) {
          ctx.beginPath();
          projected.forEach((p, i) => {
            const s = toScreen(p);
            if (i === 0) ctx.moveTo(s.x, s.y); else ctx.lineTo(s.x, s.y);
          });
          ctx.closePath();
          ctx.fillStyle = "rgba(212,169,71,0.15)";
          ctx.fill();
          ctx.strokeStyle = "rgba(212,169,71,0.5)";
          ctx.lineWidth = 1;
          ctx.stroke();
          continue;
        }

        // partially visible: stroke each front-facing run separately,
        // dimming as segments approach the limb so they don't end abruptly
        let started = false;
        ctx.lineWidth = 1;
        for (let i = 0; i < projected.length; i++) {
          const p = projected[i];
          if (p.z < 0.02) {
            if (started) { ctx.stroke(); started = false; }
            continue;
          }
          const s = toScreen(p);
          if (!started) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(212,169,71,${0.22 + Math.min(p.z, 0.5) * 0.56})`;
            ctx.moveTo(s.x, s.y);
            started = true;
          } else {
            ctx.lineTo(s.x, s.y);
          }
        }
        if (started) ctx.stroke();
      }

      // --- terminator: darken the limb for a lit-sphere read ---------------
      const limb = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
      limb.addColorStop(0, "rgba(0,0,0,0)");
      limb.addColorStop(1, "rgba(0,0,0,0.55)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      // --- arcs: travelling pulse along each great circle -------------------
      const t = time * 0.001;
      ARCS.forEach((arc, i) => {
        const pts = arcPoints(HOME, arc.to, st.spin, st.tilt);
        // the static arc line
        ctx.beginPath();
        let started = false;
        for (const p of pts) {
          if (p.z < 0) { started = false; continue; }
          const s = toScreen(p);
          if (!started) { ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        }
        ctx.strokeStyle = "rgba(212,169,71,0.30)";
        ctx.lineWidth = 1;
        ctx.stroke();

        // the pulse riding along it
        const head = ((t * 0.42 + i * 0.25) % 1);
        const idx = Math.floor(head * (pts.length - 1));
        for (let k = 0; k < 9; k++) {
          const j = idx - k;
          if (j < 0) break;
          const p = pts[j];
          if (p.z < 0) continue;
          const s = toScreen(p);
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.7 - k * 0.15, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(232,214,160,${0.85 - k * 0.09})`;
          ctx.fill();
        }
      });

      // --- nodes ------------------------------------------------------------
      for (const n of NODES) {
        const p = project(n.lat, n.lng, st.spin, st.tilt);
        const s = toScreen(p);
        const front = p.z >= 0;
        const col = SEV_COLOR[n.sev];
        if (!front) {
          // faint ghost on the far side — depth cue, not clutter
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(95,107,128,0.22)";
          ctx.fill();
          continue;
        }
        // expanding ping
        const phase = (t * 0.6 + n.lng / 360) % 1;
        const pingR = 3 + phase * 13;
        ctx.beginPath();
        ctx.arc(s.x, s.y, pingR, 0, Math.PI * 2);
        ctx.strokeStyle = hexA(col, (1 - phase) * 0.5);
        ctx.lineWidth = 1;
        ctx.stroke();
        // core
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = hexA(col, 0.18);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    function hexA(hex, a) {
      const h = hex.replace("#", "");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    // --- drag to spin -------------------------------------------------------
    function onDown(e) {
      if (!interactive) return;
      const st = dragRef.current;
      st.active = true;
      st.lastX = (e.touches ? e.touches[0].clientX : e.clientX);
      st.lastY = (e.touches ? e.touches[0].clientY : e.clientY);
      canvas.style.cursor = "grabbing";
    }

    function onMove(e) {
      const st = dragRef.current;
      if (!st.active) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const y = (e.touches ? e.touches[0].clientY : e.clientY);
      const dx = x - st.lastX;
      const dy = y - st.lastY;
      st.lastX = x;
      st.lastY = y;

      // Both deltas are negated so the surface tracks the cursor: drag right
      // and the globe turns right, drag down and the north pole tips toward
      // you. Without the negation the sphere moves against your hand.
      st.spin -= dx * 0.005;
      st.tilt = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, st.tilt + dy * 0.005));

      // Only horizontal motion carries momentum. Pitch stays where you put it,
      // so releasing mid-drag doesn't drift the globe off the angle you chose.
      if (dx) st.velocity = -dx * 0.0004;
    }

    function onUp() {
      const st = dragRef.current;
      if (!st.active) return;
      st.active = false;
      canvas.style.cursor = interactive ? "grab" : "default";
      // clamp so a hard flick doesn't leave it spinning wildly
      st.velocity = Math.max(-0.006, Math.min(0.006, st.velocity)) || -0.0016;
    }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("touchstart", onDown);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [interactive]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        cursor: interactive ? "grab" : "default",
        touchAction: interactive ? "none" : "auto",
      }}
      aria-label="Rotating globe showing active threat monitoring locations"
      role="img"
    />
  );
}