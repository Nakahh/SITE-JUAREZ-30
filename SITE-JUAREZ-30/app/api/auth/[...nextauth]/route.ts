// app/api/auth/[...nextauth]/authOptions.ts

import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authOptions = {
  session: {
    strategy: "jwt" as const,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.password) return null

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          papel: user.papel,
          name: user.nome,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.papel = user.papel
        token.name = user.name
      }
      return token
    },
    async session({ session, token }: any) {
      session.papel = token.papel
      session.user.name = token.name
      return session
    },
  },
  secret: process.env.JWT_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/login",
  },
}

import NextAuth from "next-auth"
import { getServerSession } from "next-auth/next"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Exporta uma função para usar no backend para autenticação
export async function auth() {
  return await getServerSession(authOptions)
}
