declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "USER" | "AGENT" | "ADMIN" | "CLIENT";
    };
  }

  interface User {
    id?: string;
    role?: "USER" | "AGENT" | "ADMIN" | "CLIENT";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "USER" | "AGENT" | "ADMIN" | "CLIENT";
    userId?: string;
  }
}
