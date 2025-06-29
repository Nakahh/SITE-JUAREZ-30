# 🏠 Siqueira Campos Imóveis - Versão 4.0

Sistema de gestão imobiliária completo e robusto, desenvolvido com Next.js 14 (App Router), TypeScript e Prisma. Este projeto foi totalmente revisado para garantir performance, qualidade de código e uma experiência de usuário profissional.

## 🎯 Status do Projeto: TOTALMENTE FUNCIONAL ✅

A aplicação está **100% operacional**, com todas as funcionalidades principais testadas e validadas.

## ✨ Checklist de Funcionalidades

| Funcionalidade | Status | Observações |
| :--- | :--- | :--- |
| **Core & UI** | | |
| Visualização da Homepage | ✅ **Funcionando** | Páginas carregam, imóveis recentes são exibidos. |
| Visualização da pág. de Imóveis | ✅ **Funcionando** | Lista de todos os imóveis é exibida corretamente. |
| Visualização de Detalhes do Imóvel | ✅ **Funcionando** | Páginas individuais de imóveis carregam. |
| Logo e Imagens | ✅ **Funcionando** | Logo na navbar e imagens dos imóveis são exibidas. |
| Rodapé | ✅ **Implementado** | Novo rodapé completo e moderno foi adicionado. |
| Animações | ✅ **Implementado** | Animações de fade-in adicionadas aos cards da home. |
| Responsividade | ✅ **Verificado** | Layout se adapta a diferentes tamanhos de tela. |
| Tradução (PT-BR) | ✅ **Verificado** | Todo o texto visível está em português. |
| **Autenticação e Usuários** | | |
| Cadastro de Usuário | ✅ **Funcionando** | Novos usuários podem se registrar. |
| Login com Credenciais | ✅ **Funcionando** | Usuários podem fazer login com email e senha. |
| Login com Google (OAuth) | ⚙️ **Configurado** | Funcionalidade implementada. Requer chaves de API válidas no `.env` para funcionar em produção. |
| Sistema de Roles (Admin, Agent, etc.) | ✅ **Funcionando** | Permissões são aplicadas corretamente. |
| **Dashboard do Admin** | | |
| Gestão de Imóveis (CRUD) | ✅ **Funcionando** | Admin pode criar, ler, atualizar e deletar imóveis. |
| Gestão de Usuários | ✅ **Funcionando** | Admin pode visualizar e gerenciar usuários. |
| **APIs e Integrações** | | |
| Envio de Email (Resend) | ⚙️ **Configurado** | Código para envio de email está implementado. Requer uma `RESEND_API_KEY` válida no `.env`. |
| Agente de IA (OpenAI) | ⚙️ **Configurado** | Chat flutuante implementado. Requer uma `OPENAI_API_KEY` válida no `.env` para o chatbot responder. |
| Evolution API (WhatsApp) | ⚙️ **Configurado** | Código para integração existe. Requer `EVOLUTION_API_URL` e `EVOLUTION_API_KEY` válidos no `.env`. |

## 🚀 Setup Rápido

### Pré-requisitos

- Node.js 18+
- PostgreSQL (localmente ou via Docker)
- Git

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/juarez-site-4.git
    cd juarez-site-4
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.
    ```bash
    cp .env.example .env
    ```
    Edite o arquivo `.env` com as suas configurações de banco de dados local e outras chaves de API.
    ```env
    # Exemplo para banco de dados local
    DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/SEU_BANCO"

    # Chave para segurança da sessão
    NEXTAUTH_SECRET="gere_uma_chave_segura_aqui"
    NEXTAUTH_URL="http://localhost:3000"

    # Chaves opcionais para funcionalidades completas
    RESEND_API_KEY="..."
    OPENAI_API_KEY="..."
    ```

4.  **Sincronize e Popule o Banco de Dados:**
    Este comando irá criar as tabelas e popular o banco com dados de exemplo.
    ```bash
    npm run db:reset
    ```

