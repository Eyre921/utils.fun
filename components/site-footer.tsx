"use client";

import { useSiteConfig } from "@/components/providers/site-config-provider";
import { cn } from "@/lib/utils";

export function SiteFooter({
  flush = false,
  className,
}: {
  /** When true, skip outer border (parent shell already draws it). */
  flush?: boolean;
  className?: string;
}) {
  const siteConfig = useSiteConfig();

  return (
    <footer
      className={cn(
        flush ? undefined : "border-t border-border/60",
        className,
      )}
      style={{ backgroundColor: "var(--browser-chrome-bg, var(--background))" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2.5 text-sm text-muted-foreground sm:px-6 sm:py-3 lg:px-8">
        <div
          className="text-center [&_a]:underline [&_a]:underline-offset-4 [&_img]:inline-block [&_img]:align-middle"
          dangerouslySetInnerHTML={{
            __html: siteConfig.footerHtml || `<span>${siteConfig.title}</span>`,
          }}
        />
      </div>
    </footer>
  );
}
