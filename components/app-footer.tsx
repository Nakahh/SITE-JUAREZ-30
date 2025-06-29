import Link from "next/link";
import { KryonixLogo } from "./kryonix-logo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { InstagramIcon } from "./instagram-icon";
import { Mail, Clock } from "lucide-react";

export function AppFooter() {
  const whatsappNumber = "(62) 9 8556-3905";
  const email = "siqueiraecamposimoveis@gmail.com";

  return (
    <footer className="w-full bg-gradient-to-br from-[#1a472a] via-[#2d5d3d] to-[#1a472a] text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3Zn")] bg-repeat"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6 group">
            <div className="transform transition-transform duration-300 group-hover:scale-105">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <img
                  src="/logo siqueira campos imoveis.png"
                  alt="Siqueira Campos"
                  className="h-12 w-auto"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Siqueira Campos
                  </h3>
                  <p className="text-sm text-gray-300">Imóveis</p>
                </div>
              </Link>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Há mais de 10 anos realizando sonhos em Goiânia e região
              metropolitana. Sua imobiliária de confiança com os melhores
              imóveis da cidade.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com/siqueiracamposituba"
                className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-300 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-5 w-5 animate-pulse" />
              </a>
              <a
                href={`https://wa.me/5562985563905`}
                className="p-3 bg-green-500 rounded-full hover:bg-green-600 transform hover:scale-110 transition-all duration-300 shadow-lg"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5 animate-bounce" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-[#4ade80] pb-2">
              Navegação
            </h4>
            <nav className="space-y-3">
              {[
                { href: "/", label: "Início" },
                { href: "/imoveis", label: "Imóveis" },
                { href: "/simulador-financiamento", label: "Simulador" },
                { href: "/blog", label: "Blog" },
                { href: "/depoimentos", label: "Depoimentos" },
                { href: "/contato", label: "Contato" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block text-gray-300 hover:text-[#4ade80] transition-colors duration-300 hover:translate-x-2 transform"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-[#4ade80] pb-2">
              Contato
            </h4>
            <div className="space-y-3">
              <a
                href={`https://wa.me/5562985563905`}
                className="flex items-center space-x-3 group hover:bg-green-500/10 p-2 rounded-lg transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-300 animate-pulse" />
                <span className="text-sm text-gray-300 group-hover:text-green-400 transition-colors duration-300">
                  {whatsappNumber}
                </span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 group hover:bg-blue-500/10 p-2 rounded-lg transition-all duration-300"
              >
                <Mail className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
                  {email}
                </span>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-[#4ade80] pb-2">
              Horário de Funcionamento
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#4ade80]" />
                <div className="text-sm">
                  <p className="text-white font-medium">Segunda - Sexta</p>
                  <p className="text-gray-300">08:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#4ade80]" />
                <div className="text-sm">
                  <p className="text-white font-medium">Sábado</p>
                  <p className="text-gray-300">08:00 - 14:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="text-sm">
                  <p className="text-white font-medium">Domingo</p>
                  <p className="text-gray-400">Fechado</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link
                href="/contato"
                className="inline-block bg-[#4ade80] hover:bg-[#22c55e] text-[#1a472a] px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Fale Conosco
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} Siqueira Campos Imóveis -
                Goiânia. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4 text-xs">
                <Link
                  href="/privacidade"
                  className="text-gray-400 hover:text-[#4ade80] transition-colors duration-300"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/termos"
                  className="text-gray-400 hover:text-[#4ade80] transition-colors duration-300"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/kryonix"
                className="flex items-center space-x-2 text-gray-400 hover:text-[#4ade80] transition-colors duration-300 group"
              >
                <span className="text-xs">Desenvolvido por</span>
                <img
                  src="/logo-kryonix.png"
                  alt="Kryonix Logo"
                  className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
                />
                <span className="text-xs font-medium">KRYONIX</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#4ade80]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#22c55e]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
}