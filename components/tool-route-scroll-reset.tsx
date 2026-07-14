"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const TOOL_PAGE_SCROLL_ID = "tool-page-scroll";

export function ToolRouteScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const scroller = document.getElementById(TOOL_PAGE_SCROLL_ID);
      if (scroller) {
        scroller.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
