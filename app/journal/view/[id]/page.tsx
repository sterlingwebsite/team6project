'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface IJournalEntry {
  _id: string;
  templeId: string;
  templeName: string;
  visitDate: string;
  insights: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function JournalDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [entry, setEntry] = useState<IJournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSingleLog() {
      try {
        // Rerouted the backend data lookup target to pass the object ID as a URL query parameter string
        const response = await fetch(`/api/journal?id=${id}`);
        if (response.status === 401 || response.status === 403) {
          setError('Unauthorized. You do not have ownership privileges to read this record.');
          return;
        }
        if (!response.ok) {
          throw new Error('Target document lookup failed.');
        }
        
        const data = await response.json();
        
        // Find the specific item matching the dynamic ID parameters inside the returned array data stream
        const activeEntry = Array.isArray(data) 
          ? data.find((item: IJournalEntry) => item._id === id) 
          : data;

        if (!activeEntry) {
          throw new Error('Target journal item record not found inside collection.');
        }

        setEntry(activeEntry);
      } catch (err) {
        console.error("Detailed entry fetch error:", err);
        setError('We couldn’t retrieve this journal entry. It may have been removed.');
      } finally {
        setLoading(false);
      }
    }
    loadSingleLog();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you certain you want to permanently delete this journal entry?')) return;
    try {
      // Adjusted endpoint parameters string to target our unified central backend DELETE route helper safely
      const response = await fetch(`/api/journal?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        router.push('/journal');
      } else {
        alert('Failed to erase the document. Please try again.');
      }
    } catch (err) {
      console.error('Delete action failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 min-h-screen">
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Opening your personal log...</p>
      </div>
    );
  }

  if (error || !entry) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 min-h-screen">
        <div className="w-full max-w-xl bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium shadow-sm mb-4">
          ❌ {error || 'Journal entry not found.'}
        </div>
        {/* Darkened text link to #9A7B1C and added explicit interactive focus boxes to satisfy strict WCAG checks */}
        <Link href="/journal" className="text-sm font-semibold text-[#9A7B1C] hover:underline focus:outline-none focus:ring-2 focus:ring-[#9A7B1C] rounded p-0.5">
          ← Return to Journal List
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 min-h-screen">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          {/* Darkened state actions and hover transitions for WCAG compliance */}
          <Link href="/journal" className="text-xs font-bold text-zinc-400 uppercase tracking-wider hover:text-[#9A7B1C] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400 rounded">
            ← Back to Journal
          </Link>
          <div className="flex items-center gap-2">
            {/* Updated path configuration pattern to route link structures to the correct subfolder action layout map */}
            <Link
              href={`/journal/edit/${id}`}
              className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-[#1A2530]"
            >
              Edit Log
            </Link>
            <button
              onClick={handleDelete}
              className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-600"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {/* Darkened tag headers accent text color to #9A7B1C */}
          <p className="text-xs font-bold text-[#9A7B1C] uppercase tracking-widest">
            Spiritual Reflection Log
          </p>
          <h1 className="text-3xl font-serif font-bold text-[#1A2530]">
            {entry.templeName}
          </h1>
          <p className="text-sm font-medium text-zinc-400 pt-1">
            📅 Visited on {new Date(entry.visitDate).toLocaleDateString(undefined, { dateStyle: 'full', timeZone: 'UTC' })}
          </p>
        </div>

        <div className="border-t border-zinc-100 pt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
            Personal Thoughts & Spiritual Insights
          </h2>
          <p className="text-zinc-700 text-base leading-relaxed whitespace-pre-wrap font-sans">
            {entry.insights}
          </p>
        </div>

      </div>
    </div>
  );
}
