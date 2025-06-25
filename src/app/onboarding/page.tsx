'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateUserProfileAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const profileFormSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters.'),
  businessPhoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function OnboardingPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

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
    const formData = new FormData();
    formData.append('businessName', values.businessName);
    formData.append('businessPhoneNumber', values.businessPhoneNumber);

    startTransition(() => {
        updateUserProfileAction(user.uid, formData).catch(err => {
            console.error(err);
            // In a real app, you would set an error state to display to the user
            alert('Failed to update profile. Please try again.');
        });
    });
  };

  if (loading || !user || userProfile) {
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
                <CardDescription>Let's set up your business profile. This information will be shown to your customers.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
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
            </CardContent>
        </Card>
    </div>
  );
}
