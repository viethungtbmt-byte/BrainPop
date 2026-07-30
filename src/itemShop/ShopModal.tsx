import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Layers, 
  Palette, 
  Music,
  Video,
  RefreshCw
} from 'lucide-react';
import { COSMETIC_ITEMS } from './itemData';
import { CosmeticEffectType, CosmeticItem } from './itemTypes';
import { synth } from '../audio';
import { TRANSLATIONS } from '../locales';
import { getInventoryState, unlockItem } from './inventory';
import { adManager } from '../ads/AdManager';
import { PanelBackground } from '../components/PanelBackground';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  equippedEffect: CosmeticEffectType | null;
  onEquipEffect: (effect: CosmeticEffectType | null) => void;
  equippedCardBackId: string;
  onEquipCardBack: (id: string) => void;
  equippedThemeId: string;
  onEquipTheme: (id: string) => void;
  equippedMusicId: string;
  onEquipMusic: (id: string) => void;
  isMobileLandscape?: boolean;
  highlightItemId?: string | null;
  onClearHighlight?: () => void;
}

const SHOP_THEME_STYLES: Record<string, {
  dialogBg: string;
  sidebarBg: string;
  tabSelected: string;
  tabUnselected: string;
  itemCardEquipped: string;
  itemCardUnequipped: string;
  btnEquipped: string;
  btnUnequipped: string;
  textPrimary: string;
  textSecondary: string;
}> = {
  theme_midnight_blue: {
    dialogBg: 'bg-gradient-to-b from-[#1c244f]/95 via-[#141a3c]/95 to-[#0c102b]/95 border-2 border-[#5066c7]/60 shadow-[0_24px_60px_rgba(4,8,24,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(80,102,199,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#151c3e]/90 to-[#0e122b]/95 border-r border-white/10',
    tabSelected: 'bg-gradient-to-r from-[#2c377a] to-[#394998] border-[#546bbf] text-cyan-300',
    tabUnselected: 'bg-[#1d244d]/30 hover:bg-[#1d244d]/80 text-slate-300 hover:text-slate-100 border-transparent',
    itemCardEquipped: 'bg-[#25326d]/70 border-cyan-500/80 shadow-[0_8px_20px_-2px_rgba(6,182,212,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#1c2246]/60 hover:bg-[#202852]/90 border-slate-700/50 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300',
    btnUnequipped: 'bg-gradient-to-b from-[#34448e] to-[#25326d] hover:from-[#3a4ea4] hover:to-[#2c3c7e] border border-[#546bbf]/40 text-slate-100',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
  },
  theme_spring: {
    dialogBg: 'bg-gradient-to-b from-[#341d2e]/95 via-[#241420]/95 to-[#170c14]/95 border-2 border-pink-500/50 shadow-[0_24px_60px_rgba(24,8,18,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(236,72,153,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#251522]/90 to-[#140b12]/95 border-r border-pink-900/40',
    tabSelected: 'bg-gradient-to-r from-[#9d3a5b] to-[#be4b73] border-pink-400 text-pink-100',
    tabUnselected: 'bg-[#331a28]/30 hover:bg-[#331a28]/80 text-pink-200/80 hover:text-pink-100 border-transparent',
    itemCardEquipped: 'bg-[#422036]/80 border-emerald-400/80 shadow-[0_8px_20px_-2px_rgba(52,211,153,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#2a1624]/70 hover:bg-[#391e31]/90 border-pink-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300',
    btnUnequipped: 'bg-gradient-to-b from-[#be4b73] to-[#9d3a5b] hover:from-[#d25881] hover:to-[#aa4265] border border-pink-400/30 text-white',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200/70',
  },
  theme_summer: {
    dialogBg: 'bg-gradient-to-b from-[#3a2e1d]/95 via-[#251d11]/95 to-[#17120a]/95 border-2 border-amber-500/50 shadow-[0_24px_60px_rgba(24,18,8,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(245,158,11,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#2b2215]/90 to-[#120e07]/95 border-r border-amber-900/40',
    tabSelected: 'bg-gradient-to-r from-[#b45309] to-[#d97706] border-amber-400 text-amber-100 font-extrabold',
    tabUnselected: 'bg-[#332817]/30 hover:bg-[#332817]/80 text-amber-200/80 hover:text-amber-100 border-transparent',
    itemCardEquipped: 'bg-[#42331c]/80 border-amber-400/80 shadow-[0_8px_20px_-2px_rgba(245,158,11,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#2a2114]/70 hover:bg-[#3a2d1b]/90 border-amber-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-sky-950/40 border border-sky-400/40 text-sky-300',
    btnUnequipped: 'bg-gradient-to-b from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#c25e09] border border-amber-400/30 text-slate-950 font-extrabold',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
  },
  theme_autumn: {
    dialogBg: 'bg-gradient-to-b from-[#382618]/95 via-[#22160e]/95 to-[#150d08]/95 border-2 border-orange-500/50 shadow-[0_24px_60px_rgba(24,12,6,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(249,115,22,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#291b10]/90 to-[#100a06]/95 border-r border-orange-900/40',
    tabSelected: 'bg-gradient-to-r from-[#9a3412] to-[#c2410c] border-orange-400 text-orange-100 font-extrabold',
    tabUnselected: 'bg-[#301c10]/30 hover:bg-[#301c10]/80 text-orange-200/80 hover:text-orange-100 border-transparent',
    itemCardEquipped: 'bg-[#402616]/80 border-orange-400/80 shadow-[0_8px_20px_-2px_rgba(234,88,12,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#25170d]/70 hover:bg-[#382314]/90 border-orange-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-amber-950/40 border border-amber-500/40 text-amber-300',
    btnUnequipped: 'bg-gradient-to-b from-[#c2410c] to-[#9a3412] hover:from-[#ea580c] hover:to-[#ad380b] border border-orange-400/30 text-white font-extrabold',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-200/70',
  },
  theme_winter: {
    dialogBg: 'bg-gradient-to-b from-[#1b2b42]/95 via-[#111c2c]/95 to-[#0a111b]/95 border-2 border-sky-400/50 shadow-[0_24px_60px_rgba(6,14,24,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(56,189,248,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#142032]/90 to-[#070e17]/95 border-r border-sky-900/40',
    tabSelected: 'bg-gradient-to-r from-[#0369a1] to-[#0284c7] border-sky-300 text-white font-extrabold',
    tabUnselected: 'bg-[#172436]/30 hover:bg-[#172436]/80 text-sky-200/80 hover:text-sky-100 border-transparent',
    itemCardEquipped: 'bg-[#1e3047]/80 border-sky-300/80 shadow-[0_8px_20px_-2px_rgba(56,189,248,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#121d2b]/70 hover:bg-[#1d2e45]/90 border-sky-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-cyan-950/40 border border-cyan-400/40 text-cyan-300',
    btnUnequipped: 'bg-gradient-to-b from-[#0284c7] to-[#0369a1] hover:from-[#38bdf8] hover:to-[#0284c7] border border-sky-300/30 text-slate-950 font-extrabold',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-200/70',
  },
  theme_ocean: {
    dialogBg: 'bg-gradient-to-b from-[#132f4a]/95 via-[#0c1f31]/95 to-[#06121d]/95 border-2 border-cyan-500/50 shadow-[0_24px_60px_rgba(5,16,26,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(6,182,212,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#0f243a]/90 to-[#05101a]/95 border-r border-cyan-900/40',
    tabSelected: 'bg-gradient-to-r from-[#0284c7] to-[#06b6d4] border-cyan-300 text-white font-extrabold',
    tabUnselected: 'bg-[#13283c]/30 hover:bg-[#13283c]/80 text-cyan-200/80 hover:text-cyan-100 border-transparent',
    itemCardEquipped: 'bg-[#183552]/80 border-cyan-300/80 shadow-[0_8px_20px_-2px_rgba(34,211,238,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#0d1e2f]/70 hover:bg-[#16304a]/90 border-cyan-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-cyan-950/40 border border-cyan-400/40 text-cyan-300',
    btnUnequipped: 'bg-gradient-to-b from-[#06b6d4] to-[#0284c7] hover:from-[#22d3ee] hover:to-[#06b6d4] border border-cyan-300/30 text-slate-950 font-extrabold',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/70',
  },
  theme_desert: {
    dialogBg: 'bg-gradient-to-b from-[#38281d]/95 via-[#221811]/95 to-[#150e0a]/95 border-2 border-amber-600/50 shadow-[0_24px_60px_rgba(24,14,8,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2),inset_0_0_40px_rgba(217,119,6,0.15)]',
    sidebarBg: 'bg-gradient-to-b from-[#291d15]/90 to-[#100a07]/95 border-r border-amber-900/40',
    tabSelected: 'bg-gradient-to-r from-[#b45309] to-[#d97706] border-amber-400 text-amber-100 font-extrabold',
    tabUnselected: 'bg-[#302117]/30 hover:bg-[#302117]/80 text-amber-200/80 hover:text-amber-100 border-transparent',
    itemCardEquipped: 'bg-[#402b1f]/80 border-teal-400/80 shadow-[0_8px_20px_-2px_rgba(45,212,191,0.3),0_4px_12px_rgba(0,0,0,0.35)]',
    itemCardUnequipped: 'bg-[#261a13]/70 hover:bg-[#38271d]/90 border-amber-900/40 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]',
    btnEquipped: 'bg-teal-950/40 border border-teal-400/40 text-teal-300',
    btnUnequipped: 'bg-gradient-to-b from-[#d97706] to-[#b45309] hover:from-[#f59e0b] hover:to-[#d97706] border border-amber-400/30 text-white font-extrabold',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
  },
};

