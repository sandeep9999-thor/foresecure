import React, { useEffect, useRef, useState } from "react";
import { COASTLINES, LAND_DOTS } from "./geo";

// ---------------------------------------------------------------------------
// ThreatGlobe — a glowing HUD-style globe drawn to canvas.
//
// No Three.js, no WebGL, no textures. Points are defined in real lat/lng,
// rotated about a tilted axis, and projected orthographically; anything with
// a negative Z sits on the far side of the sphere and is hidden or dimmed,
// which is what produces the sense of depth.
//
// Coastlines and the interior dot matrix come from Natural Earth 110m data
// (see geo.js) rather than hand-typed polygons — that is what makes the
// landmasses read as real continents instead of blobs.
// ---------------------------------------------------------------------------

// HUD palette. Deliberately independent of the site's gold/red tokens: this
// element is a display, and displays in this idiom are cyan.
const C = {
  coast: [120, 220, 255],
  dot:   [ 70, 170, 240],
  grid:  [ 60, 130, 200],
  arc:   [110, 200, 255],
  high:  [255,  70,  90],
  med:   [255, 175,  60],
  low:   [ 90, 200, 255],
};

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// Watch nodes at true coordinates. `sev` drives colour and size.
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
  { lat: 40.7,  lng: -74.0, sev: "low",  label: "New York" },
  { lat: 25.2,  lng: 55.3,  sev: "med",  label: "Dubai" },
  { lat: 1.35,  lng: 103.8, sev: "low",  label: "Singapore" },
];

const HOME = { lat: 15.9, lng: 74.5 };
const ARCS = [
  { to: { lat: 14.6,  lng: 120.9 } },
  { to: { lat: -23.5, lng: -46.6 } },
  { to: { lat: -1.3,  lng: 36.8  } },
  { to: { lat: 51.5,  lng: -0.1  } },
  { to: { lat: 40.7,  lng: -74.0 } },
  { to: { lat: 35.7,  lng: 139.7 } },
];

const SEV = { high: C.high, med: C.med, low: C.low };

const DEFAULT_TILT = -0.38;
// Pitch is clamped short of the poles. An orthographic projection has no
// notion of "upside down", so without this the globe can be dragged inside out.
const TILT_LIMIT = 1.15;

function project(lat, lng, spin, tilt = DEFAULT_TILT) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180) + spin;
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);
  return {
    x,
    y: y * Math.cos(tilt) - z * Math.sin(tilt),
    z: y * Math.sin(tilt) + z * Math.cos(tilt),
  };
}

// Great-circle interpolation, lifted off the surface so the arc bows outward.
function arcPoints(a, b, spin, tilt, steps = 54) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = a.lat + (b.lat - a.lat) * t;
    let d = b.lng - a.lng;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    const p = project(lat, a.lng + d * t, spin, tilt);
    const lift = 1 + Math.sin(t * Math.PI) * 0.26;
    pts.push({ x: p.x * lift, y: p.y * lift, z: p.z * lift });
  }
  return pts;
}

