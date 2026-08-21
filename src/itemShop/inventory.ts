import { InventoryState, CosmeticEffectType } from './itemTypes';
import { safeLocalStorage } from '../utils/safeStorage';

const STORAGE_KEY = 'emoji_brainpop_inventory';

export const TEMPORARY_AD_ITEMS = [
  'effect_bubbles',
  'cardback_diamond',
  'theme_winter',
  'music_wellerman'
];

export const TEMPORARY_UNLOCK_DURATION_MS = 48 * 60 * 60 * 1000; // 48 hours

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
    const data = safeLocalStorage.getItem(STORAGE_KEY);
    if (!data) {
      safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(data);
    
    // Ensure default items are always owned
    const parsedOwned = Array.isArray(parsed.ownedItemIds) ? parsed.ownedItemIds : DEFAULT_OWNED_IDS;
    let owned = Array.from(new Set([
      ...DEFAULT_OWNED_IDS,
      ...parsedOwned
    ])).filter((id: string) => id !== 'effect_sakura' && id !== 'effect_rain');

    const itemUnlocksUntil: Record<string, number> = { ...(parsed.itemUnlocksUntil || {}) };
    const now = Date.now();
    let stateChanged = false;

    // Check expiration for 48h temporary ad items
    TEMPORARY_AD_ITEMS.forEach((itemId) => {
      const until = itemUnlocksUntil[itemId] || 0;
      if (until > 0 && now < until) {
        if (!owned.includes(itemId)) {
          owned.push(itemId);
          stateChanged = true;
        }
      } else {
        if (owned.includes(itemId)) {
          owned = owned.filter(id => id !== itemId);
          stateChanged = true;
        }
        if (itemUnlocksUntil[itemId] !== undefined) {
          delete itemUnlocksUntil[itemId];
          stateChanged = true;
        }
      }
    });

    let equippedEffectId = parsed.equippedEffectId !== undefined ? parsed.equippedEffectId : DEFAULT_STATE.equippedEffectId;
    let equippedCardBackId = parsed.equippedCardBackId !== undefined ? parsed.equippedCardBackId : DEFAULT_STATE.equippedCardBackId;
    let equippedThemeId = parsed.equippedThemeId !== undefined ? parsed.equippedThemeId : DEFAULT_STATE.equippedThemeId;
    let equippedBackgroundId = parsed.equippedBackgroundId !== undefined ? parsed.equippedBackgroundId : DEFAULT_STATE.equippedBackgroundId;
    let equippedMusicId = parsed.equippedMusicId !== undefined ? parsed.equippedMusicId : DEFAULT_STATE.equippedMusicId;

    // Rule 4: If player is currently using an expired item, automatically switch back to default for that category
    if (equippedEffectId === 'effect_bubbles' && !owned.includes('effect_bubbles')) {
      equippedEffectId = null;
      stateChanged = true;
    }
    if (equippedCardBackId === 'cardback_diamond' && !owned.includes('cardback_diamond')) {
      equippedCardBackId = 'cardback_circle';
      stateChanged = true;
    }
    if (equippedThemeId === 'theme_winter' && !owned.includes('theme_winter')) {
      equippedThemeId = 'theme_midnight_blue';
      stateChanged = true;
    }
    if (equippedMusicId === 'music_wellerman' && !owned.includes('music_wellerman')) {
      equippedMusicId = 'music_none';
      stateChanged = true;
    }

    if (equippedEffectId === 'effect_sakura' || equippedEffectId === 'effect_rain') {
      equippedEffectId = null;
      stateChanged = true;
    }

    const state: InventoryState = {
      ownedItemIds: owned,
      itemUnlocksUntil,
      equippedEffectId,
      equippedCardBackId,
      equippedThemeId,
      equippedBackgroundId,
      equippedMusicId,
    };

    if (stateChanged) {
      saveInventoryState(state);
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

export function getItemUnlockTimeLeft(itemId: string): number {
  if (!TEMPORARY_AD_ITEMS.includes(itemId)) return 0;
  const state = getInventoryState();
  const until = state.itemUnlocksUntil?.[itemId] || 0;
  const remaining = until - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function unlockItem(itemId: string): void {
  const state = getInventoryState();
  if (!state.ownedItemIds.includes(itemId)) {
    state.ownedItemIds.push(itemId);
  }
  if (TEMPORARY_AD_ITEMS.includes(itemId)) {
    if (!state.itemUnlocksUntil) {
      state.itemUnlocksUntil = {};
    }
    state.itemUnlocksUntil[itemId] = Date.now() + TEMPORARY_UNLOCK_DURATION_MS;
  }
  saveInventoryState(state);
}

export function saveInventoryState(state: InventoryState): void {
  try {
    safeLocalStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
