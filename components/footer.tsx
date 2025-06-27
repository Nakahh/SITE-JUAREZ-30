import Link from "next/link";
import { KryonixLogo } from "./kryonix-logo";
import { WhatsAppIcon } from "./whatsapp-icon";
import { InstagramIcon } from "./instagram-icon";
import { MapPin, Phone, Mail, Clock, Facebook, Twitter } from "lucide-react";

export function Footer() {
  const whatsappNumber = "(62) 9 8765-4321";
  const telefoneFixo = "(62) 3241-5678";
  const email = "contato@siqueiracamposituba.com.br";
  const endereco = "Av. T-4, 1234 - Setor Bueno, Goiânia - GO";

  return (
    <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJtMzYgMzQgNi0yIDItNiAyIDYgNiAyLTYgMi0yIDYtMi02LTYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6 group">
            <div className="transform transition-transform duration-300 group-hover:scale-105">
              <Link href="/" className="flex items-center space-x-3 mb-4">
                <KryonixLogo className="h-10 w-10 text-primary" />
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
                href="https://facebook.com/siqueiracamposimoveis"
                className="p-2 bg-blue-600 rounded-full hover:bg-blue-700 transform hover:scale-110 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com/imoveisgoiania"
                className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 transform hover:scale-110 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com/siqueiracampos"
                className="p-2 bg-blue-400 rounded-full hover:bg-blue-500 transform hover:scale-110 transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-primary pb-2">
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
                  className="block text-gray-300 hover:text-primary transition-colors duration-300 hover:translate-x-2 transform"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-primary pb-2">
              Contato
            </h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 group cursor-pointer">
                <MapPin className="h-5 w-5 text-primary mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">
                    {endereco}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/5562987654321`}
                className="flex items-center space-x-3 group hover:bg-green-500/10 p-2 rounded-lg transition-all duration-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-300 group-hover:text-green-400 transition-colors duration-300">
                  {whatsappNumber}
                </span>
              </a>

              <a
                href={`tel:+556232415678`}
                className="flex items-center space-x-3 group hover:bg-blue-500/10 p-2 rounded-lg transition-all duration-300"
              >
                <Phone className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-300 group-hover:text-blue-400 transition-colors duration-300">
                  {telefoneFixo}
                </span>
              </a>

              <a
                href={`mailto:${email}`}
                className="flex items-center space-x-3 group hover:bg-purple-500/10 p-2 rounded-lg transition-all duration-300"
              >
                <Mail className="h-5 w-5 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                  {email}
                </span>
              </a>
            </div>
          </div>

          {/* Business Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white border-b border-primary pb-2">
              Horário de Funcionamento
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
                <div className="text-sm">
                  <p className="text-white font-medium">Segunda - Sexta</p>
                  <p className="text-gray-300">08:00 - 18:00</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-primary" />
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
                className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
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
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  Política de Privacidade
                </Link>
                <Link
                  href="/termos"
                  className="text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  Termos de Uso
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/desenvolvedor"
                className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors duration-300 group"
              >
                <span className="text-xs">Desenvolvido por</span>
                <KryonixLogo className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-xs font-medium">KRYONIX</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  );
}
