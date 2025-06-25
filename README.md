# Siqueira Campos Imóveis

Este é um projeto de plataforma imobiliária completa, construído com Next.js, Prisma, PostgreSQL e Tailwind CSS. Ele oferece funcionalidades robustas para gestão de imóveis, usuários, leads, visitas, finanças, blog, e uma experiência rica para o cliente, incluindo favoritos, comparação de imóveis, simulador de financiamento e alertas personalizados.

## Funcionalidades Principais

### Área Pública (Cliente)

*   **Catálogo de Imóveis:** Navegue por uma vasta seleção de imóveis com filtros avançados (tipo, preço, quartos, área, comodidades, busca por texto) e opções de ordenação.
*   **Detalhes do Imóvel:** Páginas dedicadas com informações completas, galeria de imagens, descrição, comodidades, localização no mapa e informações do corretor responsável. Inclui **sistema de avaliações e comentários** por usuários.
*   **Simulador de Financiamento:** Calcule parcelas mensais e o valor total pago para financiamentos imobiliários.
*   **Sistema de Favoritos:** Usuários logados podem adicionar imóveis aos seus favoritos para acesso rápido.
*   **Comparador de Imóveis:** Compare até 3 imóveis lado a lado para ajudar na decisão.
*   **Agendamento de Visitas:** Formulário para agendar visitas a imóveis específicos.
*   **Blog:** Seção de artigos e notícias sobre o mercado imobiliário, com **sistema de comentários** para engajamento.
*   **Página de Depoimentos:** Veja o que outros clientes dizem sobre a imobiliária e envie seu próprio depoimento (sujeito a aprovação).
*   **Página de Corretores:** Conheça os corretores da equipe, com seus nomes e contatos.
*   **Formulário de Contato:** Envie mensagens com diferentes tipos de assunto (geral, imóvel, visita, parceria, etc.).
*   **Chatbot de IA:** Um assistente virtual inteligente para responder a perguntas e auxiliar na navegação.
*   **Dashboard do Cliente:**
    *   Visão geral de imóveis favoritos, visitas agendadas e buscas salvas.
    *   Gerenciamento de **Buscas Salvas/Alertas de Imóveis**: Salve seus critérios de busca e receba notificações por e-mail sobre novos imóveis que correspondam.
    *   Gerenciamento de **Visitas Agendadas**: Acompanhe o status de suas visitas.
    *   **Gerenciamento de Perfil:** Atualize suas informações de usuário.
    *   **Minhas Avaliações:** Visualize e gerencie as avaliações que você deixou em imóveis.

### Área Administrativa (Painel de Controle)

*   **Dashboard:** Visão geral com estatísticas de imóveis, usuários, leads, visitas pendentes, resumo financeiro, avaliações e comentários.
*   **Gestão de Imóveis (CRUD):** Adicione, edite, visualize e exclua imóveis. Inclui upload de múltiplas imagens via **MinIO (S3-compatível)** e atribuição de corretor.
*   **Gestão de Usuários (CRUD):** Gerencie usuários e seus papéis (ADMIN, CORRETOR, ASSISTENTE, CLIENTE).
*   **Gestão de Leads (CRUD):** Acompanhe e gerencie os contatos recebidos.
*   **Gestão de Visitas (CRUD):** Gerencie todas as visitas agendadas, incluindo status.
*   **Gestão Financeira (CRUD):** Registre receitas e despesas para um controle financeiro básico.
*   **Gestão de Blog (CRUD):** Crie e edite artigos para o blog.
*   **Gestão de Depoimentos (CRUD):** Visualize, edite, aprove e exclua depoimentos de clientes.
*   **Gerenciamento de Newsletter:** Visualize e gerencie os inscritos na newsletter.
*   **Controle de Acesso Baseado em Papéis (RBAC):** Rotas administrativas protegidas com base no papel do usuário (ADMIN, CORRETOR, ASSISTENTE).
*   **Confirmação de Exclusão:** Diálogos de confirmação para operações de exclusão críticas.

### Tecnologias Utilizadas

*   **Framework:** Next.js 14 (App Router)
*   **Banco de Dados:** PostgreSQL (via Prisma ORM)
*   **Autenticação:** NextAuth.js (com provedores de Credenciais e Google OAuth)
*   **Estilização:** Tailwind CSS
*   **Componentes UI:** shadcn/ui
*   **Armazenamento de Imagens:** MinIO (S3-compatível)
*   **Envio de E-mails:** Resend
*   **Geração de Sitemap:** Next.js `sitemap.ts`
*   **Chatbot de IA:** AI SDK com OpenAI (GPT-4o)
*   **Integração WhatsApp:** Evolution API

