// components/TempleFactCard.tsx
'use client';

import { useState, useEffect } from 'react';
import LikeButton from "./LikeButton";
import CreateFactForm from "./CreateFactForm";

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
  const [editingFactId, setEditingFactId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

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

  if (loading) return <p className="text-zinc-500 text-sm animate-pulse">Loading temple facts vault...</p>;

  return (
    <div className="space-y-6">
      <div aria-live="assertive">
        {error && <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm mb-4">❌ {error}</div>}
      </div>

      <CreateFactForm templeId={templeId} onSuccess={loadFacts} />

      <section className="space-y-4" aria-label="Community Submissions Directory">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Community Submissions ({facts.length})</h3>
        {facts.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-xl p-8 text-center text-zinc-400 text-sm shadow-sm">
            No community facts recorded yet. Be the first to add one!
          </div>
        ) : (
          <div className="space-y-3">
            {facts.map((fact, index) => (
              <div key={fact._id ? `fact-${fact._id}` : `fact-index-${index}`} className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm flex items-start justify-between gap-4 transition-all hover:shadow-md">
                <div className="space-y-2 flex-grow">
                  {editingFactId === fact._id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full">
                      <input
                        type="text"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="flex-grow px-3 py-1.5 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none"
                      />
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleUpdateFact(fact._id)} className="text-xs bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-700 font-semibold shadow-sm">Save</button>
                        <button onClick={() => setEditingFactId(null)} className="text-xs bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-lg hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-400 font-semibold border border-zinc-200">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-zinc-700 text-sm leading-relaxed font-sans">"{fact.text}"</p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs font-semibold mt-2 border-t border-zinc-50 pt-2">
                    <div className="flex items-center gap-3">
                      <LikeButton 
                        templeId={templeId} 
                        factId={fact._id} 
                        onLikeSuccess={loadFacts} 
                      />
                      <span className="text-zinc-500 font-medium">({fact.likesCount || 0} Peer Votes)</span>
                    </div>
                    
                    {editingFactId !== fact._id && (
                      <div className="flex items-center gap-2 ml-auto">
                        <button 
                          onClick={() => { setEditingFactId(fact._id); setEditingText(fact.text); }} 
                          className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-[#9A7B1C]"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteFact(fact._id)} 
                          className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-600"
                        >
                          Delete
                        </button>
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
