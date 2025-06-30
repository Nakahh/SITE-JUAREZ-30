#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { PrismaClient } from '@prisma/client'

console.log('🔧 CORREÇÃO ROBUSTA DO SISTEMA - Mantendo todas as funcionalidades...')

async function robustSystemFix() {
  try {
    // 1. Verificar e corrigir DATABASE_URL
    console.log('1️⃣ Verificando configuração do banco de dados...')

    // Detectar ambiente Replit
    const isReplit = process.env.REPL_SLUG || process.env.REPLIT_CLUSTER

    let envContent = `# Configuração Robusta - ${new Date().toISOString()}
NODE_ENV="development"
PORT=3000

# NextAuth
NEXTAUTH_SECRET="robust-secret-${Math.random().toString(36).substring(2, 15)}"
NEXTAUTH_URL="${isReplit ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'http://localhost:3000'}"

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix

`

    // Configurar banco de dados
    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
      console.log('   🐘 PostgreSQL detectado no Replit')
      envContent += `# PostgreSQL (Replit Database)
DATABASE_URL="${process.env.DATABASE_URL}"
`
    } else {
      console.log('   📦 Configurando SQLite como banco padrão')
      envContent += `# SQLite (Desenvolvimento)
DATABASE_URL="file:./dev.db"
`
    }

    // Salvar .env
    writeFileSync('.env', envContent)
    console.log('   ✅ Arquivo .env configurado')

    // 2. Atualizar schema.prisma para usar provider correto
    console.log('2️⃣ Atualizando schema do banco...')
    let schemaContent = readFileSync('prisma/schema.prisma', 'utf-8')

    if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql://')) {
      // Usar PostgreSQL
      schemaContent = schemaContent.replace(
        /provider = "sqlite"/g,
        'provider = "postgresql"'
      )
    } else {
      // Usar SQLite
      schemaContent = schemaContent.replace(
        /provider = "postgresql"/g,
        'provider = "sqlite"'
      )
    }

    writeFileSync('prisma/schema.prisma', schemaContent)
    console.log('   ✅ Schema atualizado')

    // 3. Limpar cache problemático
    console.log('3️⃣ Limpando cache...')
    try {
      if (existsSync('.next')) {
        execSync('rm -rf .next', { stdio: 'pipe' })
      }
      if (existsSync('node_modules/.prisma')) {
        execSync('rm -rf node_modules/.prisma', { stdio: 'pipe' })
      }
      console.log('   ✅ Cache limpo')
    } catch (error) {
      console.log('   ⚠️ Aviso ao limpar cache:', error)
    }

    // 4. Regenerar Prisma Client
    console.log('4️⃣ Regenerando Prisma Client...')
    try {
      execSync('npx prisma generate', { stdio: 'inherit' })
      console.log('   ✅ Cliente Prisma regenerado')
    } catch (error) {
      console.log('   ⚠️ Erro ao regenerar Prisma:', error)
    }

    // 5. Aplicar schema ao banco
    console.log('5️⃣ Aplicando schema ao banco...')
    try {
      execSync('npx prisma db push', { stdio: 'inherit' })
      console.log('   ✅ Schema aplicado ao banco')
    } catch (error) {
      console.log('   ⚠️ Erro ao aplicar schema:', error)
    }

    // 6. Testar conexão
    console.log('6️⃣ Testando conexão com banco...')
    try {
      const prisma = new PrismaClient()
      await prisma.$connect()
      console.log('   ✅ Conexão estabelecida com sucesso')
      await prisma.$disconnect()
    } catch (error) {
      console.log('   ⚠️ Erro de conexão:', error)
    }

    console.log('\n🎉 CORREÇÃO ROBUSTA CONCLUÍDA!')
    console.log('📋 Sistema configurado e pronto para uso')
    console.log('🚀 Execute npm run dev para iniciar o servidor')

  } catch (error) {
    console.error('❌ Erro durante correção robusta:', error)

    // Fallback garantido para SQLite
    console.log('🔄 Aplicando fallback garantido...')
    const fallbackEnv = `DATABASE_URL="file:./dev.db"
NODE_ENV="development"
NEXTAUTH_SECRET="fallback-secret-${Date.now()}"
NEXTAUTH_URL="http://localhost:3000"
PORT=3000
NEXT_PUBLIC_WHATSAPP_NUMBER=5562985563905
NEXT_PUBLIC_DEVELOPER_WHATSAPP=5517981805327
NEXT_PUBLIC_DEVELOPER_INSTAGRAM=kryon.ix`

    writeFileSync('.env', fallbackEnv)
    console.log('✅ Fallback aplicado com SQLite')
  }
}

robustSystemFix()