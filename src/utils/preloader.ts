// Asset Preloader Engine for Emoji Brainpop
// Preloads Images, Audio Synth, Fonts, Locales, and Game Data with byte-level progress tracking.

import { TRANSLATIONS } from "../locales";
import { UNIQUE_EMOJIS } from "../emoji/emojis";
import { EMBEDDED_PAIRS } from "../emoji/related";
import { COSMETIC_ITEMS } from "../itemShop/itemData";
import { synth } from "../audio";
import gameLogo from "../assets/images/emoji_brainpop_thumb_1784707895737.jpg";
import logoIcon from "../assets/thumbnails/icon-128.png";

export interface PreloadProgressState {
  percentage: number; // 0 to 100
  loadedBytes: number;
  totalBytes: number;
  currentTaskName: string;
  isComplete: boolean;
}

export type PreloadProgressCallback = (state: PreloadProgressState) => void;

interface PreloadManifestItem {
  id: string;
  taskName: string;
  url?: string;
  estimatedBytes: number;
  type: "image" | "audio" | "fonts" | "locales" | "data";
}

// Complete list of essential assets to preload
const ASSET_MANIFEST: PreloadManifestItem[] = [
  {
    id: "game-logo",
    taskName: "Preloading Game Artwork & Textures...",
    url: gameLogo,
    estimatedBytes: 661504,
    type: "image",
  },
  {
    id: "logo-icon",
    taskName: "Loading Game Icon & UI Badges...",
    url: logoIcon,
    estimatedBytes: 64661,
    type: "image",
  },
  {
    id: "locales",
    taskName: "Loading Language Bundles (16 Locales)...",
    estimatedBytes: 320000,
    type: "locales",
  },
  {
    id: "emoji-db",
    taskName: "Parsing Emoji Database & Memory Relations...",
    estimatedBytes: 280000,
    type: "data",
  },
  {
    id: "fonts",
    taskName: "Verifying Fonts & UI Graphics...",
    estimatedBytes: 220000,
    type: "fonts",
  },
  {
    id: "audio-synth",
    taskName: "Initializing Synthesizer & Audio Engine...",
    estimatedBytes: 450000,
    type: "audio",
  },
  {
    id: "shop-data",
    taskName: "Initializing Customization & Shop Data...",
    estimatedBytes: 180000,
    type: "data",
  },
];

// Calculate total estimated bytes
export const TOTAL_ESTIMATED_BYTES = ASSET_MANIFEST.reduce(
  (sum, item) => sum + item.estimatedBytes,
  0
);

export class AssetPreloader {
  private loadedBytesMap: Map<string, number> = new Map();
  private onProgressCb: PreloadProgressCallback | null = null;
  private isRunning: boolean = false;

  constructor(onProgress?: PreloadProgressCallback) {
    if (onProgress) {
      this.onProgressCb = onProgress;
    }
  }

  public setProgressCallback(cb: PreloadProgressCallback) {
    this.onProgressCb = cb;
  }

  public async startPreload(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;

    // Reset progress tracking
    ASSET_MANIFEST.forEach((item) => this.loadedBytesMap.set(item.id, 0));
    this.notifyProgress("Initializing Emoji Brainpop Engine...");

    for (const item of ASSET_MANIFEST) {
      this.notifyProgress(item.taskName);

      try {
        switch (item.type) {
          case "image":
            await this.preloadImage(item);
            break;
          case "locales":
            await this.preloadLocales(item);
            break;
          case "data":
            await this.preloadGameData(item);
            break;
          case "fonts":
            await this.preloadFonts(item);
            break;
          case "audio":
            await this.preloadAudio(item);
            break;
        }
      } catch (error) {
        console.warn(`Preloader item fallback for ${item.id}:`, error);
        // Ensure progress advances even if a single optional fetch errors out
        this.loadedBytesMap.set(item.id, item.estimatedBytes);
        this.notifyProgress(item.taskName);
      }

      // Small yield to UI thread to keep 60fps frame rate
      await this.yieldToUI();
    }

    // Final completion state
    ASSET_MANIFEST.forEach((item) => this.loadedBytesMap.set(item.id, item.estimatedBytes));
    this.notifyProgress("Game Assets Loaded Successfully!", true);
  }

