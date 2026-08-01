// components/TempleFactCard.tsx
'use client';

import { useState, useEffect } from 'react';
import LikeButton from "./LikeButton";

type TempleFact = {
  _id: string;
  text: string;
  likesCount: number;
  creatorId?: string;
};

interface TempleFactCardProps {
  templeId: string;
}

export default function TempleFactCard({ templeId }: TempleFactCardProps) {
  const [facts, setFacts] = useState<TempleFact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newFactText, setNewFactText] = useState("");
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadFacts = async () => {
    try {
      const response = await fetch(`/api/temples/${templeId}/facts`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load temple facts.');
      const data = await response.json();
      const factList = data.facts || data || [];
      factList.sort((a: TempleFact, b: TempleFact) => b.likesCount - a.likesCount);
      setFacts(factList);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve crowdsourced facts for this temple.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFacts();
  }, [templeId]);

  const handleCreateFact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/temples/${templeId}/facts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newFactText.trim() })
      });
      if (res.ok) {
        setNewFactText("");
        await loadFacts();
      } else {
        alert('Failed to submit fact.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateFact = async (factId: string) => {
    if (!editingText.trim()) return;
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText.trim() })
      });
      if (res.ok) {
        setEditingFactId(null);
        setEditingText("");
        await loadFacts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFact = async (factId: string) => {
    if (!confirm('Are you sure you want to remove this fact?')) return;
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${factId}`, { method: 'DELETE' });
      if (res.ok) await loadFacts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLikeSuccess = () => {
    loadFacts();
  };

  if (loading) return <p className="text-zinc-500 text-sm animate-pulse">Loading temple facts vault...</p>;

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm">{error}</div>}

      <section className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-[#1A2530] uppercase tracking-wider">Contribute a Historical Fact</h3>
        <form onSubmit={handleCreateFact} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="e.g., This temple features a unique slate-blue granite exterior..."
            value={newFactText}
            onChange={(e) => setNewFactText(e.target.value)}
            disabled={submitting}
            className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            disabled={submitting || !newFactText.trim()}
            className="bg-[#D4AF37] text-white hover:bg-[#bfa032] font-semibold px-5 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            Submit Fact
          </button>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Community Submissions ({facts.length})</h3>
        {facts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-zinc-400 text-sm">
            No community facts recorded yet. Be the first to add one!
          </div>
        ) : (
          <div className="space-y-3">
            {facts.map((fact, index) => (
              <div key={fact._id ? `fact-${fact._id}` : `fact-index-${index}`} className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex items-start justify-between gap-4">
                <div className="space-y-2 flex-grow">
                  {editingFactId === fact._id ? (
                    <div className="flex gap-2 w-full">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-grow px-3 py-1 border border-zinc-300 rounded-md text-sm text-gray-900 bg-white"
                      />
                      <button onClick={() => handleUpdateFact(fact._id)} className="text-xs bg-green-600 text-white px-2.5 py-1 rounded">Save</button>
                      <button onClick={() => setEditingFactId(null)} className="text-xs bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded">Cancel</button>
                    </div>
                  ) : (
                    <p className="text-zinc-700 text-sm leading-relaxed">{fact.text}</p>
                  )}

                  <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400 mt-2">
                    <div className="flex items-center gap-2">
                      {/* Updated to pass templeId variable context directly downward */}
                      <LikeButton 
                        templeId={templeId} 
                        factId={fact._id} 
                        onLikeSuccess={handleLikeSuccess} 
                      />
                      <span className="text-zinc-700 font-bold">{fact.likesCount || 0} likes</span>
                    </div>
                    
                    {editingFactId !== fact._id && (
                      <div className="flex gap-4">
                        <button onClick={() => { setEditingFactId(fact._id); setEditingText(fact.text); }} className="hover:text-[#D4AF37] transition-colors">Edit</button>
                        <button onClick={() => handleDeleteFact(fact._id)} className="hover:text-red-500 transition-colors">Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
