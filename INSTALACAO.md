# 📋 Instruções de Instalação - Siqueira Campos Imóveis

## 🚀 Instalação Rápida (Recomendada)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis

# 2. Execute o setup automático
bash setup.sh

# 3. Inicie o servidor
npm run dev
```

## 📋 Instalação Manual Passo a Passo

### 1. Pré-requisitos

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL** - Local, Docker ou Cloud
- ✅ **Git** - Para clonar o repositório

### 2. Clone e Dependências

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/siqueira-campos-imoveis.git
cd siqueira-campos-imoveis

# Instale dependências (escolha um)
npm install
# ou
yarn install
# ou
pnpm install
```

### 3. Banco de Dados PostgreSQL

#### Opção A: PostgreSQL Local

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar usuário e banco
sudo -u postgres psql
CREATE DATABASE siqueira_db;
CREATE USER siqueira_user WITH PASSWORD 'siqueira_pass';
GRANT ALL PRIVILEGES ON DATABASE siqueira_db TO siqueira_user;
ALTER USER siqueira_user CREATEDB;
\q
```

#### Opção B: Docker

```bash
# PostgreSQL via Docker
docker run --name siqueira-postgres \
  -e POSTGRES_USER=siqueira_user \
  -e POSTGRES_PASSWORD=siqueira_pass \
  -e POSTGRES_DB=siqueira_db \
  -p 5432:5432 \
  -d postgres:15
```

#### Opção C: Cloud (Neon, Supabase, etc.)

1. Crie uma conta em [Neon](https://neon.tech) ou [Supabase](https://supabase.com)
2. Crie um novo projeto
3. Copie a string de conexão PostgreSQL

### 4. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo .env
nano .env
# ou
code .env
```

**Variáveis obrigatórias:**

```env
# Banco de dados
DATABASE_URL="postgresql://siqueira_user:siqueira_pass@localhost:5432/siqueira_db?schema=public"

# NextAuth
NEXTAUTH_SECRET="sua_chave_secreta_muito_segura_aqui"
NEXTAUTH_URL="http://localhost:3000"

# Básicas para funcionamento
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="5562985563905"
```

### 5. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar schema ao banco
npx prisma db push

# Popular com dados iniciais
npx tsx scripts/seed.ts
```

### 6. Testar Instalação

```bash
# Verificar problemas comuns
npm run fix

# Fazer build
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

### 7. Acessar Sistema

- **Site**: http://localhost:3000
- **Admin**: http://localhost:3000/admin
- **Login**: http://localhost:3000/login

**Credenciais padrão:**

- Owner: `siqueiraecamposimoveis@gmail.com` / `Juarez.123`
- Admin: `admin@email.com` / `admin123`

## 🐳 Instalação com Docker

### Desenvolvimento

```bash
# Iniciar todos os serviços
docker-compose -f docker-compose.dev.yml up -d

# Aplicar migrações
docker-compose -f docker-compose.dev.yml exec app npx prisma db push

# Popular banco
docker-compose -f docker-compose.dev.yml exec app npx tsx scripts/seed.ts

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f app
```

### Produção

```bash
# Build e iniciar
docker-compose up -d

# Aplicar migrações
docker-compose exec frontend npx prisma migrate deploy

# Ver status
docker-compose ps
```

## ⚙️ Configurações Opcionais

### Google OAuth

1. Vá para [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto ou selecione existente
3. Ative a Google OAuth API
4. Crie credenciais OAuth 2.0
5. Adicione ao .env:

```env
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
```

### Email (Resend)

1. Crie conta em [Resend](https://resend.com)
2. Gere uma API key
3. Adicione ao .env:

```env
RESEND_API_KEY="sua_chave_resend"
```

### ChatBot (OpenAI)

1. Crie conta em [OpenAI](https://platform.openai.com)
2. Gere uma API key
3. Adicione ao .env:

```env
OPENAI_API_KEY="sua_chave_openai"
```

### WhatsApp (Evolution API)

1. Configure Evolution API
2. Adicione ao .env:

```env
EVOLUTION_API_URL="https://sua-evolution-api.com"
EVOLUTION_API_KEY="sua_chave_evolution"
```

## 🔧 Scripts Úteis

```bash
# Desenvolvimento
npm run dev              # Servidor desenvolvimento
npm run build           # Build produção
npm run start           # Servidor produção

# Banco de dados
npm run db:push         # Aplicar schema
npm run db:seed         # Popular dados
npm run db:studio       # Interface visual
npm run db:reset        # Resetar e popular

# Utilidades
npm run setup           # Setup completo
npm run fix             # Verificar problemas
npm run type-check      # Verificar tipos
npm run lint            # Verificar código
```

## 🚨 Solução de Problemas

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# Testar conexão
psql postgresql://siqueira_user:siqueira_pass@localhost:5432/siqueira_db
```

### Erro "Module not found"

```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Erro de tipos TypeScript

```bash
# Regenerar tipos Prisma
npx prisma generate

# Verificar tipos
npm run type-check
```

### Build falha

```bash
# Verificar problemas
npm run lint
npm run type-check

# Verificar banco
npm run fix
```

### Banco vazio após seed

```bash
# Resetar banco completamente
npm run db:reset

# Verificar se seed rodou
npm run fix
```

## 📞 Suporte

Se ainda estiver com problemas:

1. **Verifique** se seguiu todos os passos
2. **Execute** `npm run fix` para diagnóstico
3. **Veja logs** de erro completos
4. **Entre em contato**:
   - WhatsApp: +55 17 98180-5327
   - Instagram: @kryon.ix
   - Email: suporte@kryonix.dev

## ✅ Checklist Final

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL configurado e rodando
- [ ] Projeto clonado e dependências instaladas
- [ ] Arquivo .env configurado
- [ ] Banco de dados criado e populado
- [ ] Build executa sem erros
- [ ] Servidor roda em http://localhost:3000
- [ ] Login funciona com credenciais padrão
- [ ] Painel admin acessível

---

🎉 **Instalação concluída!** Agora você pode começar a usar o sistema.

Desenvolvido com ❤️ pela [KRYONIX Development](https://kryonix.dev)
