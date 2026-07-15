import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";

import { ScrollBottomButton } from "@/components/scroll-bottom-button";
import { SiteConfigProvider } from "@/components/providers/site-config-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { getDictionary } from "@/lib/i18n";
import { getPreferredLocale } from "@/lib/locale-server";
import { getLocaleDirection, getLocaleHtmlLang } from "@/lib/locale";
import { getSiteConfig } from "@/lib/site.server";
import {
  getInitialBodyStyle,
  getInitialHtmlClassName,
  getInitialHtmlStyle,
  getThemeColor,
  getThemeMetaDefinitions,
  getThemeBootstrapScript,
  normalizeThemePreference,
  resolveThemeMode,
  THEME_COOKIE_NAME,
} from "@/lib/theme-preferences";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getPreferredLocale();
  const siteConfig = getSiteConfig(locale);

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.title,
      template: `%s ${siteConfig.titleSeparator} ${siteConfig.title}`,
    },
    applicationName: siteConfig.title,
    description: siteConfig.description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
        ...(siteConfig.logo
          ? [{ url: siteConfig.logo.src, type: "image/png", sizes: "72x72" }]
          : []),
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = await getPreferredLocale();
  const dict = getDictionary(locale);
  const siteConfig = getSiteConfig(locale);
  const preference = normalizeThemePreference(cookieStore.get(THEME_COOKIE_NAME)?.value);
  const mode = resolveThemeMode(preference);
  const backgroundColor = getThemeColor(mode);
  const htmlClassName = getInitialHtmlClassName(preference);
  const htmlStyle = getInitialHtmlStyle(preference, mode, backgroundColor);
  const bodyStyle = getInitialBodyStyle(backgroundColor);
  const themeMetaDefinitions = getThemeMetaDefinitions(preference);
  const bootstrapScript = getThemeBootstrapScript();

  return (
    <html
      lang={getLocaleHtmlLang(locale)}
      dir={getLocaleDirection(locale)}
      suppressHydrationWarning
      className={htmlClassName}
      style={htmlStyle}
    >
      <head>
        {themeMetaDefinitions.map((definition) => (
          <meta
            key={definition.slot}
            name="theme-color"
            data-theme-color={definition.slot}
            content={definition.color}
            media={definition.media}
          />
        ))}
        <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      </head>
      <body style={bodyStyle}>
        <SiteConfigProvider value={siteConfig}>
          <ThemeProvider>
            {children}
            <ScrollBottomButton
              labels={{
                top: dict.scrollToTop,
                bottom: dict.scrollToBottom,
              }}
            />
          </ThemeProvider>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
