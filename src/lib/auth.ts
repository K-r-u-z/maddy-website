import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import type { AdminDocument } from '@/models/Admin';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const trimmedUsername = credentials.username.trim();
          const trimmedPassword = credentials.password.trim();

          if (!trimmedUsername || !trimmedPassword) {
            return null;
          }

          const admin = await Admin.findOne({ username: trimmedUsername }).exec() as AdminDocument;
          
          if (!admin) {
            return null;
          }

          const isValid = await admin.comparePassword(trimmedPassword);

          if (!isValid) {
            return null;
          }

          return {
            id: admin._id.toString(),
            name: admin.username,
            email: admin.username,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  }
}; 