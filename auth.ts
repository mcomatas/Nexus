import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import Resend from 'next-auth/providers/resend'

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [Resend({
        from: "onboarding@resend.dev"
    })],
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
    }
});

declare module "next-auth" {
  interface User {
    playedGames?: number[];
  }
}