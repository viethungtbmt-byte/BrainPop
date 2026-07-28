import { DisplayConfig } from "./types";

export const desktopConfig: DisplayConfig = {
  name: "desktop",
  showTopBar: true,
  showSidebar: true,
  showSidebarToggle: true,
  showTabletMenuToggle: false,
  showBrandingFooter: false,
  showHUD: false,
  showSoloControls: true,
  allowMobileConfigMenu: false,
  gameFrameClass: "",
  matchBoardCardClass: "relative rounded-2xl p-3 sm:p-4 shadow-2xl border border-teal-300/40 overflow-hidden flex-1 min-h-0 flex flex-col justify-between",
  memoryBoardCardClass: "relative flex-1 min-h-0 border border-blue-300/50 rounded-3xl p-1.5 sm:p-3 md:p-4 shadow-xl flex flex-col justify-start sm:justify-center overflow-hidden",
  matchGridGapXClass: "gap-x-8 sm:gap-x-16 md:gap-x-24 lg:gap-x-32",
  maxBoardWidthClass: "max-w-xl lg:max-w-2xl",
  sidebarWidthClass: "sm:w-[190px] md:sm:w-[215px] lg:sm:w-[240px]"
};
