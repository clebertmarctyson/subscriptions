"use client";

import {
  SessionProvider as NextAuthSessionProvider,
  SessionProviderProps,
} from "next-auth/react";

const SessionProvider = ({ children, session }: SessionProviderProps) => {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
