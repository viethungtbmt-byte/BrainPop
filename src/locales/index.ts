import { en } from "./en";
import { vi } from "./vi";
import { es } from "./es";
import { pt } from "./pt";
import { tr } from "./tr";
import { de } from "./de";
import { fr } from "./fr";
import { it } from "./it";
import { ru } from "./ru";
import { id } from "./id";
import { zhTW } from "./zh-TW";
import { ja } from "./ja";
import { ko } from "./ko";
import { pl } from "./pl";
import { nl } from "./nl";
import { th } from "./th";

export type TranslationType = typeof en;

export const TRANSLATIONS = {
  en,
  vi,
  es,
  pt,
  tr,
  de,
  fr,
  it,
  ru,
  id,
  "zh-TW": zhTW,
  ja,
  ko,
  pl,
  nl,
  th,
} as const;

export type Language = "vi" | "en" | "es" | "pt" | "tr" | "de" | "fr" | "it" | "ru" | "id" | "zh-TW" | "ja" | "ko" | "pl" | "nl" | "th";

export const SUPPORTED_LANGUAGES: Language[] = [
  "vi", "en", "es", "pt", "tr", "de", "fr", "it", "ru", "id", "zh-TW", "ja", "ko", "pl", "nl", "th"
];

export function getAutoDetectedLanguage(): Language {
  if (typeof navigator === "undefined") return "en";

  const rawLanguages: string[] = [];
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    rawLanguages.push(...navigator.languages);
  }
  if (navigator.language) {
    rawLanguages.push(navigator.language);
  }

  for (const raw of rawLanguages) {
    if (!raw) continue;
    const lower = raw.trim().toLowerCase();

    // Chinese language family -> zh-TW
    if (lower === "zh-tw" || lower === "zh-hant" || lower === "zh-hk" || lower === "zh-mo" || lower.startsWith("zh")) {
      return "zh-TW";
    }

    // Direct exact match
    const exactMatch = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === lower);
    if (exactMatch) return exactMatch;

    // Primary language code match (e.g., "pt-BR" -> "pt", "de-DE" -> "de", "en-US" -> "en")
    const primary = lower.split("-")[0];
    const primaryMatch = SUPPORTED_LANGUAGES.find((l) => l.toLowerCase() === primary);
    if (primaryMatch) return primaryMatch;
  }

  return "en";
}
