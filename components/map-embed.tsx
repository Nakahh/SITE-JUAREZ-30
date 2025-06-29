
"use client";

import { useEffect, useRef } from "react";

interface MapEmbedProps {
  address: string;
  city: string;
  state: string;
  className?: string;
}

export function MapEmbed({ address, city, state, className = "" }: MapEmbedProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current) return;

      const fullAddress = `${address}, ${city}, ${state}, Brasil`;
      const encodedAddress = encodeURIComponent(fullAddress);
      
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodedAddress}`;
      iframe.width = "100%";
      iframe.height = "100%";
      iframe.style.border = "0";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "no-referrer-when-downgrade";

      mapRef.current.appendChild(iframe);
    };

    loadMap();
  }, [address, city, state]);

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full min-h-[300px] rounded-lg overflow-hidden ${className}`}
    />
  );
}
