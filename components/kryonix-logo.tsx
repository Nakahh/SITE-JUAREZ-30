
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface KryonixLogoProps {
  width?: number
  height?: number
  className?: string
  linkTo?: string
  priority?: boolean
}

function KryonixLogo({ 
  width = 100, 
  height = 30, 
  className = "",
  linkTo,
  priority = false 
}: KryonixLogoProps) {
  const logoContent = (
    <Image
      src="/logo kryonix.png"
      alt="Kryonix - Desenvolvimento Web"
      width={width}
      height={height}
      className={cn("h-auto w-auto logo-hover", className)}
      priority={priority}
    />
  )

  if (linkTo) {
    return (
      <Link href={linkTo} className="hover:opacity-80 transition-opacity">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

export { KryonixLogo }
export default KryonixLogo
