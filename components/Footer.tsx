// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 py-6 px-6" aria-label="Portal Footer Links">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600 gap-4">
        <p>© 2026 Temples Journal App Team. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <Link 
            href="/temples" 
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded px-1 transition-colors"
          >
            Directory
          </Link>
          <Link 
            href="/auth/login" 
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded px-1 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth/signup" 
            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 rounded px-1 transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </footer>
  );
}
