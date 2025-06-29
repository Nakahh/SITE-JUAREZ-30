
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, PieChart, FileText, Info } from "lucide-react"
import { simulateFinancing } from "@/app/actions/financing-actions"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function SimuladorFinanciamento() {
  const [formData, setFormData] = useState({
    propertyValue: "",
    downPayment: "",
    interestRate: "9.5",
    termMonths: "360",
    type: "SAC"
  })
  
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calcular entrada baseada em 20% se não preenchida
    if (field === "propertyValue" && value && !formData.downPayment) {
      const autoDownPayment = (parseFloat(value) * 0.2).toString()
      setFormData(prev => ({ ...prev, downPayment: autoDownPayment }))
    }
  }

  const handleSimulate = async () => {
    setLoading(true)
    setError("")
    
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value)
      })
      
      const response = await simulateFinancing(data)
      
      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.message || "Erro ao simular financiamento")
      }
    } catch (err) {
      setError("Erro inesperado ao simular financiamento")
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value)
  }

  const downPaymentPercentage = formData.propertyValue && formData.downPayment 
    ? (parseFloat(formData.downPayment) / parseFloat(formData.propertyValue)) * 100 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Simulador de Financiamento</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Simule seu financiamento imobiliário e compare diferentes modalidades para encontrar a melhor opção
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Formulário de Simulação */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Dados para Simulação
            </CardTitle>
            <CardDescription>
              Preencha os dados abaixo para simular seu financiamento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="propertyValue">Valor do Imóvel</Label>
              <Input
                id="propertyValue"
                type="number"
                placeholder="R$ 300.000,00"
                value={formData.propertyValue}
                onChange={(e) => handleInputChange("propertyValue", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="downPayment">Valor da Entrada</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="R$ 60.000,00"
                value={formData.downPayment}
                onChange={(e) => handleInputChange("downPayment", e.target.value)}
              />
              {downPaymentPercentage > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  {downPaymentPercentage.toFixed(1)}% do valor do imóvel
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="interestRate">Taxa de Juros (% ao ano)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                placeholder="9.5"
                value={formData.interestRate}
                onChange={(e) => handleInputChange("interestRate", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="termMonths">Prazo (meses)</Label>
              <Select value={formData.termMonths} onValueChange={(value) => handleInputChange("termMonths", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="240">20 anos (240 meses)</SelectItem>
                  <SelectItem value="300">25 anos (300 meses)</SelectItem>
                  <SelectItem value="360">30 anos (360 meses)</SelectItem>
                  <SelectItem value="420">35 anos (420 meses)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Sistema de Amortização</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SAC">SAC - Sistema de Amortização Constante</SelectItem>
                  <SelectItem value="PRICE">PRICE - Sistema Francês</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleSimulate} disabled={loading} className="w-full">
              {loading ? "Simulando..." : "Simular Financiamento"}
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Resultado da Simulação
              </CardTitle>
              <CardDescription>
                Sistema: {result.type} | Prazo: {result.termMonths} meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="resumo" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="resumo">Resumo</TabsTrigger>
                  <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
                  <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                </TabsList>
                
                <TabsContent value="resumo" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Valor Financiado</p>
                      <p className="text-lg font-bold">{formatCurrency(result.financedAmount)}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Primeira Parcela</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(result.monthlyPayment)}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total a Pagar</p>
                      <p className="text-lg font-bold">{formatCurrency(result.totalAmount)}</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground">Total de Juros</p>
                      <p className="text-lg font-bold text-red-600">{formatCurrency(result.totalInterest)}</p>
                    </div>
                  </div>
                  
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      {result.type === "SAC" 
                        ? "No SAC, as parcelas diminuem ao longo do tempo. A primeira parcela é a maior."
                        : "No PRICE, todas as parcelas têm o mesmo valor durante todo o financiamento."
                      }
                    </AlertDescription>
                  </Alert>
                </TabsContent>

                <TabsContent value="detalhes" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Valor do Imóvel:</span>
                      <span className="font-medium">{formatCurrency(result.propertyValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Entrada:</span>
                      <span className="font-medium">{formatCurrency(result.downPayment)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Juros:</span>
                      <span className="font-medium">{result.interestRate}% ao ano</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Prazo:</span>
                      <span className="font-medium">{result.termMonths} meses ({Math.floor(result.termMonths / 12)} anos)</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Evolução das Parcelas (primeiros 12 meses)</h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                      {result.payments.slice(0, 12).map((payment: any) => (
                        <div key={payment.month} className="flex justify-between text-sm">
                          <span>Mês {payment.month}:</span>
                          <span>{formatCurrency(payment.payment)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="graficos" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Composição do Financiamento</h4>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Principal</span>
                            <span>{((result.financedAmount / result.totalAmount) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(result.financedAmount / result.totalAmount) * 100} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Juros</span>
                            <span>{((result.totalInterest / result.totalAmount) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(result.totalInterest / result.totalAmount) * 100} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Comparação de Sistemas</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>SAC:</strong> Parcelas decrescentes, menos juros no total</p>
                        <p><strong>PRICE:</strong> Parcelas fixas, mais juros no total</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Informações Importantes */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informações Importantes
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Sistema SAC</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Amortização constante do principal</li>
              <li>• Parcelas decrescentes ao longo do tempo</li>
              <li>• Menor valor total de juros</li>
              <li>• Primeira parcela mais alta</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Sistema PRICE</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Parcelas fixas durante todo o período</li>
              <li>• Mais juros no início, mais amortização no final</li>
              <li>• Maior valor total de juros</li>
              <li>• Melhor para planejamento financeiro</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
