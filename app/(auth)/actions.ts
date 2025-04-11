'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { AuthService } from '../services/auth';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export async function login(formData: LoginFormData) {
  try {
    const validatedFields = loginSchema.safeParse(formData);

    if (!validatedFields.success) {
      console.log('failed to validate form');
      return {
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { email, password } = validatedFields.data;
    const authService = AuthService.getInstance();

    try {
      const response = await authService.login(email, password);

      const cookieStore = await cookies();
      cookieStore.set('session', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred during login' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
  //   redirect('/login');
}

const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

export async function signup(formData: SignupFormData) {
  try {
    const validatedFields = signupSchema.safeParse(formData);

    if (!validatedFields.success) {
      return {
        error: 'Invalid form data',
        fieldErrors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = validatedFields.data;
    const authService = AuthService.getInstance();

    try {
      const response = await authService.signup({ name, email, password });

      const cookieStore = await cookies();
      cookieStore.set('session', response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
    } catch (error) {
      if (error instanceof Error) {
        return { error: error.message };
      }
      return { error: 'An unexpected error occurred during signup' };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      error: 'An unexpected error occurred. Please try again.',
    };
  }
  redirect('/dashboard');
}
