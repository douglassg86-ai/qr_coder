'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const password = formData.get('password');
  const appPassword = process.env.APP_PASSWORD;

  if (password === appPassword) {
    cookies().set('auth', 'ok', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    return { success: true };
  }

  return { success: false, error: 'Senha incorreta' };
}
