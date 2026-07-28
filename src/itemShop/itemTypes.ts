export type CosmeticEffectType = 
  | 'snow' 
  | 'autumn' 
  | 'fireflies' 
  | 'hearts' 
  | 'bubbles' 
  | 'stars' 
  | 'confetti';

export type CosmeticCategory = 'effect' | 'cardBack' | 'theme' | 'background' | 'music';

export type RarityType = 'common' | 'rare' | 'epic' | 'legendary';

export interface CosmeticItem {
  id: string;
  nameKey: string;
  descriptionKey: string;
  type: CosmeticCategory;
  category?: CosmeticCategory;
  effectType?: CosmeticEffectType;
  price?: number;
  rarity?: RarityType;
  icon: string; // Emoji or Lucide icon name
  owned?: boolean;
  equipped?: boolean;
  locked?: boolean;
  preview?: string;
  isDefault?: boolean;
}

export interface InventoryState {
  ownedItemIds: string[];
  equippedEffectId: string | null;
  equippedCardBackId: string | null;
  equippedThemeId: string | null;
  equippedBackgroundId: string | null;
  equippedMusicId: string | null;
}
