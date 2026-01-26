import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: email,
          subject: "Sign in to Nexus",
          html: `<a href="${url}">Click here to sign in</a>`,
        });
      },
    }),
  ],
});
