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
        <p className="mt-2 flex items-center justify-center gap-2">
          Desenvolvido por{" "}
          <Link href="/kryonix" className="flex items-center gap-2 text-primary hover:underline">
            <Image
              src="/logo-kryonix.png"
              alt="Kryonix"
              width={20}
              height={20}
              className="rounded"
            />
            Kryonix
          </Link>
        </p>
      </div>
    </footer>
  );
}