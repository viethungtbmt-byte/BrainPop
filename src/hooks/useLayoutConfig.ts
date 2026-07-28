import { useState, useEffect } from "react";
import { DisplayConfig, getDisplayConfig } from "../utils/layouts";

export function useLayoutConfig() {
  // Always initialize from scratch. Do not restore or preserve previous values from previous sessions or cache.
  const [dimensions, setDimensions] = useState(() => {
    if (typeof window !== "undefined") {
      // Clear any potentially cached viewport or layout state from previous play sessions
      try {
        localStorage.removeItem("emoji_brainpop_viewport");
        localStorage.removeItem("emoji_brainpop_zoom");
        localStorage.removeItem("emoji_brainpop_dimensions");
        localStorage.removeItem("emoji_brainpop_layout");
        sessionStorage.removeItem("emoji_brainpop_viewport");
        sessionStorage.removeItem("emoji_brainpop_zoom");
        sessionStorage.removeItem("emoji_brainpop_dimensions");
        sessionStorage.removeItem("emoji_brainpop_layout");
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

      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1200, height: 800 };
  });

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

    let resizeTimeoutId1: any = null;
    let resizeTimeoutId2: any = null;
    let resizeTimeoutId3: any = null;

    const handleResize = () => {
      if (resizeTimeoutId1) clearTimeout(resizeTimeoutId1);
      if (resizeTimeoutId2) clearTimeout(resizeTimeoutId2);
      if (resizeTimeoutId3) clearTimeout(resizeTimeoutId3);

      // Recalculate dimensions strictly based on active current window bounds
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Schedule subsequent passes for older/slower devices where innerWidth/innerHeight delay updates
      resizeTimeoutId1 = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 50);

      resizeTimeoutId2 = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);

      resizeTimeoutId3 = setTimeout(() => {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 300);
    };

    // Recalculate immediately on mount to ensure completely fresh display initialization
    handleResize();

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    // Prevent zoom interactions on touch devices (purely for responsiveness/control)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    let lastTouchEnd = 0;
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    const handleGestureStart = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: false });
    document.addEventListener("touchend", handleTouchEnd, { passive: false });
    document.addEventListener("gesturestart", handleGestureStart, { passive: false });

    const originalTouchAction = document.body.style.touchAction;
    document.body.style.touchAction = "manipulation";

    return () => {
      if (resizeTimeoutId1) clearTimeout(resizeTimeoutId1);
      if (resizeTimeoutId2) clearTimeout(resizeTimeoutId2);
      if (resizeTimeoutId3) clearTimeout(resizeTimeoutId3);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("gesturestart", handleGestureStart);
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  // Compute Layout, Device Type, and Orientation strictly from current dimensions
  const checkIsPortrait = (w: number, h: number): boolean => {
    if (typeof window !== "undefined") {
      if (window.matchMedia) {
        return window.matchMedia("(orientation: portrait)").matches;
      }
      if (window.screen && window.screen.orientation && window.screen.orientation.type) {
        return window.screen.orientation.type.startsWith("portrait");
      }
      if (typeof window.orientation !== "undefined") {
        return window.orientation === 0 || window.orientation === 180 || window.orientation === -180;
      }
    }
    return w < h;
  };

  const isPortrait = checkIsPortrait(dimensions.width, dimensions.height);
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
