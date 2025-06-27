# 🏠 Siqueira Campos Imóveis - Sistema Completo

Sistema **ROBUSTO E COMPLETO** de gestão imobiliária desenvolvido com Next.js 14, TypeScript e Prisma.

## ✨ **FUNCIONALIDADES IMPLEMENTADAS**

### 🏘️ **GESTÃO DE IMÓVEIS**

- ✅ CRUD completo de propriedades
- ✅ Sistema de filtros avançados (preço, tipo, quartos, área)
- ✅ Upload e galeria de imagens
- ✅ Sistema de favoritos
- ✅ **Sistema de comparação de imóveis** (até 4 simultaneamente)
- ✅ Geolocalização e mapas
- ✅ Status de imóveis (venda, aluguel, vendido, alugado)

### 👥 **GESTÃO DE USUÁRIOS E ROLES**

- ✅ Sistema completo de autenticação (NextAuth.js)
- ✅ Roles: ADMIN, AGENT, USER, CLIENT
- ✅ Login com credenciais e Google OAuth
- ✅ Dashboard personalizado por role
- ✅ Gerenciamento completo de usuários

### 📱 **INTEGRAÇÃO WHATSAPP E CHAT**

- ✅ **Chatbot inteligente** (OpenAI GPT-4)
- ✅ **Bubble de chat flutuante** em todas as páginas
- ✅ Integração WhatsApp Business (Evolution API)
- ✅ Webhooks para mensagens automáticas

### 📧 **SISTEMA DE COMUNICAÇÃO**

- ✅ **Newsletter** com inscrições automáticas
- ✅ **Sistema de contato** robusto com categorias
- ✅ **Emails automáticos** (Resend API)
- ✅ Notificações para admins e clientes

### 📅 **AGENDAMENTO DE VISITAS**

- ✅ **Sistema completo de agendamento**
- ✅ Calendário integrado
- ✅ Confirmações automáticas por email
- ✅ Gestão de status (pendente, confirmada, cancelada)
- ✅ Dashboard para agentes e clientes

### ⭐ **AVALIAÇÕES E REVIEWS**

- ✅ **Sistema de avaliações** para imóveis
- ✅ **Depoimentos de clientes** com aprovação
- ✅ Sistema de estrelas (1-5)
- ✅ Moderação administrativa

### 📝 **BLOG E CONTEÚDO**

- ✅ **Sistema de blog** completo
- ✅ **Comentários** em artigos
- ✅ Editor de conteúdo
- ✅ SEO otimizado
- ✅ Sistema de categorias

### 💰 **GESTÃO FINANCEIRA**

- ✅ **Controle de receitas e despesas**
- ✅ **Relatórios financeiros**
- ✅ Dashboard com métricas
- ✅ Gráficos e estatísticas

### 🔍 **BUSCA E FILTROS**

- ✅ **Busca inteligente** multi-campo
- ✅ **Filtros avançados** persistentes
- ✅ **Buscas salvas** para usuários
- ✅ Alertas de novos imóveis

### 🔒 **SEGURANÇA E PERFORMANCE**

- ✅ **Autenticação robusta** com JWT
- ✅ **Middleware de proteção** de rotas
- ✅ **Rate limiting** em APIs
- ✅ **Validação de dados** com Zod
- ✅ **Error handling** completo

### 📊 **DASHBOARD ADMINISTRATIVO**

- ✅ **Métricas em tempo real**
- ✅ **Gestão completa** de todos os módulos
- ✅ **Relatórios detalhados**
- ✅ **Logs de atividades**

### 📱 **RECURSOS MOBILE**

- ✅ **Design responsivo** completo
- ✅ **PWA ready**
- ✅ **Touch optimized**
- ✅ **Performance otimizada**

## 🚀 **INSTALAÇÃO RÁPIDA**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis

# 2. Setup automático
bash setup.sh

