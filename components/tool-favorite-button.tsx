"use client";

import { Star } from "lucide-react";

import { useFavorites } from "@/components/providers/favorites-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type Locale, type ToolSlug } from "@/lib/tools";

export function ToolFavoriteButton({
  slug,
  locale,
  title,
  addLabel,
  removeLabel,
  className,
}: {
  slug: ToolSlug;
  locale: Locale;
  title: string;
  /** Prefer server-passed labels to avoid shipping full i18n dictionaries to the client. */
  addLabel?: string;
  removeLabel?: string;
  className?: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(slug);
  const add = addLabel ?? "Add to favorites";
  const remove = removeLabel ?? "Remove from favorites";
  const label = favorite ? `${remove}: ${title}` : `${add}: ${title}`;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={favorite}
      title={label}
      className={cn(
        "shrink-0 rounded-xl border border-border/70 bg-background text-muted-foreground shadow-sm transition-[transform,background-color,border-color,color,box-shadow] hover:-translate-y-0.5 hover:border-foreground/15 hover:bg-muted hover:text-foreground hover:[&_svg]:scale-110 focus-visible:ring-2 focus-visible:ring-ring/40",
        favorite &&
          "border-amber-400/50 bg-amber-400 text-amber-950 shadow-amber-400/25 hover:border-amber-400/60 hover:bg-amber-400 hover:text-amber-950 dark:border-amber-400/60 dark:bg-amber-400 dark:text-amber-950 dark:hover:bg-amber-300",
        className,
      )}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(slug);
      }}
    >
      <Star className={cn("size-4", favorite && "fill-current")} />
    </Button>
  );
}
