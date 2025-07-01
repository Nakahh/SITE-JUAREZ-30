"use client";

import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Desenvolvedor - KRYONIX Development",
  description:
    "Conheça a KRYONIX Development, responsável pelo desenvolvimento do sistema Siqueira Campos Imóveis",
};

export default function DeveloperPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-4 shadow-xl">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-2">
                <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text">
                  K
                </div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            KRYONIX
            <span className="block text-blue-600">Development</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Desenvolvimento de soluções tecnológicas inovadoras e robustas para
            empresas que buscam excelência digital
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="https://kryonix.dev" target="_blank">
                <Globe className="mr-2 h-5 w-5" />
                Visitar Site
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="mailto:contato@kryonix.dev">
                <Mail className="mr-2 h-5 w-5" />
                Contato
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
