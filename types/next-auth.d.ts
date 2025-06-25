declare module "next-auth" {
  interface Session {
    papel?: "ADMIN" | "CORRETOR" | "ASSISTENTE" | "CLIENTE"
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface User {
    papel?: "ADMIN" | "CORRETOR" | "ASSISTENTE" | "CLIENTE"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    papel?: "ADMIN" | "CORRETOR" | "ASSISTENTE" | "CLIENTE"
  }
}