type ShopCategory = 
  | 'effects' 
  | 'cardBacks' 
  | 'themes' 
  | 'music';

const CATEGORIES = [
  { id: 'effects', labelKey: 'shopTabEffects', icon: Sparkles },
  { id: 'cardBacks', labelKey: 'shopTabCardBacks', icon: Layers },
  { id: 'themes', labelKey: 'shopTabThemes', icon: Palette },
  { id: 'music', labelKey: 'shopTabMusic', icon: Music }
] as const;

const mapCategoryToType = (cat: ShopCategory): string => {
  if (cat === 'effects') return 'effect';
  if (cat === 'cardBacks') return 'cardBack';
  if (cat === 'themes') return 'theme';
  return 'music';
};

const isDefaultItem = (itemId: string): boolean => {
  return (
    itemId === 'effect_none' ||
    itemId === 'cardback_circle' ||
    itemId === 'theme_midnight_blue' ||
    itemId === 'music_none'
  );
};

export const ShopModal: React.FC<ShopModalProps> = ({
  isOpen,
  onClose,
  language,
  equippedEffect,
  onEquipEffect,
  equippedCardBackId,
  onEquipCardBack,
  equippedThemeId,
  onEquipTheme,
  equippedMusicId,
  onEquipMusic,
  highlightItemId,
  onClearHighlight,
}) => {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('effects');
  const [ownedItemIds, setOwnedItemIds] = useState<string[]>(() => getInventoryState().ownedItemIds);
  const [watchingItemId, setWatchingItemId] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setOwnedItemIds(getInventoryState().ownedItemIds);
      if (highlightItemId === 'effect_snow') {
        setActiveCategory('effects');
      }
    }
  }, [isOpen, highlightItemId]);

  const t = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS.en;

  const itemType = mapCategoryToType(activeCategory);
  const filteredItems = useMemo(() => COSMETIC_ITEMS.filter(item => item.type === itemType), [itemType]);

  const tStyle = SHOP_THEME_STYLES[equippedThemeId] || SHOP_THEME_STYLES.theme_midnight_blue;

  const handleWatchAdToUnlock = (item: CosmeticItem) => {
    if (watchingItemId) return;
    setWatchingItemId(item.id);
    synth.playSelect();

    const onSuccess = () => {
      setWatchingItemId(null);
      unlockItem(item.id);
      setOwnedItemIds(prev => Array.from(new Set([...prev, item.id])));

      // Automatically equip item after unlocking
      if (activeCategory === 'effects') {
        onEquipEffect(item.effectType || null);
      } else if (activeCategory === 'cardBacks') {
        onEquipCardBack(item.id);
      } else if (activeCategory === 'themes') {
        onEquipTheme(item.id);
      } else if (activeCategory === 'music') {
        onEquipMusic(item.id);
      }

      synth.playRankUp();
    };

    adManager.showRewardedAd()
      .then((withReward: boolean) => {
        if (withReward) {
          onSuccess();
        } else {
          setWatchingItemId(null);
        }
      })
      .catch((err: any) => {
        console.warn('Rewarded ad error in Shop:', err);
        onSuccess();
      });
  };

  const renderUnifiedItems = () => {
    const itemsToRender = [...filteredItems];
    
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 pb-2">
        {/* Special Default "None" option for Effects tab */}
        {activeCategory === 'effects' && (
          <div 
            id="shop-item-none"
            onClick={() => {
              synth.playSuccess();
              onEquipEffect(null);
            }}
            className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col justify-between items-center text-center cursor-pointer active:scale-95 active:translate-y-0 min-h-[112px] sm:min-h-[135px] h-auto relative overflow-hidden group -translate-y-[2px] hover:-translate-y-1.5 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/10 ${
              equippedEffect === null
                ? `${tStyle.itemCardEquipped} border-cyan-500/80 shadow-[0_8px_20px_-2px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.35)]`
                : `${tStyle.itemCardUnequipped}`
            }`}
          >
            {/* Top row label */}
            <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-wider gap-1">
              <span className="px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                {t.shopDefaultLabel || "DEFAULT"}
              </span>
              {equippedEffect === null ? (
                <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </span>
              ) : null}
            </div>

            {/* Icon */}
            <div className="my-1 text-2xl sm:text-3xl select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              🚫
            </div>

            {/* Title & Action */}
            <div className="w-full flex flex-col items-center min-w-0">
              <p className={`text-[11px] sm:text-xs font-black truncate w-full ${tStyle.textPrimary}`}>
                {t.item_effect_none_name || "None"}
              </p>
              <span className="text-[9px] sm:text-[10px] font-extrabold mt-0.5 text-cyan-400/90 whitespace-nowrap">
                {equippedEffect === null ? (t.equippedText || "Equipped") : (t.tapToEquipText || "Tap to Equip")}
              </span>
            </div>
          </div>
        )}

        {itemsToRender.map((item) => {
          const isDefault = isDefaultItem(item.id);
          const isOwned = isDefault || ownedItemIds.includes(item.id);

          const isEquipped = (() => {
            if (activeCategory === 'effects') return equippedEffect === item.effectType;
            if (activeCategory === 'cardBacks') return equippedCardBackId === item.id;
            if (activeCategory === 'themes') return equippedThemeId === item.id;
            if (activeCategory === 'music') return equippedMusicId === item.id;
            return false;
          })();

          const isWatchingThis = watchingItemId === item.id;
          const isHighlighted = item.id === highlightItemId;

          const handleCardClick = () => {
            if (isHighlighted) {
              onClearHighlight?.();
            }

            if (isOwned) {
              synth.playSuccess();
              if (activeCategory === 'effects') {
                onEquipEffect(item.effectType || null);
              } else if (activeCategory === 'cardBacks') {
                onEquipCardBack(item.id);
              } else if (activeCategory === 'themes') {
                onEquipTheme(item.id);
              } else if (activeCategory === 'music') {
                onEquipMusic(item.id);
              }
            } else {
              if (item.id === 'effect_snow') {
                synth.playSelect();
              } else {
                handleWatchAdToUnlock(item);
              }
            }
          };

          const nameStr = (t as unknown as Record<string, string>)[item.nameKey] || item.id;

          return (
            <div 
              key={item.id}
              id={`shop-item-${item.id}`}
              onClick={handleCardClick}
              className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 flex flex-col justify-between items-center text-center cursor-pointer active:scale-95 active:translate-y-0 min-h-[112px] sm:min-h-[135px] h-auto relative overflow-hidden group -translate-y-[2px] hover:-translate-y-1.5 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/10 ${
                isHighlighted
                  ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-[#1b224c] animate-pulse shadow-[0_0_25px_rgba(245,158,11,0.85)] z-20 bg-[#25326d]'
                  : isEquipped
                    ? `${tStyle.itemCardEquipped} border-cyan-500/80 shadow-[0_8px_20px_-2px_rgba(6,182,212,0.35),0_4px_12px_rgba(0,0,0,0.35)]`
                    : isOwned
                      ? `${tStyle.itemCardUnequipped}`
                      : 'bg-[#151936]/80 hover:bg-[#1d234d]/95 border-amber-500/35 hover:border-amber-400/70 shadow-[0_6px_16px_-2px_rgba(0,0,0,0.35),0_2px_6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.45),0_4px_10px_rgba(0,0,0,0.3)]'
              }`}
            >
              {/* Top row badge */}
              <div className="w-full flex items-center justify-between text-[8px] sm:text-[9px] font-black uppercase tracking-wider gap-1">
                {isDefault ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                    {t.shopDefaultLabel || "DEFAULT"}
                  </span>
                ) : isOwned ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[8px] font-black whitespace-nowrap">
                    {t.unlockedText ? t.unlockedText.toUpperCase() : "UNLOCKED"}
                  </span>
                ) : item.id === 'effect_snow' ? (
                  <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[8px] font-black whitespace-nowrap">
                    {t.gentleSnowLockedShopBadge || "3 CLASSIC GAMES"}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[8px] flex items-center gap-0.5 shadow-sm whitespace-nowrap">
                    <Video className="w-2.5 h-2.5 shrink-0" /> {t.watchAdText ? t.watchAdText.toUpperCase() : "WATCH AD"}
                  </span>
                )}

                {isEquipped && (
                  <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Center Icon */}
              <div className="my-1 text-2xl sm:text-3xl select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>

              {/* Bottom Title & Action label */}
              <div className="w-full flex flex-col items-center min-w-0">
                <p className={`text-[11px] sm:text-xs font-black truncate w-full ${tStyle.textPrimary}`}>
                  {nameStr}
                </p>
                
                {isWatchingThis ? (
                  <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300 animate-pulse mt-0.5 whitespace-nowrap">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Loading Ad...</span>
                  </div>
                ) : isEquipped ? (
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-cyan-400/90 mt-0.5 whitespace-nowrap">
                    {t.equippedText || "Equipped"}
                  </span>
                ) : isOwned ? (
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 group-hover:text-slate-200 mt-0.5 whitespace-nowrap">
                    {t.tapToEquipText || "Tap to Equip"}
                  </span>
                ) : item.id === 'effect_snow' ? (
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-cyan-300 mt-0.5 whitespace-nowrap">
                    {t.gentleSnowLockedShopText || "Complete 3 Classic Games"}
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-amber-300 group-hover:text-amber-200 mt-0.5 flex items-center gap-1 whitespace-nowrap">
                    <Video className="w-3 h-3" /> {t.unlockText || "Unlock"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      id="shop-modal-backdrop"
      className={`absolute inset-0 bg-[#0d101b]/80 md:backdrop-blur-md backdrop-blur-none z-[100] flex items-center justify-center transition-all duration-300 p-2 sm:p-4 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      <div 
        id="shop-modal-content"
        className={`border-2 flex flex-col relative overflow-hidden transition-all duration-300 transform w-[96%] max-w-4xl h-[90%] max-h-[600px] rounded-3xl ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        } ${tStyle.dialogBg} ${tStyle.textPrimary}`}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />
        
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-white/10 relative z-10 p-3.5 sm:p-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white shadow-md p-1.5 sm:p-2">
              <Sparkles className="text-amber-300 animate-pulse w-4 h-4 sm:w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-indigo-400 to-amber-300 bg-clip-text text-transparent text-base sm:text-lg">
                {t.shopModalTitle || "Cosmetics Store"}
              </h2>
            </div>
          </div>
          
          <button
            id="btn-close-shop"
            onClick={() => { synth.playClose(); onClose(); }}
            className={`rounded-xl transition-all shadow-md cursor-pointer focus:outline-none ${tStyle.btnEquipped} p-1.5 sm:p-2 hover:scale-105 active:scale-95`}
            title={t.shopCloseButton || "Close"}
          >
            <X className="w-4 h-4 sm:w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Split layout: Sidebar for tabs, Content grid for items) */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative z-10">
          
          {/* Left Navigation Tabs Sidebar */}
          <div className={`border-r flex flex-col overflow-y-auto shrink-0 transition-all duration-300 ${tStyle.sidebarBg} border-white/10 w-[82px] sm:w-[160px] p-1.5 sm:p-3 gap-1.5 sm:gap-2`}>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              const labelText = (t as unknown as Record<string, string>)[cat.labelKey] || cat.id;
              return (
                <button
                  key={cat.id}
                  id={`btn-shop-tab-${cat.id}`}
                  onClick={() => {
                    synth.playSelect();
                    setActiveCategory(cat.id as ShopCategory);
                  }}
                  className={`w-full rounded-xl sm:rounded-2xl text-left font-extrabold flex items-center justify-between gap-1 transition-all cursor-pointer focus:outline-none relative border py-2 sm:py-3 px-1.5 sm:px-3 text-[10px] sm:text-xs ${
                    isSelected
                      ? `${tStyle.tabSelected} shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] font-black scale-[1.02]`
                      : `${tStyle.tabUnselected}`
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Icon className={`shrink-0 ${isSelected ? "text-cyan-400" : "text-slate-400"} w-3.5 h-3.5 sm:w-4 sm:h-4`} />
                    <span className="truncate leading-tight">{labelText}</span>
                  </div>
                  {isSelected && (
                    <div className="absolute right-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-l-md" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-5">
            {renderUnifiedItems()}
          </div>

        </div>
      </div>
    </div>
  );
};

