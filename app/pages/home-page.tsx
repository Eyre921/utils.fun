import { Badge } from "@/components/ui/badge";
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

export function HomePage({
  locale,
  pathPrefix,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
}) {
  const dict = getDictionary(locale);
  const homePath = getHomePath(pathPrefix);

  return (
    <>
      <SiteHeader
        locale={locale}
        pathname={homePath}
        homePath={homePath}
        pathPrefix={pathPrefix}
        dict={dict}
        mobileNavigationTitle={dict.categoryNavTitle}
        mobileNavigation={
          <ToolSidebar
            locale={locale}
            pathPrefix={pathPrefix}
            variant="docs"
          />
        }
      />
      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-6 sm:py-10 lg:gap-12 lg:px-8 lg:py-14">
        <section className="space-y-6">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
              {dict.homeTitle}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {dict.homeIntro}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="rounded-full px-5">
              <a href={`${homePath}#tools`}>
                {dict.toolListTitle}
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Badge
              variant="outline"
              className="rounded-full border-border/80 bg-card/60 px-3 py-1 font-normal text-muted-foreground"
            >
              {dict.homeStats.replace(
                "{count}",
                formatCount(dict.tools.length, locale),
              )}
            </Badge>
          </div>
        </section>

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
            dict={dict}
            categories={dict.categories}
            tools={dict.tools}
          />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
