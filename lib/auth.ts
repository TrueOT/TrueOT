import db from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { type SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session, DefaultSession } from "next-auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession["user"]
  }
}

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { 
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const validatedCredentials = schema.parse(credentials);
        
        const user = await db.user.findUnique({
          where: { 
            email: validatedCredentials.email.toLowerCase(),
          },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
          },
        });

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const passwordMatch = await bcrypt.compare(
          validatedCredentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

export const auth = NextAuth(authOptions);