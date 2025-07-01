import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };

// Export auth for server components
import { auth } from "@/lib/auth";
export { auth };
