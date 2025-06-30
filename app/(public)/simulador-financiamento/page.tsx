"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  Home,
  TrendingUp,
  PiggyBank,
  DollarSign,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancingResult {
  monthlyPayment: number;
  totalAmount: number;
  totalInterest: number;
  payments: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function FinancingSimulatorPage() {
  const [propertyValue, setPropertyValue] = useState(300000);
  const [downPayment, setDownPayment] = useState(60000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termYears, setTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(10.5);
  const [financingType, setFinancingType] = useState<"SAC" | "PRICE">("SAC");
  const [results, setResults] = useState<FinancingResult | null>(null);

  // Atualizar entrada quando o percentual muda
  useEffect(() => {
    const newDownPayment = (propertyValue * downPaymentPercent) / 100;
    setDownPayment(Math.round(newDownPayment));
  }, [propertyValue, downPaymentPercent]);

  // Atualizar percentual quando a entrada muda
  const handleDownPaymentChange = (value: number) => {
    setDownPayment(value);
    const percent = (value / propertyValue) * 100;
    setDownPaymentPercent(Math.round(percent));
  };

  const calculateFinancing = () => {
    const principal = propertyValue - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = termYears * 12;

    if (financingType === "PRICE") {
      // Sistema PRICE (Prestações fixas)
      const monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

      const payments = [];
      let balance = principal;

      for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;

        payments.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
        });
      }

      const totalAmount = monthlyPayment * totalPayments;
      const totalInterest = totalAmount - principal;

      setResults({
        monthlyPayment,
        totalAmount,
        totalInterest,
        payments,
      });
    } else {
      // Sistema SAC (Amortização constante)
      const principalPayment = principal / totalPayments;
      const payments = [];
      let balance = principal;
      let totalAmount = 0;

      for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = balance * monthlyRate;
        const monthlyPayment = principalPayment + interestPayment;
        balance -= principalPayment;
        totalAmount += monthlyPayment;

        payments.push({
          month: i,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, balance),
        });
      }

      const totalInterest = totalAmount - principal;

      setResults({
        monthlyPayment: payments[0].payment, // Primeira prestação (maior no SAC)
        totalAmount,
        totalInterest,
        payments,
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getRecommendation = () => {
    const maxRecommendedPayment = propertyValue * 0.003; // 30% seria uma métrica mais realista
    const currentPayment = results?.monthlyPayment || 0;

    if (currentPayment > maxRecommendedPayment) {
      return {
        type: "warning",
        message:
          "A prestação está alta para este imóvel. Considere aumentar a entrada ou escolher um imóvel mais barato.",
      };
    } else if (downPaymentPercent < 20) {
      return {
        type: "info",
        message:
          "Recomendamos pelo menos 20% de entrada para melhores condições de financiamento.",
      };
    } else {
      return {
        type: "success",
        message:
          "Excelente! Este financiamento está dentro dos parâmetros recomendados.",
      };
    }
  };

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Simulador de Financiamento
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calcule as melhores condições para financiar seu imóvel
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Formulário */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Dados do Imóvel</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Valor do Imóvel */}
              <div className="space-y-2">
                <Label>Valor do Imóvel</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className="pl-10"
                    placeholder="300.000"
                  />
                </div>
                <Slider
                  value={[propertyValue]}
                  onValueChange={(value) => setPropertyValue(value[0])}
                  max={2000000}
                  min={50000}
                  step={10000}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>R$ 50.000</span>
                  <span className="font-medium">
                    {formatCurrency(propertyValue)}
                  </span>
                  <span>R$ 2.000.000</span>
                </div>
              </div>

              {/* Entrada */}
              <div className="space-y-2">
                <Label>Entrada ({downPaymentPercent}%)</Label>
                <div className="relative">
                  <PiggyBank className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={downPayment}
                    onChange={(e) =>
                      handleDownPaymentChange(Number(e.target.value))
                    }
                    className="pl-10"
                  />
                </div>
                <Slider
                  value={[downPaymentPercent]}
                  onValueChange={(value) => setDownPaymentPercent(value[0])}
                  max={50}
                  min={5}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span className="font-medium">
                    {formatCurrency(downPayment)} ({downPaymentPercent}%)
                  </span>
                  <span>50%</span>
                </div>
              </div>

              {/* Prazo */}
              <div className="space-y-2">
                <Label>Prazo (anos)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    value={termYears}
                    onChange={(e) => setTermYears(Number(e.target.value))}
                    className="pl-10"
                    min="5"
                    max="35"
                  />
                </div>
                <Slider
                  value={[termYears]}
                  onValueChange={(value) => setTermYears(value[0])}
                  max={35}
                  min={5}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 anos</span>
                  <span className="font-medium">
                    {termYears} anos ({termYears * 12} meses)
                  </span>
                  <span>35 anos</span>
                </div>
              </div>

              {/* Taxa de Juros */}
              <div className="space-y-2">
                <Label>Taxa de Juros (% ao ano)</Label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="pl-10"
                  />
                </div>
                <Slider
                  value={[interestRate]}
                  onValueChange={(value) => setInterestRate(value[0])}
                  max={15}
                  min={6}
                  step={0.1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>6% a.a.</span>
                  <span className="font-medium">{interestRate}% a.a.</span>
                  <span>15% a.a.</span>
                </div>
              </div>

              {/* Tipo de Financiamento */}
              <div className="space-y-2">
                <Label>Tipo de Financiamento</Label>
                <Tabs
                  value={financingType}
                  onValueChange={(value) =>
                    setFinancingType(value as "SAC" | "PRICE")
                  }
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="SAC" className="flex-1">
                      SAC
                    </TabsTrigger>
                    <TabsTrigger value="PRICE" className="flex-1">
                      PRICE
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="SAC" className="mt-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <strong>SAC:</strong> Prestações decrescentes. Amortização
                      constante, você paga menos juros ao longo do tempo.
                    </div>
                  </TabsContent>
                  <TabsContent value="PRICE" className="mt-3">
                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                      <strong>PRICE:</strong> Prestações fixas. Valor constante,
                      facilita o planejamento financeiro.
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <Button onClick={calculateFinancing} size="lg" className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calcular Financiamento
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Resultados */}
        <div className="space-y-6">
          {results && (
            <>
              {/* Resumo */}
              <Card>
                <CardHeader>
                  <CardTitle>Resumo do Financiamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        Valor Financiado
                      </p>
                      <p className="text-lg font-bold">
                        {formatCurrency(propertyValue - downPayment)}
                      </p>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {financingType === "SAC"
                          ? "Primeira Prestação"
                          : "Prestação Fixa"}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(results.monthlyPayment)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Pago:</span>
                      <span className="font-semibold">
                        {formatCurrency(results.totalAmount + downPayment)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Juros:</span>
                      <span className="font-semibold text-orange-600">
                        {formatCurrency(results.totalInterest)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Última Prestação:</span>
                      <span>
                        {formatCurrency(
                          results.payments[results.payments.length - 1].payment,
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recomendação */}
              <Card>
                <CardContent className="pt-6">
                  {(() => {
                    const recommendation = getRecommendation();
                    return (
                      <div
                        className={cn(
                          "flex items-start space-x-3 p-3 rounded-lg",
                          recommendation.type === "success" &&
                            "bg-green-50 dark:bg-green-950/20",
                          recommendation.type === "warning" &&
                            "bg-orange-50 dark:bg-orange-950/20",
                          recommendation.type === "info" &&
                            "bg-blue-50 dark:bg-blue-950/20",
                        )}
                      >
                        {recommendation.type === "success" && (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        )}
                        {recommendation.type === "warning" && (
                          <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                        )}
                        {recommendation.type === "info" && (
                          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        )}
                        <p className="text-sm">{recommendation.message}</p>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>

              {/* Ações */}
              <div className="flex space-x-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>

              {/* CTA */}
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold mb-2">Gostou da simulação?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Fale com nossos especialistas para encontrar as melhores
                    condições.
                  </p>
                  <Button className="w-full">Falar com Corretor</Button>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
