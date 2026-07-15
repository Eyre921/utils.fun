import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolSidebar } from "@/components/tool-sidebar";
import { ToolExplorer } from "@/components/tool-explorer";
import { getDictionary } from "@/lib/i18n";
import { getHomePath, type PathPrefix } from "@/lib/locale";
import { type Locale } from "@/lib/tools";
import { formatCount } from "@/lib/utils";

const headerDictKeys = [
  "localeLabel",
  "languageLabel",
  "themeLabel",
  "githubLabel",
  "themeSystem",
  "themeLight",
  "themeDark",
  "menuLabel",
  "searchTools",
  "searchDialogTitle",
  "searchDialogHint",
  "searchShortcut",
  "closeLabel",
] as const;

function pickHeaderDict(dict: ReturnType<typeof getDictionary>) {
  return Object.fromEntries(headerDictKeys.map((key) => [key, dict[key]])) as {
    [K in (typeof headerDictKeys)[number]]: (typeof dict)[K];
  };
}

/**
 * Yield once so the hero shell can stream/paint before the large catalog HTML.
 * Improves LCP when the tool grid dominates document size.
 */
async function DeferredToolCatalog({
  locale,
  pathPrefix,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
}) {
  // Real microtask + macrotask yield so the hero shell can flush before catalog HTML.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
  const dict = getDictionary(locale);

  const localizedTools = dict.tools.map((tool) => ({
    slug: tool.slug,
    category: tool.category,
    title: tool.title[locale],
    description: tool.description[locale],
    highlights: tool.highlights[locale],
  }));
  const localizedCategories = dict.categories.map((category) => ({
    slug: category.slug,
    title: category.title[locale],
    description: category.description[locale],
  }));

  return (
    <section id="tools" className="space-y-6">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.toolListTitle}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">{dict.toolListIntro}</p>
        </div>
      </div>
      <ToolExplorer
        locale={locale}
        pathPrefix={pathPrefix}
        dict={{
          searchPlaceholder: dict.searchPlaceholder,
          searchEmpty: dict.searchEmpty,
          myFavorites: dict.myFavorites,
          addFavorite: dict.addFavorite,
          removeFavorite: dict.removeFavorite,
        }}
        categories={localizedCategories}
        tools={localizedTools}
      />
    </section>
  );
}

function ToolCatalogFallback({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <section id="tools" className="space-y-6" aria-busy="true">
      <div className="flex flex-col gap-1 border-b border-border/60 pb-5">
        <div className="space-y-1.5">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {dict.toolListTitle}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">{dict.toolListIntro}</p>
        </div>
      </div>
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
          />
        ))}
      </div>
    </section>
  );
}

export function HomePage({
  locale,
  pathPrefix,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
}) {
  const dict = getDictionary(locale);
  const homePath = getHomePath(pathPrefix);

  const sidebarTools = dict.tools.map((tool) => ({
    slug: tool.slug,
    category: tool.category,
    title: tool.title[locale],
  }));
  const sidebarCategories = dict.categories.map((category) => ({
    slug: category.slug,
    title: category.title[locale],
  }));
  const sidebarLabels = {
    myFavorites: dict.myFavorites,
    favoriteEmpty: dict.favoriteEmpty,
    categoryNavTitle: dict.categoryNavTitle,
  };

  return (
    <>
      <SiteHeader
        locale={locale}
        pathname={homePath}
        homePath={homePath}
        pathPrefix={pathPrefix}
        dict={pickHeaderDict(dict)}
        mobileNavigationTitle={dict.categoryNavTitle}
        mobileNavigation={
          <ToolSidebar
            locale={locale}
            pathPrefix={pathPrefix}
            variant="docs"
            tools={sidebarTools}
            categories={sidebarCategories}
            labels={sidebarLabels}
          />
        }
      />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:gap-12 lg:px-8 lg:py-14">
        <section className="space-y-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
              {dict.homeTitle}
            </h1>
            {/* Keep hero copy lightweight for LCP: solid color, no client deps */}
            <p className="max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 dark:text-neutral-400">
              {dict.homeIntro}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full px-5 no-underline hover:no-underline">
              <a href={`${homePath}#tools`} className="no-underline hover:no-underline">
                {dict.toolListTitle}
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <p className="text-sm text-muted-foreground sm:text-base">
              {dict.homeStats.replace(
                "{count}",
                formatCount(dict.tools.length, locale),
              )}
            </p>
          </div>
        </section>

        {/* content-visibility lets the browser skip offscreen catalog layout during first paint */}
        <div className="[content-visibility:auto] [contain-intrinsic-size:auto_2400px]">
          <Suspense fallback={<ToolCatalogFallback locale={locale} />}>
            <DeferredToolCatalog locale={locale} pathPrefix={pathPrefix} />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
