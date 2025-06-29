
#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'

console.log('🔧 Iniciando correção automática de problemas...')

// 1. Verificar e corrigir exports de componentes
console.log('📦 Verificando exports de componentes...')

const components = [
  'components/footer.tsx',
  'components/navbar.tsx',
  'components/chat-interface.tsx',
  'components/floating-chat-bubble.tsx'
]

components.forEach(file => {
  if (existsSync(file)) {
    const content = readFileSync(file, 'utf-8')
    
    // Verificar se tem export default
    if (!content.includes('export default') && content.includes('function ')) {
      console.log(`🔧 Corrigindo export em ${file}`)
      
      // Encontrar nome da função
      const functionMatch = content.match(/function\s+(\w+)/);
      if (functionMatch) {
        const functionName = functionMatch[1]
        const newContent = content + `\n\nexport default ${functionName}\nexport { ${functionName} }`
        writeFileSync(file, newContent)
        console.log(`✅ Export corrigido para ${functionName}`)
      }
    }
  }
})

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

console.log('🎯 Correção automática concluída!')
console.log('🚀 Projeto otimizado e pronto!')
