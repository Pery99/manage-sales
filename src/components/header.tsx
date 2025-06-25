'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Mock auth hook for demonstration purposes
const useAuth = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd check for a token or session here.
    // We'll simulate this with a timeout.
    const timer = setTimeout(() => {
        // To test both states, you can manually change this condition
        if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
            setUser({ name: 'Business Owner' });
        } else {
            setUser(null);
        }
        setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { user, loading, logout: () => setUser(null) };
};

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Package2 className="h-6 w-6 text-primary" />
            <span className="font-headline">LinkSale</span>
          </Link>
        </div>
        <nav className="flex-1 items-center space-x-4 hidden md:flex">
          {user && navLinks.map(link => (
            <Link key={link.href} href={link.href} className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end space-x-4 flex-1">
          {loading ? (
             <div className="w-24 h-8 bg-muted rounded-md animate-pulse"></div>
          ) : user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.name}</span>
              <Button variant="outline" onClick={logout} asChild>
                <Link href="/">Logout</Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
