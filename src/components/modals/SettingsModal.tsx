import React from "react";
import { Settings, X, Volume2, VolumeX, ChevronDown } from "lucide-react";
import { PanelBackground } from "../PanelBackground";
import { Language } from "../../locales";

export interface SettingsModalProps {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  currentTheme: {
    dialogBg: string;
    [key: string]: any;
  };
  t: Record<string, any>;
  synth: {
    playClose: () => void;
    playSelect: () => void;
  };
  language: Language;
  changeLanguage: (lang: Language) => void;
  isLangDropdownOpen: boolean;
  setIsLangDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  soundOn: boolean;
  setSoundOn: (on: boolean) => void;
}

const LANGUAGES_LIST: Array<{ code: Language; label: string }> = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "it", label: "Italiano" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "th", label: "ไทย" },
  { code: "tr", label: "Türkçe" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "zh-TW", label: "繁體中文" },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isSettingsOpen,
  setIsSettingsOpen,
  currentTheme,
  t,
  synth,
  language,
  changeLanguage,
  isLangDropdownOpen,
  setIsLangDropdownOpen,
  soundOn,
  setSoundOn,
}) => {
  return (
    <div
      id="settings-modal-backdrop"
      className={`absolute inset-0 bg-[#0d101b]/70 md:backdrop-blur-md backdrop-blur-none z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        isSettingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => setIsSettingsOpen(false)}
    >
      <div
        id="settings-modal-content"
        className={`${currentTheme.dialogBg} md:backdrop-blur-xl backdrop-blur-none border-2 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-[0_24px_60px_rgba(4,8,24,0.7),inset_0_1.5px_1.5px_rgba(255,255,255,0.2)] relative overflow-hidden text-slate-100 transition-all duration-300 transform max-h-[90vh] overflow-y-auto ${
          isSettingsOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <PanelBackground showTopBar={true} />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <h2 className="text-lg font-black tracking-tight">{t.settingsTitle}</h2>
          </div>
          <button
            id="btn-close-settings-x"
            onClick={() => {
              synth.playClose();
              setIsSettingsOpen(false);
            }}
            className="p-1.5 rounded-xl bg-[#34448e] hover:bg-[#3e51aa] text-slate-300 hover:text-white transition-all border border-[#546bbf]/40 shadow-sm cursor-pointer"
            title={t.settingsClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4 relative z-10">
          {/* Row 1: Language Settings */}
          <div
            id="setting-row-language"
            className="p-4 rounded-2xl bg-[#1e2552]/70 border-2 border-[#3f509d]/40 flex flex-col gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🌐</span>
                <div>
                  <h3 className="text-sm font-black text-slate-100">{t.settingsLanguage}</h3>
                  <p className="text-[10px] text-slate-300 font-bold">Select your language</p>
                </div>
              </div>
            </div>

            {/* Stylized Dropdown/Toggle Menu */}
            <div className="relative w-full mt-1">
              <button
                id="btn-lang-dropdown-trigger"
                onClick={() => {
                  synth.playSelect();
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                }}
                className="w-full py-2 px-3.5 rounded-xl bg-[#2d3875] border-2 border-[#546bbf]/40 hover:border-[#546bbf]/60 text-slate-100 text-xs font-black flex items-center justify-between transition-all focus:outline-none cursor-pointer shadow-sm"
              >
                <span>
                  {LANGUAGES_LIST.find((l) => l.code === language)?.label || "English"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-300 transition-transform duration-200 ${
                    isLangDropdownOpen ? "rotate-180 text-cyan-300" : ""
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
                  isLangDropdownOpen
                    ? "max-h-[320px] opacity-100 mt-1.5 pointer-events-auto"
                    : "max-h-0 opacity-0 pointer-events-none mt-0"
                }`}
              >
                <div className="bg-[#1e2552] border-2 border-[#3f509d]/60 rounded-xl p-1.5 grid grid-cols-2 gap-1 shadow-xl">
                  {LANGUAGES_LIST.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        id={`btn-lang-${lang.code}`}
                        onClick={() => {
                          synth.playSelect();
                          changeLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-600/30 to-indigo-600/30 text-cyan-300 border border-cyan-500/30 shadow-inner"
                            : "bg-transparent text-slate-300 hover:text-slate-100 hover:bg-slate-800/40 border border-transparent"
                        }`}
                      >
                        <span className="truncate">{lang.label}</span>
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Audio Config */}
          <div
            id="setting-row-audio"
            className="p-4 rounded-2xl bg-[#1e2552]/70 border-2 border-[#3f509d]/40 flex items-center justify-between gap-4 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.12)]"
          >
            <div className="flex items-center gap-2.5">
              <div
                className={`p-2 rounded-xl ${
                  soundOn
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/20"
                    : "bg-rose-500/20 text-rose-300 border border-rose-500/20"
                }`}
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-100">{t.settingsAudio}</h3>
                <p className="text-[10px] text-slate-300 font-bold">{t.settingsAudioDesc}</p>
              </div>
            </div>

            <button
              id="btn-settings-audio-toggle"
              onClick={() => {
                synth.playSelect();
                setSoundOn(!soundOn);
              }}
              className={`w-12 h-6 rounded-full p-0.5 transition-all duration-200 focus:outline-none relative border border-slate-900/10 ${
                soundOn
                  ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                  : "bg-[#2d3875]"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                  soundOn ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
