
import Image from 'next/image'

export function KryonixLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image
        src="/logo-kryonix.png"
        alt="Kryonix Logo"
        width={32}
        height={32}
        className="rounded"
      />
    </div>
  );
}
