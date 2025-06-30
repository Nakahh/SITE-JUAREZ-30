import Image from "next/image"

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
      className={className}
      priority
    />
  )
}

export default KryonixLogo