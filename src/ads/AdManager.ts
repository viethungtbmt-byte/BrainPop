import { AdProvider, AdPlatform } from "./types";
import { PokiProvider } from "./providers/PokiProvider";
import { MockProvider } from "./providers/MockProvider";

export class AdManager {
  private static instance: AdManager;
  private provider: AdProvider;

  private constructor() {
    const poki = new PokiProvider();
    if (poki.isAvailable()) {
      this.provider = poki;
    } else {
      this.provider = new MockProvider();
    }
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  /**
   * Set or switch to a custom provider at runtime
   */
  public setProvider(provider: AdProvider): void {
    this.provider = provider;
  }

  public getActivePlatform(): AdPlatform {
    return this.provider.name;
  }

  public gameLoadingFinished(): void {
    this.provider.gameLoadingFinished();
  }

  public gameplayStart(): void {
    this.provider.gameplayStart();
  }

  public gameplayStop(): void {
    this.provider.gameplayStop();
  }

  public async showRewardedAd(): Promise<boolean> {
    return this.provider.showRewardedAd();
  }

  public async showCommercialAd(): Promise<boolean> {
    if (this.provider.showCommercialAd) {
      return this.provider.showCommercialAd();
    }
    return true;
  }
}

export const adManager = AdManager.getInstance();
