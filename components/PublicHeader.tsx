// components/PublicHeader.tsx
import Link from "next/link";

export default function PublicHeader() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm" aria-label="Global Landing Header">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#54410D] rounded p-1">
          <svg 
            className="w-6 h-6 text-[#54410D]" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path d="M12 2L2 7v2h20V7L12 2zm1 14h3v3h-3v-3zm-5 0h3v3H8v-3zm11 3v-3h2v3h-2zM4 16v-3h2v3H4zm4-5h2v3H8v-3zm5 0h3v3h-3v-3zM2 22h20v2H2v-2z" />
          </svg>
          
          <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530] group-hover:text-[#54410D] transition-colors">
            Temples Journal
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/auth/login" 
            className="text-sm font-medium text-gray-600 hover:text-[#54410D] focus:outline-none focus:ring-2 focus:ring-[#54410D] rounded px-1 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="bg-[#1A2530] text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
          >
            Create Account
          </Link>
        </div>
      </div>
    </nav>
  );
}
