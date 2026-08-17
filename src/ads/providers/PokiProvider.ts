import { AdProvider, AdPlatform } from "../types";
import { synth } from "../../audio";

export class PokiProvider implements AdProvider {
  readonly name: AdPlatform = "poki";
  private initPromise: Promise<void> | null = null;

  private get sdk(): any {
    return (window as any).PokiSDK;
  }

  isAvailable(): boolean {
    return typeof (window as any).PokiSDK !== "undefined";
  }

  public init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    const sdk = this.sdk;
    if (sdk && typeof sdk.init === "function") {
      this.initPromise = sdk
        .init()
        .then(() => {
          console.log("[PokiProvider] PokiSDK initialized successfully");
        })
        .catch((err: any) => {
          console.warn("[PokiProvider] PokiSDK init failed or adblocker active:", err);
        });
    } else {
      this.initPromise = Promise.resolve();
    }
    return this.initPromise;
  }

  gameLoadingFinished(): void {
    this.init();
    const sdk = this.sdk;
    if (sdk && typeof sdk.gameLoadingFinished === "function") {
      try {
        sdk.gameLoadingFinished();
      } catch (err) {
        console.warn("[PokiProvider] gameLoadingFinished error:", err);
      }
    }
  }

  gameplayStart(): void {
    const sdk = this.sdk;
    if (sdk && typeof sdk.gameplayStart === "function") {
      try {
        sdk.gameplayStart();
      } catch (err) {
        console.warn("[PokiProvider] gameplayStart error:", err);
      }
    }
  }

  gameplayStop(): void {
    const sdk = this.sdk;
    if (sdk && typeof sdk.gameplayStop === "function") {
      try {
        sdk.gameplayStop();
      } catch (err) {
        console.warn("[PokiProvider] gameplayStop error:", err);
      }
    }
  }

  async showRewardedAd(): Promise<boolean> {
    await this.init();
    const sdk = this.sdk;
    synth.muteForAd();

    try {
      if (sdk && typeof sdk.rewardedBreak === "function") {
        const withReward = await sdk.rewardedBreak();
        return Boolean(withReward);
      }
      // Fallback if PokiSDK is loaded but rewardedBreak function is unavailable
      await new Promise((resolve) => setTimeout(resolve, 750));
      return true;
    } catch (err) {
      console.warn("[PokiProvider] rewardedBreak error, falling back to success:", err);
      return true;
    } finally {
      synth.unmuteAfterAd();
    }
  }

  async showCommercialAd(): Promise<boolean> {
    await this.init();
    const sdk = this.sdk;
    synth.muteForAd();

    try {
      if (sdk && typeof sdk.commercialBreak === "function") {
        await sdk.commercialBreak();
        return true;
      }
      return true;
    } catch (err) {
      console.warn("[PokiProvider] commercialBreak error:", err);
      return false;
    } finally {
      synth.unmuteAfterAd();
    }
  }
}
