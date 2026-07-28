import { InventoryState, CosmeticEffectType } from './itemTypes';

const STORAGE_KEY = 'emoji_brainpop_inventory';

export const DEFAULT_OWNED_IDS = [
  'cardback_circle',
  'theme_midnight_blue',
  'music_none'
];

const DEFAULT_STATE: InventoryState = {
  ownedItemIds: DEFAULT_OWNED_IDS,
  equippedEffectId: null,
  equippedCardBackId: 'cardback_circle',
  equippedThemeId: 'theme_midnight_blue',
  equippedBackgroundId: 'background_soft_sky',
  equippedMusicId: 'music_none',
};

export function getInventoryState(): InventoryState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(data);
    
    // Ensure default items are always owned
    const parsedOwned = Array.isArray(parsed.ownedItemIds) ? parsed.ownedItemIds : DEFAULT_OWNED_IDS;
    const owned = Array.from(new Set([
      ...DEFAULT_OWNED_IDS,
      ...parsedOwned
    ])).filter((id: string) => id !== 'effect_sakura' && id !== 'effect_rain');

    const state: InventoryState = {
      ownedItemIds: owned,
      equippedEffectId: parsed.equippedEffectId !== undefined ? parsed.equippedEffectId : DEFAULT_STATE.equippedEffectId,
      equippedCardBackId: parsed.equippedCardBackId !== undefined ? parsed.equippedCardBackId : DEFAULT_STATE.equippedCardBackId,
      equippedThemeId: parsed.equippedThemeId !== undefined ? parsed.equippedThemeId : DEFAULT_STATE.equippedThemeId,
      equippedBackgroundId: parsed.equippedBackgroundId !== undefined ? parsed.equippedBackgroundId : DEFAULT_STATE.equippedBackgroundId,
      equippedMusicId: parsed.equippedMusicId !== undefined ? parsed.equippedMusicId : DEFAULT_STATE.equippedMusicId,
    };
    
    if (state.equippedEffectId === 'effect_sakura' || state.equippedEffectId === 'effect_rain') {
      state.equippedEffectId = null;
    }
    
    return state;
  } catch (e) {
    console.error('Failed to parse inventory state', e);
    return DEFAULT_STATE;
  }
}

export function isItemOwned(itemId: string): boolean {
  if (itemId === 'effect_none' || DEFAULT_OWNED_IDS.includes(itemId)) {
    return true;
  }
  const state = getInventoryState();
  return state.ownedItemIds.includes(itemId);
}

export function unlockItem(itemId: string): void {
  const state = getInventoryState();
  if (!state.ownedItemIds.includes(itemId)) {
    state.ownedItemIds.push(itemId);
    saveInventoryState(state);
  }
}

export function saveInventoryState(state: InventoryState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save inventory state', e);
  }
}

export function getEquippedEffect(): CosmeticEffectType | null {
  const state = getInventoryState();
  if (!state.equippedEffectId) return null;
  
  if (state.equippedEffectId === 'effect_snow') return 'snow';
  if (state.equippedEffectId === 'effect_autumn') return 'autumn';
  if (state.equippedEffectId === 'effect_fireflies') return 'fireflies';
  if (state.equippedEffectId === 'effect_hearts') return 'hearts';
  if (state.equippedEffectId === 'effect_bubbles') return 'bubbles';
  if (state.equippedEffectId === 'effect_stars') return 'stars';
  if (state.equippedEffectId === 'effect_confetti') return 'confetti';
  
  return null;
}

export function setEquippedEffect(effectType: CosmeticEffectType | null): void {
  const state = getInventoryState();
  if (!effectType) {
    state.equippedEffectId = null;
  } else {
    state.equippedEffectId = `effect_${effectType}`;
  }
  saveInventoryState(state);
}

// Helpers for newly introduced categories
export function getEquippedCardBack(): string {
  const state = getInventoryState();
  return state.equippedCardBackId || 'cardback_circle';
}

export function setEquippedCardBack(id: string): void {
  const state = getInventoryState();
  state.equippedCardBackId = id;
  saveInventoryState(state);
}

export function getEquippedTheme(): string {
  const state = getInventoryState();
  const validThemes = ['theme_midnight_blue', 'theme_spring', 'theme_summer', 'theme_autumn', 'theme_winter', 'theme_ocean', 'theme_desert'];
  if (state.equippedThemeId && validThemes.includes(state.equippedThemeId)) {
    return state.equippedThemeId;
  }
  return 'theme_midnight_blue';
}

export function setEquippedTheme(id: string): void {
  const state = getInventoryState();
  state.equippedThemeId = id;
  saveInventoryState(state);
}

export function getEquippedBackground(): string {
  const state = getInventoryState();
  return state.equippedBackgroundId || 'background_soft_sky';
}

export function setEquippedBackground(id: string): void {
  const state = getInventoryState();
  state.equippedBackgroundId = id;
  saveInventoryState(state);
}

export function getEquippedMusic(): string {
  const state = getInventoryState();
  return state.equippedMusicId || 'music_none';
}

export function setEquippedMusic(id: string): void {
  const state = getInventoryState();
  state.equippedMusicId = id;
  saveInventoryState(state);
}
