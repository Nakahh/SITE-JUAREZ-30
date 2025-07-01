import Link from "next/link";

// Página mínima sem dependências complexas para teste de performance
export default function HomePage() {
  return (
    <html lang="pt-BR">
      <head>
        <title>Siqueira Campos Imóveis</title>
        <style>{`
          body {
            margin: 0;
            font-family: system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            background: white;
            padding: 3rem;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            max-width: 500px;
            margin: 2rem;
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
            font-size: 2.5rem;
          }
          p {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .button {
            display: inline-block;
            background: #667eea;
            color: white;
            text-decoration: none;
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            margin: 0.5rem;
            font-weight: 600;
            transition: all 0.3s;
          }
          .button:hover {
            background: #5a67d8;
            transform: translateY(-2px);
          }
          .status {
            margin-top: 2rem;
            padding: 1rem;
            background: #f0f9ff;
            border: 1px solid #0ea5e9;
            border-radius: 0.5rem;
            color: #0c4a6e;
          }
        `}</style>
      </head>
      <body>
        <div className="container">
          <h1>🏠 Siqueira Campos Imóveis</h1>
          <p>
            Encontre seu imóvel dos sonhos em Siqueira Campos e região. Sistema
            de imobiliária completo com login, dashboard e gestão de
            propriedades.
          </p>

          <div>
            <Link href="/login" className="button">
              🔑 Fazer Login
            </Link>
            <Link href="/imoveis" className="button">
              🏘️ Ver Imóveis
            </Link>
          </div>

          <div>
            <Link href="/test" className="button">
              ✅ Teste Rápido
            </Link>
            <Link href="/auth-debug" className="button">
              🔍 Debug Auth
            </Link>
          </div>

          <div className="status">
            <strong>✅ Status do Sistema:</strong>
            <br />
            🌐 Servidor: Online
            <br />
            🗄️ Banco: Conectado
            <br />
            🔐 Auth: Configurado
            <br />⚡ Performance: Otimizada
          </div>

          <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#888" }}>
            <p>
              <strong>Contas de Teste:</strong>
              <br />
              Admin: admin@siqueiracampos.com / 123456
              <br />
              Corretor: corretor@siqueiracampos.com / 123456
              <br />
              Cliente: usuario@teste.com / 123456
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
