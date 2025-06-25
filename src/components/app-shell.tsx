'use client';

import { usePathname } from 'next/navigation';
import Header from './header';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noHeaderPaths = ['/sale/', '/track/'];
  const showHeader = !noHeaderPaths.some(path => pathname.startsWith(path));

  return (
    <>
      {showHeader && <Header />}
      <main className="flex-grow">{children}</main>
    </>
  );
}
