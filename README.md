
# 🏢 Siqueira Campos Imóveis - Sistema Completo

> **Sistema completo de gestão imobiliária com portal público e painel administrativo**

![Siqueira Campos](./public/logo%20siqueira%20campos%20imoveis.png)

## 🌟 **VISÃO GERAL**

Sistema completo desenvolvido para a **Siqueira Campos Imóveis** com tecnologias modernas, oferecendo:

- 🏠 **Portal Público** completo para clientes
- 🎛️ **Sistema Administrativo** robusto
- 💰 **Gestão Financeira** completa
- 📱 **Design Responsivo** mobile-first
- 🤖 **Chat Inteligente** com IA
- 📊 **Dashboard** analítico avançado

## 🚀 **INSTALAÇÃO RÁPIDA**

### **Pré-requisitos**
- Node.js 18+ 
- NPM ou Yarn
- PostgreSQL (produção) ou SQLite (desenvolvimento)

### **Setup Automático**

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis

# 2. Setup automático
bash setup.sh

# 3. Inicie o servidor
npm run dev
```

### **Configuração Manual**

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
npx prisma generate
npx prisma db push
npx prisma db seed

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Iniciar desenvolvimento
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

## 🏢 **FUNCIONALIDADES PRINCIPAIS**

### **Portal do Cliente:**
- 🏠 Catálogo completo de imóveis com filtros avançados
- 🔍 Busca por localização, preço, tipo, quartos, área
- 📱 Galeria de fotos profissionais para cada imóvel
- 📍 Mapa interativo com localização dos imóveis
- 💬 Formulário de contato e interesse
- 📞 Agendamento de visitas online
- ⭐ Sistema de favoritos
- 📊 Comparador de imóveis
- 📧 Newsletter com novos imóveis
- 💰 Simulador de financiamento
- 🤖 Chat inteligente com IA

### **Sistema Administrativo:**

#### **Gestão de Imóveis:**
- ➕ Cadastro completo de imóveis
- 📸 Upload múltiplo de imagens
- ✏️ Edição de informações
- 🗑️ Exclusão com confirmação
- 📋 Listagem com filtros avançados
- 📊 Status (Disponível, Alugado, Vendido, Reservado)
- 💰 Histórico de preços
- 📄 Geração de fichas técnicas em PDF

#### **Gestão Financeira:**
- 💳 Controle de receitas e despesas
- 📊 Dashboard financeiro completo
- 💰 Gestão de comissões
- 📈 Relatórios financeiros
- 📅 Fluxo de caixa
- 🎯 Orçamentos e metas
- 📋 Controle de pagamentos

#### **Gestão de Usuários:**
- 👥 Níveis de acesso (Admin, Corretor, Assistente)
- 🔐 Sistema de autenticação seguro
- 📊 Log de atividades
- 👤 Perfis personalizados

#### **Dashboard e Relatórios:**
- 📈 Estatísticas em tempo real
- 📊 Gráficos de vendas/locações
- 💹 Relatórios financeiros
- 📅 Agenda de visitas
- 🎯 Metas e performance
- 📧 Leads e conversões
- 📱 Relatórios de acessos mobile

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
- **Prisma ORM** - Object-Relational Mapping
- **Redis** - Cache e sessões

### **Autenticação:**
- **NextAuth.js** - Autenticação completa
- **Google OAuth** - Login social
- **JWT** - Tokens seguros

### **Integrações:**
- **WhatsApp Business API** - Comunicação
- **Google Maps** - Geolocalização
- **Vercel Blob** - Storage de imagens
- **Nodemailer** - Envio de emails

### **DevTools:**
- **ESLint** - Linter
- **Prettier** - Formatador
- **Jest** - Testes
- **TypeScript** - Verificação de tipos

## 📁 **ESTRUTURA DO PROJETO**

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
│   │   └── whatsapp/      # Integração WhatsApp
│   ├── (public)/          # Rotas públicas
│   │   ├── imoveis/       # Listagem de imóveis
│   │   ├── blog/          # Blog público
│   │   ├── contato/       # Formulário de contato
│   │   ├── depoimentos/   # Depoimentos
│   │   ├── comparar/      # Comparador de imóveis
│   │   └── simulador-financiamento/
│   ├── (app)/             # Dashboard do usuário
│   ├── api/               # API Routes
│   │   ├── auth/          # Autenticação
│   │   ├── chat/          # Chatbot
│   │   ├── upload/        # Upload de arquivos
│   │   └── whatsapp-webhook/
│   ├── actions/           # Server Actions
│   └── globals.css        # Estilos globais
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── navbar.tsx        # Navegação
│   ├── footer.tsx        # Rodapé
│   ├── property-card.tsx # Card de imóvel
│   └── floating-chat-bubble.tsx
├── lib/                  # Bibliotecas e utilitários
│   ├── auth.ts          # Configuração autenticação
│   ├── prisma.ts        # Cliente Prisma
│   ├── utils.ts         # Utilitários
│   └── email.ts         # Configuração email
├── prisma/              # Schema e migrações
│   ├── schema.prisma    # Modelo do banco
│   └── migrations/      # Migrações
├── public/              # Arquivos estáticos
└── scripts/             # Scripts de automação
```