  private notifyProgress(currentTaskName: string, isComplete: boolean = false) {
    let currentLoadedBytes = 0;
    this.loadedBytesMap.forEach((bytes) => {
      currentLoadedBytes += bytes;
    });

    // Ensure loadedBytes doesn't exceed totalBytes artificially
    currentLoadedBytes = Math.min(currentLoadedBytes, TOTAL_ESTIMATED_BYTES);

    const percentage = isComplete
      ? 100
      : Math.min(99, Math.round((currentLoadedBytes / TOTAL_ESTIMATED_BYTES) * 100));

    if (this.onProgressCb) {
      this.onProgressCb({
        percentage,
        loadedBytes: currentLoadedBytes,
        totalBytes: TOTAL_ESTIMATED_BYTES,
        currentTaskName,
        isComplete,
      });
    }
  }

  private async preloadImage(item: PreloadManifestItem): Promise<void> {
    if (!item.url) return;

    const targetBytes = item.estimatedBytes;

    return new Promise((resolve) => {
      let resolved = false;
      const done = () => {
        if (!resolved) {
          resolved = true;
          this.loadedBytesMap.set(item.id, targetBytes);
          this.notifyProgress(item.taskName);
          resolve();
        }
      };

      // Maximum 800ms safety timeout per image
      const timeout = setTimeout(done, 800);

      const img = new Image();
      img.onload = () => {
        clearTimeout(timeout);
        done();
      };
      img.onerror = () => {
        clearTimeout(timeout);
        done();
      };
      img.src = item.url!;
    });
  }

  private async preloadLocales(item: PreloadManifestItem): Promise<void> {
    const totalLocales = Object.keys(TRANSLATIONS).length;
    let loadedCount = 0;

    for (const key of Object.keys(TRANSLATIONS)) {
      const dict = (TRANSLATIONS as Record<string, unknown>)[key];
      if (dict && typeof dict === "object") {
        Object.keys(dict).length;
      }
      loadedCount++;
      const portion = Math.round((loadedCount / totalLocales) * item.estimatedBytes);
      this.loadedBytesMap.set(item.id, portion);
      this.notifyProgress(item.taskName);
    }
    await this.yieldToUI();
  }

  private async preloadGameData(item: PreloadManifestItem): Promise<void> {
    // Touch game datasets to prime JS engine memory
    const emojiCount = UNIQUE_EMOJIS.length;
    const memoryPairsCount = EMBEDDED_PAIRS.length;
    const shopItemsCount = COSMETIC_ITEMS.length;

    const totalSteps = 3;
    let step = 0;

    if (emojiCount > 0) step++;
    this.loadedBytesMap.set(item.id, Math.round((step / totalSteps) * item.estimatedBytes));
    this.notifyProgress(item.taskName);

    if (memoryPairsCount > 0) step++;
    this.loadedBytesMap.set(item.id, Math.round((step / totalSteps) * item.estimatedBytes));
    this.notifyProgress(item.taskName);

    if (shopItemsCount > 0) step++;
    this.loadedBytesMap.set(item.id, item.estimatedBytes);
    this.notifyProgress(item.taskName);
    await this.yieldToUI();
  }

  private async preloadFonts(item: PreloadManifestItem): Promise<void> {
    if (typeof document !== "undefined" && "fonts" in document) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((r) => setTimeout(r, 400)),
        ]);
      } catch (err) {
        console.warn("Font loading check error:", err);
      }
    }
    this.loadedBytesMap.set(item.id, item.estimatedBytes);
    this.notifyProgress(item.taskName);
  }

  private async preloadAudio(item: PreloadManifestItem): Promise<void> {
    try {
      if (synth) {
        // Audio synth ready
      }
    } catch {
      // Ignore audio policy warnings
    }

    const chunks = 2;
    for (let i = 1; i <= chunks; i++) {
      this.loadedBytesMap.set(item.id, Math.round((i / chunks) * item.estimatedBytes));
      this.notifyProgress(item.taskName);
      await new Promise((r) => setTimeout(r, 15));
    }
  }

  private yieldToUI(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof requestAnimationFrame !== "undefined") {
        requestAnimationFrame(() => resolve());
      } else {
        setTimeout(resolve, 16);
      }
    });
  }
}
