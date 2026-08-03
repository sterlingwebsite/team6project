// app/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | Temple Journal",
  description: "Welcome to the Temple Journal app. Record insights, track visits, and explore temples worldwide.",
  openGraph: {
    title: "Home | Temple Journal",
    description: "A personal journal for recording temple experiences and insights.",
    type: "website"
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A2530] flex flex-col justify-between">
      <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 shadow-sm" aria-label="Global Landing Header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">🏛️</span>
            <span className="font-serif font-bold text-xl tracking-tight text-[#1A2530]">
              Temples Journal
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-gray-600 hover:text-[#9A7B1C] focus:outline-none focus:ring-2 focus:ring-[#9A7B1C] rounded px-1 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup" 
              className="bg-[#1A2530] text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] text-sm font-medium px-4 py-2 rounded-lg shadow-sm transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center">
        
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1A2530] leading-tight tracking-tight">
            Preserve Your Sacred <br />
            <span className="text-[#9A7B1C]">Temple Milestones</span>
          </h1>
          <p className="text-lg text-gray-600 mt-6 leading-relaxed">
            A reverent community-focused platform designed to log your physical attendance, safeguard your sacred personal spiritual insights, and explore crowdsourced historical facts.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="/auth/signup" 
              className="bg-[#1A2530] text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] font-semibold px-8 py-3.5 rounded-lg shadow-md transition-all text-center w-full sm:w-auto"
            >
              Get Started Free
            </Link>
            <Link 
              href="/temples" 
              className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-semibold px-8 py-3.5 rounded-lg shadow-sm transition-all text-center w-full sm:w-auto"
            >
              Browse Public Directory
            </Link>
          </div>
        </section>

        <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mt-4" aria-label="Application Key Features Summary">
          
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="bg-amber-50 p-3 rounded-xl text-xl mb-6 text-[#9A7B1C]" aria-hidden="true">
              ✍️
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1A2530] mb-3">
              Spiritual Journaling
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Log your individual attendance records and tie personal thoughts, promptings, or family ordinances cleanly to specific calendar timelines.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="bg-amber-50 p-3 rounded-xl text-xl mb-6 text-[#9A7B1C]" aria-hidden="true">
              🌍
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1A2530] mb-3">
              Live Global Analytics
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Explore dynamic operational data, map structures, and external scheduling reservation endpoints mapped live across global houses of the Lord.
            </p>
          </div>

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="bg-amber-50 p-3 rounded-xl text-xl mb-6 text-[#9A7B1C]" aria-hidden="true">
              ⭐
            </div>
            <h3 className="text-xl font-serif font-bold text-[#1A2530] mb-3">
              Crowdsourced History
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Contribute historical milestones, share interesting facts, and vote on community metrics to bring the most inspiring insights to the front page.
            </p>
          </div>

        </section>
      </main>

      <footer className="w-full bg-white border-t border-gray-200 py-6 px-6" aria-label="Portal Footer Links">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>© 2026 Temples Journal App Team. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/temples" className="hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded px-1 transition-colors">Directory</Link>
            <Link href="/auth/login" className="hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded px-1 transition-colors">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400 rounded px-1 transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
