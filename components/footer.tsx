import Link from "next/link";
import { KryonixLogo } from "./kryonix-logo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { InstagramIcon } from "./instagram-icon";

export function Footer() {
  const whatsappNumber = "(62) 9 8765-4321"; // WhatsApp de Goiânia
  const instagramHandle = "@imoveisgoiania"; // Instagram local

  return (
    <footer className="w-full bg-gray-900 text-white py-8 mt-auto border-t-2 border-primary">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <p className="text-lg font-medium">
              &copy; {new Date().getFullYear()} Siqueira Campos Imóveis -
              Goiânia
            </p>
            <div className="flex items-center justify-center md:justify-start space-x-6">
              <a
                href={`https://wa.me/5562987654321`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors text-sm"
              >
                <WhatsAppIcon className="h-5 w-5 mr-2" />
                {whatsappNumber}
              </a>
              <a
                href={`https://instagram.com/imoveisgoiania`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary transition-colors text-sm"
              >
                <InstagramIcon className="h-5 w-5 mr-2" />
                {instagramHandle}
              </a>
            </div>
            <p className="text-xs text-gray-400">
              Vendas e locações de imóveis em Goiânia e região metropolitana
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/desenvolvedor"
              className="flex items-center hover:text-primary transition-colors text-sm"
            >
              <KryonixLogo className="h-8 w-8 mr-2" />
              Desenvolvido por KRYONIX
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
