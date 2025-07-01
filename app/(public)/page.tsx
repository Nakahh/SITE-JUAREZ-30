import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center space-y-6 max-w-2xl mx-auto p-8">
        <h1 className="text-5xl font-bold text-gray-900">
          🏠 Siqueira Campos Imóveis
        </h1>

        <p className="text-xl text-gray-600">
          Encontre seu imóvel dos sonhos em Siqueira Campos e região
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            🔑 Fazer Login
          </Link>

          <Link
            href="/imoveis"
            className="bg-gray-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            🏘️ Ver Imóveis
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 mb-4">Teste rápido do sistema:</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/test"
              className="bg-green-100 text-green-800 px-4 py-2 rounded border hover:bg-green-200"
            >
              ✅ Página de Teste
            </Link>
            <Link
              href="/auth-debug"
              className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded border hover:bg-yellow-200"
            >
              🔍 Debug Auth
            </Link>
            <Link
              href="/dashboard"
              className="bg-purple-100 text-purple-800 px-4 py-2 rounded border hover:bg-purple-200"
            >
              📊 Dashboard
            </Link>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-400">
          Status: ✅ Servidor funcionando | 🗄️ Banco conectado | 🔐 Auth
          configurado
        </div>
      </div>
    </div>
  );
}
