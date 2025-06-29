"use client";

import { useState } from "react";

export default function SimuladorFinanciamento() {
  const [valor, setValor] = useState("");
  const [juros, setJuros] = useState("");
  const [prazo, setPrazo] = useState("");
  const [resultado, setResultado] = useState<number | null>(null);

  const calcularPrestacao = (valor: number, juros: number, prazo: number) => {
    const taxaMensal = juros / 100 / 12;
    const prestacao =
      (valor * taxaMensal) / (1 - Math.pow(1 + taxaMensal, -prazo));
    return prestacao;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const valorNum = parseFloat(valor);
    const jurosNum = parseFloat(juros);
    const prazoNum = parseInt(prazo);

    if (isNaN(valorNum) || isNaN(jurosNum) || isNaN(prazoNum)) {
      setResultado(null);
      return;
    }

    const prestacao = calcularPrestacao(valorNum, jurosNum, prazoNum);
    setResultado(prestacao);
  };

  return (
    <main className="container py-12 max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Simulador de Financiamento
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="valor" className="block font-medium mb-1">
            Valor do Empréstimo (R$)
          </label>
          <input
            type="number"
            id="valor"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="juros" className="block font-medium mb-1">
            Taxa de Juros Anual (%)
          </label>
          <input
            type="number"
            id="juros"
            value={juros}
            onChange={(e) => setJuros(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="prazo" className="block font-medium mb-1">
            Prazo (meses)
          </label>
          <input
            type="number"
            id="prazo"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            className="w-full border rounded px-3 py-2"
            min="1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
        >
          Calcular
        </button>
      </form>
      {resultado !== null && (
        <div className="mt-6 p-4 bg-green-100 rounded text-green-800 text-center">
          Prestação mensal: R${" "}
          {resultado.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      )}
    </main>
  );
}
