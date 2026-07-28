export interface DisplayConfig {
  name: "desktop" | "tablet" | "mobilePortrait" | "mobileLandscape";
  
  // Visibility rules for key layout elements
  showTopBar: boolean;          // Determines if portrait topbar header is shown
  showSidebar: boolean;         // Determines if desktop/tablet sidebar is shown
  showSidebarToggle: boolean;   // Determines if PC handle to collapse sidebar is shown
  showTabletMenuToggle: boolean;// Determines if tablet fixed menu button is shown
  showBrandingFooter: boolean;  // Determines if portrait branding logo is shown
  showHUD: boolean;             // Determines if unified top mobile HUD bar is shown
  showSoloControls: boolean;    // Determines if solo controls are shown in memory mode
  allowMobileConfigMenu: boolean; // Determines if full screen mobile config is allowed
  
  // Layout styling properties
  gameFrameClass: string;       // Custom classes for #poki-game-frame container
  matchBoardCardClass: string;  // Custom classes for match-board-card
  memoryBoardCardClass: string; // Custom classes for memory-board-card
  matchGridGapXClass: string;   // Gap-x classes for match board container
  maxBoardWidthClass: string;   // Max width classes for match board container
  sidebarWidthClass: string;    // Width class for sidebar
}
