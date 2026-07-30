# Architecture & Engine Guide (`ARCHITECTURE.md`)

## 1. Executive Summary

This document defines the system architecture, component boundaries, and code placement rules for **Emoji BrainPop**. Following the recent modular refactoring, the codebase has transitioned from a monolithic `App.tsx` structure to a clean, componentized architecture.

---

## 2. Component & Directory Responsibilities

### 2.1 Engine Layer (`/src/components/engine/`, `/src/audio/`, `/src/BOT/`)
- **Responsibilities**:
  - Core game runtime loop, timer management, audio synthesis, ambient music, and sound effects (`src/audio/`).
  - Bot AI decision logic and difficulty algorithms (`src/BOT/`, `src/emoji/botAI.ts`).
  - Reusable engine HUD controls and landscape menus (`src/components/engine/`).
- **Boundaries**:
  - Engine modules must NOT directly mutate UI state or render global modals.
  - Engine components receive state and dispatch callbacks through clean typed props.

### 2.2 Game Logic & Gameplay Board Layer (`/src/components/game/`, `/src/emoji/`, `/src/hooks/`)
- **Responsibilities**:
  - Board rendering and card interaction (`MemoryBoardGrid.tsx`, `MatchConnectionBoard.tsx`).
  - Card flips, matching algorithms, grid sizing math, cabling SVG rendering, and emoji generator data (`src/emoji/`).
  - Custom game state hooks (`useMemoryGame.ts`).
- **Boundaries**:
  - Game components handle in-game board interaction.
  - Card interactions trigger sound/effects via callback interfaces provided by the parent.

### 2.3 UI & Modal Overlay Layer (`/src/components/modals/`, `/src/itemShop/`, `/src/components/`)
- **Responsibilities**:
  - Isolated overlay dialogs: `SettingsModal`, `ShopModal`, `RankUpModal`, `HighScoreModal`, `GentleSnowUnlockModal`, `GameStartConfirmModal`, `ResetConfirmModal`, `HintModal`, `PauseOverlay`, `LoadingAdOverlay`, `MemoryFinishedModal`.
  - Presentation cards: `MemoryCard.tsx`, `CanvasCard.tsx`, `PanelBackground.tsx`.
- **Boundaries**:
  - Modals must accept explicit open/close props and callbacks. They must not attempt to modify unrelated global state.

### 2.4 App Coordinator Layer (`/src/App.tsx`)
- **Responsibilities**:
  - Top-level layout composition, tab switching (`memory` vs `match`), theme resolution, language provider, and modal visibility coordination.
- **Boundaries**:
  - `App.tsx` should ONLY manage route/tab orchestration, state pass-through, and layout containers.
  - **STRICT RULE**: `App.tsx` must NOT contain inline JSX grids, card loops, or complex game calculation loops directly inside its main render tree.

---

## 3. Strict Code Placement & Monolith Prevention Rules

To prevent code drift and stop features from accumulating back into `App.tsx`:

1. **New UI Dialogs & Overlays** $\rightarrow$ Must be placed in `/src/components/modals/`.
2. **New Gameplay Mechanics or Board Types** $\rightarrow$ Must be placed in `/src/components/game/`.
3. **New Audio / Engine Controls** $\rightarrow$ Must be placed in `/src/components/engine/` or `/src/audio/`.
4. **New State or Logic Controllers** $\rightarrow$ Must be extracted into custom React hooks in `/src/hooks/`.
5. **No Direct Inline Loops in App.tsx**: Any list rendering (`.map()`) exceeding 10 lines of JSX must be extracted into a standalone component.

---

## 4. Pre-Feature Review Checklist

Before merging or committing any new feature, verify against this checklist:

- [ ] **Location Check**: Is the new feature placed in the correct directory (`modals/`, `game/`, `engine/`, `hooks/`)?
- [ ] **App.tsx Size Check**: Did `App.tsx` grow by more than 25 lines? If so, extract the sub-layout into a component.
- [ ] **Prop Cleanliness**: Are component interfaces typed with explicit props?
- [ ] **Single Responsibility**: Does the component do only one thing (e.g., render a modal, handle a card grid)?
- [ ] **Build & Type Safety**: Does `npm run lint` and `compile_applet` pass cleanly?

---

## 5. Architectural Assessment & Maturity Report

### 5.1 Current Architecture Maturity
- **Status**: **Phase 2 Complete (Refactored & Modularized)**.
- **UI Modularization**: 100% of modals, overlays, and game boards (`MemoryBoardGrid`, `MatchConnectionBoard`, `GameHUD`, `MobileLandscapeMenu`) have been extracted into dedicated component files.
- **Maintainability**: High. Each component file has a clear single responsibility and clear prop boundaries.

### 5.2 Remaining Architectural Risks
- **App.tsx Size**: `App.tsx` currently acts as the central state hub. While UI loops are extracted, additional domain state hooks (e.g., matching connection state) can further be extracted as new game modes are added.

### 5.3 Long-Term Readiness
- The project architecture is **fully secured and protected** by modular boundaries, clean file organization, and established development rules. It is ready for continuous feature development without requiring another major architectural refactor.
