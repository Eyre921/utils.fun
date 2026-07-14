"use client";

import { FileDropzone, type FileDropzoneProps } from "@/components/file-dropzone";

/** @deprecated Prefer `FileDropzone` — kept for PDF tool imports. */
export function PdfDropzone(props: FileDropzoneProps) {
  return <FileDropzone {...props} />;
}
