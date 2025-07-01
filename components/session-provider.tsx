"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import React from "react";

interface SessionProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

export function SessionProvider({ children, session }: SessionProviderProps) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchInterval={15 * 60} // 15 minutes - reduced frequency
      refetchOnWindowFocus={false} // Disabled for performance
    >
      {children}
    </NextAuthSessionProvider>
  );
}
