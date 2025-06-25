'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfileAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const profileFormSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters.'),
  businessPhoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function OnboardingPage() {
  const { user, userProfile, loading, refreshUserProfile } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading) {
        if (!user) {
            router.push('/login');
        }
        if (user && userProfile) {
            router.push('/dashboard');
        }
    }
  }, [user, userProfile, loading, router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { businessName: '', businessPhoneNumber: '' },
  });

  const onSubmit = (values: ProfileFormValues) => {
    if (!user) return;
    setSubmissionError(null);

    startTransition(async () => {
        const result = await updateUserProfileAction(user.uid, values);
        if (result.success) {
            await refreshUserProfile();
            setIsSuccess(true);
            router.push('/dashboard');
        } else {
            setSubmissionError(result.error || 'An unknown error occurred.');
        }
    });
  };

  if (loading || !user || (userProfile && !isSuccess)) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center py-12">
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Welcome!</CardTitle>
                <CardDescription>
                  {isSuccess 
                    ? "You're all set!"
                    : "Let's set up your business profile. This information will be shown to your customers."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isSuccess ? (
                    <div className="text-center py-4">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="mt-4 text-lg font-medium">Profile Updated Successfully!</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            You are being redirected to your dashboard.
                        </p>
                        <Button asChild className="mt-6 w-full">
                            <Link href="/dashboard">Go to Dashboard Now</Link>
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
                            {submissionError && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Update Failed</AlertTitle>
                                    <AlertDescription>{submissionError}</AlertDescription>
                                </Alert>
                            )}
                            <FormField control={form.control} name="businessName" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Name</FormLabel>
                                    <FormControl><Input placeholder="My Awesome Store" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="businessPhoneNumber" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Business Phone Number</FormLabel>
                                    <FormControl><Input type="tel" placeholder="+2348012345678" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Button type="submit" disabled={isPending} className="w-full">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Continue to Dashboard
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
