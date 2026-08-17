import { DisplayConfig } from "./types";
import { desktopConfig } from "./desktop";
import { tabletConfig, tabletPortraitConfig, tabletLandscapeConfig } from "./tablet";
import { mobilePortraitConfig } from "./mobilePortrait";
import { mobileLandscapeConfig } from "./mobileLandscape";

export * from "./types";
export { desktopConfig } from "./desktop";
export { tabletConfig, tabletPortraitConfig, tabletLandscapeConfig } from "./tablet";
export { mobilePortraitConfig } from "./mobilePortrait";
export { mobileLandscapeConfig } from "./mobileLandscape";

export function getDisplayConfig(width: number, height: number, isPortraitOverride?: boolean): DisplayConfig {
  const isPortrait = isPortraitOverride !== undefined ? isPortraitOverride : (height >= width);
  
  if (isPortrait) {
    if (width >= 640) {
      return tabletPortraitConfig;
    } else {
      return mobilePortraitConfig;
    }
  } else {
    // Landscape
    if (width >= 1024) {
      return desktopConfig;
    } else if (width >= 640) {
      return tabletLandscapeConfig;
    } else {
      return mobileLandscapeConfig;
    }
  }
}

