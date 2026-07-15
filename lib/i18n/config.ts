export const localeConfig = {
  cn: {
    label: "简体中文",
    htmlLang: "zh-CN",
    numberFormat: "zh-CN",
    // Local emoji avoids Iconify network fetch on first paint
    flagEmoji: "🇨🇳",
    direction: "ltr",
  },
  tw: {
    label: "繁體中文",
    htmlLang: "zh-Hant",
    numberFormat: "zh-TW",
    // 🇭🇰 renders reliably where 🇹🇼 may fall back to a missing-glyph box
    flagEmoji: "🇭🇰",
    direction: "ltr",
  },
  en: {
    label: "English",
    htmlLang: "en",
    numberFormat: "en-US",
    flagEmoji: "🇺🇸",
    direction: "ltr",
  },
  es: {
    label: "Español",
    htmlLang: "es",
    numberFormat: "es-ES",
    flagEmoji: "🇪🇸",
    direction: "ltr",
  },
  ja: {
    label: "日本語",
    htmlLang: "ja",
    numberFormat: "ja-JP",
    flagEmoji: "🇯🇵",
    direction: "ltr",
  },
  ko: {
    label: "한국어",
    htmlLang: "ko",
    numberFormat: "ko-KR",
    flagEmoji: "🇰🇷",
    direction: "ltr",
  },
  ru: {
    label: "Русский",
    htmlLang: "ru",
    numberFormat: "ru-RU",
    flagEmoji: "🇷🇺",
    direction: "ltr",
  },
  de: {
    label: "Deutsch",
    htmlLang: "de",
    numberFormat: "de-DE",
    flagEmoji: "🇩🇪",
    direction: "ltr",
  },
  ar: {
    label: "العربية",
    htmlLang: "ar",
    numberFormat: "ar-SA",
    flagEmoji: "🇸🇦",
    direction: "rtl",
  },
} as const;

export type Locale = keyof typeof localeConfig;

export const defaultLocale: Locale = "cn";
export const locales = Object.keys(localeConfig) as Locale[];
export const routableLocales = locales;

export function isLocale(value: string): value is Locale {
  return value in localeConfig;
}

export function getLocaleConfig(locale: Locale) {
  return localeConfig[locale];
}
