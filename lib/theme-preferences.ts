import type { CSSProperties } from "react";

export const THEME_STORAGE_KEY = "theme";
export const THEME_COOKIE_NAME = "utils-theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type ThemePreference = "light" | "dark" | "system";
export type ThemeMode = "light" | "dark";
export type ThemeMetaDefinition = {
  slot: ThemeMode;
  color: string;
  media?: string;
};

const INACTIVE_THEME_MEDIA = "not all";

/** Warp × Apple default surfaces for browser chrome / theme-color meta */
export const THEME_COLOR_MAP: Record<ThemeMode, string> = {
  light: "#fafafa",
  dark: "#000000",
};

export function normalizeThemePreference(value?: string | null): ThemePreference {
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

export function resolveThemeMode(
  preference: ThemePreference,
  systemPrefersDark = false,
): ThemeMode {
  if (preference === "light") {
    return "light";
  }

  if (preference === "dark") {
    return "dark";
  }

  return systemPrefersDark ? "dark" : "light";
}

export function getThemeColor(mode: ThemeMode) {
  return THEME_COLOR_MAP[mode];
}

export function getThemeMetaDefinitions(
  preference: ThemePreference,
): ThemeMetaDefinition[] {
  const light = getThemeColor("light");
  const dark = getThemeColor("dark");

  if (preference === "light") {
    return [
      { slot: "light", color: light },
      { slot: "dark", color: dark, media: INACTIVE_THEME_MEDIA },
    ];
  }

  if (preference === "dark") {
    return [
      { slot: "light", color: light, media: INACTIVE_THEME_MEDIA },
      { slot: "dark", color: dark },
    ];
  }

  return [
    { slot: "light", color: light, media: "(prefers-color-scheme: light)" },
    { slot: "dark", color: dark, media: "(prefers-color-scheme: dark)" },
  ];
}

export function getInitialHtmlClassName(preference: ThemePreference) {
  const classes = ["font-sans"];

  if (preference === "dark") {
    classes.push("dark");
  }

  return classes.join(" ");
}

export function getInitialHtmlStyle(
  preference: ThemePreference,
  mode: ThemeMode,
  backgroundColor: string,
): CSSProperties {
  return {
    colorScheme: preference === "system" ? "light dark" : mode,
    backgroundColor,
    ["--browser-chrome-bg" as string]: backgroundColor,
  } as CSSProperties;
}

export function getInitialBodyStyle(backgroundColor: string): CSSProperties {
  return {
    backgroundColor,
  };
}

export function getThemeBootstrapScript() {
  return `(function(){try{var themeKey=${JSON.stringify(THEME_STORAGE_KEY)};var themeCookie=${JSON.stringify(THEME_COOKIE_NAME)};var maxAge=${String(THEME_COOKIE_MAX_AGE)};var inactiveMedia=${JSON.stringify(INACTIVE_THEME_MEDIA)};var themeColorMap=${JSON.stringify(THEME_COLOR_MAP)};var root=document.documentElement;var readCookie=function(name){var match=document.cookie.match(new RegExp('(?:^|; )'+name.replace(/[$()*+.?[\\\\\\]^{|}]/g,'\\\\$&')+'=([^;]*)'));return match?decodeURIComponent(match[1]):null;};var ensureMeta=function(slot){var meta=document.head.querySelector('meta[name="theme-color"][data-theme-color="'+slot+'"]');if(!meta){meta=document.createElement('meta');meta.name='theme-color';meta.setAttribute('data-theme-color',slot);document.head.appendChild(meta);}return meta;};var applyMetaSet=function(theme){var colors=themeColorMap;var entries=theme==='light'?[{slot:'light',color:colors.light},{slot:'dark',color:colors.dark,media:inactiveMedia}]:theme==='dark'?[{slot:'light',color:colors.light,media:inactiveMedia},{slot:'dark',color:colors.dark}]:[{slot:'light',color:colors.light,media:'(prefers-color-scheme: light)'},{slot:'dark',color:colors.dark,media:'(prefers-color-scheme: dark)'}];entries.forEach(function(entry){var meta=ensureMeta(entry.slot);meta.setAttribute('content',entry.color);if(entry.media){meta.setAttribute('media',entry.media);}else{meta.removeAttribute('media');}});return colors;};var theme=localStorage.getItem(themeKey)||readCookie(themeCookie)||'system';if(!theme||!/^(light|dark|system)$/.test(theme)){theme='system';}var isDark=theme==='dark'||(theme!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);root.classList.toggle('dark',isDark);root.style.colorScheme=theme==='system'?'light dark':(isDark?'dark':'light');var colors=applyMetaSet(theme);var currentColor=colors[isDark?'dark':'light'];root.style.backgroundColor=currentColor;root.style.setProperty('--browser-chrome-bg',currentColor);if(document.body){document.body.style.backgroundColor=currentColor;}document.cookie=themeCookie+'='+encodeURIComponent(theme)+'; Path=/; Max-Age='+maxAge+'; SameSite=Lax';}catch(error){}})();`;
}

export function persistThemePreferenceCookie(theme: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${THEME_COOKIE_NAME}=${encodeURIComponent(theme)}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function readClientThemePreference() {
  if (typeof window === "undefined") {
    return {
      preference: "system" as ThemePreference,
    };
  }

  const theme = normalizeThemePreference(
    readStorage(THEME_STORAGE_KEY) || readCookie(THEME_COOKIE_NAME),
  );

  return { preference: theme };
}

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapeCookieName(name)}=([^;]*)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

function escapeCookieName(value: string) {
  return value.replace(/[$()*+.?[\\\]^{|}]/g, "\\$&");
}
