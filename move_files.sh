#!/bin/bash

# Navega para o diretório do projeto
cd ~/siqueira-campos-imoveis

# Cria os novos diretórios se não existirem
mkdir -p app/$$admin$$/admin/blog/edit
mkdir -p app/$$admin$$/admin/depoimentos/edit
mkdir -p app/$$admin$$/admin/imoveis/edit
mkdir -p app/$$admin$$/admin/leads/edit
mkdir -p app/$$admin$$/admin/financeiro/edit
mkdir -p app/$$admin$$/admin/usuarios/edit
mkdir -p app/$$admin$$/admin/visitas/edit
mkdir -p app/$$app$$/dashboard

# Move as páginas do admin para o subdiretório 'admin'
mv app/$$admin$$/page.tsx app/$$admin$$/admin/page.tsx
mv app/$$admin$$/blog/page.tsx app/$$admin$$/admin/blog/page.tsx
mv app/$$admin$$/depoimentos/page.tsx app/$$admin$$/admin/depoimentos/page.tsx
mv app/$$admin$$/imoveis/page.tsx app/$$admin$$/admin/imoveis/page.tsx
mv app/$$admin$$/leads/page.tsx app/$$admin$$/admin/leads/page.tsx
mv app/$$admin$$/financeiro/page.tsx app/$$admin$$/admin/financeiro/page.tsx
mv app/$$admin$$/newsletter/page.tsx app/$$admin$$/admin/newsletter/page.tsx
mv app/$$admin$$/usuarios/page.tsx app/$$admin$$/admin/usuarios/page.tsx
mv app/$$admin$$/visitas/page.tsx app/$$admin$$/admin/visitas/page.tsx
mv app/$$admin$$/chat/page.tsx app/$$admin$$/admin/chat/page.tsx
mv app/$$admin$$/whatsapp/page.tsx app/$$admin$$/admin/whatsapp/page.tsx


# Move as páginas de edição do admin para o novo subdiretório 'edit'
mv app/$$admin$$/blog/[id]/edit/page.tsx app/$$admin$$/admin/blog/edit/[id]/page.tsx
mv app/$$admin$$/depoimentos/[id]/edit/page.tsx app/$$admin$$/admin/depoimentos/edit/[id]/page.tsx
mv app/$$admin$$/imoveis/[id]/edit/page.tsx app/$$admin$$/admin/imoveis/edit/[id]/page.tsx
mv app/$$admin$$/leads/[id]/edit/page.tsx app/$$admin$$/admin/leads/edit/[id]/page.tsx
mv app/$$admin$$/financeiro/[id]/edit/page.tsx app/$$admin$$/admin/financeiro/edit/[id]/page.tsx
mv app/$$admin$$/usuarios/[id]/edit/page.tsx app/$$admin$$/admin/usuarios/edit/[id]/page.tsx
mv app/$$admin$$/visitas/[id]/edit/page.tsx app/$$admin$$/admin/visitas/edit/[id]/page.tsx

# Move a página principal do app para o subdiretório 'dashboard'
mv app/$$app$$/page.tsx app/$$app$$/dashboard/page.tsx

echo "✅ Movimentação de arquivos concluída."
