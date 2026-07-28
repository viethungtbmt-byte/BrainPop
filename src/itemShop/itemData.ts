import { CosmeticItem } from './itemTypes';

export const COSMETIC_ITEMS: CosmeticItem[] = [
  {
    id: 'effect_snow',
    nameKey: 'item_effect_snow_name',
    descriptionKey: 'item_effect_snow_desc',
    type: 'effect',
    effectType: 'snow',
    price: 100,
    rarity: 'common',
    icon: '❄️'
  },
  {
    id: 'effect_autumn',
    nameKey: 'item_effect_autumn_name',
    descriptionKey: 'item_effect_autumn_desc',
    type: 'effect',
    effectType: 'autumn',
    price: 120,
    rarity: 'common',
    icon: '🍂'
  },
  {
    id: 'effect_fireflies',
    nameKey: 'item_effect_fireflies_name',
    descriptionKey: 'item_effect_fireflies_desc',
    type: 'effect',
    effectType: 'fireflies',
    price: 250,
    rarity: 'epic',
    icon: '✨'
  },
  {
    id: 'effect_hearts',
    nameKey: 'item_effect_hearts_name',
    descriptionKey: 'item_effect_hearts_desc',
    type: 'effect',
    effectType: 'hearts',
    price: 200,
    rarity: 'epic',
    icon: '💖'
  },
  {
    id: 'effect_bubbles',
    nameKey: 'item_effect_bubbles_name',
    descriptionKey: 'item_effect_bubbles_desc',
    type: 'effect',
    effectType: 'bubbles',
    price: 180,
    rarity: 'rare',
    icon: '🫧'
  },
  {
    id: 'effect_stars',
    nameKey: 'item_effect_stars_name',
    descriptionKey: 'item_effect_stars_desc',
    type: 'effect',
    effectType: 'stars',
    price: 300,
    rarity: 'legendary',
    icon: '⭐'
  },
  {
    id: 'effect_confetti',
    nameKey: 'item_effect_confetti_name',
    descriptionKey: 'item_effect_confetti_desc',
    type: 'effect',
    category: 'effect',
    effectType: 'confetti',
    price: 350,
    rarity: 'legendary',
    icon: '🎉'
  },
  // CARD BACKS
  {
    id: 'cardback_circle',
    nameKey: 'item_cardback_circle_name',
    descriptionKey: 'item_cardback_circle_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'common',
    icon: '⭕'
  },
  {
    id: 'cardback_triangle',
    nameKey: 'item_cardback_triangle_name',
    descriptionKey: 'item_cardback_triangle_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'rare',
    icon: '🔺'
  },
  {
    id: 'cardback_star',
    nameKey: 'item_cardback_star_name',
    descriptionKey: 'item_cardback_star_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'epic',
    icon: '⭐'
  },
  {
    id: 'cardback_question_mark',
    nameKey: 'item_cardback_question_mark_name',
    descriptionKey: 'item_cardback_question_mark_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'rare',
    icon: '❓'
  },
  {
    id: 'cardback_cross',
    nameKey: 'item_cardback_cross_name',
    descriptionKey: 'item_cardback_cross_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'epic',
    icon: '➕'
  },
  {
    id: 'cardback_diamond',
    nameKey: 'item_cardback_diamond_name',
    descriptionKey: 'item_cardback_diamond_desc',
    type: 'cardBack',
    category: 'cardBack',
    price: 0,
    rarity: 'legendary',
    icon: '🔷'
  },
  // THEMES
  {
    id: 'theme_midnight_blue',
    nameKey: 'item_theme_midnight_blue_name',
    descriptionKey: 'item_theme_midnight_blue_desc',
    type: 'theme',
    category: 'theme',
    price: 0,
    rarity: 'common',
    icon: '🌌'
  },
  {
    id: 'theme_spring',
    nameKey: 'item_theme_spring_name',
    descriptionKey: 'item_theme_spring_desc',
    type: 'theme',
    category: 'theme',
    price: 150,
    rarity: 'rare',
    icon: '🌸'
  },
  {
    id: 'theme_summer',
    nameKey: 'item_theme_summer_name',
    descriptionKey: 'item_theme_summer_desc',
    type: 'theme',
    category: 'theme',
    price: 150,
    rarity: 'rare',
    icon: '☀️'
  },
  {
    id: 'theme_autumn',
    nameKey: 'item_theme_autumn_name',
    descriptionKey: 'item_theme_autumn_desc',
    type: 'theme',
    category: 'theme',
    price: 150,
    rarity: 'rare',
    icon: '🍂'
  },
  {
    id: 'theme_winter',
    nameKey: 'item_theme_winter_name',
    descriptionKey: 'item_theme_winter_desc',
    type: 'theme',
    category: 'theme',
    price: 150,
    rarity: 'rare',
    icon: '❄️'
  },
  {
    id: 'theme_ocean',
    nameKey: 'item_theme_ocean_name',
    descriptionKey: 'item_theme_ocean_desc',
    type: 'theme',
    category: 'theme',
    price: 200,
    rarity: 'epic',
    icon: '🌊'
  },
  {
    id: 'theme_desert',
    nameKey: 'item_theme_desert_name',
    descriptionKey: 'item_theme_desert_desc',
    type: 'theme',
    category: 'theme',
    price: 200,
    rarity: 'epic',
    icon: '🏜️'
  },
  // MUSIC PACKS
  {
    id: 'music_none',
    nameKey: 'item_music_none_name',
    descriptionKey: 'item_music_none_desc',
    type: 'music',
    category: 'music',
    price: 0,
    rarity: 'common',
    icon: '🔇',
    preview: 'none',
    equipped: true,
    owned: true,
    locked: false
  },
  {
    id: 'music_ocean_breeze',
    nameKey: 'item_music_ocean_breeze_name',
    descriptionKey: 'item_music_ocean_breeze_desc',
    type: 'music',
    category: 'music',
    price: 0,
    rarity: 'rare',
    icon: '🌊',
    preview: 'ocean',
    equipped: false,
    owned: true,
    locked: false
  },
  {
    id: 'music_cozy_rain',
    nameKey: 'item_music_cozy_rain_name',
    descriptionKey: 'item_music_cozy_rain_desc',
    type: 'music',
    category: 'music',
    price: 0,
    rarity: 'rare',
    icon: '🌧️',
    preview: 'rain',
    equipped: false,
    owned: true,
    locked: false
  },
  {
    id: 'music_relaxing_piano',
    nameKey: 'item_music_relaxing_piano_name',
    descriptionKey: 'item_music_relaxing_piano_desc',
    type: 'music',
    category: 'music',
    price: 0,
    rarity: 'common',
    icon: '🎹',
    preview: 'piano',
    equipped: false,
    owned: true,
    locked: false
  },
  {
    id: 'music_wellerman',
    nameKey: 'item_music_wellerman_name',
    descriptionKey: 'item_music_wellerman_desc',
    type: 'music',
    category: 'music',
    price: 0,
    rarity: 'epic',
    icon: '⛵',
    preview: 'wellerman',
    equipped: false,
    owned: false,
    locked: true
  }
];
