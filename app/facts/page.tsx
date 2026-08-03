// app\facts\page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface IUserFact {
  _id: string;
  templeId: string;
  templeName: string;
  text: string;
  likesCount: number;
  createdAt: string;
}

export default function UserFactsPage() {
  const [facts, setFacts] = useState<IUserFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const loadUserFacts = async () => {
    try {
      const response = await fetch('/api/user/facts', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Failed to load your contributed facts folder data.');
      }
      const data = await response.json();
      setFacts(data || []);
    } catch (err) {
      console.error('Error fetching user fact collections:', err);
      setError('Could not retrieve your shared facts collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFacts();
  }, []);

  const handleUpdate = async (factId: string, templeId: string) => {
    if (!editingText.trim()) return;

    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText.trim() })
      });

      if (res.ok) {
        setEditingId(null);
        setEditingText('');
        await loadUserFacts();
      } else {
        alert('Failed to update fact. Please verify your profile permissions.');
      }
    } catch (err) {
      console.error('Update error submission execution:', err);
    }
  };

  const handleDelete = async (factId: string, templeId: string) => {
    if (!confirm('Are you absolutely certain you want to permanently delete this historical fact? This action cannot be undone.')) return;

    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await loadUserFacts();
      } else {
        alert('Failed to delete fact documentation.');
      }
    } catch (err) {
      console.error('Delete execution lifecycle failure:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-500 animate-pulse font-medium text-sm">Opening your contributions vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1A2530]">My Contributed Facts</h1>
            <p className="text-zinc-500 text-sm mt-1">Review, modify, or remove historical facts you have added to the directory.</p>
          </div>
          <Link
            href="/temples"
            className="inline-flex items-center justify-center bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            🏛️ Browse Temples
          </Link>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium">
            ❌ {error}
          </div>
        ) : facts.length === 0 ? (
          
          <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <span className="text-4xl block" aria-hidden="true">💡</span>
            <h3 className="text-lg font-semibold text-[#1A2530]">No contributions tracked yet</h3>
            <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
              When you add historical milestones or unique architectural features directly to individual temple profile screens, they will aggregate inside this management pane.
            </p>
            {/* Swapped style background to high-contrast dark blue layout brand parameters to clear WCAG audits */}
            <Link
              href="/temples"
              className="inline-block bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
            >
              Explore Directory & Contribute
            </Link>
          </div>
        ) : (
          
          <div className="space-y-4">
            {facts.map((fact) => (
              <div 
                key={fact._id} 
                className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm space-y-4 transition-all hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 pb-3 gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base" aria-hidden="true">🏛️</span>
                    {/* Shifted active text hover attributes to rich accessible #9A7B1C gold values */}
                    <Link 
                      href={`/temples/${fact.templeId}`}
                      className="font-serif font-bold text-base text-[#1A2530] hover:text-[#9A7B1C] transition-all hover:underline focus:ring-2 focus:ring-[#9A7B1C] rounded p-0.5"
                    >
                      {fact.templeName || 'View Temple Details'}
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400">
                    <span>👍 {fact.likesCount || 0} Peer Votes</span>
                    <span>• Added {new Date(fact.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium', timeZone: 'UTC' })}</span>
                  </div>
                </div>

                <div>
                  {editingId === fact._id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        // Updated input ring boundaries to use compliant tracking layouts
                        className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleUpdate(fact._id, fact.templeId)}
                          className="text-xs bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-700 font-semibold shadow-sm"
                        >
                          Save
                        </button>
                        <button 
                          onClick={() => { setEditingId(null); setEditingText(''); }}
                          className="text-xs bg-zinc-100 text-zinc-600 px-3 py-2 rounded-lg hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-400 font-semibold border border-zinc-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
                      <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl">
                        "{fact.text}"
                      </p>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => { setEditingId(fact._id); setEditingText(fact.text); }}
                          className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-[#1A2530]"
                        >
                          Edit
                        </button>
                        {/* Corrected truncated code syntax block down below safely */}
                        <button
                          onClick={() => handleDelete(fact._id, fact.templeId)}
                          className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
