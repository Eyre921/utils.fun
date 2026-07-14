"use client";

import { useEffect } from "react";

const SCROLLING_ATTR = "data-scrolling";
const HIDE_DELAY_MS = 900;

/**
 * Shows custom scrollbars only while the user is actively scrolling.
 * Uses capture-phase scroll events so nested overflow containers work too.
 */
export function ScrollbarActivity() {
  useEffect(() => {
    const hideTimers = new WeakMap<Element, number>();

    function armHide(element: Element) {
      element.setAttribute(SCROLLING_ATTR, "");

      const previous = hideTimers.get(element);
      if (previous) {
        window.clearTimeout(previous);
      }

      const timer = window.setTimeout(() => {
        element.removeAttribute(SCROLLING_ATTR);
        hideTimers.delete(element);
      }, HIDE_DELAY_MS);

      hideTimers.set(element, timer);
    }

    function markScrolling(target: EventTarget | null) {
      const element =
        target === document || target === document.documentElement || target === document.body
          ? document.documentElement
          : target instanceof Element
            ? target
            : null;

      if (!element) {
        return;
      }

      armHide(element);

      // Radix ScrollArea scrolls its viewport; surface state on the root for custom thumbs.
      const scrollAreaRoot = element.closest?.('[data-slot="scroll-area"]');
      if (scrollAreaRoot instanceof Element && scrollAreaRoot !== element) {
        armHide(scrollAreaRoot);
      }
    }

    function onScroll(event: Event) {
      markScrolling(event.target);
    }

    document.addEventListener("scroll", onScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.documentElement.removeAttribute(SCROLLING_ATTR);
    };
  }, []);

  return null;
}
