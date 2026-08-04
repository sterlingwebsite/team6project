// app/facts/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FactCard from "@/components/FactCard";
import EmptyFactsState from "@/components/EmptyFactsState";

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

  const loadUserFacts = async () => {
    try {
      const response = await fetch('/api/user/facts', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load your contributed data.');
      const data = await response.json();
      setFacts(data || []);
    } catch (err) {
      console.error('Error fetching fact collections:', err);
      setError('Could not retrieve your shared facts collection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserFacts();
  }, []);

  const handleUpdate = async (factId: string, templeId: string, text: string) => {
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        await loadUserFacts();
      } else {
        alert('Failed to update fact. Please verify profile permissions.');
      }
    } catch (err) {
      console.error('Update lifecycle failure:', err);
    }
  };

  const handleDelete = async (factId: string, templeId: string) => {
    if (!confirm('Are you certain you want to permanently delete this historical fact?')) return;
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, { method: 'DELETE' });
      if (res.ok) {
        await loadUserFacts();
      } else {
        alert('Failed to delete fact documentation.');
      }
    } catch (err) {
      console.error('Delete execution failure:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-700 animate-pulse font-medium text-sm">Opening your contributions vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <header className="border-b border-zinc-200 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1A2530]">My Contributed Facts</h1>
            <p className="text-zinc-700 text-sm mt-1">Review, modify, or remove historical facts you have added to the directory.</p>
          </div>
          <Link
            href="/temples"
            className="inline-flex items-center justify-center gap-2 bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            <svg 
              className="w-4 h-4 shrink-0 text-white" 
              fill="currentColor" 
              viewBox="0 0 24 24" 
              aria-hidden="true"
            >
              <path d="M12 2L2 7v2h20V7L12 2zm1 14h3v3h-3v-3zm-5 0h3v3H8v-3zm11 3v-3h2v3h-2zM4 16v-3h2v3H4zm4-5h2v3H8v-3zm5 0h3v3h-3v-3zM2 22h20v2H2v-2z" />
            </svg>
            <span>Browse Temples</span>
          </Link>
        </header>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium">
            ❌ {error}
          </div>
        ) : facts.length === 0 ? (
          <EmptyFactsState />
        ) : (
          <div className="space-y-4">
            {facts.map((fact) => (
              <FactCard 
                key={fact._id}
                fact={fact}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
