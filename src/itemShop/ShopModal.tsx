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
import { getInventoryState, unlockItem, getItemUnlockTimeLeft } from './inventory';
import { adManager } from '../ads/AdManager';
import { PanelBackground } from '../components/PanelBackground';
import { GameViewportFrame } from '../components/engine/GameViewportFrame';
import { RoyalPanelFrame } from '../components/engine/RoyalPanelFrame';

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
    dialogBg: 'bg-[#121838]',
    sidebarBg: 'bg-[#090e24]/90 border-slate-800/80',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#182352]/70 hover:bg-[#202e6b] text-slate-200 hover:text-white border border-[#3f509d]/40 font-bold',
    itemCardEquipped: 'bg-[#25326d] border-2 border-cyan-400 text-slate-100 shadow-[0_0_12px_rgba(34,211,238,0.25)]',
    itemCardUnequipped: 'bg-[#182352]/70 hover:bg-[#202e6b] border border-[#485da6]/40 text-slate-200',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300',
    btnUnequipped: 'bg-[#28346e] hover:bg-[#32418a] border border-[#546bbf]/40 text-slate-100',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
  },
  theme_spring: {
    dialogBg: 'bg-[#22121d]',
    sidebarBg: 'bg-[#140a12]/90 border-pink-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#2f1828]/70 hover:bg-[#3f2036] text-pink-200 hover:text-white border border-pink-700/40 font-bold',
    itemCardEquipped: 'bg-[#4a223c] border-2 border-pink-400 text-pink-50 shadow-[0_0_12px_rgba(244,114,182,0.25)]',
    itemCardUnequipped: 'bg-[#2d1727]/70 hover:bg-[#3f2036] border border-pink-700/40 text-pink-100',
    btnEquipped: 'bg-pink-950/60 border border-pink-500/50 text-pink-300',
    btnUnequipped: 'bg-[#be4b73] hover:bg-[#d25881] border border-pink-400/40 text-white',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200/70',
  },
  theme_summer: {
    dialogBg: 'bg-[#241c10]',
    sidebarBg: 'bg-[#140f08]/90 border-amber-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#31230e]/70 hover:bg-[#433013] text-amber-200 hover:text-white border border-amber-600/40 font-bold',
    itemCardEquipped: 'bg-[#4d3817] border-2 border-amber-400 text-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.25)]',
    itemCardUnequipped: 'bg-[#2e200c]/70 hover:bg-[#433013] border border-amber-700/40 text-amber-100',
    btnEquipped: 'bg-sky-950/60 border border-sky-400/50 text-sky-300',
    btnUnequipped: 'bg-[#d97706] hover:bg-[#f59e0b] border border-amber-400/40 text-slate-950 font-extrabold',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
  },
  theme_autumn: {
    dialogBg: 'bg-[#22150c]',
    sidebarBg: 'bg-[#130b05]/90 border-orange-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#311c0c]/70 hover:bg-[#452711] text-orange-200 hover:text-white border border-orange-600/40 font-bold',
    itemCardEquipped: 'bg-[#4b270f] border-2 border-orange-400 text-orange-50 shadow-[0_0_12px_rgba(251,146,60,0.25)]',
    itemCardUnequipped: 'bg-[#2d180a]/70 hover:bg-[#452711] border border-orange-700/40 text-orange-100',
    btnEquipped: 'bg-amber-950/60 border border-amber-500/50 text-amber-300',
    btnUnequipped: 'bg-[#c2410c] hover:bg-[#ea580c] border border-orange-400/40 text-white font-extrabold',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-200/70',
  },
  theme_winter: {
    dialogBg: 'bg-[#101b2a]',
    sidebarBg: 'bg-[#080e18]/90 border-sky-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#16273c]/70 hover:bg-[#1e3552] text-sky-200 hover:text-white border border-sky-600/40 font-bold',
    itemCardEquipped: 'bg-[#203958] border-2 border-sky-300 text-sky-50 shadow-[0_0_12px_rgba(125,211,252,0.25)]',
    itemCardUnequipped: 'bg-[#142336]/70 hover:bg-[#1e3552] border border-sky-700/40 text-sky-100',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300',
    btnUnequipped: 'bg-[#0284c7] hover:bg-[#38bdf8] border border-sky-300/40 text-slate-950 font-extrabold',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-200/70',
  },
  theme_ocean: {
    dialogBg: 'bg-[#0b1c2d]',
    sidebarBg: 'bg-[#050f19]/90 border-cyan-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#102a43]/70 hover:bg-[#15395b] text-cyan-200 hover:text-white border border-cyan-600/40 font-bold',
    itemCardEquipped: 'bg-[#173e63] border-2 border-cyan-300 text-cyan-50 shadow-[0_0_12px_rgba(34,211,238,0.25)]',
    itemCardUnequipped: 'bg-[#0d2338]/70 hover:bg-[#15395b] border border-cyan-700/40 text-cyan-100',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300',
    btnUnequipped: 'bg-[#06b6d4] hover:bg-[#22d3ee] border border-cyan-300/40 text-slate-950 font-extrabold',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/70',
  },
  theme_desert: {
    dialogBg: 'bg-[#211710]',
    sidebarBg: 'bg-[#120c08]/90 border-amber-900/40',
    tabSelected: 'bg-amber-400 text-slate-950 border-transparent font-black shadow-none',
    tabUnselected: 'bg-[#332215]/70 hover:bg-[#48301d] text-amber-200 hover:text-white border border-amber-600/40 font-bold',
    itemCardEquipped: 'bg-[#4e321e] border-2 border-amber-400 text-amber-50 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    itemCardUnequipped: 'bg-[#2d1c10]/70 hover:bg-[#48301d] border border-amber-700/40 text-amber-100',
    btnEquipped: 'bg-teal-950/60 border border-teal-400/50 text-teal-300',
    btnUnequipped: 'bg-[#d97706] hover:bg-[#f59e0b] border border-amber-400/40 text-white font-extrabold',
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
  isMobileLandscape = false,
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

  if (!isOpen) return null;

  const handleWatchAdToUnlock = (item: CosmeticItem) => {
    if (watchingItemId) return;
    setWatchingItemId(item.id);
    synth.playSelect();

    let handled = false;
    const onSuccess = () => {
      if (handled) return;
      handled = true;
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

    setWatchingItemId(item.id);
    synth.playSelect();

    adManager.showRewardedAd()
      .then((withReward: boolean) => {
        setWatchingItemId(null);
        if (withReward) {
          onSuccess();
        }
      })
      .catch((err: any) => {
        setWatchingItemId(null);
        console.warn('Rewarded ad error in Shop:', err);
      });
  };

  const renderUnifiedItems = () => {
    const itemsToRender = [...filteredItems];
    
    return (
      <div className={`grid ${
        isMobileLandscape 
          ? 'grid-cols-4 gap-1.5' 
          : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3'
      } pb-1 sm:pb-2`}>
        {/* Special Default "None" option for Effects tab */}
        {activeCategory === 'effects' && (
          <div 
            id="shop-item-none"
            onClick={() => {
              synth.playSuccess();
              onEquipEffect(null);
            }}
            className={`rounded-xl sm:rounded-2xl border transition-colors duration-150 flex flex-col justify-between items-center text-center cursor-pointer h-auto relative overflow-hidden group ${
              isMobileLandscape 
                ? 'p-1.5 min-h-[64px]' 
                : 'p-2 sm:p-3.5 min-h-[82px] sm:min-h-[135px]'
            } ${
              equippedEffect === null
                ? `${tStyle.itemCardEquipped}`
                : `${tStyle.itemCardUnequipped}`
            }`}
          >
            {/* Top row label */}
            <div className={`w-full flex items-center justify-between ${isMobileLandscape ? 'text-[6.5px] sm:text-[7.5px]' : 'text-[7.5px] sm:text-[9px]'} font-black uppercase tracking-wider gap-0.5 sm:gap-1`}>
              <span className="px-1.5 py-0.25 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                {t.shopDefaultLabel || "DEFAULT"}
              </span>
              {equippedEffect === null ? (
                <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                  <Check className={isMobileLandscape ? "w-2.5 h-2.5" : "w-3 h-3"} />
                </span>
              ) : null}
            </div>

            {/* Icon */}
            <div className={`${isMobileLandscape ? 'my-0 text-base sm:text-xl' : 'my-0.5 sm:my-1 text-xl sm:text-3xl'} select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200`}>
              🚫
            </div>

            {/* Title & Action */}
            <div className="w-full flex flex-col items-center min-w-0">
              <p className={`${isMobileLandscape ? 'text-[8.5px] sm:text-[10px]' : 'text-[10px] sm:text-xs'} font-black truncate w-full ${tStyle.textPrimary}`}>
                {t.item_effect_none_name || "None"}
              </p>
              <span className={`${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px] mt-0' : 'text-[8.5px] sm:text-[10px] mt-0.5'} font-extrabold text-cyan-400/90 whitespace-nowrap`}>
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
              className={`rounded-xl sm:rounded-2xl border transition-colors duration-150 flex flex-col justify-between items-center text-center cursor-pointer h-auto relative overflow-hidden group ${
                isMobileLandscape 
                  ? 'p-1.5 min-h-[64px]' 
                  : 'p-2 sm:p-3.5 min-h-[82px] sm:min-h-[135px]'
              } ${
                isHighlighted
                  ? 'ring-2 ring-amber-400 border-amber-300 z-20 bg-[#25326d]'
                  : isEquipped
                    ? `${tStyle.itemCardEquipped}`
                    : isOwned
                      ? `${tStyle.itemCardUnequipped}`
                      : 'bg-[#151936] hover:bg-[#1d234d] border-amber-500/35 hover:border-amber-400/70'
              }`}
            >
              {/* Top row badge */}
              <div className={`w-full flex items-center justify-between ${isMobileLandscape ? 'text-[6.5px] sm:text-[7.5px]' : 'text-[7.5px] sm:text-[9px]'} font-black uppercase tracking-wider gap-0.5 sm:gap-1`}>
                {isDefault ? (
                  <span className="px-1.5 py-0.25 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                    {t.shopDefaultLabel || "DEFAULT"}
                  </span>
                ) : isOwned ? (
                  item.isTemporary ? (
                    <span className="px-1.5 py-0.25 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[7px] sm:text-[7.5px] font-black whitespace-nowrap">
                      ⏳ {Math.max(1, Math.ceil(getItemUnlockTimeLeft(item.id) / (3600 * 1000)))}H
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.25 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[7px] sm:text-[7.5px] font-black whitespace-nowrap">
                      {t.unlockedText ? t.unlockedText.toUpperCase() : "UNLOCKED"}
                    </span>
                  )
                ) : item.id === 'effect_snow' ? (
                  <span className="px-1.5 py-0.25 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[7px] sm:text-[7.5px] font-black whitespace-nowrap">
                    {t.gentleSnowLockedShopBadge || "3 CLASSIC"}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.25 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[7px] sm:text-[7.5px] flex items-center gap-0.5 shadow-sm whitespace-nowrap">
                    <Video className="w-2 h-2 sm:w-2.5 sm:h-2.5 shrink-0" /> {item.isTemporary ? "AD (48H)" : (t.watchAdText ? t.watchAdText.toUpperCase() : "AD")}
                  </span>
                )}

                {isEquipped && (
                  <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                    <Check className={isMobileLandscape ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} />
                  </span>
                )}
              </div>

              {/* Center Icon */}
              <div className={`${isMobileLandscape ? 'my-0 text-base sm:text-xl' : 'my-0.5 sm:my-1 text-xl sm:text-3xl'} select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                {item.icon}
              </div>

              {/* Bottom Title & Action label */}
              <div className="w-full flex flex-col items-center min-w-0">
                <p className={`${isMobileLandscape ? 'text-[8.5px] sm:text-[10px]' : 'text-[10px] sm:text-xs'} font-black truncate w-full ${tStyle.textPrimary}`}>
                  {nameStr}
                </p>
                
                {isWatchingThis ? (
                  <div className={`flex items-center gap-1 ${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px]' : 'text-[8.5px] sm:text-[10px]'} font-extrabold text-amber-300 animate-pulse mt-0.5 whitespace-nowrap`}>
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>{t.loadingAdText || "Loading..."}</span>
                  </div>
                ) : isEquipped ? (
                  <span className={`${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px] mt-0' : 'text-[8.5px] sm:text-[10px] mt-0.5'} font-extrabold text-cyan-400/90 whitespace-nowrap`}>
                    {t.equippedText || "Equipped"}
                  </span>
                ) : isOwned ? (
                  <span className={`${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px] mt-0' : 'text-[8.5px] sm:text-[10px] mt-0.5'} font-bold text-slate-400 group-hover:text-slate-200 whitespace-nowrap`}>
                    {t.tapToEquipText || "Tap to Equip"}
                  </span>
                ) : item.id === 'effect_snow' ? (
                  <span className={`${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px] mt-0' : 'text-[8.5px] sm:text-[10px] mt-0.5'} font-extrabold text-cyan-300 whitespace-nowrap`}>
                    {t.gentleSnowLockedShopText || "3 Classic Games"}
                  </span>
                ) : (
                  <span className={`${isMobileLandscape ? 'text-[7.5px] sm:text-[8.5px] mt-0' : 'text-[8.5px] sm:text-[10px] mt-0.5'} font-extrabold text-amber-300 group-hover:text-amber-200 flex items-center gap-0.5 sm:gap-1 whitespace-nowrap`}>
                    <Video className="w-2 h-2 sm:w-2.5 sm:h-2.5" /> {item.isTemporary ? "Unlock (48h)" : (t.unlockText || "Unlock")}
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
      className="fixed inset-0 bg-slate-950/80 md:backdrop-blur-md backdrop-blur-none z-[140] flex items-center justify-center transition-all duration-300 p-1 sm:p-4 landscape:p-1.5 h-[100dvh] max-h-[100dvh] overflow-hidden select-none"
      onClick={onClose}
    >
      <div 
        id="shop-modal-content"
        className={`relative z-10 w-[98%] sm:w-[96%] max-w-4xl h-[96dvh] sm:h-[90dvh] max-h-[98dvh] flex flex-col items-center justify-center animate-scale-up ${tStyle.textPrimary}`}
        onClick={(e) => e.stopPropagation()}
      >
        <RoyalPanelFrame
          title={t.shopModalTitle || "COSMETICS STORE"}
          ribbonIcon={<Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-950 animate-pulse" />}
          ribbonColor="gold"
          showCrown={false}
          onClose={() => { synth.playClose(); onClose(); }}
          closeTitle={t.shopCloseButton || "Close"}
          className="w-full h-full max-h-full"
        >
          {/* Modal Body (Responsive layout: Top tabs on portrait/mobile, Sidebar on sm/landscape) */}
          <div className={`flex-1 flex ${isMobileLandscape ? 'flex-row' : 'flex-col sm:flex-row'} overflow-hidden min-h-0 relative z-10 pt-1 sm:pt-2`}>
            
            {/* Navigation Tabs Bar */}
            <div className={`shrink-0 border-b ${isMobileLandscape ? 'border-b-0 border-r w-[130px] sm:w-[155px] p-1.5 sm:p-2' : 'border-b sm:border-b-0 sm:border-r w-full sm:w-[170px] p-1.5 sm:p-3'} border-amber-400/20 transition-all duration-300 ${tStyle.sidebarBg} overflow-x-auto sm:overflow-y-auto custom-scrollbar`}>
              <div className={`${isMobileLandscape ? 'flex flex-col' : 'grid grid-cols-4 sm:flex sm:flex-col'} gap-1 sm:gap-2 w-full`}>
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
                      className={`w-full rounded-xl sm:rounded-2xl transition-all cursor-pointer focus:outline-none relative border text-[10px] sm:text-xs ${
                        isMobileLandscape 
                          ? 'py-2 px-2 flex flex-row items-center justify-start text-left'
                          : 'py-1 sm:py-2.5 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left'
                      } ${
                        isSelected
                          ? `${tStyle.tabSelected} font-black shadow-md`
                          : `${tStyle.tabUnselected}`
                      }`}
                    >
                      <div className={`flex ${isMobileLandscape ? 'flex-row' : 'flex-col sm:flex-row'} items-center gap-1 sm:gap-2 min-w-0 w-full sm:w-auto justify-center sm:justify-start`}>
                        <Icon className={`shrink-0 ${isSelected ? "text-slate-950" : "text-amber-400/80"} w-3.5 h-3.5 sm:w-4 sm:h-4`} />
                        <span className={`leading-tight text-[9.5px] sm:text-xs tracking-tight ${isSelected ? "text-slate-950 font-black" : "text-slate-200 font-bold"} text-center sm:text-left break-words sm:truncate w-full sm:w-auto`}>
                          {labelText}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content Panel */}
            <div className={`flex-1 overflow-y-auto ${isMobileLandscape ? 'p-1.5 sm:p-2' : 'p-2 sm:p-4'} custom-scrollbar`}>
              {renderUnifiedItems()}
            </div>

          </div>
        </RoyalPanelFrame>
      </div>
    </div>
  );
};

