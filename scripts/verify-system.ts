
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface VerificationResult {
  component: string
  status: 'OK' | 'WARNING' | 'ERROR'
  message: string
  details?: string[]
}

class SystemVerifier {
  private results: VerificationResult[] = []

  private addResult(component: string, status: 'OK' | 'WARNING' | 'ERROR', message: string, details?: string[]) {
    this.results.push({ component, status, message, details })
  }

  async verifyDatabase() {
    try {
      // Verificar conexão
      await prisma.$connect()
      this.addResult('Database', 'OK', 'Conexão estabelecida com sucesso')

      // Verificar usuários
      const userCount = await prisma.user.count()
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } })
      
      if (userCount === 0) {
        this.addResult('Users', 'ERROR', 'Nenhum usuário encontrado no banco')
      } else if (adminCount === 0) {
        this.addResult('Users', 'WARNING', `${userCount} usuários encontrados, mas nenhum admin`)
      } else {
        this.addResult('Users', 'OK', `${userCount} usuários (${adminCount} admins)`)
      }

      // Verificar propriedades
      const propertyCount = await prisma.property.count()
      this.addResult('Properties', propertyCount > 0 ? 'OK' : 'WARNING', 
        `${propertyCount} propriedades no banco`)

    } catch (error) {
      this.addResult('Database', 'ERROR', `Erro de conexão: ${error}`)
    }
  }

  verifyFiles() {
    const criticalFiles = [
      'components/navbar.tsx',
      'components/footer.tsx', 
      'components/floating-chat-bubble.tsx',
      'app/globals.css',
      'lib/auth.ts',
      'prisma/schema.prisma',
      '.env'
    ]

    const missingFiles: string[] = []
    const existingFiles: string[] = []

    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) {
        existingFiles.push(file)
      } else {
        missingFiles.push(file)
      }
    })

    if (missingFiles.length === 0) {
      this.addResult('Files', 'OK', 'Todos os arquivos críticos encontrados', existingFiles)
    } else {
      this.addResult('Files', 'ERROR', 'Arquivos críticos faltando', missingFiles)
    }
  }

  verifyLogos() {
    const logos = [
      'public/siqueira campos para fundo claro.png',
      'public/siqueira campos para fundo escuro.png',
      'public/logo-kryonix.png'
    ]

    const missingLogos: string[] = []
    const existingLogos: string[] = []

    logos.forEach(logo => {
      if (fs.existsSync(logo)) {
        existingLogos.push(logo)
      } else {
        missingLogos.push(logo)
      }
    })

    if (missingLogos.length === 0) {
      this.addResult('Logos', 'OK', 'Todas as logos encontradas', existingLogos)
    } else {
      this.addResult('Logos', 'WARNING', 'Algumas logos não encontradas', missingLogos)
    }
  }

  verifyEnvironment() {
    const requiredVars = [
      'DATABASE_URL',
      'NEXTAUTH_SECRET',
      'NEXTAUTH_URL'
    ]

    const missingVars: string[] = []
    const existingVars: string[] = []

    requiredVars.forEach(varName => {
      if (process.env[varName]) {
        existingVars.push(varName)
      } else {
        missingVars.push(varName)
      }
    })

    if (missingVars.length === 0) {
      this.addResult('Environment', 'OK', 'Todas as variáveis obrigatórias configuradas', existingVars)
    } else {
      this.addResult('Environment', 'ERROR', 'Variáveis de ambiente faltando', missingVars)
    }
  }

  async verifyComponents() {
    const components = [
      'components/ui/button.tsx',
      'components/ui/card.tsx',
      'components/ui/input.tsx',
      'components/theme-provider.tsx'
    ]

    const missingComponents: string[] = []
    const existingComponents: string[] = []

    components.forEach(comp => {
      if (fs.existsSync(comp)) {
        existingComponents.push(comp)
      } else {
        missingComponents.push(comp)
      }
    })

    if (missingComponents.length === 0) {
      this.addResult('Components', 'OK', 'Todos os componentes UI encontrados')
    } else {
      this.addResult('Components', 'WARNING', 'Alguns componentes UI não encontrados', missingComponents)
    }
  }

  async runAllChecks() {
    console.log('🔍 Iniciando verificação completa do sistema...\n')

    await this.verifyDatabase()
    this.verifyFiles()
    this.verifyLogos()
    this.verifyEnvironment()
    await this.verifyComponents()

    return this.generateReport()
  }

  private generateReport() {
    console.log('📊 RELATÓRIO DE VERIFICAÇÃO DO SISTEMA')
    console.log('=' .repeat(50))

    let totalOK = 0
    let totalWarnings = 0
    let totalErrors = 0

    this.results.forEach(result => {
      const icon = result.status === 'OK' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌'
      console.log(`\n${icon} ${result.component}: ${result.message}`)
      
      if (result.details && result.details.length > 0) {
        result.details.forEach(detail => {
          console.log(`   - ${detail}`)
        })
      }

      switch (result.status) {
        case 'OK': totalOK++; break
        case 'WARNING': totalWarnings++; break
        case 'ERROR': totalErrors++; break
      }
    })

    console.log('\n' + '='.repeat(50))
    console.log(`📈 RESUMO: ${totalOK} OK | ${totalWarnings} Avisos | ${totalErrors} Erros`)

    if (totalErrors === 0) {
      console.log('🎉 Sistema funcionando perfeitamente!')
    } else {
      console.log('🔧 Sistema precisa de correções')
    }

    return {
      ok: totalOK,
      warnings: totalWarnings,
      errors: totalErrors,
      results: this.results
    }
  }
}

// Executar verificação se chamado diretamente
if (require.main === module) {
  const verifier = new SystemVerifier()
  verifier.runAllChecks()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Erro durante verificação:', error)
      process.exit(1)
    })
}

export default SystemVerifier