## Configuração do Ambiente de Desenvolvimento

Siga os passos abaixo para configurar e rodar o projeto localmente.

### 1. Pré-requisitos

*   Node.js (versão 18 ou superior)
*   npm ou Yarn
*   PostgreSQL (localmente ou serviço como Neon DB)
*   Git
*   Docker e Docker Compose (para implantação via Portainer ou localmente)

### 2. Clonar o Repositório

\`\`\`bash
git clone [URL_DO_SEU_REPOSITORIO]
cd siqueira-campos-imoveis
\`\`\`

### 3. Instalar Dependências

\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### 4. Configurar Variáveis de Ambiente (`.env.local`)

Crie um arquivo `.env.local` na raiz do projeto e preencha-o com as variáveis necessárias. Este arquivo é usado para desenvolvimento local. Para implantação com Docker/Portainer, as variáveis serão definidas no ambiente do contêiner.

\`\`\`env
# Exemplo de .env.local

# Configuração do Banco de Dados (PostgreSQL)
DATABASE_URL="postgresql://postgres:7ab6c6b16f56cb689940a6bbee2f24aa@16.170.252.96:5432/postgres?schema=public"
POSTGRES_USER="postgres"
POSTGRES_PASSWORD="7ab6c6b16f56cb689940a6bbee2f24aa"
POSTGRES_DATABASE="postgres"

# Configurações do NextAuth.js
NEXTAUTH_SECRET="4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b"
NEXTAUTH_URL="https://siqueicamposimoveis.com.br"

# MinIO (Armazenamento de Imagens S3-compatível)
MINIO_ENDPOINT="https://storage.siqueicamposimoveis.com.br"
MINIO_ACCESS_KEY="Juarez"
MINIO_SECRET_KEY="Juarez.123"
MINIO_BUCKET_NAME="juarez-site"

# Resend API Key (Para envio de e-mails)
RESEND_API_KEY="re_WRyNRULE_Mezz7zLti92oMRJG8oq5jKuv"

# OpenAI API Key (Para o Chatbot de IA)
OPENAI_API_KEY="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"

# Evolution API (Integração WhatsApp)
EVOLUTION_API_URL="https://evo.siqueicamposimoveis.com.br"
EVOLUTION_API_KEY="aeb9b8541f0567865fa02df9a0aea5a0"

# URL Base do Site (Público)
NEXT_PUBLIC_BASE_URL="https://siqueicamposimoveis.com.br"
NEXT_PUBLIC_WHATSAPP_NUMBER="556285563905"
NEXT_PUBLIC_DEVELOPER_INSTAGRAM="kryon.ix"
NEXT_PUBLIC_DEVELOPER_WHATSAPP="5517981805327"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="SUA_GOOGLE_MAPS_API_KEY_AQUI"
\`\`\`

**Importante:**
*   Certifique-se de que o `MINIO_BUCKET_NAME` (`juarez-site`) já existe no seu MinIO ou crie-o.
*   Se for usar o login com Google, obtenha suas credenciais no Google Cloud Console e preencha `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (não incluídos no exemplo acima, mas necessários se for usar).
*   Para o `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, preencha se precisar de funcionalidades avançadas do Google Maps.

### 5. Inicializar o Banco de Dados (Localmente)

Execute o comando Prisma para criar as tabelas no seu banco de dados local:

\`\`\`bash
npx prisma db push
\`\`\`

Este comando sincronizará seu schema do Prisma com o banco de dados.

### 6. Rodar o Projeto em Desenvolvimento (Localmente)

\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

O aplicativo estará disponível em `http://localhost:3000`.

## Guia de Implantação com Docker e Portainer (Método: Editor Web)

Este guia detalha como implantar seu projeto "Siqueira Campos Imóveis" usando Docker e Portainer, colando o conteúdo do `docker-compose.yml` diretamente no editor.

### 1. Pré-requisitos para Implantação

