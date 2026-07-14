"use client";

import { ClipboardPaste, FileIcon, ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type FileDropzoneProps = {
  accept?: string;
  multiple?: boolean;
  label: string;
  hint?: string;
  /** Optional currently selected files for display */
  files?: File[];
  disabled?: boolean;
  className?: string;
  /** Micro copy under the title (defaults are bilingual-friendly English). */
  pickLabel?: string;
  pasteLabel?: string;
  /** Called with accepted files (already filtered). Multi: all; single: one file max. */
  onFiles: (files: File[]) => void;
  onClear?: () => void;
};

function normalizeAccept(accept?: string) {
  if (!accept?.trim()) {
    return [] as string[];
  }
  return accept
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function fileMatchesAccept(file: File, tokens: string[]) {
  if (tokens.length === 0) {
    return true;
  }

  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }
    if (token.endsWith("/*")) {
      const prefix = token.slice(0, -1);
      return type.startsWith(prefix);
    }
    return type === token || name.endsWith(token.replace(/^\./, "."));
  });
}

function filterFiles(fileList: File[] | FileList, accept?: string, multiple = false) {
  const tokens = normalizeAccept(accept);
  const matched = Array.from(fileList).filter((file) => fileMatchesAccept(file, tokens));
  if (!matched.length) {
    return [] as File[];
  }
  return multiple ? matched : matched.slice(0, 1);
}

function formatBytes(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageAccept(accept?: string) {
  if (!accept) {
    return false;
  }
  return accept.toLowerCase().includes("image");
}

export function FileDropzone({
  accept,
  multiple = false,
  label,
  hint,
  files,
  disabled = false,
  className,
  pickLabel,
  pasteLabel = "Paste / 粘贴",
  onFiles,
  onClear,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputId = useId();
  const [dragOver, setDragOver] = useState(false);
  const [pasteArmed, setPasteArmed] = useState(false);

  const emitFiles = useCallback(
    (incoming: File[] | FileList) => {
      if (disabled) {
        return;
      }
      const next = filterFiles(incoming, accept, multiple);
      if (next.length) {
        onFiles(next);
      }
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    },
    [accept, disabled, multiple, onFiles],
  );

  useEffect(() => {
    function onPaste(event: ClipboardEvent) {
      if (disabled) {
        return;
      }

      // Prefer the focused / hovered dropzone; ignore if neither.
      const root = rootRef.current;
      if (!root) {
        return;
      }
      const focusedInside = root.contains(document.activeElement);
      if (!pasteArmed && !focusedInside) {
        return;
      }

      const clipboardFiles = event.clipboardData?.files;
      if (!clipboardFiles?.length) {
        return;
      }

      const next = filterFiles(clipboardFiles, accept, multiple);
      if (!next.length) {
        return;
      }

      event.preventDefault();
      onFiles(next);
    }

    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [accept, disabled, multiple, onFiles, pasteArmed]);

  const Icon = isImageAccept(accept) ? ImageIcon : FileIcon;
  const selected = files?.filter(Boolean) ?? [];

  return (
    <div className={cn("grid gap-3", className)}>
      <div
        ref={rootRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-label={label}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 text-center outline-none transition-colors",
          "focus-visible:ring-2 focus-visible:ring-ring/50",
          disabled && "pointer-events-none opacity-50",
          dragOver
            ? "border-foreground/40 bg-muted/50"
            : "border-border bg-card hover:border-foreground/25 hover:bg-muted/20",
        )}
        onClick={() => {
          if (!disabled) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onMouseEnter={() => setPasteArmed(true)}
        onMouseLeave={() => setPasteArmed(false)}
        onFocus={() => setPasteArmed(true)}
        onBlur={() => setPasteArmed(false)}
        onDragEnter={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) {
            setDragOver(true);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (!disabled) {
            setDragOver(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setDragOver(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setDragOver(false);
          emitFiles(event.dataTransfer.files);
        }}
      >
        <Upload className="mb-3 size-8 text-muted-foreground" />
        <div className="space-y-1.5">
          <p className="text-base font-medium sm:text-lg">{label}</p>
          {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
          <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Upload className="size-3.5" />
              {pickLabel ??
                (multiple
                  ? "Drag / click · 拖拽/选择（多文件）"
                  : "Drag / click · 拖拽/选择")}
            </span>
            <span className="inline-flex items-center gap-1">
              <ClipboardPaste className="size-3.5" />
              {pasteLabel}
            </span>
          </p>
        </div>
        <input
          id={inputId}
          ref={inputRef}
          className="hidden"
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(event) => emitFiles(event.target.files ?? [])}
        />
      </div>

      {selected.length > 0 ? (
        <ul className="grid gap-2">
          {selected.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-3 py-2.5"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border/60 bg-muted/40 text-muted-foreground">
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
              </div>
              {onClear && !multiple ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0"
                  aria-label="Clear file"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClear();
                  }}
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
