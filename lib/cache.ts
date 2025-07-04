import { LRUCache } from "lru-cache";

// Memory cache configuration
const memoryCache = new LRUCache<string, any>({
  max: 500, // Maximum number of items
  ttl: 1000 * 60 * 15, // 15 minutes TTL
  allowStale: true,
  updateAgeOnGet: true,
  updateAgeOnHas: true,
});

// Cache keys
export const CACHE_KEYS = {
  PROPERTIES_FEATURED: "properties:featured",
  PROPERTIES_ALL: "properties:all",
  ARTICLES_RECENT: "articles:recent",
  TESTIMONIALS: "testimonials",
  STATS: "stats",
  AGENTS: "agents",
} as const;

// Cache configuration per type
const CACHE_CONFIG = {
  [CACHE_KEYS.PROPERTIES_FEATURED]: { ttl: 1000 * 60 * 10 }, // 10 minutes
  [CACHE_KEYS.PROPERTIES_ALL]: { ttl: 1000 * 60 * 5 }, // 5 minutes
  [CACHE_KEYS.ARTICLES_RECENT]: { ttl: 1000 * 60 * 30 }, // 30 minutes
  [CACHE_KEYS.TESTIMONIALS]: { ttl: 1000 * 60 * 60 }, // 1 hour
  [CACHE_KEYS.STATS]: { ttl: 1000 * 60 * 60 * 2 }, // 2 hours
  [CACHE_KEYS.AGENTS]: { ttl: 1000 * 60 * 60 }, // 1 hour
};

export class CacheManager {
  private static instance: CacheManager;
  private cache: LRUCache<string, any>;

  private constructor() {
    this.cache = memoryCache;
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  // Get item from cache
  get<T>(key: string): T | undefined {
    try {
      return this.cache.get(key) as T;
    } catch (error) {
      console.warn("Cache get error:", error);
      return undefined;
    }
  }

  // Set item in cache
  set<T>(key: string, value: T, customTtl?: number): boolean {
    try {
      const config = CACHE_CONFIG[key as keyof typeof CACHE_CONFIG];
      const ttl = customTtl || config?.ttl || 1000 * 60 * 15; // Default 15 minutes

      this.cache.set(key, value, { ttl });
      return true;
    } catch (error) {
      console.warn("Cache set error:", error);
      return false;
    }
  }

  // Delete item from cache
  delete(key: string): boolean {
    try {
      return this.cache.delete(key);
    } catch (error) {
      console.warn("Cache delete error:", error);
      return false;
    }
  }

  // Clear all cache
  clear(): void {
    try {
      this.cache.clear();
    } catch (error) {
      console.warn("Cache clear error:", error);
    }
  }

  // Check if key exists
  has(key: string): boolean {
    try {
      return this.cache.has(key);
    } catch (error) {
      console.warn("Cache has error:", error);
      return false;
    }
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      max: this.cache.max,
      calculatedSize: this.cache.calculatedSize,
    };
  }

  // Invalidate related caches
  invalidatePattern(pattern: string): void {
    try {
      const keys = Array.from(this.cache.keys());
      keys.forEach((key) => {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      });
    } catch (error) {
      console.warn("Cache invalidate pattern error:", error);
    }
  }
}

// Cache decorator for functions
export function withCache<T extends (...args: any[]) => Promise<any>>(
  key: string,
  ttl?: number,
) {
  return function (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<T>,
  ) {
    const method = descriptor.value!;

    descriptor.value = async function (this: any, ...args: any[]) {
      const cache = CacheManager.getInstance();
      const cacheKey = `${key}:${JSON.stringify(args)}`;

      // Try to get from cache first
      const cached = cache.get(cacheKey);
      if (cached !== undefined) {
        return cached;
      }

      // Execute the original method
      const result = await method.apply(this, args);

      // Store in cache
      cache.set(cacheKey, result, ttl);

      return result;
    } as T;

    return descriptor;
  };
}

// Utility functions
export const cache = CacheManager.getInstance();

// Cached fetch wrapper
export async function cachedFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number,
): Promise<T> {
  const cached = cache.get<T>(key);

  if (cached !== undefined) {
    return cached;
  }

  const result = await fetcher();
  cache.set(key, result, ttl);

  return result;
}

// Browser storage cache (for client-side persistence)
export class BrowserCache {
  private static prefix = "siqueira_cache_";

  static set(key: string, value: any, ttl: number = 1000 * 60 * 15): boolean {
    if (typeof window === "undefined") return false;

    try {
      const item = {
        value,
        expiry: Date.now() + ttl,
      };

      localStorage.setItem(this.prefix + key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.warn("Browser cache set error:", error);
      return false;
    }
  }

  static get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const itemStr = localStorage.getItem(this.prefix + key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);

      // Check if expired
      if (Date.now() > item.expiry) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.warn("Browser cache get error:", error);
      return null;
    }
  }

  static delete(key: string): boolean {
    if (typeof window === "undefined") return false;

    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.warn("Browser cache delete error:", error);
      return false;
    }
  }

  static clear(): boolean {
    if (typeof window === "undefined") return false;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.warn("Browser cache clear error:", error);
      return false;
    }
  }
}

// Image cache for better performance
export class ImageCache {
  private static cache = new Map<string, HTMLImageElement>();

  static preload(urls: string[]): Promise<void[]> {
    const promises = urls.map((url) => this.preloadSingle(url));
    return Promise.allSettled(promises).then(() => []);
  }

  static preloadSingle(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.cache.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      img.onload = () => {
        this.cache.set(url, img);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  static get(url: string): HTMLImageElement | undefined {
    return this.cache.get(url);
  }

  static clear(): void {
    this.cache.clear();
  }
}