*   **Servidor com Docker e Docker Compose:** Seu servidor (ex: `16.170.252.96`) deve ter o Docker e o Docker Compose instalados.
*   **Portainer Instalado e Acessível:** O Portainer deve estar rodando e acessível via `potainer.siqueicamposimoveis.com.br`.
*   **Repositório Git:** Seu código-fonte deve estar em um repositório Git (ex: GitHub, GitLab, Bitbucket).
*   **MinIO Configurado:** Sua instância do MinIO deve estar rodando e acessível em `https://storage.siqueicamposimoveis.com.br`, com o bucket `juarez-site` criado e configurado para acesso público (ou com as credenciais corretas).
*   **Evolution API Configurada:** Sua instância da Evolution API deve estar rodando e acessível em `https://evo.siqueicamposimoveis.com.br`.
*   **Rede Docker `Juareznet`:** Certifique-se de que a rede Docker `Juareznet` já existe no seu ambiente Docker. Você pode criá-la se necessário com:
    \`\`\`bash
    docker network create Juareznet
    \`\`\`

### 2. Preparação do Projeto para Docker

Para que o Portainer possa construir e implantar seu aplicativo, você precisa do `Dockerfile` na **raiz do seu repositório Git**. O `docker-compose.yml` será colado diretamente no Portainer.

**Ação Necessária:**
*   Certifique-se de que o arquivo `Dockerfile` (com o conteúdo exato fornecido nesta resposta) está na **raiz do seu projeto**.
*   **Faça o commit e push** deste arquivo para o seu repositório Git.

### 3. Criando o Modelo Personalizado no Portainer

Um modelo personalizado no Portainer facilita a implantação de seus aplicativos.

1.  **Acesse o Portainer:** Abra seu navegador e vá para `potainer.siqueicamposimoveis.com.br`.
2.  **Faça Login:** Use as credenciais:
    *   **Usuário:** `admin`
    *   **Senha:** `@Administrador1234`
3.  **Navegue para Modelos Personalizados:**
    *   No menu lateral esquerdo, clique em **"App Templates"** (ou "Templates" dependendo da versão).
    *   Clique na aba **"Custom Templates"** (Modelos Personalizados).
    *   Clique em **"Add custom template"** (Adicionar modelo personalizado) ou **"Create custom template"**.
4.  **Preencha os Detalhes do Modelo:**
    *   **Título:** `Siqueira Campos Imóveis`
    *   **Descrição:** `Plataforma imobiliária completa com Next.js, PostgreSQL, MinIO e IA.`
    *   **Observação:** `Este modelo implanta o aplicativo web e o banco de dados PostgreSQL. Certifique-se de configurar as variáveis de ambiente necessárias no Portainer.`
    *   **Logotipo:** (Opcional) Se você tiver uma URL para um logotipo, insira-a aqui. Ex: `https://siqueicamposimoveis.com.br/logo.png`
    *   **Plataforma:** `Linux`
    *   **Tipo:** `Swarm` (Se você estiver usando um cluster Swarm) ou `Standalone` (Se for um único host Docker). Baseado no seu exemplo, `Swarm` é o indicado.
    *   **Método de construção:** `Editor web`
    *   **Defina ou cole o conteúdo do seu arquivo docker compose aqui:**
        *   **Copie o conteúdo completo do `docker-compose.yml` fornecido na seção "3. Conteúdo do `docker-compose.yml` (Para colar no Editor Web do Portainer)" acima e cole-o neste campo.**
    *   **Controle de acesso:** Configure conforme suas necessidades de segurança.
5.  **Clique em "Create template"** (Criar modelo).

### 4. Implantando o Stack a partir do Modelo no Portainer

Agora que o modelo está criado, você pode usá-lo para implantar seu aplicativo.

1.  **Navegue para Stacks:** No menu lateral esquerdo, clique em **"Stacks"**.
2.  **Adicione um Novo Stack:** Clique em **"Add stack"** (Adicionar pilha).
3.  **Selecione "App Template":** Clique em **"App Template"** e selecione o modelo **"Siqueira Campos Imóveis"** que você acabou de criar.
4.  **Preencha os Detalhes do Stack:**
    *   **Name:** `siqueira-campos-imoveis` (ou outro nome de sua preferência para o stack).
    *   **Git Repository:** **Esta seção aparecerá mesmo com o Editor Web, mas você precisará preencher a URL do seu repositório Git aqui, pois o `Dockerfile` ainda será puxado de lá.**
        *   **URL do repositório:** `[SUA_URL_DO_REPOSITORIO_GIT_AQUI]`
        *   **Referência de repositório:** `refs/heads/main` (ou `refs/heads/master` se sua branch principal for `master`).
