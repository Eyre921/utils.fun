"use client";

import type * as React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github } from "lucide-react";

import { MobileSidebarDrawer } from "@/components/mobile-sidebar-drawer";
import { useSiteConfig } from "@/components/providers/site-config-provider";
import { Button } from "@/components/ui/button";
import { type PathPrefix } from "@/lib/locale";
import { type Locale } from "@/lib/tools";

const LocaleToggle = dynamic(
  () => import("@/components/locale-toggle").then((mod) => mod.LocaleToggle),
  {
    ssr: false,
    loading: () => (
      <div className="size-11 shrink-0 rounded-xl border border-input bg-background" aria-hidden />
    ),
  },
);

const ThemeToggle = dynamic(
  () => import("@/components/theme-toggle").then((mod) => mod.ThemeToggle),
  {
    ssr: false,
    loading: () => (
      <div className="size-11 shrink-0 rounded-xl border border-input bg-background" aria-hidden />
    ),
  },
);

const ToolSearchDialog = dynamic(
  () => import("@/components/tool-search-dialog").then((mod) => mod.ToolSearchDialog),
  {
    ssr: false,
    loading: () => (
      <div className="size-11 shrink-0 rounded-full border border-input bg-background sm:h-11 sm:w-28" aria-hidden />
    ),
  },
);

export function SiteHeader({
  locale,
  pathname,
  homePath,
  pathPrefix,
  dict,
  mobileNavigation,
  mobileNavigationTitle,
}: {
  locale: Locale;
  pathname?: string;
  homePath: string;
  pathPrefix: PathPrefix;
  dict: {
    localeLabel: string;
    languageLabel: string;
    themeLabel: string;
    githubLabel: string;
    themeSystem: string;
    themeLight: string;
    themeDark: string;
    menuLabel: string;
    searchTools: string;
    searchDialogTitle: string;
    searchDialogHint: string;
    searchShortcut: string;
    closeLabel: string;
  };
  mobileNavigation?: React.ReactNode;
  mobileNavigationTitle?: string;
}) {
  const activePathname = usePathname() ?? pathname ?? homePath;
  const siteConfig = useSiteConfig();

  return (
    <header
      className="sticky top-0 z-30 border-b border-border/60 backdrop-blur-xl"
      style={{ backgroundColor: "var(--browser-chrome-bg, var(--background))" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          {mobileNavigation ? (
            <MobileSidebarDrawer
              title={mobileNavigationTitle ?? dict.menuLabel}
              triggerLabel={dict.menuLabel}
            >
              {mobileNavigation}
            </MobileSidebarDrawer>
          ) : null}
          <Link href={homePath} className="flex items-center gap-3 no-underline hover:no-underline">
            {siteConfig.logo ? (
              <div className="flex size-8 items-center justify-center overflow-hidden rounded-xl bg-background sm:size-9">
                {/* Use a plain img so Docker/runtime env can point to any local or remote logo URL. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={siteConfig.logo.src}
                  alt={siteConfig.logo.alt}
                  width={siteConfig.logo.width}
                  height={siteConfig.logo.height}
                  decoding="async"
                  fetchPriority="high"
                  className="size-full object-contain"
                />
              </div>
            ) : null}
            <div className="text-lg font-semibold tracking-tight">{siteConfig.title}</div>
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ToolSearchDialog locale={locale} pathPrefix={pathPrefix} />
          <LocaleToggle
            locale={locale}
            pathname={activePathname}
            label={dict.languageLabel}
          />
          <ThemeToggle
            options={{
              label: dict.themeLabel,
              system: dict.themeSystem,
              light: dict.themeLight,
              dark: dict.themeDark,
            }}
          />
          <Button asChild type="button" variant="outline" size="icon" className="size-11 min-h-11 min-w-11 shrink-0">
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={dict.githubLabel}
              title={dict.githubLabel}
            >
              <Github className="size-3.5 sm:size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