## 🔧 **COMANDOS DISPONÍVEIS**

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run build           # Build para produção
npm run start           # Inicia servidor de produção
npm run lint            # Executa linter
npm run type-check      # Verifica tipos TypeScript

# Banco de Dados
npm run db:generate     # Gera cliente Prisma
npm run db:push         # Aplica mudanças ao banco
npm run db:seed         # Popula banco com dados iniciais
npm run db:studio       # Abre Prisma Studio
npm run db:reset        # Reseta banco de dados

# Testes
npm run test            # Executa testes
npm run test:watch      # Executa testes em watch mode
npm run test:coverage   # Gera relatório de cobertura

# Deploy
npm run deploy          # Deploy para produção
npm run deploy:staging  # Deploy para staging
```

## 🐳 **DOCKER**

### **Desenvolvimento**
```bash
# Inicia todos os serviços
docker-compose -f docker-compose.dev.yml up

# Apenas o banco de dados
docker-compose -f docker-compose.dev.yml up postgres
```

### **Produção**
```bash
# Build e inicialização
docker-compose up -d

# Logs
docker-compose logs -f app
```

## 🌍 **VARIÁVEIS DE AMBIENTE**

```env
# Domínio
MAIN_DOMAIN=siqueicamposimoveis.com.br

# JWT
JWT_SECRET=seu_jwt_secret_aqui
JWT_EXPIRES_IN=7d
COOKIE_SECRET=seu_cookie_secret_aqui

# Banco de Dados
DATABASE_URL="postgresql://usuario:senha@localhost:5432/banco?schema=public"

# Portas
PORT=3000
ADMIN_PORT=3001
APP_PORT=3002
NODE_ENV="production"

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=siqueiraecamposimoveis@gmail.com
EMAIL_PASS=sua_senha_app

# Google OAuth
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GOOGLE_CALLBACK_URL=https://seudominio.com/api/auth/google/callback

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# WhatsApp
WHATSAPP_TOKEN=seu_whatsapp_token
WHATSAPP_WEBHOOK_VERIFY=seu_webhook_verify_token

# Backup
BACKUP_DIR=/var/backups/siqueira-campos
```

## 📱 **RESPONSIVIDADE**

- ✅ **Mobile First** - Design otimizado para mobile
- ✅ **Tablet** - Layout adaptado para tablets
- ✅ **Desktop** - Experiência completa em desktop
- ✅ **PWA Ready** - Pronto para Progressive Web App

## 🔒 **SEGURANÇA**

- 🛡️ **Autenticação JWT** segura
- 🔐 **Criptografia** de senhas com bcrypt
- 🚫 **Proteção CSRF** integrada
- 📝 **Validação** rigorosa de dados
- 🔒 **HTTPS** enforced
- 👤 **Controle de acesso** por roles

## 🚀 **DEPLOY**

### **Vercel (Recomendado)**
```bash
# Configurar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Servidor Próprio**
```bash
# Build
npm run build

# Iniciar
npm start
```

## 📊 **MONITORAMENTO**

- 📈 **Analytics** integrado
- 🔍 **Logs** estruturados
- ⚡ **Performance** monitoring
- 🚨 **Error tracking** automático
- 📱 **Uptime** monitoring

## 🤝 **CONTRIBUIÇÃO**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **LICENÇA**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 **SUPORTE**

- 📧 **Email**: siqueiraecamposimoveis@gmail.com
- 📱 **WhatsApp**: (62) 9 8556-3905
- 🌐 **Site**: https://siqueicamposimoveis.com.br

## 🏆 **CRÉDITOS**

**Desenvolvido por [KRYONIX](https://kryonix.dev)**

- 🎨 **Design**: Interface moderna e responsiva
- ⚡ **Performance**: Otimizado para velocidade
- 🔧 **Manutenção**: Suporte técnico contínuo

---

**© 2024 Siqueira Campos Imóveis - Todos os direitos reservados**
