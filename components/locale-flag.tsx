import CN from "country-flag-icons/react/3x2/CN";
import DE from "country-flag-icons/react/3x2/DE";
import ES from "country-flag-icons/react/3x2/ES";
import HK from "country-flag-icons/react/3x2/HK";
import JP from "country-flag-icons/react/3x2/JP";
import KR from "country-flag-icons/react/3x2/KR";
import RU from "country-flag-icons/react/3x2/RU";
import SA from "country-flag-icons/react/3x2/SA";
import US from "country-flag-icons/react/3x2/US";

import type { Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * ISO region codes mapped from app locales.
 * Source: `country-flag-icons` (MIT) — free for commercial use.
 * 繁體中文 intentionally uses HK (香港), not TW.
 */
const LOCALE_FLAG_COMPONENTS = {
  cn: CN,
  tw: HK,
  en: US,
  es: ES,
  ja: JP,
  ko: KR,
  ru: RU,
  de: DE,
  ar: SA,
} as const satisfies Record<Locale, typeof CN>;

export function LocaleFlag({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const Flag = LOCALE_FLAG_COMPONENTS[locale];

  return (
    <Flag
      aria-hidden
      className={cn(
        "inline-block h-3.5 w-[1.3125rem] shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
        className,
      )}
    />
  );
}
