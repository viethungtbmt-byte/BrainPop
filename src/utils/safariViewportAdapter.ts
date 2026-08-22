/**
 * Safari Landscape Viewport Compatibility Adapter
 * 
 * Provides a Safari-specific viewport detection and height correction layer.
 * Safari on iOS / iPadOS introduces dynamic browser UI (Tab bar, Address bar, Toolbar)
 * in Landscape mode, which causes window.innerHeight or 100dvh to report height
 * covered by browser bars.
 * 
 * This adapter uses window.visualViewport.height to measure the real visible pixel
 * height in Safari Landscape and exposes it to the layout engine and CSS custom properties.
 * 
 * Non-Safari browsers (Chrome Android, Firefox, Chrome Desktop) bypass this adapter completely.
 */

export interface SafariViewportResult {
  width: number;
  height: number;
  isSafariLandscape: boolean;
}

/**
 * Reliably detects iOS / iPadOS / macOS Safari.
 * Strictly excludes Chrome (including CriOS on iOS), Firefox (FxiOS), Edge, and Android Chrome.
 */
export function detectSafari(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;

  const ua = navigator.userAgent || "";
  const vendor = navigator.vendor || "";

  // Apple device check (iPhone, iPad, iPod, or iPad Pro/Mac with touch points)
  const isAppleDevice =
    /iPhone|iPad|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // Apple Computer vendor check
  const isAppleVendor = /Apple Computer/i.test(vendor);

  // Exclude third-party browsers
  const isChrome = /Chrome|CriOS|HeadlessChrome/i.test(ua);
  const isFirefox = /FxiOS|Firefox/i.test(ua);
  const isEdge = /EdgiOS|Edg/i.test(ua);
  const isAndroid = /Android/i.test(ua);

  return isAppleDevice && isAppleVendor && !isChrome && !isFirefox && !isEdge && !isAndroid;
}

/**
 * Computes the real usable viewport dimensions.
 * For Safari in Landscape, uses window.visualViewport.height to measure the exact visible canvas.
 * For Chrome / Android / Desktop, returns standard window dimensions without modification.
 */
export function getSafariCorrectedViewport(): SafariViewportResult {
  if (typeof window === "undefined") {
    return { width: 1200, height: 800, isSafariLandscape: false };
  }

  let rawW = window.innerWidth || document.documentElement?.clientWidth || 1200;
  let rawH = window.innerHeight || document.documentElement?.clientHeight || 800;

  if (window.visualViewport) {
    const vvHeight = Math.round(window.visualViewport.height);
    const vvWidth = Math.round(window.visualViewport.width);
    if (vvHeight > 0 && vvWidth > 0) {
      rawW = vvWidth;
      rawH = vvHeight;
    }
  }

  const isSafari = detectSafari();
  const isLandscape = rawW > rawH;

  if (typeof document !== "undefined" && document.documentElement) {
    if (isSafari && isLandscape) {
      document.documentElement.classList.add("is-safari-landscape");
      document.documentElement.style.setProperty("--safari-real-vh", `${rawH}px`);
    } else {
      document.documentElement.classList.remove("is-safari-landscape");
      document.documentElement.style.removeProperty("--safari-real-vh");
    }
  }

  return {
    width: rawW,
    height: rawH,
    isSafariLandscape: isSafari && isLandscape,
  };
}

/**
 * Creates a debounced viewport stabilizer to avoid repeated recalculations
 * while Safari is mid-rotation or animating toolbars.
 */
export function createViewportStabilizer(
  onStabilized: (dimensions: SafariViewportResult) => void
) {
  let rafId: number | null = null;
  let debounceTimer: number | null = null;
  let lastW = 0;
  let lastH = 0;

  const checkAndEmit = () => {
    const current = getSafariCorrectedViewport();
    if (current.width !== lastW || current.height !== lastH) {
      lastW = current.width;
      lastH = current.height;
      onStabilized(current);
    }
  };

  const handleResize = () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    if (debounceTimer !== null) clearTimeout(debounceTimer);

    // Immediate check on RAF frame
    rafId = requestAnimationFrame(() => {
      checkAndEmit();
    });

    // Stabilization pass after rotation/toolbar animation completes
    debounceTimer = window.setTimeout(() => {
      checkAndEmit();
    }, 120);
  };

  return {
    handleResize,
    cleanup: () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
    },
  };
}