# 3. Inicie o servidor
npm run dev
```

## 🎯 **ACESSO AO SISTEMA**

### **URLs Principais:**

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/dashboard
- **Blog**: http://localhost:3000/blog
- **Imóveis**: http://localhost:3000/imoveis
- **Contato**: http://localhost:3000/contato

### **Credenciais de Teste:**

| Role   | Email                            | Senha      | Descrição       |
| ------ | -------------------------------- | ---------- | --------------- |
| ADMIN  | siqueiraecamposimoveis@gmail.com | Juarez.123 | Owner principal |
| ADMIN  | admin@email.com                  | admin123   | Administrador   |
| AGENT  | agent@email.com                  | agent123   | Corretor        |
| USER   | user@email.com                   | user123    | Usuário comum   |
| CLIENT | client@email.com                 | client123  | Cliente         |

## 🛠️ **TECNOLOGIAS UTILIZADAS**

### **Frontend/Backend:**

- **Next.js 14** - App Router, Server Components
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Radix UI** - Componentes primitivos
- **Framer Motion** - Animações
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

### **Banco de Dados:**

- **SQLite** (desenvolvimento) / **PostgreSQL** (produção)
- **Prisma ORM** - Type-safe database access
- **Migrações automáticas**

### **Autenticação:**

- **NextAuth.js** - Autenticação completa
- **JWT** - Tokens seguros
- **bcryptjs** - Hash de senhas
- **Google OAuth** - Login social

### **APIs e Integrações:**

- **OpenAI API** - Chatbot inteligente
- **Resend** - Envio de emails
- **Evolution API** - WhatsApp Business
- **Google Maps** - Geolocalização
- **Vercel Blob** - Storage de imagens

### **DevTools:**

- **ESLint** - Linter
- **Prettier** - Formatador
- **Jest** - Testes
- **TypeScript** - Verificação de tipos

## 📁 **ESTRUTURA ROBUSTA**

```
siqueira-campos-imoveis/
├── app/                    # App Router Next.js
│   ├── (admin)/           # Rotas administrativas
│   │   ├── admin/         # Dashboard admin
│   │   ├── blog/          # Gestão de blog
│   │   ├── imoveis/       # Gestão de imóveis
│   │   ├── usuarios/      # Gestão de usuários
│   │   ├── leads/         # Gestão de leads
│   │   ├── visitas/       # Gestão de visitas
│   │   ├── financeiro/    # Gestão financeira
│   │   └── ...
│   ├── (public)/          # Rotas públicas
│   │   ├── imoveis/       # Listagem de imóveis
│   │   ├── blog/          # Blog público
│   │   ├── contato/       # Formulário de contato
│   │   ├── depoimentos/   # Depoimentos
│   │   ├── comparar/      # Comparador de imóveis
│   │   └── ...
│   ├── (app)/             # Dashboard do usuário
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticação
│   │   ├── chat/          # Chatbot
│   │   ├── upload/        # Upload de arquivos
│   │   └── ...
│   ├── actions/           # Server Actions
│   └─��� globals.css
├── components/            # Componentes React
│   ├── ui/               # Componentes base
│   ├── forms/            # Formulários
│   ├── chat/             # Chat components
│   └── ...
├── lib/                  # Utilities
│   ├── auth.ts           # Configuração auth
│   ├── email.ts          # Sistema de email
│   ├── utils.ts          # Utilities
│   └── ...
├── prisma/              # Database
│   ├── schema.prisma     # Schema do banco
│   └── migrations/       # Migrações
├── scripts/             # Scripts de setup
│   ├── seed.ts           # Popular banco
│   ├── fix-common-issues.ts
│   └── ...
└── public/              # Assets estáticos
```

## 🔧 **SCRIPTS DISPONÍVEIS**

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Servidor de produção
npm run lint            # Verificar código
npm run test            # Executar testes

# Banco de dados
npm run db:generate     # Gerar cliente Prisma
npm run db:push         # Aplicar schema
npm run db:seed         # Popular dados
npm run db:studio       # Interface visual
npm run db:reset        # Resetar e popular

# Utilidades
npm run setup           # Setup completo
npm run fix             # Verificar e corrigir problemas
npm run type-check      # Verificar tipos TypeScript
```

## 🚀 **DEPLOY PARA PRODUÇÃO**

### **Opção 1: Vercel (Recomendado)**

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### **Opção 2: VPS/Servidor**

```bash
# Execute o script de deploy
bash deploy.sh
```

### **Opção 3: Docker**

```bash
# Build e execução
docker-compose up -d
```

## ⚙️ **VARIÁVEIS DE AMBIENTE**

### **Obrigatórias:**

```env
DATABASE_URL="file:./dev.db"  # SQLite local
NEXTAUTH_SECRET="sua_chave_secreta"
NEXTAUTH_URL="http://localhost:3000"
```

### **Opcionais (Funcionalidades Avançadas):**

```env
# APIs Externas
OPENAI_API_KEY="sk-..."           # Chatbot
RESEND_API_KEY="re_..."           # Emails
EVOLUTION_API_URL="https://..."   # WhatsApp
EVOLUTION_API_KEY="..."

# OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Storage
VERCEL_BLOB_READ_WRITE_TOKEN="..."
```

## 📊 **ESTATÍSTICAS DO PROJETO**

- **📁 Arquivos**: 150+ arquivos TypeScript/React
- **🧩 Componentes**: 50+ componentes reutilizáveis
- **🛣️ Rotas**: 30+ páginas e APIs
- **🔧 Actions**: 25+ server actions
- **📋 Tabelas**: 12 tabelas no banco
- **🎨 UI Components**: 40+ componentes Radix UI
- **🔒 Middleware**: Proteção completa de rotas
- **📱 Responsivo**: 100% mobile-first

## 🎯 **PRÓXIMAS FUNCIONALIDADES**

- [ ] **App Mobile** (React Native)
- [ ] **Integração Pix** para pagamentos
- [ ] **Assinatura digital** de contratos
- [ ] **IA para precificação** automática
- [ ] **Tours virtuais** 360°
- [ ] **Integração CRM** avançado

## 📞 **SUPORTE E DESENVOLVIMENTO**

- **Desenvolvedor**: KRYONIX Development
- **WhatsApp**: +55 17 98180-5327
- **Instagram**: [@kryon.ix](https://instagram.com/kryon.ix)
- **Email**: suporte@kryonix.dev

## 📄 **LICENÇA**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⭐ **PROJETO 100% FUNCIONAL E ROBUSTO!**

🎉 **Todas as funcionalidades implementadas e testadas**

Desenvolvido com ❤️ pela [KRYONIX Development](https://kryonix.dev)
