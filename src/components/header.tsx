'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Package2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

export default function Header() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
  ];

  const handleLogout = async () => {
    await logout();
    // No need to redirect here, the auth state change will handle it
  };

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
              <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, {user.displayName || user.email}</span>
              <Button variant="outline" onClick={handleLogout} asChild>
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
