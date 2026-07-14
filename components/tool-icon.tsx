import type { LucideProps, LucideIcon } from "lucide-react";
import {
  AlarmClock,
  BadgeDollarSign,
  Binary,
  Barcode,
  Braces,
  CalendarCheck,
  CalendarClock,
  CalendarRange,
  CaseSensitive,
  CaseUpper,
  Calculator,
  CircleDollarSign,
  Clock3,
  CodeXml,
  Database,
  Dices,
  ArrowUpDown,
  FileImage,
  FileText,
  FileCog,
  FileCode2,
  FileDigit,
  FileJson2,
  Files,
  Fingerprint,
  Globe2,
  Hash,
  ImageDown,
  ImageUp,
  Images,
  KeyRound,
  KeySquare,
  Languages,
  Link2,
  ListFilter,
  LockKeyhole,
  NotebookText,
  Palette,
  QrCode,
  Rabbit,
  Regex,
  RotateCw,
  ScanLine,
  ScanText,
  Scale,
  ScreenShare,
  ShieldEllipsis,
  Shuffle,
  Split,
  Sparkles,
  SpellCheck,
  SquareCode,
  Stamp,
  SwatchBook,
  Trash2,
  Eraser,
  IdCard,
  WandSparkles,
  WalletCards,
  Webhook,
} from "lucide-react";

import type { CategorySlug, ToolSlug } from "@/lib/tools";
import { cn } from "@/lib/utils";

/** Soft tint wells — distinct hues so dense tool grids stay scannable */
const TOOL_ICON_TONES = [
  "border-sky-500/20 bg-sky-500/12 text-sky-600 dark:text-sky-400",
  "border-violet-500/20 bg-violet-500/12 text-violet-600 dark:text-violet-400",
  "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  "border-amber-500/20 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  "border-rose-500/20 bg-rose-500/12 text-rose-600 dark:text-rose-400",
  "border-cyan-500/20 bg-cyan-500/12 text-cyan-700 dark:text-cyan-400",
  "border-indigo-500/20 bg-indigo-500/12 text-indigo-600 dark:text-indigo-400",
  "border-orange-500/20 bg-orange-500/12 text-orange-600 dark:text-orange-400",
  "border-teal-500/20 bg-teal-500/12 text-teal-700 dark:text-teal-400",
  "border-fuchsia-500/20 bg-fuchsia-500/12 text-fuchsia-600 dark:text-fuchsia-400",
  "border-lime-500/25 bg-lime-500/12 text-lime-700 dark:text-lime-400",
  "border-blue-500/20 bg-blue-500/12 text-blue-600 dark:text-blue-400",
] as const;

const CATEGORY_ICON_TONES: Record<CategorySlug, string> = {
  generate: "border-violet-500/20 bg-violet-500/12 text-violet-600 dark:text-violet-400",
  image: "border-pink-500/20 bg-pink-500/12 text-pink-600 dark:text-pink-400",
  pdf: "border-red-500/20 bg-red-500/12 text-red-600 dark:text-red-400",
  encrypt: "border-amber-500/20 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  time: "border-sky-500/20 bg-sky-500/12 text-sky-600 dark:text-sky-400",
  convert: "border-teal-500/20 bg-teal-500/12 text-teal-700 dark:text-teal-400",
  finance: "border-emerald-500/20 bg-emerald-500/12 text-emerald-600 dark:text-emerald-400",
  text: "border-indigo-500/20 bg-indigo-500/12 text-indigo-600 dark:text-indigo-400",
  dev: "border-cyan-500/20 bg-cyan-500/12 text-cyan-700 dark:text-cyan-400",
};

function hashSlug(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 33 + slug.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Stable per-tool well classes (border + bg + icon color). */
export function getToolIconTone(slug: ToolSlug | string) {
  return TOOL_ICON_TONES[hashSlug(slug) % TOOL_ICON_TONES.length];
}

export function getCategoryIconTone(slug: CategorySlug) {
  return CATEGORY_ICON_TONES[slug] ?? TOOL_ICON_TONES[0];
}

const categoryIcons: Record<CategorySlug, LucideIcon> = {
  generate: WandSparkles,
  image: ImageUp,
  pdf: FileText,
  encrypt: LockKeyhole,
  time: Clock3,
  convert: Scale,
  finance: WalletCards,
  text: ScanText,
  dev: SquareCode,
};

const toolIcons: Record<ToolSlug, LucideIcon> = {
  "rand-password": KeyRound,
  qrcode: QrCode,
  "screen-record": ScreenShare,
  "random-number": Dices,
  guid: Fingerprint,
  "random-group": Shuffle,
  watermark: Stamp,
  "image-compress": ImageDown,
  "qrcode-decode": ScanLine,
  barcode: Barcode,
  "merge-pdf": Files,
  "split-pdf": Split,
  "rotate-pdf": RotateCw,
  "pdf-to-images": Images,
  "images-to-pdf": FileImage,
  "remove-pdf-pages": Trash2,
  "reorder-pdf-pages": ArrowUpDown,
  "pdf-watermark": Stamp,
  "pdf-page-numbers": FileDigit,
  "pdf-to-text": ScanText,
  "pdf-metadata-clean": Eraser,
  md5: Fingerprint,
  "file-md5": FileDigit,
  hmac: ShieldEllipsis,
  sha: Hash,
  aes: LockKeyhole,
  rabbit: Rabbit,
  des: KeySquare,
  rc4: KeyRound,
  base64: Binary,
  unicode: Languages,
  url: Link2,
  timestamp: Clock3,
  calculation: CalendarRange,
  world: Globe2,
  "working-day": CalendarCheck,
  "batch-timestamp": CalendarClock,
  "unit-converter": Scale,
  "english-amount": BadgeDollarSign,
  "sum-list": Calculator,
  loan: WalletCards,
  rmb: CircleDollarSign,
  "text-dedupe": ListFilter,
  "emoji-clean": Eraser,
  "id-card-cn": IdCard,
  "simplified-traditional": Languages,
  pinyin: SpellCheck,
  pluralize: CaseSensitive,
  "english-case": CaseUpper,
  "cn-en": Languages,
  trim: ScanText,
  regex: Regex,
  "md-html": FileCode2,
  json: FileJson2,
  "json-to-types": Braces,
  css: Palette,
  js: SquareCode,
  html: CodeXml,
  sql: Database,
  crontab: AlarmClock,
  "naming-converter": NotebookText,
  "color-converter": SwatchBook,
  websocket: Webhook,
  "go-struct-json": Braces,
  less2css: FileCog,
  binary: Binary,
};

export function CategoryIcon({
  slug,
  className,
  ...props
}: LucideProps & { slug: CategorySlug }) {
  const Icon = categoryIcons[slug] ?? Sparkles;
  return <Icon className={cn("size-4", className)} {...props} />;
}

export function ToolIcon({
  slug,
  className,
  ...props
}: LucideProps & { slug: ToolSlug }) {
  const Icon = toolIcons[slug] ?? Sparkles;
  return <Icon className={cn("size-4", className)} {...props} />;
}

/** Colored icon well for tool cards / lists. */
export function ToolIconWell({
  slug,
  className,
  iconClassName,
}: {
  slug: ToolSlug;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-2xs",
        getToolIconTone(slug),
        className,
      )}
    >
      <ToolIcon slug={slug} className={cn("size-5", iconClassName)} />
    </div>
  );
}
