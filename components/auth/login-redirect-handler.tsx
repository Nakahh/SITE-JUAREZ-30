"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function LoginRedirectHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const userRole = session.user.role;

      console.log("🔄 LoginRedirectHandler - User authenticated:", {
        email: session.user.email,
        role: userRole,
        id: session.user.id,
      });

      // Aguardar um pouco para garantir que o estado seja atualizado
      setTimeout(() => {
        if (userRole === "ADMIN") {
          console.log("🔄 Redirecting ADMIN to /admin");
          router.push("/admin");
        } else if (userRole === "AGENT") {
          console.log("🔄 Redirecting AGENT to /dashboard");
          router.push("/dashboard");
        } else {
          console.log("🔄 Redirecting USER to /dashboard");
          router.push("/dashboard");
        }
      }, 500);
    }
  }, [session, status, router]);

  // Retornar null para não renderizar nada
  return null;
}
