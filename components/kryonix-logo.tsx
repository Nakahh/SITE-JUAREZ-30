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
          alt="KRYONIX - Desenvolvimento Tecnológico" 
          width={120}
          height={40}
          style={{ width: 'auto', height: '40px' }}
          className="brightness-0 dark:brightness-100"
        />
  )
}

export default KryonixLogo