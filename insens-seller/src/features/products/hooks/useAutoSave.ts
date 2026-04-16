"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export type AutoSaveStatus = "idle" | "saving" | "saved" | "error";

const DEBOUNCE_MS = 1200;

interface UseAutoSaveOptions<T> {
  key:  string;
  data: T;
  enabled?: boolean;
}

export function useAutoSave<T>({ key, data, enabled = true }: UseAutoSaveOptions<T>) {
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("saving");

    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify({ data, savedAt: Date.now() }));
        if (mountedRef.current) setStatus("saved");
      } catch {
        if (mountedRef.current) setStatus("error");
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, JSON.stringify(data), enabled]);

  const restoreDraft = useCallback((): { data: T; savedAt: number } | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }, [key]);

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(key); } catch { /* noop */ }
    setStatus("idle");
  }, [key]);

  return { status, restoreDraft, clearDraft };
}
