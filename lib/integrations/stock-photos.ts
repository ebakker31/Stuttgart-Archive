import { config } from "@/lib/config";

/**
 * Stock photo provider for demo imagery. Pulls real, license-clean photos from
 * Pexels or Unsplash (both licenses permit this use) when an API key is set.
 *
 * Resolution order:
 *   1. PEXELS_API_KEY  → Pexels API (recommended; simple + generous free tier)
 *   2. UNSPLASH_ACCESS_KEY → Unsplash API
 *   3. DEMO_PHOTO_SOURCE=loremflickr → keyword photos from LoremFlickr (no key,
 *      Creative-Commons Flickr images; fine for a demo, attribute for production)
 *   4. otherwise → none (the UI falls back to original car illustrations)
 *
 * Results are cached in-process so a page render makes very few API calls.
 */

type PhotoSource = "pexels" | "unsplash" | "loremflickr" | "none";

const cache = new Map<string, string[]>();

function activeSource(): PhotoSource {
  if (config.stockPhotos.pexelsKey) return "pexels";
  if (config.stockPhotos.unsplashKey) return "unsplash";
  if (config.stockPhotos.source === "loremflickr") return "loremflickr";
  return "none";
}

export function stockPhotosEnabled(): boolean {
  return activeSource() !== "none";
}

export async function carPhotos(query: string, count = 1, seed = 1): Promise<string[]> {
  const source = activeSource();
  const key = `${source}:${query}:${count}:${seed}`;
  if (cache.has(key)) return cache.get(key)!;

  let urls: string[] = [];
  try {
    if (source === "pexels") urls = await fromPexels(query, count);
    else if (source === "unsplash") urls = await fromUnsplash(query, count);
    else if (source === "loremflickr") urls = fromLoremFlickr(query, count, seed);
  } catch {
    urls = [];
  }

  cache.set(key, urls);
  return urls;
}

async function fromPexels(query: string, count: number): Promise<string[]> {
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: config.stockPhotos.pexelsKey }, next: { revalidate: 86400 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.photos ?? []).map((p: any) => p?.src?.large || p?.src?.medium).filter(Boolean);
}

async function fromUnsplash(query: string, count: number): Promise<string[]> {
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${config.stockPhotos.unsplashKey}` }, next: { revalidate: 86400 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).map((p: any) => p?.urls?.regular).filter(Boolean);
}

function fromLoremFlickr(query: string, count: number, seed: number): string[] {
  const tag = encodeURIComponent(query.replace(/\s+/g, ","));
  return Array.from({ length: count }, (_, i) => `https://loremflickr.com/1200/750/${tag}?lock=${seed + i}`);
}
