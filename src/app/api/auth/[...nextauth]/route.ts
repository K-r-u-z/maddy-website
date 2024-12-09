import NextAuth, { type NextAuthOptions, type DefaultUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/db/mongodb';
import Admin from '@/models/Admin';
import type { AdminDocument } from '@/models/Admin';

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials): Promise<DefaultUser | null> {
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
            image: null
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions }; 