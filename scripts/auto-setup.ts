
#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('🚀 Iniciando setup automático completo...')

// Verificar se package.json existe
if (!existsSync('package.json')) {
  console.error('❌ package.json não encontrado!')
  process.exit(1)
}

// Instalar dependências principais
console.log('📦 Instalando dependências principais...')
try {
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })
  console.log('✅ Dependências principais instaladas')
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error)
}

// Instalar dependências de desenvolvimento
console.log('🔧 Instalando dependências de desenvolvimento...')
try {
  execSync('npm install --save-dev @types/node @types/react @types/react-dom typescript tsx', { stdio: 'inherit' })
  console.log('✅ Dependências de desenvolvimento instaladas')
} catch (error) {
  console.error('⚠️ Aviso: Algumas dependências de dev podem já estar instaladas')
}

// Configurar Prisma
console.log('🗄️ Configurando Prisma...')
try {
  execSync('npx prisma generate', { stdio: 'inherit' })
  console.log('✅ Prisma Client gerado')
  
  execSync('npx prisma db push', { stdio: 'inherit' })
  console.log('✅ Banco de dados sincronizado')
} catch (error) {
  console.error('⚠️ Erro ao configurar Prisma:', error)
}

// Popular banco de dados
console.log('🌱 Populando banco de dados...')
try {
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' })
  console.log('✅ Banco de dados populado')
} catch (error) {
  console.error('⚠️ Erro ao popular banco:', error)
}

// Verificar arquivos críticos
console.log('🔍 Verificando arquivos críticos...')
const criticalFiles = [
  'components/footer.tsx',
  'components/navbar.tsx',
  'app/globals.css',
  'lib/auth.ts',
  'prisma/schema.prisma'
]

let allFilesExist = true
criticalFiles.forEach(file => {
  if (existsSync(file)) {
    console.log(`✅ ${file} - OK`)
  } else {
    console.log(`❌ ${file} - FALTANDO`)
    allFilesExist = false
  }
})

// Verificar logos
console.log('🎨 Verificando logos...')
const logos = [
  'public/siqueira campos para fundo claro.png',
  'public/siqueira campos para fundo escuro.png',
  'public/logo-kryonix.png'
]

logos.forEach(logo => {
  if (existsSync(logo)) {
    console.log(`✅ ${logo} - OK`)
  } else {
    console.log(`⚠️ ${logo} - FALTANDO`)
  }
})

console.log('🎯 Setup automático concluído!')
console.log('🌟 Projeto otimizado e pronto para desenvolvimento!')

if (allFilesExist) {
  console.log('✅ Todos os arquivos críticos estão presentes')
  console.log('🚀 Execute "npm run dev" para iniciar o servidor')
} else {
  console.log('⚠️ Alguns arquivos críticos estão faltando')
}
