'use client';

import Link from 'next/link';
import NavLinks from './NavLinks';

export default function Header() {
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl text-[#D4AF37] group-hover:scale-110 transition-transform">🏛️</span>
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530] group-hover:text-[#D4AF37] transition-colors">
            Temples Journal
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-md text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </header>
  );
}
