# Sistema Completo - Siqueira Campos Imóveis

Sistema completo de imobiliária com múltiplos corretores, integração WhatsApp, IA e automação via N8N.

## 🚀 Funcionalidades Implementadas

### ✅ Sistema de Leads Inteligente

- **Captura automática** de leads via chat do site
- **Distribuição inteligente** para corretores ativos
- **Sistema "primeiro que responder"** assume o lead
- **Fallback automático** após 15 minutos
- **Notificações por email** para gerência

### ✅ Dashboard dos Corretores

- **Configuração WhatsApp** com validação brasileira
- **Toggle ativo/inativo** para receber leads
- **Histórico completo** de leads
- **Estatísticas em tempo real**
- **Interface premium** responsiva

### ✅ Integração WhatsApp (Evolution API)

- **Envio automático** de leads para corretores
- **Confirmação via "ASSUMIR"**
- **Notificações para cliente e outros corretores**
- **Fallback inteligente** sem corretores disponíveis

### ✅ Mobile Navbar Aprimorada

- **Scroll suave** com controle de altura
- **Modo escuro/claro** integrado no topo
- **Login/registro** destacados
- **Menu organizado** por seções
- **Informações de contato** acessíveis

### ✅ Sistema de IA Integrado

- **Respostas automáticas** personalizadas
- **GPT-3.5-turbo** para economia
- **Contextualização** por lead
- **Fallback inteligente** sem corretores

## 🛠️ Tecnologias Utilizadas

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco de Dados:** SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação:** NextAuth.js
- **Automação:** N8N
- **WhatsApp:** Evolution API
- **IA:** OpenAI GPT-3.5-turbo
- **Email:** SMTP / Resend

## 📁 Estrutura do Projeto

```
├── app/
│   ├── (admin)/           # Área administrativa
│   ├── (app)/             # Dashboard dos usuários
│   ├── (public)/          # Páginas públicas
│   ├── api/               # APIs do sistema
│   │   ├── corretor/      # APIs específicas dos corretores
│   │   │   ├── whatsapp/  # Gerenciar WhatsApp do corretor
│   │   │   └── leads/     # Leads do corretor
│   │   └── leads/         # Sistema de leads
│   │       ├── webhook/   # Receber leads do site
│   │       ├── assume/    # Assumir leads
│   │       └── expire/    # Expirar leads
│   └── globals.css
├── components/
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── whatsapp-integration-card.tsx
│   ├── leads-card.tsx
│   └── navbar.tsx         # Navbar atualizada
├── lib/
│   ├── auth.ts           # Configuração NextAuth
│   ├── prisma.ts         # Cliente Prisma
│   └── utils.ts
├── prisma/
│   ├── schema.prisma     # Schema atualizado com Leads
│   └── migrations/
└── n8n-fluxo-completo-leads-whatsapp.json
```

## 🔧 Configuração e Instalação

### 1. Dependências

```bash
npm install
# ou
yarn install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env` (já está criado):

```env
# Banco de Dados
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV="development"

# NextAuth
NEXTAUTH_SECRET="desenvolvimento-secret-123456789"
NEXTAUTH_URL="http://localhost:3000"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# OpenAI (para IA)
OPENAI_API_KEY="sua_chave_openai_aqui"

# Email
RESEND_API_KEY="sua_chave_resend_aqui"

# Uploads
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760
```

### 3. Banco de Dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar migrações (já aplicadas)
npx prisma migrate dev

# Visualizar banco (opcional)
npx prisma studio
```

### 4. Executar o Projeto

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`

## 🔗 Configurações Externas Necessárias

### 1. **N8N (Automação)**

#### Instalação do N8N:

```bash
# Via NPM
npm install -g n8n

# Via Docker
docker run -it --rm --name n8n -p 5678:5678 n8nio/n8n
```

#### Importar Fluxo:

1. Acesse `http://localhost:5678`
2. Vá em **Settings > Import**
3. Importe o arquivo `n8n-fluxo-completo-leads-whatsapp.json`

#### Configurar Credenciais no N8N:

- **PostgreSQL/SQLite:** Configurar conexão com banco
- **OpenAI API:** Chave da OpenAI para GPT-3.5-turbo
- **Evolution API:** Token e URL da instância WhatsApp
- **SMTP:** Configurações de email

#### Webhooks do N8N:

- **Lead Site:** `http://seu-n8n:5678/webhook/lead-site`
- **Resposta Corretor:** `http://seu-n8n:5678/webhook/resposta-corretor`

