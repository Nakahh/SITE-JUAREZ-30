
import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'

console.log('🔧 Corrigindo problemas do Prisma...')

try {
  // Limpar cache do Prisma
  console.log('🧹 Limpando cache do Prisma...')
  if (existsSync('node_modules/.prisma')) {
    rmSync('node_modules/.prisma', { recursive: true, force: true })
  }
  
  if (existsSync('node_modules/@prisma')) {
    rmSync('node_modules/@prisma', { recursive: true, force: true })
  }

  // Reinstalar Prisma
  console.log('📦 Reinstalando Prisma...')
  execSync('npm install prisma @prisma/client', { stdio: 'inherit' })

  // Gerar cliente
  console.log('⚡ Gerando cliente Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  // Aplicar schema
  console.log('🗄️ Aplicando schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  console.log('✅ Problemas do Prisma corrigidos!')

} catch (error) {
  console.error('❌ Erro ao corrigir Prisma:', error)
  process.exit(1)
}
