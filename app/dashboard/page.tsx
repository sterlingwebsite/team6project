'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

interface IRecentEntry {
  _id: string;
  templeName: string;
  visitDate: string;
  insights: string;
}

interface IDashboardStats {
  totalEntries: number;
  templesVisited: number;
  factsLiked: number;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState<string>('User');
  const [recentEntries, setRecentEntries] = useState<IRecentEntry[]>([]);
  const [stats, setStats] = useState<IDashboardStats>({ totalEntries: 0, templesVisited: 0, factsLiked: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const session = await getSession();
        if (session?.user?.name) {
          setUserName(session.user.name);
        }

        const [journalRes, statsRes] = await Promise.all([
          fetch('/api/journal'),
          // Appended ?liked=true parameter to target the explicit upvote tracking table
          fetch('/api/user/facts?liked=true')
        ]);
        
        let localTotalLogs = 0;
        let localUniqueTemples = new Set<string>();

        if (journalRes.ok) {
          const journalData = await journalRes.json();
          setRecentEntries(journalData.slice(0, 3));
          
          localTotalLogs = journalData.length;
          journalData.forEach((entry: any) => {
            if (entry.templeId) localUniqueTemples.add(entry.templeId);
          });
        }

        let localLikedFactsCount = 0;
        if (statsRes.ok) {
          const factsData = await statsRes.json();
          localLikedFactsCount = Array.isArray(factsData) ? factsData.length : (factsData.total || 0);
        }

        setStats({
          totalEntries: localTotalLogs,
          templesVisited: localUniqueTemples.size,
          factsLiked: localLikedFactsCount
        });

      } catch (error) {
        console.error("Failed to aggregate dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading your dashboard profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <header className="border-b border-zinc-200 pb-6">
          <h1 className="text-3xl font-serif font-bold text-[#1A2530]">
            Welcome back, <span className="text-[#9A7B1C]">{userName}</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Here is a live summary of your ongoing temple activities and insights.</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-2xl text-[#9A7B1C]" aria-hidden="true">📋</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Logs</p>
              <h3 className="text-2xl font-bold text-[#1A2530] mt-0.5">{stats.totalEntries}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-2xl text-[#9A7B1C]" aria-hidden="true">🏛️</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Temples Visited</p>
              <h3 className="text-2xl font-bold text-[#1A2530] mt-0.5">{stats.templesVisited}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-50 p-3 rounded-lg text-2xl text-[#9A7B1C]" aria-hidden="true">👍</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Facts Liked</p>
              <h3 className="text-2xl font-bold text-[#1A2530] mt-0.5">{stats.factsLiked}</h3>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4">
            <h2 className="text-xl font-serif font-bold text-[#1A2530]">Recent Journal Reflections</h2>
            <Link href="/journal" className="text-xs font-bold text-[#9A7B1C] tracking-wider uppercase hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[#9A7B1C]">
              View Entire History →
            </Link>
          </div>
          
          {recentEntries.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <span className="text-3xl block" aria-hidden="true">📖</span>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">No personal log sheets found in your profile folder.</p>
              <Link 
                href="/journal/new" 
                className="inline-block bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] px-4 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                + Create Your First Entry
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentEntries.map((entry) => (
                <div key={entry._id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-base text-[#1A2530]">{entry.templeName}</h4>
                      <span className="text-xs text-zinc-400">{new Date(entry.visitDate).toLocaleDateString(undefined, { dateStyle: 'medium', timeZone: 'UTC' })}</span>
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-1 max-w-xl">{entry.insights}</p>
                  </div>
                  <Link 
                    href={`/journal/view/${entry._id}`} 
                    className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-all text-center w-full sm:w-auto shadow-sm focus:ring-2 focus:ring-[#1A2530]"
                  >
                    Open Full Log
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
