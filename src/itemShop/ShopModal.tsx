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
    dialogBg: 'bg-[#121838] border-2 border-[#5066c7]/60 shadow-xl',
    sidebarBg: 'bg-[#0f1430] border-r border-slate-700/50',
    tabSelected: 'bg-[#2b3778] border-[#546bbf] text-cyan-300 font-extrabold',
    tabUnselected: 'bg-[#141a38] hover:bg-[#1c244c] text-slate-300 hover:text-slate-100 border-transparent',
    itemCardEquipped: 'bg-[#25326d] border-2 border-cyan-400 text-slate-100',
    itemCardUnequipped: 'bg-[#182046] hover:bg-[#202956] border border-slate-700/60 text-slate-200',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-500/50 text-cyan-300',
    btnUnequipped: 'bg-[#2f3d80] hover:bg-[#384a9c] border border-[#546bbf]/40 text-slate-100',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
  },
  theme_spring: {
    dialogBg: 'bg-[#22121d] border-2 border-pink-500/50 shadow-xl',
    sidebarBg: 'bg-[#170c14] border-r border-pink-900/40',
    tabSelected: 'bg-[#9d3a5b] border-pink-400 text-pink-100 font-extrabold',
    tabUnselected: 'bg-[#261421] hover:bg-[#361c2e] text-pink-200/80 hover:text-pink-100 border-transparent',
    itemCardEquipped: 'bg-[#422036] border-2 border-emerald-400 text-pink-50',
    itemCardUnequipped: 'bg-[#2a1624] hover:bg-[#391e31] border border-pink-900/40 text-pink-100',
    btnEquipped: 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-300',
    btnUnequipped: 'bg-[#be4b73] hover:bg-[#d25881] border border-pink-400/30 text-white',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200/70',
  },
  theme_summer: {
    dialogBg: 'bg-[#241c10] border-2 border-amber-500/50 shadow-xl',
    sidebarBg: 'bg-[#140f09] border-r border-amber-900/40',
    tabSelected: 'bg-[#b45309] border-amber-400 text-amber-100 font-extrabold',
    tabUnselected: 'bg-[#241b0d] hover:bg-[#362914] text-amber-200/80 hover:text-amber-100 border-transparent',
    itemCardEquipped: 'bg-[#42331c] border-2 border-amber-400 text-amber-50',
    itemCardUnequipped: 'bg-[#2a2114] hover:bg-[#3a2d1b] border border-amber-900/40 text-amber-100',
    btnEquipped: 'bg-sky-950/60 border border-sky-400/50 text-sky-300',
    btnUnequipped: 'bg-[#d97706] hover:bg-[#f59e0b] border border-amber-400/30 text-slate-950 font-extrabold',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/70',
  },
  theme_autumn: {
    dialogBg: 'bg-[#22150c] border-2 border-orange-500/50 shadow-xl',
    sidebarBg: 'bg-[#140d07] border-r border-orange-900/40',
    tabSelected: 'bg-[#9a3412] border-orange-400 text-orange-100 font-extrabold',
    tabUnselected: 'bg-[#24150a] hover:bg-[#361f0e] text-orange-200/80 hover:text-orange-100 border-transparent',
    itemCardEquipped: 'bg-[#402616] border-2 border-orange-400 text-orange-50',
    itemCardUnequipped: 'bg-[#25170d] hover:bg-[#382314] border border-orange-900/40 text-orange-100',
    btnEquipped: 'bg-amber-950/60 border border-amber-500/50 text-amber-300',
    btnUnequipped: 'bg-[#c2410c] hover:bg-[#ea580c] border border-orange-400/30 text-white font-extrabold',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-200/70',
  },
  theme_winter: {
    dialogBg: 'bg-[#101b2a] border-2 border-sky-400/50 shadow-xl',
    sidebarBg: 'bg-[#09101a] border-r border-sky-900/40',
    tabSelected: 'bg-[#0369a1] border-sky-300 text-white font-extrabold',
    tabUnselected: 'bg-[#111d2e] hover:bg-[#1b2d47] text-sky-200/80 hover:text-sky-100 border-transparent',
    itemCardEquipped: 'bg-[#1e3047] border-2 border-sky-300 text-sky-50',
    itemCardUnequipped: 'bg-[#121d2b] hover:bg-[#1d2e45] border border-sky-900/40 text-sky-100',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300',
    btnUnequipped: 'bg-[#0284c7] hover:bg-[#38bdf8] border border-sky-300/30 text-slate-950 font-extrabold',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-200/70',
  },
  theme_ocean: {
    dialogBg: 'bg-[#0b1c2d] border-2 border-cyan-500/50 shadow-xl',
    sidebarBg: 'bg-[#06111c] border-r border-cyan-900/40',
    tabSelected: 'bg-[#0284c7] border-cyan-300 text-white font-extrabold',
    tabUnselected: 'bg-[#0e2033] hover:bg-[#16304d] text-cyan-200/80 hover:text-cyan-100 border-transparent',
    itemCardEquipped: 'bg-[#183552] border-2 border-cyan-300 text-cyan-50',
    itemCardUnequipped: 'bg-[#0d1e2f] hover:bg-[#16304a] border border-cyan-900/40 text-cyan-100',
    btnEquipped: 'bg-cyan-950/60 border border-cyan-400/50 text-cyan-300',
    btnUnequipped: 'bg-[#06b6d4] hover:bg-[#22d3ee] border border-cyan-300/30 text-slate-950 font-extrabold',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/70',
  },
  theme_desert: {
    dialogBg: 'bg-[#211710] border-2 border-amber-600/50 shadow-xl',
    sidebarBg: 'bg-[#130d09] border-r border-amber-900/40',
    tabSelected: 'bg-[#b45309] border-amber-400 text-amber-100 font-extrabold',
    tabUnselected: 'bg-[#241912] hover:bg-[#36251b] text-amber-200/80 hover:text-amber-100 border-transparent',
    itemCardEquipped: 'bg-[#402b1f] border-2 border-teal-400 text-amber-50',
    itemCardUnequipped: 'bg-[#261a13] hover:bg-[#38271d] border border-amber-900/40 text-amber-100',
    btnEquipped: 'bg-teal-950/60 border border-teal-400/50 text-teal-300',
    btnUnequipped: 'bg-[#d97706] hover:bg-[#f59e0b] border border-amber-400/30 text-white font-extrabold',
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-3 pb-1 sm:pb-2">
        {/* Special Default "None" option for Effects tab */}
        {activeCategory === 'effects' && (
          <div 
            id="shop-item-none"
            onClick={() => {
              synth.playSuccess();
              onEquipEffect(null);
            }}
            className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-colors duration-150 flex flex-col justify-between items-center text-center cursor-pointer min-h-[82px] sm:min-h-[135px] h-auto relative overflow-hidden group ${
              equippedEffect === null
                ? `${tStyle.itemCardEquipped}`
                : `${tStyle.itemCardUnequipped}`
            }`}
          >
            {/* Top row label */}
            <div className="w-full flex items-center justify-between text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider gap-1">
              <span className="px-1.5 py-0.25 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                {t.shopDefaultLabel || "DEFAULT"}
              </span>
              {equippedEffect === null ? (
                <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                  <Check className="w-3 h-3" />
                </span>
              ) : null}
            </div>

            {/* Icon */}
            <div className="my-0.5 sm:my-1 text-xl sm:text-3xl select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
              🚫
            </div>

            {/* Title & Action */}
            <div className="w-full flex flex-col items-center min-w-0">
              <p className={`text-[10px] sm:text-xs font-black truncate w-full ${tStyle.textPrimary}`}>
                {t.item_effect_none_name || "None"}
              </p>
              <span className="text-[8.5px] sm:text-[10px] font-extrabold mt-0.5 text-cyan-400/90 whitespace-nowrap">
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
              className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-colors duration-150 flex flex-col justify-between items-center text-center cursor-pointer min-h-[82px] sm:min-h-[135px] h-auto relative overflow-hidden group ${
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
              <div className="w-full flex items-center justify-between text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider gap-1">
                {isDefault ? (
                  <span className="px-1.5 py-0.25 rounded-full bg-slate-700/60 text-slate-300 border border-slate-600/40 whitespace-nowrap">
                    {t.shopDefaultLabel || "DEFAULT"}
                  </span>
                ) : isOwned ? (
                  item.isTemporary ? (
                    <span className="px-1.5 py-0.25 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[7.5px] font-black whitespace-nowrap">
                      ⏳ {Math.max(1, Math.ceil(getItemUnlockTimeLeft(item.id) / (3600 * 1000)))}H LEFT
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.25 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[7.5px] font-black whitespace-nowrap">
                      {t.unlockedText ? t.unlockedText.toUpperCase() : "UNLOCKED"}
                    </span>
                  )
                ) : item.id === 'effect_snow' ? (
                  <span className="px-1.5 py-0.25 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[7.5px] font-black whitespace-nowrap">
                    {t.gentleSnowLockedShopBadge || "3 CLASSIC GAMES"}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.25 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-[7.5px] flex items-center gap-0.5 shadow-sm whitespace-nowrap">
                    <Video className="w-2.5 h-2.5 shrink-0" /> {item.isTemporary ? "AD (48H)" : (t.watchAdText ? t.watchAdText.toUpperCase() : "WATCH AD")}
                  </span>
                )}

                {isEquipped && (
                  <span className="text-cyan-400 font-black flex items-center gap-0.5 shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Center Icon */}
              <div className="my-0.5 sm:my-1 text-xl sm:text-3xl select-none filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </div>

              {/* Bottom Title & Action label */}
              <div className="w-full flex flex-col items-center min-w-0">
                <p className={`text-[10px] sm:text-xs font-black truncate w-full ${tStyle.textPrimary}`}>
                  {nameStr}
                </p>
                
                {isWatchingThis ? (
                  <div className="flex items-center gap-1 text-[8.5px] sm:text-[10px] font-extrabold text-amber-300 animate-pulse mt-0.5 whitespace-nowrap">
                    <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    <span>{t.loadingAdText || "Loading Ad..."}</span>
                  </div>
                ) : isEquipped ? (
                  <span className="text-[8.5px] sm:text-[10px] font-extrabold text-cyan-400/90 mt-0.5 whitespace-nowrap">
                    {t.equippedText || "Equipped"}
                  </span>
                ) : isOwned ? (
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-slate-400 group-hover:text-slate-200 mt-0.5 whitespace-nowrap">
                    {t.tapToEquipText || "Tap to Equip"}
                  </span>
                ) : item.id === 'effect_snow' ? (
                  <span className="text-[8.5px] sm:text-[10px] font-extrabold text-cyan-300 mt-0.5 whitespace-nowrap">
                    {t.gentleSnowLockedShopText || "Complete 3 Classic Games"}
                  </span>
                ) : (
                  <span className="text-[8.5px] sm:text-[10px] font-extrabold text-amber-300 group-hover:text-amber-200 mt-0.5 flex items-center gap-1 whitespace-nowrap">
                    <Video className="w-2.5 h-2.5" /> {item.isTemporary ? "Unlock (48h)" : (t.unlockText || "Unlock")}
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
      className="fixed inset-0 bg-[#0d101b]/80 md:backdrop-blur-md backdrop-blur-none z-[140] flex items-center justify-center transition-all duration-300 p-1.5 sm:p-4 landscape:p-1.5 h-[100dvh] max-h-[100dvh] overflow-hidden"
      onClick={onClose}
    >
      <div 
        id="shop-modal-content"
        className={`border-2 flex flex-col relative overflow-hidden transition-all duration-300 transform w-[96%] max-w-4xl h-[95dvh] sm:h-[90dvh] max-h-[96dvh] rounded-2xl sm:rounded-3xl ${tStyle.dialogBg} ${tStyle.textPrimary}`}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />
        
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between border-b border-white/10 relative z-10 p-2.5 sm:p-4">
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

        {/* Modal Body (Responsive layout: Top tabs on portrait/mobile, Sidebar on sm/landscape) */}
        <div className={`flex-1 flex ${isMobileLandscape ? 'flex-row' : 'flex-col sm:flex-row'} overflow-hidden min-h-0 relative z-10`}>
          
          {/* Left/Top Navigation Tabs Bar */}
          <div className={`shrink-0 border-b ${isMobileLandscape ? 'border-b-0 border-r w-[145px] sm:w-[170px]' : 'border-b sm:border-b-0 sm:border-r w-full sm:w-[170px]'} border-white/10 transition-all duration-300 ${tStyle.sidebarBg} p-1 sm:p-3 overflow-x-auto sm:overflow-y-auto`}>
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
                    className={`w-full rounded-xl sm:rounded-2xl font-extrabold transition-colors cursor-pointer focus:outline-none relative border text-[10px] sm:text-xs ${
                      isMobileLandscape 
                        ? 'py-2.5 px-2.5 flex flex-row items-center justify-between text-left'
                        : 'py-1 sm:py-2.5 px-1 sm:px-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left'
                    } ${
                      isSelected
                        ? `${tStyle.tabSelected} font-black sm:scale-[1.01]`
                        : `${tStyle.tabUnselected}`
                    }`}
                  >
                    <div className={`flex ${isMobileLandscape ? 'flex-row' : 'flex-col sm:flex-row'} items-center gap-0.5 sm:gap-2 min-w-0 w-full sm:w-auto justify-center sm:justify-start`}>
                      <Icon className={`shrink-0 ${isSelected ? "text-cyan-400" : "text-slate-400"} w-3.5 h-3.5 sm:w-4 sm:h-4`} />
                      <span className="leading-tight text-[10px] sm:text-xs font-bold sm:font-black tracking-tight text-center sm:text-left break-words sm:truncate w-full sm:w-auto">
                        {labelText}
                      </span>
                    </div>

                    {isSelected && (
                      <>
                        {/* Horizontal bottom indicator bar for top tabs in portrait */}
                        {!isMobileLandscape && (
                          <div className="absolute bottom-0 inset-x-1.5 h-0.5 bg-cyan-400 rounded-t-md sm:hidden" />
                        )}
                        {/* Vertical right indicator bar for left sidebar in landscape/sm */}
                        <div className={`absolute right-0 top-1/4 bottom-1/4 w-1 bg-cyan-400 rounded-l-md ${isMobileLandscape ? 'block' : 'hidden sm:block'}`} />
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Panel */}
          <div className="flex-1 overflow-y-auto p-1.5 sm:p-5">
            {renderUnifiedItems()}
          </div>

        </div>
      </div>
    </div>
  );
};