export default function ThreatGlobe({ interactive = true }) {
  const canvasRef = useRef(null);
  const state = useRef({
    active: false, lastX: 0, lastY: 0,
    velocity: -0.0016, spin: 0, tilt: DEFAULT_TILT,
    hover: 0,        // eased 0 -> 1 while the pointer is over the globe
    hoverTarget: 0,
  });
  const [grabbing, setGrabbing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf, W = 0, H = 0, R0 = 0, cx = 0, cy = 0;
    // Reused scratch buffer for projected coastline points (x, y, z per point),
    // so the hot loop allocates nothing per frame.
    let proj = new Float32Array(3 * 512);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // headroom so the hover swell and glow never clip at the edge
      R0 = Math.min(W, H) * 0.375;
      cx = W / 2; cy = H / 2;
    }

    function draw(time) {
      const st = state.current;
      if (!st.active && !reduced) st.spin += st.velocity;

      // Ease the hover factor rather than snapping. This is the whole feel of
      // the interaction: a ~6% swell plus a lift in glow, settling over ~250ms.
      st.hover += (st.hoverTarget - st.hover) * 0.12;
      const h = st.hover;
      const R = R0 * (1 + h * 0.06);
      const glow = 1 + h * 0.85;

      const toScreen = (p) => ({ x: cx + p.x * R, y: cy - p.y * R, z: p.z });
      const t = time * 0.001;

      ctx.clearRect(0, 0, W, H);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // --- atmosphere ------------------------------------------------------
      const halo = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.5);
      halo.addColorStop(0, `rgba(40,150,255,${0.22 * glow})`);
      halo.addColorStop(0.45, `rgba(30,120,220,${0.08 * glow})`);
      halo.addColorStop(1, "rgba(20,90,180,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // --- sphere body -----------------------------------------------------
      const body = ctx.createRadialGradient(
        cx - R * 0.3, cy - R * 0.35, R * 0.05, cx, cy, R
      );
      body.addColorStop(0, "#0A1A2E");
      body.addColorStop(0.55, "#061223");
      body.addColorStop(1, "#03080F");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();

      // Everything below is clipped to the sphere so glow never bleeds past it.
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      // --- graticule -------------------------------------------------------
      ctx.lineWidth = 0.55;
      ctx.strokeStyle = rgba(C.grid, 0.16 + h * 0.06);
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lng = -180; lng <= 180; lng += 4) {
          const p = project(lat, lng, st.spin, st.tilt);
          if (p.z < 0) { started = false; continue; }
          const s = toScreen(p);
          if (started) ctx.lineTo(s.x, s.y);
          else { ctx.moveTo(s.x, s.y); started = true; }
        }
        ctx.stroke();
      }
      for (let lng = -180; lng < 180; lng += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -88; lat <= 88; lat += 4) {
          const p = project(lat, lng, st.spin, st.tilt);
          if (p.z < 0) { started = false; continue; }
          const s = toScreen(p);
          if (started) ctx.lineTo(s.x, s.y);
          else { ctx.moveTo(s.x, s.y); started = true; }
        }
        ctx.stroke();
      }

      // --- interior dot matrix ---------------------------------------------
      // Additive blending lets overlapping dots build into brighter regions,
      // which is what gives the landmasses their internal texture.
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < LAND_DOTS.length; i++) {
        const p = project(LAND_DOTS[i][0], LAND_DOTS[i][1], st.spin, st.tilt);
        if (p.z < 0.02) continue;
        const s = toScreen(p);
        // fade toward the limb so the sphere edge stays soft
        ctx.fillStyle = rgba(C.dot, (0.16 + p.z * 0.42) * glow);
        ctx.fillRect(s.x - 0.9, s.y - 0.9, 1.8, 1.8);
      }

      // --- coastlines ------------------------------------------------------
      // Two passes: a wide low-alpha pass for bloom, then a crisp thin pass.
      // The projection is computed once per point per frame and reused across
      // both passes — projecting twice would double the per-frame math for a
      // result that is identical.
      for (const ring of COASTLINES) {
        const n = ring.length;
        if (proj.length < n * 3) proj = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const p = project(ring[i][0], ring[i][1], st.spin, st.tilt);
          proj[i * 3]     = cx + p.x * R;
          proj[i * 3 + 1] = cy - p.y * R;
          proj[i * 3 + 2] = p.z;
        }
        for (let pass = 0; pass < 2; pass++) {
          ctx.lineWidth = pass === 0 ? 2.6 : 0.85;
          const baseA = pass === 0 ? 0.10 * glow : 0.62 * glow;
          let started = false;
          for (let i = 0; i < n; i++) {
            const z = proj[i * 3 + 2];
            if (z < 0.015) {
              if (started) { ctx.stroke(); started = false; }
              continue;
            }
            if (!started) {
              ctx.beginPath();
              ctx.strokeStyle = rgba(C.coast, Math.min(1, baseA * (0.45 + z)));
              ctx.moveTo(proj[i * 3], proj[i * 3 + 1]);
              started = true;
            } else {
              ctx.lineTo(proj[i * 3], proj[i * 3 + 1]);
            }
          }
          if (started) ctx.stroke();
        }
      }

      // --- arcs ------------------------------------------------------------
      ARCS.forEach((arc, i) => {
        const pts = arcPoints(HOME, arc.to, st.spin, st.tilt);
        ctx.lineWidth = 0.9;
        ctx.strokeStyle = rgba(C.arc, 0.30 * glow);
        let started = false;
        for (const p of pts) {
          if (p.z < 0) { if (started) { ctx.stroke(); started = false; } continue; }
          const s = toScreen(p);
          if (!started) { ctx.beginPath(); ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        }
        if (started) ctx.stroke();

        // travelling pulse
        const head = (t * 0.4 + i * 0.17) % 1;
        const idx = Math.floor(head * (pts.length - 1));
        for (let k = 0; k < 11; k++) {
          const j = idx - k;
          if (j < 0) break;
          const p = pts[j];
          if (p.z < 0) continue;
          const s = toScreen(p);
          ctx.beginPath();
          ctx.arc(s.x, s.y, (2 - k * 0.14) * (1 + h * 0.2), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(190,240,255,${(0.9 - k * 0.08) * glow})`;
          ctx.fill();
        }
      });

      // --- nodes -------------------------------------------------------------
      for (const n of NODES) {
        const p = project(n.lat, n.lng, st.spin, st.tilt);
        const s = toScreen(p);
        const col = SEV[n.sev];
        if (p.z < 0) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, 1.1, 0, Math.PI * 2);
          ctx.fillStyle = rgba(col, 0.10);
          ctx.fill();
          continue;
        }
        const big = n.sev === "high";
        const phase = (t * 0.55 + n.lng / 360 + n.lat / 720) % 1;

        // expanding ring
        ctx.beginPath();
        ctx.arc(s.x, s.y, (3 + phase * (big ? 20 : 13)) * (1 + h * 0.1), 0, Math.PI * 2);
        ctx.strokeStyle = rgba(col, (1 - phase) * (big ? 0.5 : 0.32) * glow);
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // soft halo
        const hr = (big ? 11 : 7) * (1 + h * 0.15);
        const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, hr);
        hg.addColorStop(0, rgba(col, 0.55 * glow));
        hg.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, hr, 0, Math.PI * 2);
        ctx.fill();

        // white-hot core, as in the reference
        ctx.beginPath();
        ctx.arc(s.x, s.y, big ? 2.4 : 1.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.9 * Math.min(1, glow)})`;
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // --- limb shading + rim light -----------------------------------------
      const limb = ctx.createRadialGradient(cx, cy, R * 0.62, cx, cy, R);
      limb.addColorStop(0, "rgba(0,0,0,0)");
      limb.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = limb;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(90,190,255,${0.30 + h * 0.35})`;
      ctx.lineWidth = 1 + h * 0.6;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    }

    // --- interaction --------------------------------------------------------
    const pt = (e) => (e.touches ? e.touches[0] : e);

    function onDown(e) {
      if (!interactive) return;
      const st = state.current;
      st.active = true;
      st.lastX = pt(e).clientX;
      st.lastY = pt(e).clientY;
      setGrabbing(true);
    }
    function onMove(e) {
      const st = state.current;
      if (!st.active) return;
      const x = pt(e).clientX, y = pt(e).clientY;
      const dx = x - st.lastX, dy = y - st.lastY;
      st.lastX = x; st.lastY = y;
      // Horizontal is negated so the surface tracks the cursor. Vertical is
      // not, because the screen Y axis already points down while the globe's
      // Y axis points up — the two cancel out.
      st.spin -= dx * 0.005;
      st.tilt = Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, st.tilt + dy * 0.005));
      // Only horizontal carries momentum; pitch stays where you put it.
      if (dx) st.velocity = -dx * 0.0004;
    }
    function onUp() {
      const st = state.current;
      if (!st.active) return;
      st.active = false;
      setGrabbing(false);
      st.velocity = Math.max(-0.006, Math.min(0.006, st.velocity)) || -0.0016;
    }
    function onEnter() { if (interactive) state.current.hoverTarget = 1; }
    function onLeave() { state.current.hoverTarget = 0; }

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
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
        cursor: interactive ? (grabbing ? "grabbing" : "grab") : "default",
        touchAction: interactive ? "none" : "auto",
      }}
      aria-label="Rotating globe showing active threat monitoring locations"
      role="img"
    />
  );
}
