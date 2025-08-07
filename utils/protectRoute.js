import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const isProduction = process.env.NODE_ENV === 'production';

export const getUserToken = (req) =>
  getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: isProduction
          ? '__Secure-next-auth.session-token'
          : 'next-auth.session-token',
    secureCookie: isProduction,
  });

export async function protectRoute(req, requiredRights = []) {
  const token = await getUserToken(req);

  if (!token) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  const hasRequiredRights = requiredRights.some(right => token.rights.includes(right))
  if (!hasRequiredRights) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 })
  }

  return null
}