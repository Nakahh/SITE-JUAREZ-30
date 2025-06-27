# 🏠 Siqueira Campos Imóveis

Sistema completo de gestão imobiliária desenvolvido com Next.js 14, TypeScript e Prisma.

## ✨ Funcionalidades

- 🏘️ **Gestão de Imóveis**: Cadastro, edição e visualização de propriedades
- 👥 **Gestão de Usuários**: Sistema completo de roles (Admin, Agent, User, Client)
- 🔐 **Autenticação**: NextAuth.js com login por credenciais e Google OAuth
- 📱 **WhatsApp Integration**: Chatbot integrado via Evolution API
- 📧 **Sistema de Email**: Resend para envio de emails
- 🗃️ **Banco de Dados**: PostgreSQL com Prisma ORM
- 📊 **Dashboard Administrativo**: Painel completo de administração
- 🎨 **UI Moderna**: Interface responsiva com Tailwind CSS e Radix UI
- 🔍 **Sistema de Busca**: Filtros avançados para propriedades
- ⭐ **Favoritos**: Sistema de favoritar imóveis
- 📝 **Blog**: Sistema de artigos e blog integrado
- 💬 **Comentários**: Sistema de comentários e avaliações
- 📈 **Relatórios**: Dashboard com métricas e relatórios

## 🚀 Setup Rápido

### Pré-requisitos

- Node.js 18+
- PostgreSQL (local, Docker ou cloud)
- Git

### Instalação Automática

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis

# Execute o script de setup
bash setup.sh
```

O script irá:

- ✅ Verificar dependências
- ✅ Instalar packages
- ✅ Configurar banco de dados
- ✅ Gerar cliente Prisma
- ✅ Popular banco com dados iniciais
- ✅ Fazer build da aplicação

### Instalação Manual

1. **Clone e instale dependências:**

```bash
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis
npm install
# ou
yarn install
```

2. **Configure variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/siqueira_db"
NEXTAUTH_SECRET="sua_chave_secreta_muito_segura"
NEXTAUTH_URL="http://localhost:3000"
# ... outras variáveis
```

3. **Configure o banco de dados:**

```bash
npx prisma generate
npx prisma db push
npx tsx scripts/seed.ts
```

4. **Inicie o servidor:**

```bash
npm run dev
# ou
yarn dev
```

## 🐳 Docker (Desenvolvimento)

Para usar Docker no desenvolvimento:

```bash
# Inicie os serviços
docker-compose -f docker-compose.dev.yml up -d

# Aplique migrações
docker-compose -f docker-compose.dev.yml exec app npx prisma db push

# Popular banco de dados
docker-compose -f docker-compose.dev.yml exec app npx tsx scripts/seed.ts
```

## 📱 URLs Importantes

- **Site Principal**: http://localhost:3000
- **Painel Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login
- **Blog**: http://localhost:3000/blog
- **Dashboard**: http://localhost:3000/dashboard

## 👤 Credenciais Padrão

Após executar o seed, você pode usar:

| Role   | Email                            | Senha      | Descrição       |
| ------ | -------------------------------- | ---------- | --------------- |
| ADMIN  | siqueiraecamposimoveis@gmail.com | Juarez.123 | Owner principal |
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

### DevTools

- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formatador de código
- **Jest** - Framework de testes

## 📁 Estrutura do Projeto

```
siqueira-campos-imoveis/
├── app/                    # App Router do Next.js
│   ├── (admin)/           # Rotas administrativas
│   ├── (app)/             # Rotas do app
│   ├── (public)/          # Rotas públicas
│   ├── api/               # API routes
│   ├── actions/           # Server actions
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base (Radix)
│   └── ...               # Componentes específicos
├── lib/                  # Utilities e configurações
├── prisma/              # Schema e migrações
├── public/              # Assets estáticos
├── scripts/             # Scripts de setup e seed
├── types/               # Definições de tipos TypeScript
└── ...                  # Arquivos de configuração
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Verificar código
npm run test         # Executar testes

# Banco de dados
npx prisma generate  # Gerar cliente Prisma
npx prisma db push   # Aplicar schema ao banco
npx prisma studio    # Interface visual do banco
npx tsx scripts/seed.ts  # Popular banco com dados
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
