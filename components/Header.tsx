// components/Header.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import NavLinks from './NavLinks';

export default function Header() {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const isPublicWelcomeRoute = pathname === "/" || pathname?.startsWith("/auth/");
  if (isPublicWelcomeRoute) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = '/';
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#6E5611] rounded p-1">
          {/* 🛠️ FIX: Swapped out the raw native text emoji for a highly accessible, crisp SVG vector shape */}
          <svg 
            className="w-6 h-6 text-[#6E5611] transition-colors" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path d="M12 2L2 7v2h20V7L12 2zm1 14h3v3h-3v-3zm-5 0h3v3H8v-3zm11 3v-3h2v3h-2zM4 16v-3h2v3H4zm4-5h2v3H8v-3zm5 0h3v3h-3v-3zM2 22h20v2H2v-2z" />
          </svg>
          
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530] group-hover:text-[#6E5611] transition-colors">
            Temples Journal
          </span>
        </Link>

        <div className="flex items-center gap-8">
          {isAuthenticated && <NavLinks />}
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
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
