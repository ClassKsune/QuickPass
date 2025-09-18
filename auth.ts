/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { getApplicationUrl, isProduction } from './utils';

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { maxAge: 60 * 60 }, // 60 minutes
  jwt: { maxAge: 60 * 60 }, // 60 minutes
  cookies: {
    sessionToken: {
      name: isProduction ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
        maxAge: 60 * 60, // 60 minutes
      }
    }
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          throw new Error('Credentials are required');
        }

        const { email, password } = credentials;
        const baseUrl = getApplicationUrl();

        try {
          const { data } = await axios.post(`${baseUrl}/api/account`, { email, password });
          if (data.success) {
            return data.account;
          } else {
            throw new Error('Invalid credentials');
          }
        } catch (error) {
          console.error('Authorization error:', error);
          throw new Error('Failed to authorize');
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: any, token: JWT }) {
      session.user._id = token._id;
      session.user.rights = token.rights;
      session.user.name = token.name;
      session.user.surname = token.surname;
      return session
    },
    async jwt({ token, user }: { token: JWT, user?: User }) {
      if (user) {
        token._id = user._id;
        token.rights = user.rights;
        token.name = user.name;
        token.surname = user.surname;
      }
      return token;
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl
    },
  },
})