export default function TestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">✅ Site Funcionando!</h1>
      <p className="text-center mt-4 text-lg">
        Se você está vendo esta página, o site está carregando corretamente.
      </p>
      <div className="text-center mt-8">
        <a
          href="/login"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Ir para Login
        </a>
      </div>
    </div>
  );
}
