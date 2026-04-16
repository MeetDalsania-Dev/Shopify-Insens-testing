"use client";

import { useRef, useState, DragEvent } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

interface ImageUploadZoneProps {
  value?:       string;        // current URL / data URL
  onChange:     (url: string) => void;
  onClear?:     () => void;
  label?:       string;
  hint?:        string;
  required?:    boolean;
  aspectRatio?: "square" | "landscape";
  error?:       string;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result as string);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });
}

function isValidImage(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type)
    && file.size <= 5 * 1024 * 1024; // 5 MB
}

export function ImageUploadZone({
  value,
  onChange,
  onClear,
  label,
  hint,
  required,
  aspectRatio = "square",
  error,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging]   = useState(false);
  const [loading,  setLoading]    = useState(false);
  const [fileErr,  setFileErr]    = useState<string | null>(null);

  const process = async (file: File) => {
    setFileErr(null);
    if (!isValidImage(file)) {
      setFileErr("File must be JPG/PNG/WebP, max 5 MB");
      return;
    }
    setLoading(true);
    try {
      const url = await readAsDataURL(file);
      onChange(url);
    } catch {
      setFileErr("Failed to read file");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) process(file);
  };

  const aspectClass = aspectRatio === "square" ? "aspect-square" : "aspect-[4/3]";

  return (
    <div className="space-y-1.5">
      {label && (
        <p className="text-sm font-medium text-foreground">
          {label}{required && <span className="ml-0.5 text-red-500">*</span>}
        </p>
      )}

      <div className={cn("relative w-full rounded-xl border-2 border-dashed transition-colors", aspectClass,
        value ? "border-transparent" : dragging ? "border-gold-400 bg-gold-50" : "border-border hover:border-oud-300 hover:bg-oud-50/50",
      )}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label ?? "Uploaded image"}
              fill
              className="rounded-xl object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => { onChange(""); onClear?.(); setFileErr(null); }}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground"
          >
            {loading ? (
              <Loader2 className="h-8 w-8 animate-spin text-gold-500" />
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-oud-100">
                  <ImageIcon className="h-6 w-6 text-oud-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    Drop image here or{" "}
                    <span className="text-gold-600 underline underline-offset-2">browse</span>
                  </p>
                  {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
                </div>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) process(file);
          e.target.value = ""; // reset so same file can be re-selected
        }}
      />

      {(fileErr || error) && (
        <p className="text-xs text-destructive">{fileErr ?? error}</p>
      )}
    </div>
  );
}
