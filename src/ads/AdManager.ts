import { AdProvider, AdPlatform } from "./types";
import { PokiProvider } from "./providers/PokiProvider";
import { MockProvider } from "./providers/MockProvider";

export class AdManager {
  private static instance: AdManager;
  private customProvider: AdProvider | null = null;
  private defaultProvider: AdProvider | null = null;

  private get provider(): AdProvider {
    if (this.customProvider) {
      return this.customProvider;
    }
    if (!this.defaultProvider) {
      const poki = new PokiProvider();
      if (poki.isAvailable()) {
        this.defaultProvider = poki;
      } else {
        this.defaultProvider = new MockProvider();
      }
    }
    return this.defaultProvider;
  }

  public static getInstance(): AdManager {
    if (!AdManager.instance) {
      AdManager.instance = new AdManager();
    }
    return AdManager.instance;
  }

  public init(): Promise<void> {
    if (this.provider.init) {
      return this.provider.init();
    }
    return Promise.resolve();
  }

  /**
   * Set or switch to a custom provider at runtime
   */
  public setProvider(provider: AdProvider): void {
    this.customProvider = provider;
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

