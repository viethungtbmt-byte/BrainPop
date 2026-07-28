import { AdProvider, AdPlatform } from "../types";

export class MockProvider implements AdProvider {
  readonly name: AdPlatform = "mock";

  isAvailable(): boolean {
    return true;
  }

  gameLoadingFinished(): void {
    console.log("[MockAdProvider] gameLoadingFinished");
  }

  gameplayStart(): void {
    console.log("[MockAdProvider] gameplayStart");
  }

  gameplayStop(): void {
    console.log("[MockAdProvider] gameplayStop");
  }

  async showRewardedAd(): Promise<boolean> {
    console.log("[MockAdProvider] Simulating rewarded ad...");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("[MockAdProvider] Rewarded ad completed successfully");
        resolve(true);
      }, 750);
    });
  }

  async showCommercialAd(): Promise<boolean> {
    console.log("[MockAdProvider] Simulating commercial ad...");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}