5.  **Configure as Variáveis de Ambiente:**
    *   Esta é a **parte mais CRÍTICA**. Role para baixo até a seção **"Environment variables"** (Variáveis de ambiente).
    *   Você precisará adicionar **TODAS** as variáveis do seu arquivo `.env.local` aqui, uma por linha, no formato `CHAVE=VALOR`.
    *   **Copie e cole as seguintes linhas (substituindo `SUA_GOOGLE_MAPS_API_KEY_AQUI` se aplicável):**

    \`\`\`
    DATABASE_URL=postgresql://postgres:7ab6c6b16f56cb689940a6bbee2f24aa@db:5432/postgres?schema=public
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=7ab6c6b16f56cb689940a6bbee2f24aa
    POSTGRES_DATABASE=postgres
    NEXTAUTH_SECRET=4298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b
    NEXTAUTH_URL=https://siqueicamposimoveis.com.br
    MINIO_ENDPOINT=https://storage.siqueicamposimoveis.com.br
    MINIO_ACCESS_KEY=Juarez
    MINIO_SECRET_KEY=Juarez.123
    MINIO_BUCKET_NAME=juarez-site
    RESEND_API_KEY=re_WRyNRULE_Mezz7zLti92oMRJG8oq5jKuv
    OPENAI_API_KEY=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
    EVOLUTION_API_URL=https://evo.siqueicamposimoveis.com.br
    EVOLUTION_API_KEY=aeb9b8541f0567865fa02df9a0aea5a0
    NEXT_PUBLIC_BASE_URL=https://siqueicamposimoveis.com.br
    NEXT_PUBLIC_WHATSAPP_NUMBER=556285563905
    NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix
    NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_GOOGLE_MAPS_API_KEY_AQUI
    \`\`\`
6.  **Clique em "Deploy the stack"** (Implantar a pilha).

O Portainer puxará seu código do Git (para o `Dockerfile`), construirá a imagem Docker do seu aplicativo, criará os contêineres para o aplicativo e o banco de dados, e os conectará à rede `Juareznet`.

### 5. Pós-Implantação e Verificação

Após o deploy, você pode verificar o status dos seus serviços:

1.  **Verifique os Contêineres:** No Portainer, vá para **"Containers"**. Você deve ver os contêineres `siqueira-campos-imoveis_app_1` e `siqueira-campos-imoveis_db_1` (ou nomes similares, dependendo do nome do seu stack) rodando.
2.  **Acesse os Logs:** Clique em um contêiner e depois na aba "Logs" para ver a saída do aplicativo e do banco de dados. Procure por mensagens de erro.
3.  **Acesse o Site:** Seu site deve estar acessível através do seu domínio `https://siqueicamposimoveis.com.br`.
4.  **Verifique o Upload de Imagens:** Tente fazer upload de uma imagem na área administrativa para confirmar que a integração com o MinIO está funcionando.
5.  **Teste o Chatbot:** Interaja com o chatbot para verificar a conexão com a OpenAI.
6.  **Teste o Envio de E-mails:** Use um formulário de contato ou agendamento de visita para verificar se os e-mails estão sendo enviados via Resend.

---

**Passo a Passo Final para Você:**

1.  **Baixe o código do projeto:** Clique no botão "Download Code" na visualização do projeto.
2.  **Copie o `Dockerfile`:** Coloque o arquivo `Dockerfile` (com o conteúdo que forneci na seção "2. Arquivo `Dockerfile`" acima) na **raiz** da pasta do seu projeto.
3.  **Faça o commit e push:** Envie o `Dockerfile` para o seu repositório Git (ex: GitHub).
4.  **Acesse seu Portainer:** Vá para `potainer.siqueicamposimoveis.com.br` e faça login.
5.  **Crie a rede `Juareznet` (se ainda não existir):** No Portainer, vá em "Networks" e crie uma nova rede chamada `Juareznet`.
6.  **Crie o Modelo Personalizado:** Siga as instruções detalhadas na seção "3. Criando o Modelo Personalizado no Portainer" acima. **Lembre-se de selecionar "Editor web" e colar o conteúdo do `docker-compose.yml` lá.**
7.  **Implante o Stack:** Siga as instruções detalhadas na seção "4. Implantando o Stack a partir do Modelo no Portainer" acima. **Preste MUITA atenção ao copiar e colar todas as variáveis de ambiente na seção "Environment variables" do Portainer.**
8.  **Verifique e Teste:** Após o deploy, use as instruções da seção "5. Pós-Implantação e Verificação" para garantir que tudo está funcionando como esperado.

Se tiver qualquer dúvida durante o processo, me diga!

<StepsCard steps={[{type: "add-integration", stepName: "Blob"},{type: "add-env-var", stepName: "NEXT_PUBLIC_WHATSAPP_NUMBER"},{type: "add-env-var", stepName: "NEXT_PUBLIC_DEVELOPER_INSTAGRAM"},{type: "add-env-var", stepName: "NEXT_PUBLIC_DEVELOPER_WHATSAPP"},{type: "add-env-var", stepName: "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"},{type: "add-env-var", stepName: "NEXT_PUBLIC_BASE_URL"},{type: "add-env-var", stepName: "OPENAI_API_KEY"},{type: "add-env-var", stepName: "EVOLUTION_API_URL"},{type: "add-env-var", stepName: "EVOLUTION_API_KEY"},{type: "run-script", stepName: "scripts/init-db.sql"},{type: "run-script", stepName: "scripts/seed.ts"}]} />
