import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Image from "next/image";

export function AppFooter() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Coluna da Logo e Descrição */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo siqueira campos imoveis.png" alt="Siqueira Campos Logo" width={40} height={40} />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Siqueira Campos
            </span>
          </Link>
          <p className="text-sm">
            Sua parceira de confiança para encontrar o imóvel dos seus sonhos.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="hover:text-primary">
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="hover:text-primary">
              <Linkedin className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Coluna de Navegação */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Navegação</h3>
          <ul className="space-y-2">
            <li><Link href="/imoveis" className="hover:text-primary">Imóveis</Link></li>
            <li><Link href="/sobre" className="hover:text-primary">Sobre Nós</Link></li>
            <li><Link href="/blog" className="hover:text-primary">Blog</Link></li>
            <li><Link href="/contato" className="hover:text-primary">Contato</Link></li>
          </ul>
        </div>

        {/* Coluna de Contato */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Contato</h3>
          <ul className="space-y-2 text-sm">
            <li>Email: contato@siqueiracampos.com.br</li>
            <li>Telefone: (62) 3224-1234</li>
            <li>Endereço: Av. T-7, 890 - Setor Oeste, Goiânia - GO</li>
          </ul>
        </div>

        {/* Coluna da Newsletter */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 dark:text-white">Receba Novidades</h3>
          <p className="text-sm">
            Cadastre-se para receber as melhores ofertas e notícias do mercado imobiliário.
          </p>
          <form className="flex space-x-2">
            <Input type="email" placeholder="Seu e-mail" className="flex-1" />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
              Inscrever
            </Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Siqueira Campos Imóveis. Todos os direitos reservados.
        </p>
        <p className="mt-2 flex justify-center items-center gap-4">
          Desenvolvido por{" "}
          <Link
            href="/desenvolvedor"
            aria-label="Página do Desenvolvedor"
            className="inline-flex items-center justify-center rounded-full border border-input bg-background p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-10 w-10 rounded-full"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" fill="#4F46E5" />
              <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="bold"
                fontFamily="Arial, sans-serif"
              >
                KX
              </text>
            </svg>
          </Link>
          <Link href="#" className="hover:text-primary" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="hover:text-primary" aria-label="WhatsApp">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="h-6 w-6"
            >
              <path d="M20.52 3.48A11.88 11.88 0 0012 0C5.37 0 0 5.37 0 12a11.88 11.88 0 001.64 6.04L0 24l5.96-1.64A11.88 11.88 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.5a9.5 9.5 0 01-4.84-1.4l-.35-.21-3.54.98.98-3.54-.21-.35A9.5 9.5 0 012.5 12 9.5 9.5 0 1112 21.5zm5.3-7.1c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.14-.14.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.6-.48-.52-.68-.53-.18-.01-.37-.01-.57-.01s-.52.07-.8.37c-.28.3-1.07 1.05-1.07 2.55s1.1 2.95 1.25 3.15c.15.2 2.15 3.3 5.2 4.62.73.32 1.3.51 1.75.65.74.23 1.42.2 1.96.12.6-.1 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.28-.2-.58-.35z" />
            </svg>
          </Link>
        </p>
      </div>
    </footer>
  );
}
