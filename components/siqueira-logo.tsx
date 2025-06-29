
'use client'

import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface SiqueiraLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

export default function SiqueiraLogo({ 
  size = 'md', 
  className = '',
  priority = false,
  width,
  height
}: SiqueiraLogoProps) {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Evita hydration mismatch
  if (!mounted) {
    return (
      <div className={`siqueira-logo-${size} ${className} bg-gray-200 dark:bg-gray-800 animate-pulse rounded`} />
    )
  }

  const isDark = theme === 'dark' || resolvedTheme === 'dark'
  const logoSrc = isDark 
    ? '/siqueira campos para fundo escuro.png'
    : '/siqueira campos para fundo claro.png'

  const sizeClasses = {
    xs: 'w-20 h-auto',
    sm: 'w-30 h-auto', 
    md: 'w-40 h-auto',
    lg: 'w-50 h-auto',
    xl: 'w-70 h-auto',
    '2xl': 'w-90 h-auto'
  }

  const defaultSizes = {
    xs: { width: 80, height: 40 },
    sm: { width: 120, height: 60 },
    md: { width: 160, height: 80 },
    lg: { width: 200, height: 100 },
    xl: { width: 280, height: 140 },
    '2xl': { width: 360, height: 180 }
  }

  const logoWidth = width || defaultSizes[size].width
  const logoHeight = height || defaultSizes[size].height

  return (
    <Image
      src={logoSrc}
      alt="Siqueira Campos Imóveis"
      width={logoWidth}
      height={logoHeight}
      className={`siqueira-logo siqueira-logo-${size} ${sizeClasses[size]} ${className} transition-all duration-300 hover:scale-105`}
      priority={priority}
    />
  )
}
