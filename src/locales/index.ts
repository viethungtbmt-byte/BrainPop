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
