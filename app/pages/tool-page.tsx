import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { ToolFavoriteButton } from "@/components/tool-favorite-button";
import { Button } from "@/components/ui/button";
import { ToolIconWell } from "@/components/tool-icon";
import { ToolWorkbench } from "@/components/tool-workbench";
import { getDictionary } from "@/lib/i18n";
import { getHomePath, type PathPrefix } from "@/lib/locale";
import { getTool, type Locale } from "@/lib/tools";

export function ToolPage({
  locale,
  pathPrefix,
  slug,
}: {
  locale: Locale;
  pathPrefix: PathPrefix;
  slug: string;
}) {
  const dict = getDictionary(locale);
  const tool = getTool(slug);

  if (!tool) {
    return null;
  }

  const homePath = getHomePath(pathPrefix);

  return (
    <div className="min-w-0 space-y-8">
      <section className="border-b border-border/60 pb-7">
        <div className="flex items-start gap-4 sm:gap-5">
          <ToolIconWell
            slug={tool.slug}
            className="size-12 rounded-2xl sm:size-14"
            iconClassName="size-6 sm:size-7"
            eagerIcon
          />
          <div className="min-w-0 flex-1 space-y-2 sm:space-y-2.5">
            <div className="flex items-start justify-between gap-3">
              <h1 className="min-w-0 flex-1 text-2xl font-semibold tracking-tight sm:text-3xl sm:leading-tight">
                {tool.title[locale]}
              </h1>
              <ToolFavoriteButton
                slug={tool.slug}
                locale={locale}
                title={tool.title[locale]}
                addLabel={dict.addFavorite}
                removeLabel={dict.removeFavorite}
                className="size-10 shrink-0"
              />
            </div>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {tool.description[locale]}
            </p>
          </div>
        </div>
      </section>

      <ToolWorkbench tool={tool} locale={locale} dict={dict} />

      <div className="w-full pt-1">
        <Button asChild variant="ghost" className="rounded-xl px-3 text-muted-foreground no-underline hover:text-foreground hover:no-underline">
          <Link href={homePath} scroll className="no-underline hover:no-underline">
            <ArrowLeft className="size-4" />
            {dict.backHome}
          </Link>
        </Button>
      </div>
    </div>
  );
}
