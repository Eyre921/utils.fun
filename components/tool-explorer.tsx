"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import { useFavorites } from "@/components/providers/favorites-provider";
import { ToolFavoriteButton } from "@/components/tool-favorite-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CategoryIcon,
  getCategoryIconTone,
  ToolIconWell,
} from "@/components/tool-icon";
import { buildToolPath, type PathPrefix } from "@/lib/locale";
import type { Category, Locale, Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

type Dict = {
  searchPlaceholder: string;
  searchEmpty: string;
  myFavorites: string;
};

function ToolGrid({
  items,
  locale,
  pathPrefix,
}: {
  items: Tool[];
  locale: Locale;
  pathPrefix: PathPrefix;
}) {
  return (
    <div className="grid auto-rows-fr gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((tool) => (
        <Card
          key={tool.slug}
          className="group relative h-full rounded-2xl border-border/70 bg-card shadow-xs transition-[border-color,background-color,box-shadow] duration-200 hover:border-border hover:bg-muted/30 hover:shadow-sm"
        >
          <Link
            href={buildToolPath(pathPrefix, tool.slug)}
            scroll
            aria-label={tool.title[locale]}
            className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <CardContent className="pointer-events-none relative z-10 flex h-full gap-3.5 p-4 sm:p-5">
            <ToolIconWell
              slug={tool.slug}
              className="transition-transform duration-200 group-hover:scale-[1.03]"
            />
            <div className="min-w-0 flex-1 space-y-1.5">
              <div className="flex items-start justify-between gap-2">
                <h4 className="min-w-0 flex-1 text-base font-semibold leading-6 tracking-tight sm:text-[1.05rem] sm:leading-7">
                  {tool.title[locale]}
                </h4>
                <ToolFavoriteButton
                  slug={tool.slug}
                  locale={locale}
                  title={tool.title[locale]}
                  className="pointer-events-auto -mr-1.5 -mt-1 size-9 shrink-0"
                />
              </div>
              <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
                {tool.description[locale]}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function ToolExplorer({
  locale,
  pathPrefix,
  dict,
  categories,
  tools,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
  dict: Dict;
  categories: Category[];
  tools: Tool[];
}) {
  const [query, setQuery] = useState("");
  const { favorites, hydrated } = useFavorites();
  const deferredQuery = useDeferredValue(query);

  const { favoriteItems, filteredGroups } = useMemo(() => {
    const keyword = deferredQuery.trim().toLowerCase();
    const matchesQuery = (tool: Tool) => {
      const haystack = [
        tool.title[locale],
        tool.description[locale],
        ...tool.highlights[locale],
        tool.slug,
      ]
        .join(" ")
        .toLowerCase();

      return !keyword || haystack.includes(keyword);
    };

    const toolMap = new Map(tools.map((tool) => [tool.slug, tool]));
    const favoriteItems = favorites
      .map((slug) => toolMap.get(slug))
      .filter((tool): tool is Tool => Boolean(tool))
      .filter(matchesQuery);

    const filteredGroups = categories
      .map((category) => {
        const items = tools.filter(
          (tool) => tool.category === category.slug && matchesQuery(tool),
        );

        return { category, items };
      })
      .filter((group) => group.items.length > 0);

    return { favoriteItems, filteredGroups };
  }, [categories, deferredQuery, favorites, locale, tools]);

  return (
    <div className="space-y-8">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute top-1/2 left-3.5 z-20 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.searchPlaceholder}
          className="h-11 rounded-xl border-border/70 bg-card pl-10 shadow-2xs text-sm"
        />
      </div>
      {hydrated && favoriteItems.length > 0 ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight sm:text-xl">{dict.myFavorites}</h3>
            <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs tabular-nums">
              {favoriteItems.length}
            </Badge>
          </div>
          <ToolGrid items={favoriteItems} locale={locale} pathPrefix={pathPrefix} />
        </section>
      ) : null}
      {filteredGroups.length ? (
        filteredGroups.map(({ category, items }) => (
          <section key={category.slug} className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg border",
                      getCategoryIconTone(category.slug),
                    )}
                  >
                    <CategoryIcon slug={category.slug} className="size-4" />
                  </span>
                  <h3 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {category.title[locale]}
                  </h3>
                </div>
                <p className="max-w-3xl pl-[2.625rem] text-sm leading-6 text-muted-foreground">
                  {category.description[locale]}
                </p>
              </div>
              <Badge
                variant="outline"
                className="w-fit rounded-full px-2.5 py-0.5 text-xs tabular-nums"
              >
                {items.length}
              </Badge>
            </div>
            <ToolGrid items={items} locale={locale} pathPrefix={pathPrefix} />
          </section>
        ))
      ) : (
        <Card className="rounded-2xl border-dashed shadow-none">
          <CardContent>
            <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">
              {dict.searchEmpty}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
