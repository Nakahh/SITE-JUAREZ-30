import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'
import path from 'path'

console.log('🔧 Configurando ambiente: DESENVOLVIMENTO')

try {
  // Verificar se o arquivo .env existe
  if (!existsSync('.env')) {
    console.log('📝 Criando arquivo .env...')
    const envContent = `# Database
DATABASE_URL="file:./prisma/dev.db"

# NextAuth
NEXTAUTH_SECRET="desenvolvimento-secret-123456789"
NEXTAUTH_URL="http://localhost:3000"

# Aplicação
NODE_ENV="development"
PORT=3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# Developer
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix

# URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
`
    writeFileSync('.env', envContent)
    console.log('✅ Arquivo .env criado')
  }

  console.log('📦 Gerando cliente Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  console.log('🗄️ Configurando banco de dados...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  console.log('✅ Ambiente configurado com sucesso!')

} catch (error) {
  console.error('❌ Erro na configuração:', error)
  process.exit(1)
}