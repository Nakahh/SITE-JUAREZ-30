import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Validação de entrada mais rigorosa
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        // Validação de comprimento mínimo da senha
        if (credentials.password.length < 6) {
          console.log("Password too short");
          return null;
        }

        // Validação básica de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(credentials.email)) {
          console.log("Invalid email format");
          return null;
        }

        // Limitar comprimento do email para evitar ataques
        if (credentials.email.length > 254) {
          console.log("Email too long");
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim(),
            },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              image: true,
              ativo: true,
            },
          });

          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            return null;
          }

          if (user.role === "AGENT" && !user.ativo) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day - reduced for performance
    updateAge: 60 * 60, // 1 hour - reduce update frequency
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Incluir informações do usuário no token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Passar informações do token para a sessão
      if (token && session.user) {
        session.user.id = (token.id as string) || token.sub;
        session.user.role = token.role as string;
      }
      return session;
    },
    async redirect({ url, baseUrl, token }) {
      console.log("🔄 Redirect callback called:", {
        url,
        baseUrl,
        userRole: token?.role,
        userEmail: token?.email,
      });

      // Se não há token (logout), redirecionar para login
      if (!token) {
        return `${baseUrl}/login`;
      }

      // Redirecionamento baseado em papel após login bem-sucedido
      const role = token.role as string;

      // Se o usuário está tentando acessar a página de login, redirecionar baseado no papel
      if (url === `${baseUrl}/login` || url === `${baseUrl}/api/auth/signin`) {
        if (role === "ADMIN") {
          console.log("🔄 Redirecting ADMIN to admin dashboard");
          return `${baseUrl}/admin`;
        } else if (role === "AGENT") {
          console.log("🔄 Redirecting AGENT to dashboard");
          return `${baseUrl}/dashboard`;
        } else {
          console.log("🔄 Redirecting USER to dashboard");
          return `${baseUrl}/dashboard`;
        }
      }

      // URLs específicas têm prioridade
      if (url.startsWith(`${baseUrl}/`)) {
        return url;
      }

      // URLs relativos
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      // Default: baseado no papel
      if (role === "ADMIN") {
        return `${baseUrl}/admin`;
      }

      return `${baseUrl}/dashboard`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  events: {
    async signIn({ user, account, profile }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ session, token }) {
      console.log("User signed out");
    },
  },
};

export const auth = NextAuth(authOptions);
export const { handlers, signIn, signOut } = auth;
