import prisma from "@/lib/prisma";
import { cache, CACHE_KEYS } from "@/lib/cache";
import { unstable_cache } from "next/cache";

// Optimized query configurations
const QUERY_CONFIG = {
  properties: {
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      type: true,
      address: true,
      city: true,
      state: true,
      images: true,
      featured: true,
      createdAt: true,
      agent: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  },
  articles: {
    select: {
      id: true,
      title: true,
      slug: true,
      createdAt: true,
      published: true,
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  },
  testimonials: {
    select: {
      id: true,
      content: true,
      rating: true,
      approved: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  },
};

// Cached database queries with Next.js unstable_cache
export const getFeaturedProperties = unstable_cache(
  async () => {
    try {
      const properties = await prisma.property.findMany({
        where: { featured: true },
        ...QUERY_CONFIG.properties,
        take: 6, // Increased for better coverage
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });

      return properties.map((property) => ({
        ...property,
        images: processPropertyImages(property.images),
      }));
    } catch (error) {
      console.error("Error fetching featured properties:", error);
      return [];
    }
  },
  ["featured-properties"],
  {
    revalidate: 300, // 5 minutes
    tags: ["properties", "featured"],
  },
);

export const getRecentArticles = unstable_cache(
  async () => {
    try {
      return await prisma.article.findMany({
        where: { published: true },
        ...QUERY_CONFIG.articles,
        take: 6,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching recent articles:", error);
      return [];
    }
  },
  ["recent-articles"],
  {
    revalidate: 600, // 10 minutes
    tags: ["articles"],
  },
);

export const getTestimonials = unstable_cache(
  async () => {
    try {
      return await prisma.testimonial.findMany({
        where: { approved: true },
        ...QUERY_CONFIG.testimonials,
        take: 6,
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      return [];
    }
  },
  ["testimonials"],
  {
    revalidate: 1800, // 30 minutes
    tags: ["testimonials"],
  },
);

export const getStats = unstable_cache(
  async () => {
    try {
      const [totalProperties, totalUsers, totalArticles, avgRating] =
        await Promise.all([
          prisma.property.count(),
          prisma.user.count({ where: { role: "USER" } }),
          prisma.article.count({ where: { published: true } }),
          prisma.testimonial.aggregate({
            where: { approved: true },
            _avg: { rating: true },
          }),
        ]);

      return {
        totalProperties,
        totalUsers,
        totalArticles,
        avgRating: avgRating._avg.rating || 5,
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      return {
        totalProperties: 500,
        totalUsers: 1000,
        totalArticles: 50,
        avgRating: 4.8,
      };
    }
  },
  ["site-stats"],
  {
    revalidate: 3600, // 1 hour
    tags: ["stats"],
  },
);

// Optimized property search with filters
export const searchProperties = unstable_cache(
  async (filters: {
    city?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }) => {
    try {
      const { city, type, minPrice, maxPrice, page = 1, limit = 12 } = filters;

      const where: any = {};

      if (city) {
        where.city = {
          contains: city,
          mode: "insensitive",
        };
      }

      if (type && type !== "all") {
        where.type = type;
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = minPrice;
        if (maxPrice) where.price.lte = maxPrice;
      }

      const skip = (page - 1) * limit;

      const [properties, total] = await Promise.all([
        prisma.property.findMany({
          where,
          ...QUERY_CONFIG.properties,
          skip,
          take: limit,
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        }),
        prisma.property.count({ where }),
      ]);

      return {
        properties: properties.map((property) => ({
          ...property,
          images: processPropertyImages(property.images),
        })),
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("Error searching properties:", error);
      return {
        properties: [],
        total: 0,
        pages: 0,
        currentPage: 1,
      };
    }
  },
  ["search-properties"],
  {
    revalidate: 300, // 5 minutes
    tags: ["properties", "search"],
  },
);

// Get single property with optimizations
export const getProperty = unstable_cache(
  async (id: string) => {
    try {
      const property = await prisma.property.findUnique({
        where: { id },
        include: {
          agent: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              image: true,
            },
          },
          reviews: {
            take: 5,
            orderBy: { createdAt: "desc" },
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                },
              },
            },
          },
          _count: {
            select: {
              reviews: true,
              favorites: true,
            },
          },
        },
      });

      if (!property) return null;

      return {
        ...property,
        images: processPropertyImages(property.images),
      };
    } catch (error) {
      console.error("Error fetching property:", error);
      return null;
    }
  },
  ["property"],
  {
    revalidate: 600, // 10 minutes
    tags: ["properties", "property-detail"],
  },
);

// Batch query for homepage data
export const getHomePageData = unstable_cache(
  async () => {
    try {
      const [featuredProperties, recentArticles, testimonials, stats] =
        await Promise.all([
          getFeaturedProperties(),
          getRecentArticles(),
          getTestimonials(),
          getStats(),
        ]);

      return {
        featuredProperties: featuredProperties.slice(0, 3), // Limit to 3 for homepage
        recentArticles: recentArticles.slice(0, 3),
        testimonials: testimonials.slice(0, 3),
        stats,
      };
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      return {
        featuredProperties: [],
        recentArticles: [],
        testimonials: [],
        stats: {
          totalProperties: 500,
          totalUsers: 1000,
          totalArticles: 50,
          avgRating: 4.8,
        },
      };
    }
  },
  ["homepage-data"],
  {
    revalidate: 300, // 5 minutes
    tags: ["homepage", "properties", "articles", "testimonials", "stats"],
  },
);

// Utility function to process property images
function processPropertyImages(images: any): string[] {
  if (!images) return ["/placeholder-property.svg"];

  let imageArray: any[] = [];

  if (typeof images === "string") {
    try {
      imageArray = JSON.parse(images);
    } catch {
      return ["/placeholder-property.svg"];
    }
  } else if (Array.isArray(images)) {
    imageArray = images;
  } else {
    return ["/placeholder-property.svg"];
  }

  const validImages = imageArray
    .map(validateImageUrl)
    .filter((url) => url !== "/placeholder-property.svg");

  return validImages.length > 0 ? validImages : ["/placeholder-property.svg"];
}

function validateImageUrl(url: any): string {
  if (!url) return "/placeholder-property.svg";
  if (typeof url !== "string") return "/placeholder-property.svg";
  if (url.length <= 1) return "/placeholder-property.svg";
  if (url.startsWith("[") || url === "[") return "/placeholder-property.svg";
  if (!url.startsWith("/") && !url.startsWith("http"))
    return "/placeholder-property.svg";
  return url;
}

// Cache invalidation helpers
export async function invalidateCache(tags: string[]) {
  try {
    const { revalidateTag } = await import("next/cache");
    tags.forEach((tag) => revalidateTag(tag));
  } catch (error) {
    console.error("Error invalidating cache:", error);
  }
}

export async function invalidatePropertyCache() {
  await invalidateCache(["properties", "featured", "homepage"]);
}

export async function invalidateArticleCache() {
  await invalidateCache(["articles", "homepage"]);
}

export async function invalidateTestimonialCache() {
  await invalidateCache(["testimonials", "homepage"]);
}

// Performance monitoring for queries
export function logQueryPerformance(queryName: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;

  if (duration > 1000) {
    // Log slow queries (>1s)
    console.warn(
      `Slow query detected: ${queryName} took ${duration.toFixed(2)}ms`,
    );
  }
}