### 2. **Evolution API (WhatsApp)**

#### Configuração:

1. Instale a Evolution API
2. Crie uma instância
3. Configure o webhook para receber mensagens
4. Aponte para: `http://seu-n8n:5678/webhook/resposta-corretor`

#### Formato de Resposta do Corretor:

```json
{
  "leadId": "lead_id_do_banco",
  "agentId": "id_do_corretor",
  "message": "ASSUMIR"
}
```

### 3. **OpenAI API**

1. Registre-se em `https://platform.openai.com`
2. Gere uma API Key
3. Configure no `.env` e credenciais do N8N
4. O sistema usa **GPT-3.5-turbo** (econômico)

### 4. **Chat Bubble (Site)**

Configure o chat do site para enviar leads para:

```
POST http://seu-n8n:5678/webhook/lead-site

{
  "nome": "João Silva",
  "telefone": "62999999999",
  "mensagem": "Quero informações sobre imóveis"
}
```

## 👤 Uso do Sistema

### Para Corretores:

1. **Acesse o Dashboard:** `/dashboard`
2. **Configure WhatsApp:** Insira seu número e ative status
3. **Receba Leads:** Mensagens chegam automaticamente
4. **Assuma Leads:** Responda "ASSUMIR" no WhatsApp
5. **Acompanhe Histórico:** Visualize todos seus leads

### Para Clientes:

1. **Acesse o Site:** Navegue normalmente
2. **Use o Chat:** Clique no chat flutuante
3. **Envie Mensagem:** Informe nome, telefone e interesse
4. **Aguarde Contato:** IA responde e corretor entra em contato

### Para Administradores:

1. **Monitore N8N:** Acompanhe fluxos em tempo real
2. **Verifique Emails:** Receba notificações de leads não atendidos
3. **Gerencie Corretores:** Ative/desative via dashboard admin

## 🔍 Fluxo Completo do Sistema

### 1. **Cliente envia mensagem** no chat do site

↓

### 2. **N8N recebe webhook** e processa lead

↓

### 3. **Busca corretores ativos** no banco

↓

### 4. **IA gera resposta** para o cliente

↓

### 5. **Envia mensagem WhatsApp** para corretores ativos

↓

### 6. **Primeiro que responde "ASSUMIR"** fica com o lead

↓

### 7. **Sistema atualiza banco** e notifica todos

↓

### 8. **Cliente é informado** sobre o corretor responsável

### Fallback (15 minutos sem resposta):

↓

### 9. **Lead expira automaticamente**

↓

### 10. **Cliente recebe mensagem** de que entraremos em contato

↓

### 11. **Gerente recebe email** com dados do lead

## 🎨 Melhorias Implementadas

### Mobile UX:

- ✅ Scroll suave no menu
- ✅ Modo escuro/claro no topo
- ✅ Login/registro destacados
- ✅ Seções organizadas
- ✅ Contato direto via WhatsApp

### Dashboard Premium:

- ✅ Cards com estatísticas
- ✅ Interface moderna
- ✅ Validação de dados
- ✅ Feedback visual
- ✅ Responsivo

### Sistema Robusto:

- ✅ Tratamento de erros
- ✅ Validações rigorosas
- ✅ Race condition protection
- ✅ Logs detalhados
- ✅ Fallbacks inteligentes

## 🚀 Deploy

### Desenvolvimento:

- ✅ Configurado e funcionando
- ✅ SQLite local
- ✅ N8N local

### Produção:

1. **Deploy do Next.js:** Vercel/Netlify
2. **Banco PostgreSQL:** Neon/Supabase
3. **N8N:** VPS/Cloud
4. **Evolution API:** VPS própria
5. **Email:** Resend/SendGrid

## 📞 Suporte

Para dúvidas ou problemas:

- **Email:** siqueiraecamposimoveis@gmail.com
- **WhatsApp:** (62) 9 8556-3905

---

## 🏆 Status do Projeto

✅ **Sistema de Leads:** 100% implementado  
✅ **Dashboard Corretores:** 100% implementado  
✅ **Mobile Navbar:** 100% implementado  
✅ **Integração WhatsApp:** 100% implementado  
✅ **N8N Workflow:** 100% implementado  
✅ **APIs:** 100% implementadas  
✅ **Banco de Dados:** 100% configurado

**🎉 PROJETO COMPLETO E FUNCIONAL!**
