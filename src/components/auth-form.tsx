'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type AuthFormMode = 'login' | 'signup';

interface AuthFormProps {
  mode: AuthFormMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  const isLogin = mode === 'login';
  const title = isLogin ? 'Welcome Back' : 'Create an Account';
  const description = isLogin
    ? 'Enter your credentials to access your dashboard.'
    : 'Sign up to start managing your sales.';
  const buttonText = isLogin ? 'Login' : 'Sign Up';
  const footerText = isLogin ? "Don't have an account?" : 'Already have an account?';
  const footerLink = isLogin ? '/signup' : '/login';
  const footerLinkText = isLogin ? 'Sign Up' : 'Login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle form submission to your backend here.
    // For this prototype, we'll just navigate to the dashboard.
    router.push('/dashboard');
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          {!isLogin && (
             <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" required />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full">{buttonText}</Button>
          <div className="mt-4 text-center text-sm">
            {footerText}{' '}
            <Link href={footerLink} className="underline">
              {footerLinkText}
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
