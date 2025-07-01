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
          console.log(
            "Attempting to authenticate user:",
            credentials.email.substring(0, 3) + "***",
          );

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
            console.log("User not found");
            // Delay para prevenir timing attacks
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return null;
          }

          if (!user.password) {
            console.log("User has no password set");
            return null;
          }

          console.log("Comparing passwords for user");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isPasswordValid) {
            console.log("Invalid password");
            // Delay para prevenir timing attacks
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return null;
          }

          // Verificar se o usuário está ativo (para corretores)
          if (user.role === "AGENT" && !user.ativo) {
            console.log("Agent account is inactive");
            return null;
          }

          console.log("Authentication successful");
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
    maxAge: 7 * 24 * 60 * 60, // 7 days
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
    async redirect({ url, baseUrl }) {
      // Redirecionamento seguro
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
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
