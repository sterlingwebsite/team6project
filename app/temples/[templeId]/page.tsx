// app\temples\[templeId]\page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import CreateFactForm from '@/components/CreateFactForm';
import TempleFactRow from '@/components/TempleFactRow';

interface ITempleDetail {
  _id?: string;
  name: string;
  slug: string;
  status: string;
  image?: {
    full: string;
    thumb: string;
  } | string;
  imageUrl?: string;
}

interface ITempleFactItem {
  _id: string;
  templeId: string;
  text: string;
  likesCount: number;
  createdAt: string;
}

type PageProps = {
  params: Promise<{ templeId: string }>;
};

export default function TempleDetailPage({ params }: PageProps) {
  const { templeId } = use(params);

  const [temple, setTemple] = useState<ITempleDetail | null>(null);
  const [facts, setFacts] = useState<ITempleFactItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    async function loadTempleAndFacts() {
      try {
        const [directoryRes, factsRes] = await Promise.all([
          fetch(`/api/temples/${templeId}`),
          fetch(`/api/temples/${templeId}/facts`, { cache: 'no-store' })
        ]);

        if (directoryRes.ok) {
          const matched = await directoryRes.json();
          if (matched && typeof matched === 'object' && !Array.isArray(matched)) {
            setTemple(matched);
          } else {
            setError("Temple data payload invalid.");
          }
        } else {
          const errData = await directoryRes.json().catch(() => ({}));
          setError(errData.error || "Temple profile not found.");
        }

        if (factsRes.ok) {
          const data = await factsRes.json();
          const factsArray = data.facts || data || [];
          factsArray.sort((a: ITempleFactItem, b: ITempleFactItem) => b.likesCount - a.likesCount);
          setFacts(factsArray);
        }
      } catch (err) {
        console.error('Error fetching temple detailed view datasets:', err);
        setError('Could not connect to the database layers.');
      } finally {
        setLoading(false);
      }
    }

    loadTempleAndFacts();
  }, [templeId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Retrieving temple profile...</p>
      </div>
    );
  }

  const heroImageUrl = 
    typeof temple?.image === 'string' ? temple.image : 
    temple?.image?.full || temple?.image?.thumb || temple?.imageUrl || null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <nav aria-label="Breadcrumb">
          <Link href="/temples" className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-[#9A7B1C] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9A7B1C] rounded p-0.5">
            ← Return to Directory
          </Link>
        </nav>

        {heroImageUrl && !imgError && (
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-100">
            <img 
              src={heroImageUrl} 
              alt={temple?.name || 'Temple Photo'} 
              className="w-full h-full object-cover transform hover:scale-[1.01] transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <header className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-[#9A7B1C] uppercase">House of the Lord</span>
            <h1 className="text-3xl font-serif font-bold text-[#1A2530] tracking-tight">
              {temple?.name || 'Temple Details'}
            </h1>
          </div>
          <span className={`self-start sm:self-center text-xs font-bold px-3 py-1.5 rounded-full ${
            temple?.status === 'Dedicated' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            ● {temple?.status || 'Dedicated'}
          </span>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center text-sm font-medium" role="alert">
            {error}
          </div>
        )}

        <CreateFactForm templeId={templeId} onSuccess={async () => {
          const factsRes = await fetch(`/api/temples/${templeId}/facts`, { cache: 'no-store' });
          if (factsRes.ok) {
            const data = await factsRes.json();
            const factsArray = data.facts || data || [];
            factsArray.sort((a: any, b: any) => b.likesCount - a.likesCount);
            setFacts(factsArray);
          }
        }} />

        <section className="space-y-4" aria-label="Community Historical Insights Grid">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Community Historical Insights ({facts.length})</h3>
          
          {facts.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center text-sm text-zinc-400 shadow-sm">
              💡 No historical facts have been submitted yet. Share an insight above!
            </div>
          ) : (
            <div className="space-y-4">
              {facts.map((fact, index) => (
                <TempleFactRow 
                  key={fact._id || `fact-${index}`} 
                  fact={fact} 
                  templeId={templeId} 
                  onRefresh={async () => {
                    const factsRes = await fetch(`/api/temples/${templeId}/facts`, { cache: 'no-store' });
                    if (factsRes.ok) {
                      const data = await factsRes.json();
                      const factsArray = data.facts || data || [];
                      factsArray.sort((a: any, b: any) => b.likesCount - a.likesCount);
                      setFacts(factsArray);
                    }
                  }} 
                />
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
