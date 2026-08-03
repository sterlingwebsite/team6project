'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Official reactive state hook wrapper tool
import NavLinks from './NavLinks';

export default function Header() {
  const pathname = usePathname();
  // Extract real-time authentication pipeline status states instantly
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // Hide the header entirely on the landing page and core registration portals
  const isPublicWelcomeRoute = pathname === "/" || pathname?.startsWith("/auth/");
  if (isPublicWelcomeRoute) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      
      // Expire and clear the tracking token cookie on the client side
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      
      window.location.href = '/';
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#9A7B1C] rounded p-1">
          <span className="text-2xl" aria-hidden="true">🏛️</span>
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530] group-hover:text-[#9A7B1C] transition-colors">
            Temples Journal
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {/* Reactive navbar visibility updates instantly without page reload delays */}
          {isAuthenticated && <NavLinks />}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="text-xs bg-[#1A2530] text-white hover:bg-zinc-800 font-semibold px-4 py-2 rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530]"
            >
              Sign In to Your Journal
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
