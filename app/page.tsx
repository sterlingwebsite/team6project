// app/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import PublicHeader from "@/components/PublicHeader";

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
      <PublicHeader />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-16 flex flex-col items-center justify-center">
        
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#1A2530] leading-tight tracking-tight">
            Preserve Your Sacred <br />
            <span className="text-[#7C6214]">Temple Milestones</span>
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

        {/* 🛠️ OPTIMIZED: Changed grid structure from md:grid-cols-3 to md:grid-cols-2 to perfectly fit the remaining active features */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4" aria-label="Application Key Features Summary">
          
          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="bg-amber-50 p-3 rounded-xl text-[#54410D] mb-6" aria-hidden="true">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.25 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A2530] mb-3">
              Spiritual Journaling
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Log your individual attendance records and tie personal thoughts, promptings, or family ordinances cleanly to specific calendar timelines.
            </p>
          </div>

          {/* ✂️ Removed "Live Global Analytics" panel block successfully from layout flow */}

          <div className="bg-white border border-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-start">
            <div className="bg-amber-50 p-3 rounded-xl text-[#54410D] mb-6" aria-hidden="true">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.381-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif font-bold text-[#1A2530] mb-3">
              Crowdsourced History
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Contribute historical milestones, share interesting facts, and vote on community metrics to bring the most inspiring insights to the front page.
            </p>
          </div>

        </section>
      </main>

      <Footer />
    </div>
  );
}
