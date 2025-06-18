import { NextAuthOptions, User } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { DateFormat } from './date';
import { Sheet, SHEET_RANGE } from './sheet';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }: { user: User }) {
      try {
        const users = await Sheet.read(SHEET_RANGE.user);

        const isAllowed = users?.some((u) => u.email === user.email);

        if (isAllowed) return true;

        await Sheet.create(SHEET_RANGE.errorLog, {
          user: user.name,
          email: user.email,
          timestamp: DateFormat.timeStamp(new Date()),
        });

        return false;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
};
