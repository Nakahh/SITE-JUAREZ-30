import Link from "next/link";
import { KryonixLogo } from "./kryonix-logo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { InstagramIcon } from "./instagram-icon";

export function Footer() {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "(XX) X XXXX-XXXX";
  const instagramHandle =
    process.env.NEXT_PUBLIC_DEVELOPER_INSTAGRAM || "@imoveissiqueiracampos"; // Fallback to default if not set

  return (
    <footer
      className="bg-gray-800 text-white py-8 mt-8 border-t-4 border-primary"
      style={{ backgroundColor: "#333333" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="space-y-2 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Siqueira Campos Imóveis</p>
          <div className="flex items-center justify-center md:justify-start space-x-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors"
            >
              <WhatsAppIcon className="h-5 w-5 mr-2" />
              {whatsappNumber}
            </a>
            <a
              href={`https://instagram.com/${instagramHandle.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-primary transition-colors"
            >
              <InstagramIcon className="h-5 w-5 mr-2" />
              {instagramHandle}
            </a>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            href="/desenvolvedor"
            className="flex items-center hover:text-primary transition-colors"
          >
            <KryonixLogo className="h-8 w-8 mr-2" />
            Desenvolvido por KRYONIX
          </Link>
        </div>
      </div>
    </footer>
  );
}
