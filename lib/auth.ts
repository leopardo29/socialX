import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "./validation/auth-validate";
import { prisma } from "./prismadb";
import { generateBaseUsername } from "./helper";
import { ensureUniqueUsername } from "@/app/actions/auth.action";
import type { User as PrismaUser } from "@prisma/client";

// Definimos un tipo de usuario para NextAuth con id como string y username opcional
type NextAuthUser = Omit<PrismaUser, "id" | "username"> & {
  id: string;
  username?: string;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      profile: async (profile) => {
        console.log(profile, "profile");
        const baseUsername = generateBaseUsername(profile.name, profile.email);
        const uniqueUsername = await ensureUniqueUsername(baseUsername);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          profileImage: profile.picture,
          username: uniqueUsername,
        };
      },
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (
        credentials: Partial<Record<"email" | "password", unknown>>,
          // Usamos Request, para que se alinee con lo esperado
      ): Promise<NextAuthUser | null> => {
        if (!credentials.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }
        const email = credentials.email;
        const password = credentials.password;
        if (typeof email !== "string" || typeof password !== "string") {
          throw new Error("Invalid credentials");
        }
        try {
          const { email: validatedEmail, password: validatedPassword } =
            await signInSchema.parseAsync({ email, password });
          const user = await prisma.user.findUnique({
            where: { email: validatedEmail },
          });
          if (!user || !user.hashedPassword) return null;
          const isMatch = await bcrypt.compare(
            validatedPassword,
            user.hashedPassword
          );
          return isMatch
            ? {
                ...user,
                id: user.id.toString(),
                username: user.username ?? undefined,
              }
            : null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.email = token.email ?? "";
        session.user.name = token.name;
        session.user.username = token.username;
      }
      return session;
    },
  },
});
