/** Base URL for the Cloudflare Worker (no trailing slash). */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_URL as string;
  if (!base) {
    throw new Error("VITE_API_URL is not configured");
  }
  return base.replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalized}`;
}
