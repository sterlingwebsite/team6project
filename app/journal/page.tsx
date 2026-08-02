'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getSession } from 'next-auth/react';

interface IJournalEntry {
  _id: string;
  templeId: string;
  templeName: string;
  visitDate: string;
  insights: string;
}

export default function JournalListPage() {
  const [entries, setEntries] = useState<IJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadJournalLogs() {
      try {
        const session = await getSession();
        if (!session) {
          window.location.href = '/auth/login';
          return;
        }

        const response = await fetch('/api/journal');
        if (!response.ok) {
          throw new Error('Database pipeline transmission failure.');
        }
        
        const data = await response.json();
        
        const sortedData = data.sort((a: IJournalEntry, b: IJournalEntry) => 
          new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
        );
        
        setEntries(sortedData);
      } catch (err) {
        console.error("Journal extraction failure:", err);
        setError('We couldn’t load your journal entries. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadJournalLogs();
  }, []);

  const handleDeleteClick = async (entryId: string) => {
    if (!confirm('Are you absolutely sure you want to delete this journal entry?')) return;

    try {
      const response = await fetch(`/api/journal?id=${entryId}`, { method: 'DELETE' });
      if (response.ok) {
        setEntries(prev => prev.filter(item => item._id !== entryId));
      } else {
        alert('Failed to delete the selected entry. Please try again.');
      }
    } catch (err) {
      console.error('Delete request error execution:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 min-h-screen">
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading your journal vault...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 min-h-screen">
        <div className="w-full max-w-2xl bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium shadow-sm">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 min-h-screen">
      <div className="w-full max-w-2xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-6">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A2530]">
              Your Journal Entries
            </h1>
            {entries.length > 0 && (
              <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
                Showing {entries.length} Personal Milestones
              </p>
            )}
          </div>
          <Link
            href="/journal/new"
            className="inline-flex items-center justify-center bg-[#1A2530] text-white hover:bg-zinc-800 font-semibold px-4 py-2 rounded-lg shadow-sm text-sm transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530]"
          >
            Write New Entry
          </Link>
        </div>

        {entries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-zinc-200 shadow-sm mt-8">
            <span className="text-4xl block mb-4" aria-hidden="true">📖</span>
            <h3 className="text-lg font-semibold text-[#1A2530] mb-2">You haven’t written any journal entries yet.</h3>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
              Preserve your personal reflections, unique attendance dates, and spiritual promptings safely inside your profile vault.
            </p>
            <Link 
              href="/journal/new"
              className="bg-[#1A2530] text-white hover:bg-zinc-800 px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all inline-block focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530]"
            >
              Write Your First Entry
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div 
                key={entry._id}
                className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
              >
                <div className="space-y-2 flex-grow max-w-xl">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-serif font-bold text-lg text-[#1A2530]">
                      {entry.templeName}
                    </h2>
                    <span className="text-xs text-zinc-400 font-semibold">
                      • {new Date(entry.visitDate).toLocaleDateString(undefined, { dateStyle: 'long', timeZone: 'UTC' })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-zinc-600 leading-relaxed line-clamp-2">
                    {entry.insights}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-zinc-100">
                  <Link
                    href={`/journal/${entry._id}`}
                    className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-[#1A2530]"
                  >
                    View
                  </Link>
                  <Link
                    href={`/journal/${entry._id}/edit`}
                    className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-white bg-[#1A2530] hover:bg-zinc-800 transition-colors focus:ring-2 focus:ring-[#1A2530]"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(entry._id)}
                    className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
