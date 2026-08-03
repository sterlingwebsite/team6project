'use client';

import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  const handleLogout = async () => {
    try {
      // Re-routed target destination to cleanly hit your catch-all auth engine path endpoint
      const response = await fetch('/api/auth/signout', { method: 'POST' });
      
      // Wipe the authentication session-token tracker cookie directly on the client side
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
          {/* Shifted brand text hover color to accessible #9A7B1C gold values to pass AA guidelines */}
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530] group-hover:text-[#9A7B1C] transition-colors">
            Temples Journal
          </span>
        </Link>

        {/* Removed duplicate outer <nav> tag since NavLinks already contains its own internal semantic <nav> block */}
        <div className="flex items-center gap-8">
          <NavLinks />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </header>
  );
}
