import { AdProvider, AdPlatform } from "../types";

export class PokiProvider implements AdProvider {
  readonly name: AdPlatform = "poki";

  private get sdk(): any {
    return (window as any).PokiSDK;
  }

  isAvailable(): boolean {
    return typeof (window as any).PokiSDK !== "undefined";
  }

  gameLoadingFinished(): void {
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
    const sdk = this.sdk;
    if (sdk && typeof sdk.rewardedBreak === "function") {
      try {
        const withReward = await sdk.rewardedBreak();
        return Boolean(withReward);
      } catch (err) {
        console.warn("[PokiProvider] rewardedBreak error, falling back to success:", err);
        return true; // Fallback for local testing / adblocker
      }
    }
    // Fallback if PokiSDK is loaded but rewardedBreak function is unavailable
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 750);
    });
  }

  async showCommercialAd(): Promise<boolean> {
    const sdk = this.sdk;
    if (sdk && typeof sdk.commercialBreak === "function") {
      try {
        await sdk.commercialBreak();
        return true;
      } catch (err) {
        console.warn("[PokiProvider] commercialBreak error:", err);
        return false;
      }
    }
    return true;
  }
}
