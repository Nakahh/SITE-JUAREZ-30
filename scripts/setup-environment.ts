
import { execSync } from 'child_process'
import { writeFileSync, existsSync } from 'fs'

const isDev = process.env.NODE_ENV !== 'production'

try {
  // Verificar se o arquivo .env existe
  if (!existsSync('.env')) {
    console.log('📝 Criando arquivo .env...')
    const envContent = `# Development Environment - PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/siqueira_imoveis_dev?schema=public"
DATABASE_PROVIDER="postgresql"
NODE_ENV="development"

# NextAuth
NEXTAUTH_SECRET="desenvolvimento-secret-123456789"
NEXTAUTH_URL="http://localhost:3000"

# Aplicação
PORT=3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# Developer
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix

# URLs
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# IA - Configure sua chave OpenAI
OPENAI_API_KEY="your_openai_key_here"

# Email - Configure sua chave Resend
RESEND_API_KEY="your_resend_key_here"

# Uploads
UPLOAD_DIR="./public/uploads"
MAX_FILE_SIZE=10485760
`
    writeFileSync('.env', envContent)
    console.log('✅ Arquivo .env criado')
  }

  console.log('📦 Gerando cliente Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  console.log('🗄️ Configurando banco de dados...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  console.log('🌱 Populando banco de dados...')
  execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' })

  console.log('✅ Ambiente configurado com sucesso!')
  console.log(`📊 Usando: PostgreSQL (desenvolvimento e produção)`)

} catch (error) {
  console.error('❌ Erro na configuração:', error)
  process.exit(1)
}
