export interface ThemeStyle {
  sidebar: string;
  dialogBg: string;
  buttonPrimary: string;
  buttonSecondary: string;
  accentText: string;
  borderAccent: string;
  highlightRing: string;
  accentBg: string;
  sidebarText: string;
  textMuted: string;
  textPrimary: string;
  textSecondary: string;
  cardBg: string;
  cardBorder: string;
  viewportBg: string;
  boardBg: string;
  boardGridColor: string;
  boardRadialOverlay: string;
  boardBorder: string;
}

export const THEME_STYLES: Record<string, ThemeStyle> = {
  theme_midnight_blue: {
    sidebar: 'bg-[#121633]/90 border-slate-700/40',
    dialogBg: 'bg-[#1a1f3c]/95 border-slate-600/40',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
    buttonSecondary: 'bg-[#2b3775] hover:bg-[#34448e] text-slate-200 border border-[#546bbf]/40',
    accentText: 'text-cyan-400',
    borderAccent: 'border-cyan-500/40',
    highlightRing: 'ring-cyan-500/30',
    accentBg: 'bg-cyan-500',
    sidebarText: 'text-indigo-200',
    textMuted: 'text-slate-400',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    cardBg: 'bg-[#1e2552]/60',
    cardBorder: 'border-[#3f509d]/40',
    viewportBg: 'bg-gradient-to-tr from-[#0e122b] via-[#1a214d] to-[#151a3d]',
    boardBg: 'radial-gradient(ellipse at top, #1e2858 0%, #101636 60%, #0a0e24 100%)',
    boardGridColor: '#38bdf8',
    boardRadialOverlay: 'from-cyan-400/20 to-transparent',
    boardBorder: 'border-[#3f509d]/60 shadow-[0_16px_40px_rgba(10,14,35,0.5)]',
  },
  theme_spring: {
    sidebar: 'bg-[#1e141b]/95 border-pink-900/40',
    dialogBg: 'bg-[#271822]/95 border-pink-500/30',
    buttonPrimary: 'bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-600/30',
    buttonSecondary: 'bg-[#2e3b32] hover:bg-[#394a3f] text-emerald-100 border border-emerald-500/30',
    accentText: 'text-emerald-400',
    borderAccent: 'border-pink-500/40',
    highlightRing: 'ring-emerald-400/40',
    accentBg: 'bg-pink-500',
    sidebarText: 'text-pink-200',
    textMuted: 'text-pink-300/60',
    textPrimary: 'text-pink-50',
    textSecondary: 'text-pink-200/80',
    cardBg: 'bg-[#351e2c]/60',
    cardBorder: 'border-pink-500/30',
    viewportBg: 'bg-gradient-to-tr from-[#1c1018] via-[#2d1828] to-[#22121e]',
    boardBg: 'radial-gradient(ellipse at top, #3e2034 0%, #251320 60%, #161f1a 100%)',
    boardGridColor: '#f472b6',
    boardRadialOverlay: 'from-pink-400/25 via-emerald-400/10 to-transparent',
    boardBorder: 'border-pink-500/50 shadow-[0_16px_40px_rgba(40,15,30,0.5)]',
  },
  theme_summer: {
    sidebar: 'bg-[#1c1810]/95 border-amber-800/40',
    dialogBg: 'bg-[#292215]/95 border-amber-500/30',
    buttonPrimary: 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold shadow-lg shadow-amber-500/25',
    buttonSecondary: 'bg-[#193247] hover:bg-[#20425e] text-sky-200 border border-sky-400/30',
    accentText: 'text-amber-400',
    borderAccent: 'border-amber-500/40',
    highlightRing: 'ring-amber-400/40',
    accentBg: 'bg-amber-500',
    sidebarText: 'text-amber-200',
    textMuted: 'text-amber-300/60',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/80',
    cardBg: 'bg-[#3a2f1b]/60',
    cardBorder: 'border-amber-500/30',
    viewportBg: 'bg-gradient-to-tr from-[#1a150b] via-[#2d2212] to-[#20180d]',
    boardBg: 'radial-gradient(ellipse at top, #423218 0%, #261c0d 60%, #10212e 100%)',
    boardGridColor: '#fbbf24',
    boardRadialOverlay: 'from-amber-400/25 via-sky-400/10 to-transparent',
    boardBorder: 'border-amber-500/50 shadow-[0_16px_40px_rgba(40,30,10,0.5)]',
  },
  theme_autumn: {
    sidebar: 'bg-[#18110b]/95 border-orange-900/40',
    dialogBg: 'bg-[#241910]/95 border-orange-600/30',
    buttonPrimary: 'bg-orange-600 hover:bg-orange-500 text-white font-extrabold shadow-lg shadow-orange-600/25',
    buttonSecondary: 'bg-[#382518] hover:bg-[#473020] text-amber-200 border border-amber-600/30',
    accentText: 'text-orange-400',
    borderAccent: 'border-orange-500/40',
    highlightRing: 'ring-orange-400/40',
    accentBg: 'bg-orange-500',
    sidebarText: 'text-orange-200',
    textMuted: 'text-orange-300/60',
    textPrimary: 'text-orange-50',
    textSecondary: 'text-orange-200/80',
    cardBg: 'bg-[#382618]/60',
    cardBorder: 'border-orange-600/30',
    viewportBg: 'bg-gradient-to-tr from-[#170e07] via-[#2c190d] to-[#1e1108]',
    boardBg: 'radial-gradient(ellipse at top, #3d1f0d 0%, #261207 60%, #170b04 100%)',
    boardGridColor: '#fb923c',
    boardRadialOverlay: 'from-orange-500/25 via-amber-500/10 to-transparent',
    boardBorder: 'border-orange-600/50 shadow-[0_16px_40px_rgba(35,15,5,0.5)]',
  },
  theme_winter: {
    sidebar: 'bg-[#0c131d]/95 border-sky-900/40',
    dialogBg: 'bg-[#121c2b]/95 border-sky-500/30',
    buttonPrimary: 'bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold shadow-lg shadow-sky-500/25',
    buttonSecondary: 'bg-[#1e2e42] hover:bg-[#283d57] text-sky-200 border border-sky-400/30',
    accentText: 'text-sky-300',
    borderAccent: 'border-sky-400/40',
    highlightRing: 'ring-sky-400/40',
    accentBg: 'bg-sky-400',
    sidebarText: 'text-sky-200',
    textMuted: 'text-sky-300/60',
    textPrimary: 'text-sky-50',
    textSecondary: 'text-sky-200/80',
    cardBg: 'bg-[#1d2d42]/60',
    cardBorder: 'border-sky-500/30',
    viewportBg: 'bg-gradient-to-tr from-[#09111c] via-[#122033] to-[#0c1624]',
    boardBg: 'radial-gradient(ellipse at top, #142a42 0%, #0c1a2b 60%, #060e17 100%)',
    boardGridColor: '#38bdf8',
    boardRadialOverlay: 'from-sky-300/25 via-cyan-300/10 to-transparent',
    boardBorder: 'border-sky-400/50 shadow-[0_16px_40px_rgba(10,25,45,0.5)]',
  },
  theme_ocean: {
    sidebar: 'bg-[#091522]/95 border-cyan-800/40',
    dialogBg: 'bg-[#0e2033]/95 border-cyan-500/30',
    buttonPrimary: 'bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30',
    buttonSecondary: 'bg-[#16354d] hover:bg-[#1d4463] text-cyan-100 border border-cyan-400/30',
    accentText: 'text-cyan-300',
    borderAccent: 'border-cyan-500/40',
    highlightRing: 'ring-cyan-400/40',
    accentBg: 'bg-cyan-500',
    sidebarText: 'text-cyan-200',
    textMuted: 'text-cyan-300/60',
    textPrimary: 'text-cyan-50',
    textSecondary: 'text-cyan-200/80',
    cardBg: 'bg-[#142e47]/60',
    cardBorder: 'border-cyan-500/30',
    viewportBg: 'bg-gradient-to-tr from-[#06121f] via-[#0d2238] to-[#081829]',
    boardBg: 'radial-gradient(ellipse at top, #0c2d45 0%, #071c2c 60%, #030e17 100%)',
    boardGridColor: '#22d3ee',
    boardRadialOverlay: 'from-cyan-400/25 via-teal-400/10 to-transparent',
    boardBorder: 'border-cyan-500/50 shadow-[0_16px_40px_rgba(5,25,40,0.5)]',
  },
  theme_desert: {
    sidebar: 'bg-[#17110d]/95 border-amber-900/40',
    dialogBg: 'bg-[#251b14]/95 border-amber-600/30',
    buttonPrimary: 'bg-[#d97706] hover:bg-[#b45309] text-white font-extrabold shadow-lg shadow-amber-600/25',
    buttonSecondary: 'bg-[#1e3230] hover:bg-[#274240] text-teal-200 border border-teal-500/30',
    accentText: 'text-teal-300',
    borderAccent: 'border-amber-600/40',
    highlightRing: 'ring-teal-400/40',
    accentBg: 'bg-[#d97706]',
    sidebarText: 'text-amber-200',
    textMuted: 'text-amber-300/60',
    textPrimary: 'text-amber-50',
    textSecondary: 'text-amber-200/80',
    cardBg: 'bg-[#38281d]/60',
    cardBorder: 'border-amber-600/30',
    viewportBg: 'bg-gradient-to-tr from-[#170f0a] via-[#2c1b0e] to-[#1c120a]',
    boardBg: 'radial-gradient(ellipse at top, #3a2010 0%, #24130a 60%, #0e1e1c 100%)',
    boardGridColor: '#f59e0b',
    boardRadialOverlay: 'from-amber-500/25 via-teal-400/10 to-transparent',
    boardBorder: 'border-amber-600/50 shadow-[0_16px_40px_rgba(35,20,10,0.5)]',
  },
};

