"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  quality = 85,
  placeholder = "empty",
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip lazy loading for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before the image comes into view
        threshold: 0.1,
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Generate placeholder blur data URL
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#f3f4f6";
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL =
    blurDataURL ||
    (width && height ? generateBlurDataURL(width, height) : undefined);

  return (
    <div
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        fill && "w-full h-full",
        className,
      )}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse",
            "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
            "before:transform before:-skew-x-12 before:animate-[shimmer_1.5s_ease-in-out_infinite]",
          )}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-100 flex items-center justify-center",
            "text-gray-400 text-sm",
          )}
        >
          <div className="text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p>Imagem não disponível</p>
          </div>
        </div>
      )}

      {/* Actual image - only render when in view */}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={defaultBlurDataURL}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            fill && "object-cover",
          )}
          {...props}
        />
      )}
    </div>
  );
}

// Custom hook for image preloading
export function useImagePreloader(urls: string[]) {
  useEffect(() => {
    const preloadImages = urls.map((url) => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
    });

    Promise.allSettled(preloadImages);
  }, [urls]);
}
