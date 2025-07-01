"use client";

import { lazy, Suspense, ComponentType } from "react";
import { Loader2 } from "lucide-react";

// Loading component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

// Skeleton components for better UX
const PropertyCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-24" />
        <div className="h-8 bg-gray-200 rounded w-20" />
      </div>
    </div>
  </div>
);

const ArticleCardSkeleton = () => (
  <div className="border rounded-lg overflow-hidden animate-pulse">
    <div className="aspect-video bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="flex items-center space-x-2">
        <div className="h-3 bg-gray-200 rounded-full w-16" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="h-8 bg-gray-200 rounded w-16" />
    </div>
  </div>
);

const TestimonialSkeleton = () => (
  <div className="border rounded-lg p-6 animate-pulse">
    <div className="flex items-center space-x-2 mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
      ))}
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-4/5" />
    </div>
    <div className="flex items-center space-x-3">
      <div className="h-10 w-10 bg-gray-200 rounded-full" />
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-2 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </div>
);

// Lazy loaded components with proper error boundaries
const withLazyLoading = <P extends object>(
  componentImporter: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ComponentType,
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>,
) => {
  const LazyComponent = lazy(componentImporter);

  return (props: P) => (
    <Suspense fallback={fallback ? <fallback /> : <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

// Pre-configured lazy components
export const LazyPropertyCard = withLazyLoading(
  () =>
    import("./enhanced-property-card").then((module) => ({
      default: module.EnhancedPropertyCard,
    })),
  PropertyCardSkeleton,
);

export const LazyFloatingChatBubble = withLazyLoading(
  () =>
    import("./floating-chat-bubble").then((module) => ({
      default: module.FloatingChatBubble,
    })),
  () => null, // No skeleton for chat bubble
);

export const LazyNewsletterForm = withLazyLoading(
  () =>
    import("./newsletter-form").then((module) => ({
      default: module.NewsletterForm,
    })),
  () => (
    <div className="h-32 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <LoadingSpinner />
    </div>
  ),
);

export const LazyMapEmbed = withLazyLoading(
  () => import("./map-embed").then((module) => ({ default: module.MapEmbed })),
  () => (
    <div className="aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-gray-500">Carregando mapa...</div>
    </div>
  ),
);

export const LazyScheduleVisitForm = withLazyLoading(
  () =>
    import("./schedule-visit-form").then((module) => ({
      default: module.ScheduleVisitForm,
    })),
  () => (
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded w-24 animate-pulse" />
    </div>
  ),
);

export const LazyImageUpload = withLazyLoading(
  () =>
    import("./image-upload").then((module) => ({
      default: module.ImageUpload,
    })),
  () => (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center animate-pulse">
      <div className="h-8 w-8 bg-gray-200 rounded mx-auto mb-2" />
      <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
    </div>
  ),
);

// Higher-order component for intersection observer based lazy loading
export const withIntersectionObserver = <P extends object>(
  Component: ComponentType<P>,
  options: IntersectionObserverInit = {},
) => {
  return (props: P) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.1,
          rootMargin: "50px",
          ...options,
        },
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, []);

    return (
      <div ref={elementRef}>
        {isVisible ? <Component {...props} /> : <LoadingSpinner />}
      </div>
    );
  };
};

// Virtual scrolling component for large lists
export const VirtualScrollList = <T extends any>({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
}) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length - 1,
  );

  const visibleItems = items.slice(
    Math.max(0, startIndex - overscan),
    endIndex + 1,
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = Math.max(0, startIndex - overscan) * itemHeight;

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) =>
            renderItem(item, Math.max(0, startIndex - overscan) + index),
          )}
        </div>
      </div>
    </div>
  );
};

// Lazy section component with visibility detection
export const LazySection = ({
  children,
  fallback,
  threshold = 0.1,
  rootMargin = "50px",
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={sectionRef}>
      {isVisible ? children : fallback || <LoadingSpinner />}
    </div>
  );
};

// Export skeletons for direct use
export {
  PropertyCardSkeleton,
  ArticleCardSkeleton,
  TestimonialSkeleton,
  LoadingSpinner,
};