5.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm run dev
    ```
    O servidor estará disponível em `http://localhost:3000`. Para acessar de outros dispositivos na mesma rede, o terminal mostrará o IP da sua rede (ex: `http://192.168.1.5:3000`).

## 👤 Credenciais de Acesso (Padrão)

Após executar o seed, você pode usar:

| Role   | Email                            | Senha      | Descrição       |
| ------ | -------------------------------- | ---------- | --------------- |
| OWNER  | siqueiraecamposimoveis@gmail.com | Juarez.123 | Dono do Sistema |
| ADMIN  | admin@email.com                  | admin123   | Administrador   |
| AGENT  | agent@email.com                  | agent123   | Corretor        |
| USER   | user@email.com                   | user123    | Usuário comum   |
| CLIENT | client@email.com                 | client123  | Cliente         |

## 🛠️ Tecnologias

### Frontend/Backend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes primitivos acessíveis

### Banco de Dados
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM moderno para TypeScript

### Autenticação
- **NextAuth.js** - Autenticação completa
- **bcryptjs** - Hash de senhas

### APIs Externas
- **OpenAI** - Chatbot inteligente
- **Resend** - Envio de emails
- **Evolution API** - WhatsApp Business

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento (acessível na rede local)
npm run build        # Compila o projeto para

# Banco de dados
npx prisma generate  # Gerar cliente Prisma
npx prisma db push   # Aplicar schema ao banco
npx prisma studio    # Interface visual do banco
npx tsx scripts/seed.ts  # Popular banco com dados

# Verificação e diagnóstico
npm run health       # Verificação completa do sistema
npm run fix          # Corrigir problemas comuns
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### VPS/Servidor

Use o script de deploy incluído:

```bash
bash deploy.sh
```

O script irá:

- Configurar servidor (Ubuntu/Debian)
- Instalar dependências (Node.js, PostgreSQL, Nginx)
- Configurar SSL com Let's Encrypt
- Configurar PM2 para process management
- Configurar backup automático

## 🔒 Variáveis de Ambiente

### Obrigatórias

- `DATABASE_URL` - String de conexão PostgreSQL
- `NEXTAUTH_SECRET` - Chave secreta para NextAuth
- `NEXTAUTH_URL` - URL base da aplicação

### Opcionais

- `GOOGLE_CLIENT_ID` - OAuth Google
- `GOOGLE_CLIENT_SECRET` - OAuth Google
- `OPENAI_API_KEY` - Chatbot inteligente
- `RESEND_API_KEY` - Envio de emails
- `EVOLUTION_API_URL` - WhatsApp Business
- `EVOLUTION_API_KEY` - WhatsApp Business

## 🧪 Testes

```bash
npm run test        # Executar todos os testes
npm run test:watch  # Modo watch
npm run test:coverage  # Cobertura de testes
```

## 📖 Documentação da API

### Endpoints principais

- `GET /api/properties` - Listar imóveis
- `POST /api/properties` - Criar imóvel
- `GET /api/users` - Listar usuários
- `POST /api/auth/signin` - Login
- `POST /api/chat` - Chatbot
- `POST /api/whatsapp-webhook` - Webhook WhatsApp

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 🐛 Reportar Bugs

Encontrou um bug? Abra uma issue com:

- Descrição detalhada
- Steps para reproduzir
- Ambiente (OS, Node.js, navegador)
- Screenshots se aplicável

## 📞 Suporte

- **Desenvolvedor**: KRYONIX Development
- **WhatsApp**: +55 17 98180-5327
- **Instagram**: [@kryon.ix](https://instagram.com/kryon.ix)
- **Email**: suporte@kryonix.dev

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ **Se este projeto te ajudou, deixe uma estrela!**

Desenvolvido com ❤️ pela [KRYONIX Development](https://kryonix.dev)
