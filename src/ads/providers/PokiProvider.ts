import { AdProvider, AdPlatform } from "../types";
import { synth } from "../../audio";

export class PokiProvider implements AdProvider {
  readonly name: AdPlatform = "poki";
  private initPromise: Promise<void> | null = null;
  private _isPlaying: boolean = false;
  private _loadingFinishedCalled: boolean = false;

  private get sdk(): any {
    return typeof window !== "undefined" ? (window as any).PokiSDK : undefined;
  }

  isAvailable(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof (window as any).PokiSDK !== "undefined" &&
      !(window as any).__poki_sdk_blocked
    );
  }

  public isPlaying(): boolean {
    return this._isPlaying;
  }

  public init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise<void>((resolve) => {
      try {
        const sdk = this.sdk;
        if (sdk && typeof sdk.init === "function") {
          Promise.resolve(sdk.init())
            .then(() => {
              console.log("[PokiProvider] PokiSDK initialized successfully");
              resolve();
            })
            .catch((err: any) => {
              console.warn("[PokiProvider] PokiSDK init rejected / adblocker:", err);
              resolve(); // Resolve anyway so game flow never blocks
            });
        } else {
          resolve();
        }
      } catch (err) {
        console.warn("[PokiProvider] PokiSDK init synchronous exception:", err);
        resolve();
      }
    });

    return this.initPromise;
  }

  gameLoadingFinished(): void {
    if (this._loadingFinishedCalled) return;
    this._loadingFinishedCalled = true;

    // Ensure SDK init has settled before or alongside gameLoadingFinished
    this.init()
      .catch(() => {})
      .then(() => {
        try {
          const sdk = this.sdk;
          if (sdk && typeof sdk.gameLoadingFinished === "function") {
            sdk.gameLoadingFinished();
          }
        } catch (err) {
          console.warn("[PokiProvider] gameLoadingFinished error:", err);
        }
      });
  }

  gameplayStart(): void {
    if (this._isPlaying) return; // Prevent duplicate consecutive calls
    this._isPlaying = true;
    try {
      const sdk = this.sdk;
      if (sdk && typeof sdk.gameplayStart === "function") {
        sdk.gameplayStart();
      }
    } catch (err) {
      console.warn("[PokiProvider] gameplayStart error:", err);
    }
  }

  gameplayStop(): void {
    if (!this._isPlaying) return; // Prevent duplicate consecutive calls
    this._isPlaying = false;
    try {
      const sdk = this.sdk;
      if (sdk && typeof sdk.gameplayStop === "function") {
        sdk.gameplayStop();
      }
    } catch (err) {
      console.warn("[PokiProvider] gameplayStop error:", err);
    }
  }

  async showRewardedAd(): Promise<boolean> {
    try {
      await this.init().catch(() => {});
    } catch {}

    const sdk = this.sdk;
    const wasPlaying = this._isPlaying;
    if (wasPlaying) {
      this.gameplayStop();
    }

    try {
      synth.muteForAd();
    } catch {}

    try {
      if (sdk && typeof sdk.rewardedBreak === "function") {
        const result = await Promise.resolve(sdk.rewardedBreak()).catch((e) => {
          console.warn("[PokiProvider] rewardedBreak promise rejected:", e);
          return false;
        });
        return Boolean(result);
      }
      return false;
    } catch (err) {
      console.warn("[PokiProvider] rewardedBreak error:", err);
      return false;
    } finally {
      try {
        synth.unmuteAfterAd();
      } catch {}
      if (wasPlaying) {
        this.gameplayStart();
      }
    }
  }

  async showCommercialAd(): Promise<boolean> {
    try {
      await this.init().catch(() => {});
    } catch {}

    const sdk = this.sdk;
    const wasPlaying = this._isPlaying;
    if (wasPlaying) {
      this.gameplayStop();
    }

    try {
      synth.muteForAd();
    } catch {}

    try {
      if (sdk && typeof sdk.commercialBreak === "function") {
        await Promise.resolve(sdk.commercialBreak()).catch((e) => {
          console.warn("[PokiProvider] commercialBreak promise rejected:", e);
        });
        return true;
      }
      return true;
    } catch (err) {
      console.warn("[PokiProvider] commercialBreak error:", err);
      return false;
    } finally {
      try {
        synth.unmuteAfterAd();
      } catch {}
      if (wasPlaying) {
        this.gameplayStart();
      }
    }
  }
}

