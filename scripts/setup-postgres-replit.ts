
import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

async function setupPostgreSQLReplit() {
  console.log('🐘 Configurando PostgreSQL no Replit...')
  
  try {
    // Verificar se DATABASE_URL existe (Replit PostgreSQL)
    if (process.env.DATABASE_URL) {
      console.log('✅ Database do Replit detectado')
      console.log('🔧 Configurando esquema...')
      
      // Aplicar schema
      execSync('npx prisma generate', { stdio: 'inherit' })
      execSync('npx prisma db push', { stdio: 'inherit' })
      
      console.log('🌱 Populando banco de dados...')
      execSync('npx tsx scripts/seed.ts', { stdio: 'inherit' })
      
    } else {
      console.log('❌ PostgreSQL do Replit não encontrado')
      console.log('📋 Para configurar:')
      console.log('1. Abra a aba "Database" no Replit')
      console.log('2. Clique em "Create a database"')
      console.log('3. Escolha PostgreSQL')
      console.log('4. O DATABASE_URL será automaticamente configurado')
      
      // Criar .env com placeholder
      const envContent = `# Replit PostgreSQL Environment
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV="development"

# NextAuth
NEXTAUTH_SECRET="desenvolvimento-secret-${Math.random().toString(36)}"
NEXTAUTH_URL="https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co"

# Aplicação
PORT=3000

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905

# Developer
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix

# IA e Email - Configure suas chaves
OPENAI_API_KEY="your_openai_key_here"
RESEND_API_KEY="your_resend_key_here"
`
      writeFileSync('.env', envContent)
      console.log('📝 Arquivo .env criado - Configure o PostgreSQL primeiro')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

setupPostgreSQLReplit()
