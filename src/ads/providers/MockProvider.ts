import { AdProvider, AdPlatform } from "../types";
import { synth } from "../../audio";

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
    synth.muteForAd();
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("[MockAdProvider] Rewarded ad completed successfully");
        synth.unmuteAfterAd();
        resolve(true);
      }, 750);
    });
  }

  async showCommercialAd(): Promise<boolean> {
    console.log("[MockAdProvider] Simulating commercial ad...");
    synth.muteForAd();
    return new Promise((resolve) => {
      setTimeout(() => {
        synth.unmuteAfterAd();
        resolve(true);
      }, 500);
    });
  }
}
