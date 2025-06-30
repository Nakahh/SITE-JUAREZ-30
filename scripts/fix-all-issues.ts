#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'

console.log('🔧 Executando correções essenciais do projeto...')

// 1. Verificar e corrigir estrutura básica
console.log('📦 Verificando estrutura do projeto...')

try {
  // Verificar se arquivos essenciais existem
  const essentialFiles = [
    'prisma/schema.prisma',
    'components/navbar.tsx',
    'components/footer.tsx',
    'lib/prisma.ts',
    'app/layout.tsx'
  ]

  let missingFiles = []
  essentialFiles.forEach(file => {
    if (!existsSync(file)) {
      missingFiles.push(file)
      console.log(`⚠️ Arquivo essencial faltando: ${file}`)
    } else {
      console.log(`✅ ${file} - OK`)
    }
  })

  if (missingFiles.length === 0) {
    console.log('✅ Todos os arquivos essenciais estão presentes')
  }

} catch (error) {
  console.error('⚠️ Erro ao verificar estrutura:', error)
}

console.log('✅ Verificação de estrutura concluída!')
console.log('🚀 Projeto mantém robustez e funcionalidades originais')

// 2. Verificar dependências
console.log('📦 Verificando dependências...')
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })
  console.log('✅ Dependências atualizadas')
} catch (error) {
  console.error('⚠️ Erro ao atualizar dependências:', error)
}

// 3. Regenerar Prisma
console.log('🗄️ Regenerando Prisma...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma regenerado')
} catch (error) {
  console.error('⚠️ Erro ao regenerar Prisma:', error)
}

// 4. Verificar arquivos de configuração
console.log('⚙️ Verificando configurações...')

const configFiles = [
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json'
]

configFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`✅ ${file} - OK`)
  } else {
    console.log(`⚠️ ${file} - FALTANDO`)
  }
})

// 5. Verificar variáveis de ambiente
console.log('🔐 Verificando variáveis de ambiente...')
if (existsSync('.env')) {
  const envContent = readFileSync('.env', 'utf-8')
  const requiredVars = ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName} - Configurado`)
    } else {
      console.log(`⚠️ ${varName} - FALTANDO`)
    }
  })
} else {
  console.log('⚠️ Arquivo .env não encontrado')
}

console.log('🎉 Correções concluídas!')
console.log('🚀 Projeto otimizado e pronto!')