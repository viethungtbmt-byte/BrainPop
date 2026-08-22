import { useState, useEffect } from "react";
import { DisplayConfig, getDisplayConfig } from "../utils/layouts";
import { getSafariCorrectedViewport } from "../utils/safariViewportAdapter";
import { safeLocalStorage, safeSessionStorage } from "../utils/safeStorage";

const getViewportDimensions = () => {
  if (typeof window === "undefined") return { width: 1200, height: 800 };
  const viewport = getSafariCorrectedViewport();
  let w = viewport.width;
  let h = viewport.height;

  if (w <= 0 || h <= 0) {
    w = typeof window !== "undefined" ? window.innerWidth || 1200 : 1200;
    h = typeof window !== "undefined" ? window.innerHeight || 800 : 800;
  }

  return {
    width: w,
    height: h,
  };
};

export function useLayoutConfig() {
  // Always initialize from scratch with clean layout metrics
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window !== "undefined") {
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
        // Safe check
      }
      return getViewportDimensions();
    }
    return { width: 1200, height: 800 };
  });

  const [isOrienting, setIsOrienting] = useState<boolean>(false);

  useEffect(() => {
    // Ensure viewport meta tag is properly set on mobile/tablet
    const initViewport = () => {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement("meta");
        viewportMeta.setAttribute("name", "viewport");
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover"
      );
    };

    initViewport();

    let rafId: number | null = null;
    let orientationTimeout: number | null = null;

    const updateDimensions = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const next = getSafariCorrectedViewport();
        setDimensions((prev) => {
          if (prev.width === next.width && prev.height === next.height) {
            return prev;
          }
          return { width: next.width, height: next.height };
        });
      });
    };

    const handleOrientationChange = () => {
      setIsOrienting(true);
      updateDimensions();

      if (orientationTimeout !== null) clearTimeout(orientationTimeout);
      orientationTimeout = window.setTimeout(() => {
        updateDimensions();
        setIsOrienting(false);
      }, 150);
    };

    const handleStandardResize = () => {
      updateDimensions();
    };

    // Initial sync
    updateDimensions();

    window.addEventListener("resize", handleStandardResize, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, { passive: true });

    const screenOrientation = window.screen?.orientation;
    if (screenOrientation && typeof screenOrientation.addEventListener === "function") {
      screenOrientation.addEventListener("change", handleOrientationChange);
    }

    const visualViewport = window.visualViewport;
    if (visualViewport && typeof visualViewport.addEventListener === "function") {
      visualViewport.addEventListener("resize", handleStandardResize, { passive: true });
    }

    let portraitMq: MediaQueryList | null = null;
    if (typeof window.matchMedia === "function") {
      portraitMq = window.matchMedia("(orientation: portrait)");
      if (portraitMq && typeof portraitMq.addEventListener === "function") {
        portraitMq.addEventListener("change", handleOrientationChange);
      }
    }

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (orientationTimeout !== null) clearTimeout(orientationTimeout);
      window.removeEventListener("resize", handleStandardResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (screenOrientation && typeof screenOrientation.removeEventListener === "function") {
        screenOrientation.removeEventListener("change", handleOrientationChange);
      }
      if (visualViewport && typeof visualViewport.removeEventListener === "function") {
        visualViewport.removeEventListener("resize", handleStandardResize);
      }
      if (portraitMq && typeof portraitMq.removeEventListener === "function") {
        portraitMq.removeEventListener("change", handleOrientationChange);
      }
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
