import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Link as LinkIcon, BarChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-card">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Simplify Your Sales with a Single Link
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  LinkSale helps small businesses manage orders without the need for a complex online store. Generate a link, share it, and watch your orders roll in.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              width="600"
              height="400"
              alt="Hero"
              data-ai-hint="sales dashboard illustration"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                How It Works
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
                A 3-Step Process to Effortless Sales
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We've designed LinkSale to be as simple as possible. Focus on your products, not on complex technology.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 rounded-full bg-primary text-primary-foreground">
                  <LinkIcon className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold font-headline">1. Create a Sale Link</h3>
              <p className="text-sm text-muted-foreground">
                Generate a unique link for your product or service. No storefront needed.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 rounded-full bg-primary text-primary-foreground">
                  <ShoppingCart className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold font-headline">2. Customer Fills Order</h3>
              <p className="text-sm text-muted-foreground">
                Your customer opens the link, fills in their details, and attaches proof of payment.
              </p>
            </div>
            <div className="grid gap-1 text-center">
              <div className="flex justify-center items-center mb-4">
                <div className="p-4 rounded-full bg-primary text-primary-foreground">
                  <BarChart className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-lg font-bold font-headline">3. Manage & Track</h3>
              <p className="text-sm text-muted-foreground">
                Manage all your orders from a simple dashboard and provide customers with a tracking link.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-6 border-t bg-card">
         <div className="container px-4 md:px-6 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">© 2024 LinkSale. All rights reserved.</p>
         </div>
      </footer>
    </div>
  );
}
