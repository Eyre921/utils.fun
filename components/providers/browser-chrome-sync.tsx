"use client";

import { useEffect } from "react";
import {
  getThemeColor,
  getThemeMetaDefinitions,
  readClientThemePreference,
} from "@/lib/theme-preferences";

function ensureThemeColorMeta(slot: "light" | "dark") {
  let meta = document.head.querySelector<HTMLMetaElement>(
    `meta[name="theme-color"][data-theme-color="${slot}"]`,
  );

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.dataset.themeColor = slot;
    document.head.appendChild(meta);
  }

  return meta;
}

export function BrowserChromeSync() {
  useEffect(() => {
    let frame = 0;

    const sync = () => {
      const root = document.documentElement;
      const { preference } = readClientThemePreference();
      const definitions = getThemeMetaDefinitions(preference);
      const currentMode =
        preference === "system"
          ? root.classList.contains("dark")
            ? "dark"
            : "light"
          : preference;
      const currentColor = getThemeColor(currentMode);

      definitions.forEach((definition) => {
        const meta = ensureThemeColorMeta(definition.slot);
        meta.setAttribute("content", definition.color);

        if (definition.media) {
          meta.setAttribute("media", definition.media);
        } else {
          meta.removeAttribute("media");
        }
      });

      root.style.colorScheme =
        preference === "system"
          ? "light dark"
          : root.classList.contains("dark")
            ? "dark"
            : "light";
      root.style.backgroundColor = currentColor;
      root.style.setProperty("--browser-chrome-bg", currentColor);
      document.body.style.backgroundColor = currentColor;
    };

    const scheduleSync = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(sync);
    };

    scheduleSync();

    const observer = new MutationObserver(scheduleSync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("pageshow", scheduleSync);
    window.addEventListener("storage", scheduleSync);

    return () => {
      observer.disconnect();
      window.removeEventListener("pageshow", scheduleSync);
      window.removeEventListener("storage", scheduleSync);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
