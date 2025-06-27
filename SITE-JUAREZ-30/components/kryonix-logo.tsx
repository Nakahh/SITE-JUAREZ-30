// components/kryonix-logo.tsx
import Image from "next/image"

export function KryonixLogo({ className }: { className?: string }) {
  return <Image src="/logo-kryonix.png" alt="Kryonix Logo" width={32} height={32} className={className} />
}
