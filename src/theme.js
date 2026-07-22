// ForeSecure — design tokens
// Deep operations-room palette. Red is reserved exclusively for live
// threat states so it retains meaning; gold carries brand + wayfinding.

export const T = {
  // surfaces
  void:    "#07090D",   // page base
  hull:    "#0B0E14",   // primary surface
  panel:   "#11151E",   // raised card
  ridge:   "#1A202C",   // borders / hairlines
  ridgeHi: "#252D3D",   // hover borders

  // ink
  ink:     "#F2F4F8",   // primary text
  inkMid:  "#9AA4B6",   // secondary text
  inkLow:  "#5F6B80",   // tertiary / captions

  // brand
  gold:    "#D4A947",
  goldDim: "#8A6E2A",
  goldWash:"rgba(212,169,71,0.10)",

  // signal (threat states only)
  red:     "#E03B4C",
  redDim:  "#7A1F29",
  redWash: "rgba(224,59,76,0.10)",
  amber:   "#E8A33D",
  green:   "#3FBE7C",
};

export const FONTS =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap";
