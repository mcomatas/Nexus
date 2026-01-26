import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import { prisma } from "./prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        try {
          const result = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Sign in to Nexus",
            html: `<a href="${url}">Click here to sign in</a>`,
          });
          console.log("Resend result:", result);
          if (result.error) {
            console.error("Resend error:", result.error);
            throw new Error(result.error.message);
          }
        } catch (err) {
          console.error("Failed to send magic link email:", err);
          throw err;
        }
      },
    }),
  ],
});
