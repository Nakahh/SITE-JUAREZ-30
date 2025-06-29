"use client"

import { useEffect, useState } from "react"

interface MapEmbedProps {
  location: string
}

export function MapEmbed({ location }: MapEmbedProps) {
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  useEffect(() => {
    // Codifica a localização para ser usada na URL do Google Maps
    const encodedLocation = encodeURIComponent(location)
    // URL de um iframe simples do Google Maps. Para mais controle, use a API JavaScript do Google Maps.
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "your_google_maps_api_key_here"
    const url = `https://www.google.com/maps/embed/v1/place?key=${googleMapsApiKey}&q=${encodedLocation}`
    setMapUrl(url)
  }, [location])

  if (!mapUrl) {
    return (
      <div className="w-full h-64 bg-gray-200 rounded-md flex items-center justify-center text-muted-foreground">
        Carregando mapa...
      </div>
    )
  }

  return (
    <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={mapUrl}
        title={`Mapa de ${location}`}
      ></iframe>
    </div>
  )
}