export const getBoardBackgroundStyle = (themeOrBgId: string): string => {
  if (THEME_STYLES[themeOrBgId]?.boardBg) {
    return THEME_STYLES[themeOrBgId].boardBg;
  }
  switch (themeOrBgId) {
    case 'background_soft_sky':
      return "linear-gradient(135deg, #7492b3 0%, #94abc2 50%, #b2ccd9 100%)";
    case 'background_spring_garden':
      return "linear-gradient(135deg, #578c5e 0%, #74a68a 50%, #adc9b7 100%)";
    case 'background_night_sky':
      return "linear-gradient(135deg, #050810 0%, #0d121f 50%, #182133 100%)";
    case 'background_wooden_table':
      return "linear-gradient(135deg, #3a1906 0%, #4a2109 50%, #612d0f 100%)";
    case 'background_marble':
      return "linear-gradient(135deg, #8b95a1 0%, #a4abb5 50%, #bfcbdb 100%)";
    case 'background_candy_land':
      return "linear-gradient(135deg, #b88ba5 0%, #b56c8c 50%, #d1b8c6 100%)";
    case 'background_galaxy':
      return "linear-gradient(135deg, #15072e 0%, #250d4a 50%, #321261 100%)";
    case 'background_japanese_garden':
      return "linear-gradient(135deg, #9ca5b0 0%, #7d868f 50%, #9ca5b0 100%)";
    case 'background_winter_landscape':
      return "linear-gradient(135deg, #014c70 0%, #70a6c7 50%, #adc9da 100%)";
    case 'background_tropical_beach':
      return "linear-gradient(135deg, #b3a656 0%, #b3a030 50%, #5f87b0 100%)";
    default:
      return THEME_STYLES.theme_midnight_blue.boardBg;
  }
};
