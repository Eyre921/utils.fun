import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ToolRouteScrollReset } from "@/components/tool-route-scroll-reset";
import { ToolSidebar } from "@/components/tool-sidebar";
import { getDictionary } from "@/lib/i18n";
import { getHomePath, type PathPrefix } from "@/lib/locale";
import { type Locale } from "@/lib/tools";

export function ToolLayout({
  locale,
  pathPrefix,
  children,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const homePath = getHomePath(pathPrefix);

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <div className="shrink-0">
        <SiteHeader
          locale={locale}
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
      </div>

      <ToolRouteScrollReset />

      <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1">
        <aside className="hidden min-h-0 w-[260px] shrink-0 overflow-y-auto overscroll-contain border-r border-border/60 px-3 py-5 lg:block xl:w-[280px] xl:px-4">
          <ToolSidebar
            locale={locale}
            pathPrefix={pathPrefix}
            variant="docs"
          />
        </aside>

        <main
          id="tool-page-scroll"
          className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
        >
          <div className="mx-auto min-w-0 max-w-4xl pb-6">{children}</div>
        </main>
      </div>

      <div className="shrink-0 border-t border-border/60">
        <SiteFooter flush />
      </div>
    </div>
  );
}
