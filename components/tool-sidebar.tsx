"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Star } from "lucide-react";

import { useFavorites } from "@/components/providers/favorites-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CategoryIcon,
  getCategoryIconTone,
  ToolIconWell,
} from "@/components/tool-icon";
import { getDictionary } from "@/lib/i18n";
import { buildToolPath, stripLocalePrefix, type PathPrefix } from "@/lib/locale";
import { type Locale, type ToolSlug } from "@/lib/tools";
import { cn } from "@/lib/utils";

function SidebarToolLink({
  href,
  title,
  slug,
  active,
}: {
  href: string;
  title: string;
  slug: ToolSlug;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      scroll
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground",
        active && "bg-muted font-medium text-foreground shadow-2xs ring-1 ring-border/80",
      )}
    >
      <ToolIconWell
        slug={slug}
        className="size-7 rounded-lg shadow-none"
        iconClassName="size-3.5"
      />
      <span className="min-w-0 flex-1 truncate leading-5">{title}</span>
    </Link>
  );
}

export function ToolSidebar({
  locale,
  pathPrefix,
  currentSlug,
  variant = "docs",
  className,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
  currentSlug?: ToolSlug;
  variant?: "docs" | "plain";
  className?: string;
}) {
  const dict = getDictionary(locale);
  const { favorites, hydrated } = useFavorites();
  const pathname = usePathname() ?? "";
  const derivedSlug = stripLocalePrefix(pathname).split("/").filter(Boolean)[0];
  const activeSlug = (currentSlug ?? derivedSlug) as ToolSlug | undefined;
  const favoriteItems = favorites
    .map((slug) => dict.tools.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof dict.tools)[number] => Boolean(tool));

  const content = (
    <div className="grid gap-6 pr-2">
      {hydrated ? (
        <section className="grid gap-2.5">
          <div className="flex items-center gap-2.5 px-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            <span className="flex size-6 items-center justify-center rounded-md border border-border bg-muted text-foreground">
              <Star className="size-3.5" />
            </span>
            <span>{dict.myFavorites}</span>
          </div>
          {favoriteItems.length ? (
            <div className="ml-4 grid gap-1 border-l border-border/50 pl-3">
              {favoriteItems.map((tool) => (
                <SidebarToolLink
                  key={tool.slug}
                  href={buildToolPath(pathPrefix, tool.slug)}
                  title={tool.title[locale]}
                  slug={tool.slug}
                  active={tool.slug === activeSlug}
                />
              ))}
            </div>
          ) : (
            <div className="ml-4 rounded-xl border border-dashed border-border/60 px-3 py-3 text-sm text-muted-foreground">
              {dict.favoriteEmpty}
            </div>
          )}
        </section>
      ) : null}

      <div className="px-1 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {dict.categoryNavTitle}
      </div>

      {dict.categories.map((category) => {
        const items = dict.tools.filter((tool) => tool.category === category.slug);

        return (
          <section key={category.slug} className="grid gap-2.5">
            <div className="flex items-center gap-2.5 px-1">
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-md border",
                  getCategoryIconTone(category.slug),
                )}
              >
                <CategoryIcon slug={category.slug} className="size-3.5" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {category.title[locale]}
              </span>
            </div>
            <div className="ml-4 grid gap-1 border-l border-border/50 pl-3">
              {items.map((tool) => (
                <SidebarToolLink
                  key={tool.slug}
                  href={buildToolPath(pathPrefix, tool.slug)}
                  title={tool.title[locale]}
                  slug={tool.slug}
                  active={tool.slug === activeSlug}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );

  if (variant === "docs") {
    return (
      <div className={cn("h-full", className)}>
        <div className="h-full overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("h-full", className)}>
      <ScrollArea className="h-full">{content}</ScrollArea>
    </div>
  );
}
