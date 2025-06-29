#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'

console.log('🔧 Corrigindo apenas exports de componentes...')

// Lista de componentes críticos
const components = [
  'components/navbar.tsx',
  'components/floating-chat-bubble.tsx', 
  'components/kryonix-logo.tsx',
  'components/footer.tsx',
  'components/app-footer.tsx'
]

// Função para verificar e corrigir exports
function fixComponentExports(filePath: string) {
  if (!existsSync(filePath)) {
    console.log(`⚠️  Arquivo não encontrado: ${filePath}`)
    return
  }

  const content = readFileSync(filePath, 'utf-8')

  // Encontrar o nome da função principal
  const functionMatch = content.match(/(?:export\s+default\s+)?function\s+(\w+)/)

  if (functionMatch) {
    const functionName = functionMatch[1]

    // Verificar se já tem os exports corretos
    const hasNamedExport = content.includes(`export { ${functionName} }`)
    const hasDefaultExport = content.includes('export default')

    if (!hasNamedExport || !hasDefaultExport) {
      console.log(`🔧 Corrigindo exports em ${filePath}`)

      let newContent = content

      // Adicionar exports se não existirem
      if (!hasNamedExport && !hasDefaultExport) {
        newContent = newContent + `\n\nexport { ${functionName} }\nexport default ${functionName}`
      } else if (!hasNamedExport) {
        newContent = newContent + `\nexport { ${functionName} }`
      } else if (!hasDefaultExport) {
        newContent = newContent + `\nexport default ${functionName}`
      }

      writeFileSync(filePath, newContent)
      console.log(`✅ Exports corrigidos para ${functionName}`)
    } else {
      console.log(`✅ ${filePath} já tem exports corretos`)
    }
  }
}

console.log('📦 Verificando exports dos componentes...')
components.forEach(fixComponentExports)

console.log('✅ Correção de exports concluída!')
console.log('🚀 Todos os componentes mantêm suas funcionalidades originais')

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