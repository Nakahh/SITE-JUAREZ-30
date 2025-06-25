import Image from "next/image"
import { WhatsAppIcon } from "@/components/whatsapp-icon"
import { InstagramIcon } from "@/components/instagram-icon"

export default function Desenvolvedor() {
  const developerWhatsapp = process.env.NEXT_PUBLIC_DEVELOPER_WHATSAPP || "(XX) X XXXX-XXXX"
  const developerInstagram = process.env.NEXT_PUBLIC_DEVELOPER_INSTAGRAM || "@KRYON.IX"

  return (
    <section className="container py-12">
      <div className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">KRYONIX - Soluções Digitais</h1>
          <p className="mt-4 text-muted-foreground">
            Especialistas em criação de sites, aplicativos e software sob medida.
          </p>
          <p className="mt-2">
            <strong>CEO:</strong> Vitor Jayme Fernandes Ferreira
          </p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <WhatsAppIcon className="h-5 w-5" />
              <a
                href={`https://wa.me/${developerWhatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {developerWhatsapp}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <InstagramIcon className="h-5 w-5" />
              <a
                href={`https://instagram.com/${developerInstagram.replace(/^@/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {developerInstagram}
              </a>
            </div>
          </div>
        </div>
        <Image src="/logo-kryonix.png" alt="Logo Kryonix" width={300} height={300} className="rounded-md" />
      </div>
      {/* Adicionar animações e background estilizado aqui */}
    </section>
  )
}
