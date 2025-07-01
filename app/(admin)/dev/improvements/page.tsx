"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Zap,
  Rocket,
  Shield,
  Database,
  Image as ImageIcon,
  Code,
  Globe,
  Search,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  Star,
  Smartphone,
  Monitor,
  Wifi,
  Lock,
  Eye,
  Brain,
  Target,
  BarChart3,
  Settings2,
  Layers,
  Package,
  FileCode,
  Server,
  CloudUpload,
  Gauge,
  Paintbrush,
  Accessibility,
  MessageSquare,
} from "lucide-react";

interface Improvement {
  id: string;
  title: string;
  description: string;
  category:
    | "performance"
    | "security"
    | "ux"
    | "seo"
    | "accessibility"
    | "features";
  priority: "high" | "medium" | "low";
  status: "implemented" | "in-progress" | "planned";
  impact: number;
  effort: number;
  icon: any;
}

export default function ImprovementsPage() {
  const [improvements, setImprovements] = useState<Improvement[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    setImprovements([
      // Performance Improvements
      {
        id: "perf-1",
        title: "Implementar Code Splitting Avançado",
        description:
          "Dividir o bundle em chunks menores para carregamento mais rápido",
        category: "performance",
        priority: "high",
        status: "implemented",
        impact: 95,
        effort: 80,
        icon: Rocket,
      },
      {
        id: "perf-2",
        title: "Service Worker com Cache Inteligente",
        description:
          "Cache offline com estratégias personalizadas por tipo de conteúdo",
        category: "performance",
        priority: "high",
        status: "implemented",
        impact: 90,
        effort: 70,
        icon: Wifi,
      },
      {
        id: "perf-3",
        title: "Otimização de Imagens com WebP/AVIF",
        description: "Conversão automática para formatos modernos de imagem",
        category: "performance",
        priority: "high",
        status: "implemented",
        impact: 85,
        effort: 60,
        icon: ImageIcon,
      },
      {
        id: "perf-4",
        title: "Database Query Optimization",
        description: "Índices otimizados e queries com cache inteligente",
        category: "performance",
        priority: "high",
        status: "implemented",
        impact: 80,
        effort: 75,
        icon: Database,
      },
      {
        id: "perf-5",
        title: "Edge Computing com CDN",
        description: "Distribuição global de conteúdo estático",
        category: "performance",
        priority: "medium",
        status: "planned",
        impact: 75,
        effort: 90,
        icon: Globe,
      },

      // Security Improvements
      {
        id: "sec-1",
        title: "Autenticação Multi-Fator (2FA)",
        description: "Camada adicional de segurança com TOTP/SMS",
        category: "security",
        priority: "high",
        status: "planned",
        impact: 95,
        effort: 85,
        icon: Shield,
      },
      {
        id: "sec-2",
        title: "Headers de Segurança Avançados",
        description: "CSP, HSTS, X-Frame-Options otimizados",
        category: "security",
        priority: "high",
        status: "implemented",
        impact: 80,
        effort: 40,
        icon: Lock,
      },
      {
        id: "sec-3",
        title: "Rate Limiting Inteligente",
        description: "Proteção contra ataques DDoS e brute force",
        category: "security",
        priority: "medium",
        status: "in-progress",
        impact: 70,
        effort: 60,
        icon: Shield,
      },

      // UX Improvements
      {
        id: "ux-1",
        title: "Interface Responsiva Avançada",
        description: "Design adaptativo para todos os dispositivos",
        category: "ux",
        priority: "high",
        status: "implemented",
        impact: 90,
        effort: 70,
        icon: Smartphone,
      },
      {
        id: "ux-2",
        title: "Micro-interações e Animações",
        description: "Feedback visual aprimorado para melhor UX",
        category: "ux",
        priority: "medium",
        status: "in-progress",
        impact: 75,
        effort: 50,
        icon: Paintbrush,
      },
      {
        id: "ux-3",
        title: "Sistema de Notificações Push",
        description: "Notificações em tempo real para usuários",
        category: "ux",
        priority: "medium",
        status: "planned",
        impact: 80,
        effort: 85,
        icon: MessageSquare,
      },

      // SEO Improvements
      {
        id: "seo-1",
        title: "Meta Tags Dinâmicas Otimizadas",
        description: "SEO otimizado para cada página com Open Graph",
        category: "seo",
        priority: "high",
        status: "implemented",
        impact: 85,
        effort: 40,
        icon: Search,
      },
      {
        id: "seo-2",
        title: "Sitemap XML Automático",
        description: "Geração automática de sitemap com prioridades",
        category: "seo",
        priority: "medium",
        status: "implemented",
        impact: 70,
        effort: 30,
        icon: FileCode,
      },
      {
        id: "seo-3",
        title: "Schema Markup Estruturado",
        description: "Dados estruturados para Rich Snippets",
        category: "seo",
        priority: "medium",
        status: "planned",
        impact: 75,
        effort: 60,
        icon: Code,
      },

      // Accessibility Improvements
      {
        id: "acc-1",
        title: "ARIA Labels Completos",
        description: "Acessibilidade total para leitores de tela",
        category: "accessibility",
        priority: "high",
        status: "in-progress",
        impact: 90,
        effort: 50,
        icon: Accessibility,
      },
      {
        id: "acc-2",
        title: "Navegação por Teclado",
        description: "Suporte completo para navegação sem mouse",
        category: "accessibility",
        priority: "medium",
        status: "planned",
        impact: 80,
        effort: 40,
        icon: Eye,
      },

      // Features
      {
        id: "feat-1",
        title: "Sistema de Analytics Avançado",
        description: "Métricas detalhadas de uso e performance",
        category: "features",
        priority: "medium",
        status: "planned",
        impact: 70,
        effort: 80,
        icon: BarChart3,
      },
      {
        id: "feat-2",
        title: "Chat AI Integrado",
        description: "Assistente virtual para atendimento",
        category: "features",
        priority: "medium",
        status: "planned",
        impact: 85,
        effort: 95,
        icon: Brain,
      },
    ]);
  }, []);

  const categories = [
    { id: "all", label: "Todas", icon: Target },
    { id: "performance", label: "Performance", icon: Rocket },
    { id: "security", label: "Segurança", icon: Shield },
    { id: "ux", label: "UX/UI", icon: Paintbrush },
    { id: "seo", label: "SEO", icon: Search },
    { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
    { id: "features", label: "Funcionalidades", icon: Star },
  ];

  const filteredImprovements =
    selectedCategory === "all"
      ? improvements
      : improvements.filter((imp) => imp.category === selectedCategory);

  const stats = {
    total: improvements.length,
    implemented: improvements.filter((i) => i.status === "implemented").length,
    inProgress: improvements.filter((i) => i.status === "in-progress").length,
    planned: improvements.filter((i) => i.status === "planned").length,
    avgImpact: Math.round(
      improvements.reduce((acc, i) => acc + i.impact, 0) / improvements.length,
    ),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "planned":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "implemented":
        return "Implementado";
      case "in-progress":
        return "Em Progresso";
      case "planned":
        return "Planejado";
      default:
        return "Desconhecido";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Rocket className="h-8 w-8 text-purple-400" />
              Melhorias & Otimizações
            </h1>
            <p className="text-purple-200 mt-1">
              Sistema completo de melhorias para máximo desempenho
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Target className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Implementadas</p>
                  <p className="text-2xl font-bold text-green-400">
                    {stats.implemented}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Em Progresso</p>
                  <p className="text-2xl font-bold text-blue-400">
                    {stats.inProgress}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Planejadas</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {stats.planned}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Impacto Médio</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {stats.avgImpact}%
                  </p>
                </div>
                <Gauge className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`${
                      selectedCategory === category.id
                        ? "bg-purple-600 border-purple-600"
                        : "border-slate-600 hover:bg-slate-700"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Improvements Grid */}
        <div className="grid gap-4">
          {filteredImprovements.map((improvement) => {
            const Icon = improvement.icon;
            return (
              <Card
                key={improvement.id}
                className="bg-slate-800/50 border-slate-700"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-slate-700 rounded-lg">
                        <Icon className="h-6 w-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {improvement.title}
                        </h3>
                        <p className="text-slate-300 mb-4">
                          {improvement.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                              Impacto:
                            </span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${improvement.impact}%` }}
                              />
                            </div>
                            <span className="text-sm text-white">
                              {improvement.impact}%
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                              Esforço:
                            </span>
                            <div className="w-24 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${improvement.effort}%` }}
                              />
                            </div>
                            <span className="text-sm text-white">
                              {improvement.effort}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`${getPriorityColor(improvement.priority)} text-white`}
                      >
                        {improvement.priority.toUpperCase()}
                      </Badge>
                      <Badge
                        className={`${getStatusColor(improvement.status)} text-white`}
                      >
                        {getStatusLabel(improvement.status)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Implementation Roadmap */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              Roadmap de Implementação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert className="bg-green-900/20 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-green-300">
                  <strong>Fase 1 - Concluída:</strong> Performance e otimizações
                  básicas implementadas
                </AlertDescription>
              </Alert>
              <Alert className="bg-blue-900/20 border-blue-500">
                <Clock className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-300">
                  <strong>Fase 2 - Em Progresso:</strong> Segurança avançada e
                  acessibilidade
                </AlertDescription>
              </Alert>
              <Alert className="bg-purple-900/20 border-purple-500">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-purple-300">
                  <strong>Fase 3 - Planejada:</strong> Features avançadas e IA
                  integrada
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
