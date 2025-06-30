import Image from "next/image"
import { cn } from "@/lib/utils"

export function KryonixLogo({ className, width = 120, height = 40 }: {
  className?: string
  width?: number
  height?: number
}) {
  return (
    <Image
        src="/logo-kryonix.png"
        alt="KRYONIX Development"
        width={width}
        height={height}
        style={{ width: 'auto', height: 'auto' }}
        className={cn("object-contain", className)}
        priority={true}
      />
  )
}

export default KryonixLogo