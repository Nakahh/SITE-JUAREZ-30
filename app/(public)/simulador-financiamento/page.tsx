"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SimuladorFinanciamento() {
  const [valorImovel, setValorImovel] = useState<number | string>("")
  const [entrada, setEntrada] = useState<number | string>("")
  const [taxaJurosAnual, setTaxaJurosAnual] = useState<number | string>("")
  const [prazoAnos, setPrazoAnos] = useState<number | string>("")
  const [parcelaMensal, setParcelaMensal] = useState<number | null>(null)
  const [totalPago, setTotalPago] = useState<number | null>(null)

  const calcularFinanciamento = () => {
    const vImovel = Number(valorImovel)
    const vEntrada = Number(entrada)
    const tJurosAnual = Number(taxaJurosAnual)
    const pAnos = Number(prazoAnos)

    if (isNaN(vImovel) || isNaN(vEntrada) || isNaN(tJurosAnual) || isNaN(pAnos) || vImovel <= 0 || pAnos <= 0) {
      setParcelaMensal(null)
      setTotalPago(null)
      alert("Por favor, preencha todos os campos com valores válidos.")
      return
    }

    const valorFinanciado = vImovel - vEntrada
    const taxaJurosMensal = tJurosAnual / 100 / 12
    const numeroParcelas = pAnos * 12

    if (taxaJurosMensal === 0) {
      const parcela = valorFinanciado / numeroParcelas
      setParcelaMensal(parcela)
      setTotalPago(parcela * numeroParcelas + vEntrada)
    } else {
      const parcela = valorFinanciado * (taxaJurosMensal / (1 - Math.pow(1 + taxaJurosMensal, -numeroParcelas)))
      setParcelaMensal(parcela)
      setTotalPago(parcela * numeroParcelas + vEntrada)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <section className="container py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Simulador de Financiamento Imobiliário</h1>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Calcule sua Parcela Mensal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="valorImovel" className="block text-sm font-medium text-gray-700">
              Valor do Imóvel (R$)
            </label>
            <Input
              id="valorImovel"
              type="number"
              value={valorImovel}
              onChange={(e) => setValorImovel(e.target.value)}
              placeholder="Ex: 300000"
              required
            />
          </div>
          <div>
            <label htmlFor="entrada" className="block text-sm font-medium text-gray-700">
              Valor da Entrada (R$)
            </label>
            <Input
              id="entrada"
              type="number"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Ex: 60000"
              required
            />
          </div>
          <div>
            <label htmlFor="taxaJurosAnual" className="block text-sm font-medium text-gray-700">
              Taxa de Juros Anual (%)
            </label>
            <Input
              id="taxaJurosAnual"
              type="number"
              step="0.01"
              value={taxaJurosAnual}
              onChange={(e) => setTaxaJurosAnual(e.target.value)}
              placeholder="Ex: 8.5"
              required
            />
          </div>
          <div>
            <label htmlFor="prazoAnos" className="block text-sm font-medium text-gray-700">
              Prazo do Financiamento (Anos)
            </label>
            <Input
              id="prazoAnos"
              type="number"
              value={prazoAnos}
              onChange={(e) => setPrazoAnos(e.target.value)}
              placeholder="Ex: 30"
              required
            />
          </div>
          <Button onClick={calcularFinanciamento} className="w-full">
            Calcular Financiamento
          </Button>

          {parcelaMensal !== null && (
            <div className="mt-8 p-4 bg-gray-100 rounded-md">
              <h3 className="text-xl font-bold mb-2">Resultados:</h3>
              <p className="text-lg">
                Parcela Mensal Estimada:{" "}
                <span className="font-semibold text-primary">{formatCurrency(parcelaMensal)}</span>
              </p>
              <p className="text-lg">
                Valor Total Pago (Estimado):{" "}
                <span className="font-semibold text-primary">{formatCurrency(totalPago || 0)}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                *Este é um cálculo aproximado. Consulte um especialista financeiro para condições exatas.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
