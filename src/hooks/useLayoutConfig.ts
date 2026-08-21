import { useState, useEffect } from "react";
import { DisplayConfig, getDisplayConfig } from "../utils/layouts";
import { getSafariCorrectedViewport, createViewportStabilizer } from "../utils/safariViewportAdapter";
import { safeLocalStorage, safeSessionStorage } from "../utils/safeStorage";

const getIsPortrait = (): boolean => {
  if (typeof window !== "undefined") {
    const dims = getSafariCorrectedViewport();
    if (dims.width > 0 && dims.height > 0) return dims.height >= dims.width;
  }
  return true;
};

const getViewportDimensions = () => {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const viewport = getSafariCorrectedViewport();
  let w = viewport.width;
  let h = viewport.height;

  if (w <= 0 || h <= 0) {
    w = 1200;
    h = 800;
  }

  return {
    width: w,
    height: h,
  };
};

export function useLayoutConfig() {
  // Always initialize from scratch. Do not restore or preserve previous values from previous sessions or cache.
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window !== "undefined") {
      // Clear any potentially cached viewport or layout state from previous play sessions
      try {
        safeLocalStorage.removeItem("emoji_brainpop_viewport");
        safeLocalStorage.removeItem("emoji_brainpop_zoom");
        safeLocalStorage.removeItem("emoji_brainpop_dimensions");
        safeLocalStorage.removeItem("emoji_brainpop_layout");
        safeSessionStorage.removeItem("emoji_brainpop_viewport");
        safeSessionStorage.removeItem("emoji_brainpop_zoom");
        safeSessionStorage.removeItem("emoji_brainpop_dimensions");
        safeSessionStorage.removeItem("emoji_brainpop_layout");
      } catch (e) {
        // Safe check for private browsing mode where storage might be disabled
      }

      // Enforce clean browser zoom reset on startup
      try {
        if (document.documentElement) {
          document.documentElement.style.zoom = "100%";
        }
        if (document.body) {
          document.body.style.zoom = "100%";
        }
      } catch (e) {
        // Ignore zoom style errors
      }

      return getViewportDimensions();
    }
    return { width: 1200, height: 800 };
  });

  const [isOrienting, setIsOrienting] = useState<boolean>(false);

  useEffect(() => {
    // Fresh viewport metadata initialization on mount (app launch)
    const initViewport = () => {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute(
          "content",
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
        );
      }
    };

    initViewport();

    let debounceTimer: number | null = null;
    let maxTimeoutTimer: number | null = null;
    let rafId: number | null = null;
    let lastIsPortrait = dimensions.height >= dimensions.width;
    let isCurrentlyOrienting = false;

    const startOrienting = () => {
      if (!isCurrentlyOrienting) {
        isCurrentlyOrienting = true;
        setIsOrienting(true);
      }

      if (maxTimeoutTimer === null) {
        // Hard safety limit: max 600ms spinner duration under any condition
        maxTimeoutTimer = window.setTimeout(() => {
          finishOrienting();
        }, 600);
      }
    };

    const finishOrienting = () => {
      if (debounceTimer !== null) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      if (maxTimeoutTimer !== null) {
        clearTimeout(maxTimeoutTimer);
        maxTimeoutTimer = null;
      }

      const next = getSafariCorrectedViewport();
      setDimensions({ width: next.width, height: next.height });
      lastIsPortrait = next.height >= next.width;

      // Allow 2 frames for React and browser layout paint before removing spinner
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = requestAnimationFrame(() => {
          isCurrentlyOrienting = false;
          setIsOrienting(false);
        });
      });
    };

    const handleResize = (isExplicitOrientationEvent = false) => {
      const current = getSafariCorrectedViewport();
      const currentIsPortrait = current.height >= current.width;
      const isAspectFlipped = currentIsPortrait !== lastIsPortrait;

      if (isExplicitOrientationEvent || isAspectFlipped || isCurrentlyOrienting) {
        startOrienting();

        if (debounceTimer !== null) {
          clearTimeout(debounceTimer);
        }

        // Wait 250ms of quiet time after last resize/orientation tick to ensure viewport has stabilized
        debounceTimer = window.setTimeout(() => {
          finishOrienting();
        }, 250);
      } else {
        // Normal minor desktop resize (no orientation change)
        setDimensions({ width: current.width, height: current.height });
        lastIsPortrait = currentIsPortrait;
      }
    };

    // Initial check
    const initialViewport = getSafariCorrectedViewport();
    setDimensions({ width: initialViewport.width, height: initialViewport.height });

    const onExplicitOrientationChange = () => handleResize(true);
    const onStandardResize = () => handleResize(false);

    window.addEventListener("resize", onStandardResize);
    window.addEventListener("orientationchange", onExplicitOrientationChange);

    const screenOrientation = window.screen?.orientation;
    if (screenOrientation && screenOrientation.addEventListener) {
      screenOrientation.addEventListener("change", onExplicitOrientationChange);
    }

    const visualViewport = window.visualViewport;
    if (visualViewport && visualViewport.addEventListener) {
      visualViewport.addEventListener("resize", onStandardResize);
    }

    let portraitMq: MediaQueryList | null = null;
    if (window.matchMedia) {
      portraitMq = window.matchMedia("(orientation: portrait)");
      if (portraitMq.addEventListener) {
        portraitMq.addEventListener("change", onExplicitOrientationChange);
      }
    }

    // Prevent multi-touch pinch zoom interactions on touch devices safely
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart, { passive: false });

    const originalTouchAction = document.body.style.touchAction;
    document.body.style.touchAction = "manipulation";

    return () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      if (maxTimeoutTimer !== null) clearTimeout(maxTimeoutTimer);
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onStandardResize);
      window.removeEventListener("orientationchange", onExplicitOrientationChange);
      if (screenOrientation && screenOrientation.removeEventListener) {
        screenOrientation.removeEventListener("change", onExplicitOrientationChange);
      }
      if (visualViewport && visualViewport.removeEventListener) {
        visualViewport.removeEventListener("resize", onStandardResize);
      }
      if (portraitMq && portraitMq.removeEventListener) {
        portraitMq.removeEventListener("change", onExplicitOrientationChange);
      }
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("gesturestart", handleGestureStart);
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // Compute Layout, Device Type, and Orientation strictly from current dimensions
  const isPortrait = dimensions.height >= dimensions.width;
  const config = getDisplayConfig(dimensions.width, dimensions.height, isPortrait);
  const isMobileOrTablet = dimensions.width < 1024 || isPortrait;
  const isMobile = dimensions.width < 640;
  const isTablet = isPortrait ? (dimensions.width >= 640) : (dimensions.width >= 640 && dimensions.width < 1024);
  const isDesktop = !isPortrait && dimensions.width >= 1024;
  const isMobilePortrait = isPortrait && isMobile;
  const isTabletPortrait = isPortrait && isTablet;
  const isMobileLandscape = !isPortrait && (dimensions.width < 1024 || dimensions.height < 600);
  const isTabletLandscape = !isPortrait && dimensions.width >= 640 && (dimensions.width <= 1366 || dimensions.height <= 900);

  return {
    config,
    dimensions,
    isOrienting,
    isPortrait,
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    isMobilePortrait,
    isTabletPortrait,
    isMobileLandscape,
    isTabletLandscape,
  };
}
