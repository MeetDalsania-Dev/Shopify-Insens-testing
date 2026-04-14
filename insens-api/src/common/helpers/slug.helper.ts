/**
 * Convert a display name to a URL-safe slug.
 * e.g. "Attar & Co." → "attar-co"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word chars except spaces and hyphens
    .replace(/[\s_]+/g, '-')    // spaces/underscores → hyphen
    .replace(/-+/g, '-')        // collapse multiple hyphens
    .replace(/^-|-$/g, '');     // strip leading/trailing hyphens
}

/**
 * Append a short random suffix to make a slug unique.
 * e.g. "rose-shop" → "rose-shop-a3f2"
 */
export function uniqueSlug(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}
