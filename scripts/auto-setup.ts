#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('🚀 Iniciando setup automático completo...')

try {
  // 1. Limpar cache do npm
  console.log('🧹 Limpando cache...')
  execSync('npm cache clean --force', { stdio: 'inherit' })

  // 2. Instalar dependências
  console.log('📦 Instalando dependências...')
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' })

  // 3. Instalar dependências de desenvolvimento
  console.log('🔧 Instalando dependências de desenvolvimento...')
  try {
    execSync('npm install --save-dev @types/node @types/react @types/react-dom typescript tsx', { stdio: 'inherit' })
    console.log('✅ Dependências de desenvolvimento instaladas')
  } catch (error) {
    console.error('⚠️ Aviso: Algumas dependências de dev podem já estar instaladas')
  }

  // 4. Gerar Prisma
  console.log('🗄️ Gerando Prisma Client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // 5. Sincronizar banco
  console.log('🔄 Sincronizando banco de dados...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  // 6. Popular banco
  console.log('🌱 Populando banco de dados...')
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' })

  // 7. Verificar arquivos críticos
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

  // 8. Verificar logos
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

  console.log('✅ Setup automático concluído com sucesso!')

  if (allFilesExist) {
    console.log('✅ Todos os arquivos críticos estão presentes')
    console.log('🚀 Execute "npm run dev" para iniciar o servidor')
  } else {
    console.log('⚠️ Alguns arquivos críticos estão faltando')
  }

} catch (error) {
  console.error('❌ Erro durante o setup:', error)
  process.exit(1)
}