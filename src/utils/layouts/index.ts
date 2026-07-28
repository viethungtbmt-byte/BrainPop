import { DisplayConfig } from "./types";
import { desktopConfig } from "./desktop";
import { tabletConfig } from "./tablet";
import { mobilePortraitConfig } from "./mobilePortrait";
import { mobileLandscapeConfig } from "./mobileLandscape";

export * from "./types";
export { desktopConfig } from "./desktop";
export { tabletConfig } from "./tablet";
export { mobilePortraitConfig } from "./mobilePortrait";
export { mobileLandscapeConfig } from "./mobileLandscape";

export function getDisplayConfig(width: number, height: number, isPortraitOverride?: boolean): DisplayConfig {
  const isPortrait = isPortraitOverride !== undefined ? isPortraitOverride : (width < height);
  const isMobileOrTablet = width < 1024 || isPortrait;
  const isMobileLandscape = !isPortrait && (width < 1024 || height < 600);
  
  if (isMobileLandscape) {
    return mobileLandscapeConfig;
  }
  
  if (isPortrait) {
    if (width >= 640) {
      return tabletConfig;
    } else {
      return mobilePortraitConfig;
    }
  } else {
    // Landscape
    if (width >= 1024) {
      return desktopConfig;
    } else if (width >= 640) {
      return tabletConfig;
    } else {
      return mobilePortraitConfig;
    }
  }
}
