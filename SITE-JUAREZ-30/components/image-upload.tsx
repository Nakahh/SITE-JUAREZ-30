"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { UploadCloud, XCircle } from "lucide-react"

interface ImageUploadProps {
  onImageUpload: (urls: string[]) => void
  initialImageUrls?: string[]
}

export function ImageUpload({ onImageUpload, initialImageUrls = [] }: ImageUploadProps) {
  const [images, setImages] = useState<string[]>(initialImageUrls)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    const uploadedUrls: string[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const response = await fetch(`/api/upload?filename=${file.name}`, {
          method: "POST",
          body: file,
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blob = await response.json()
        uploadedUrls.push(blob.url)
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error)
      }
    }

    const newImages = [...images, ...uploadedUrls]
    setImages(newImages)
    onImageUpload(newImages)
    setIsUploading(false)
    event.target.value = "" // Clear the input
  }

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedImages = images.filter((url) => url !== urlToRemove)
    setImages(updatedImages)
    onImageUpload(updatedImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input id="imageUpload" type="file" multiple onChange={handleFileChange} disabled={isUploading} />
        <Button type="button" disabled={isUploading}>
          {isUploading ? "Enviando..." : <UploadCloud className="h-4 w-4 mr-2" />}
          {isUploading ? "Enviando..." : "Upload Imagens"}
        </Button>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <Image
                src={url || "/placeholder.svg"}
                alt={`Uploaded image ${index}`}
                width={150}
                height={100}
                className="rounded-md object-cover w-full h-24"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(url)}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">Remover imagem</span>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
