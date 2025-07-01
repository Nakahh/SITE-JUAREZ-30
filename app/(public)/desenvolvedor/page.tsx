import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KryonixLogo } from "@/components/kryonix-logo";
import {
  Globe,
  Code,
  Smartphone,
  Database,
  Shield,
  Zap,
  ExternalLink,
  Mail,
  Github,
  Linkedin,
} from "lucide-react";

export const metadata = {
  title: "Desenvolvedor - KRYONIX Development",
  description:
    "Conheça a KRYONIX Development, responsável pelo desenvolvimento do sistema Siqueira Campos Imóveis",
};

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Desenvolvedor
            </h1>
            <p className="text-xl text-muted-foreground">
              Conheça quem desenvolveu este sistema
            </p>
          </div>

          {/* Developer Profile */}
          <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center">
            {/* Logo da empresa - tamanho reduzido */}
            <div className="mb-8">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-xl">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1">
                  <Image
                    src="/logo-kryonix.png"
                    alt="Kryonix Logo"
                    width={60}
                    height={60}
                    className="object-contain"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">KRYONIX</h2>
              <p className="text-muted-foreground">Development</p>
            </div>

            {/* Developer Photo */}
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                <Image
                  src="/placeholder-user.jpg"
                  alt="Desenvolvedor"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">Vitor Nakah</h3>
              <p className="text-lg text-primary font-semibold mb-4">
                CEO - Desenvolvedor DEV Full-Stack
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                Especialista em desenvolvimento de soluções tecnológicas
                inovadoras e robustas. Responsável pelo desenvolvimento completo
                do sistema Siqueira Campos Imóveis, incluindo frontend, backend,
                banco de dados e integração com IA.
              </p>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">
                Tecnologias Utilizadas
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Next.js",
                  "React",
                  "TypeScript",
                  "Tailwind CSS",
                  "Prisma",
                  "PostgreSQL",
                  "NextAuth",
                  "Node.js",
                  "WhatsApp API",
                  "OpenAI",
                  "N8N",
                  "Vercel",
                ].map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="https://wa.me/5517981805327" target="_blank">
                  <Smartphone className="mr-2 h-5 w-5" />
                  WhatsApp
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="https://instagram.com/kryon.ix" target="_blank">
                  <Globe className="mr-2 h-5 w-5" />
                  Instagram
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="mailto:vitornakah@kryonix.dev">
                  <Mail className="mr-2 h-5 w-5" />
                  Email
                </Link>
              </Button>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Code className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="font-semibold mb-2">Desenvolvimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Soluções completas de software
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 text-green-600" />
                  <h4 className="font-semibold mb-2">Banco de Dados</h4>
                  <p className="text-sm text-muted-foreground">
                    Modelagem e otimização
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
                  <h4 className="font-semibold mb-2">Automação</h4>
                  <p className="text-sm text-muted-foreground">
                    Integração com IA e APIs
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
