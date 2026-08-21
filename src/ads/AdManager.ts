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
    try {
      if (this.provider.init) {
        return Promise.resolve(this.provider.init()).catch((err) => {
          console.warn("[AdManager] init error:", err);
        });
      }
    } catch (err) {
      console.warn("[AdManager] init exception:", err);
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
    try {
      return this.provider.name;
    } catch {
      return "mock";
    }
  }

  public gameLoadingFinished(): void {
    try {
      this.provider.gameLoadingFinished();
    } catch (err) {
      console.warn("[AdManager] gameLoadingFinished error:", err);
    }
  }

  public gameplayStart(): void {
    try {
      this.provider.gameplayStart();
    } catch (err) {
      console.warn("[AdManager] gameplayStart error:", err);
    }
  }

  public gameplayStop(): void {
    try {
      this.provider.gameplayStop();
    } catch (err) {
      console.warn("[AdManager] gameplayStop error:", err);
    }
  }

  public async showRewardedAd(): Promise<boolean> {
    try {
      return await Promise.resolve(this.provider.showRewardedAd()).catch((err) => {
        console.warn("[AdManager] showRewardedAd promise error:", err);
        return false;
      });
    } catch (err) {
      console.warn("[AdManager] showRewardedAd exception:", err);
      return false;
    }
  }

  public async showCommercialAd(): Promise<boolean> {
    try {
      if (this.provider.showCommercialAd) {
        return await Promise.resolve(this.provider.showCommercialAd()).catch((err) => {
          console.warn("[AdManager] showCommercialAd promise error:", err);
          return true;
        });
      }
      return true;
    } catch (err) {
      console.warn("[AdManager] showCommercialAd exception:", err);
      return true;
    }
  }
}

export const adManager = AdManager.getInstance();

