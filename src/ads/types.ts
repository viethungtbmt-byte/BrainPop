export type AdPlatform = "poki" | "mock" | "crazygames" | "gamedistribution";

export interface AdProvider {
  name: AdPlatform;
  isAvailable(): boolean;
  init?(): Promise<void>;
  gameLoadingFinished(): void;
  gameplayStart(): void;
  gameplayStop(): void;
  showRewardedAd(): Promise<boolean>;
  showCommercialAd?(): Promise<boolean>;
}

