// app/temples/[templeId]/page.tsx
'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Integrated native optimization component
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
        {/* Boosted text loading state font metadata parameters to text-zinc-700 */}
        <p className="text-sm font-medium text-zinc-700 animate-pulse">Retrieving temple profile...</p>
      </div>
    );
  }

  const thumbnailImageUrl = typeof temple?.image === 'object' ? temple?.image?.thumb : null;
  const fullImageUrl = typeof temple?.image === 'object' ? temple?.image?.full : null;
  const baseImageUrl = typeof temple?.image === 'string' ? temple.image : null;
  
  const heroImageUrl = thumbnailImageUrl || fullImageUrl || temple?.imageUrl || baseImageUrl || null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <nav aria-label="Breadcrumb">
          {/* 🛠️ FIX: Replaced hover color states and active focus ring links with AAA compliant #54410D tokens */}
          <Link href="/temples" className="text-xs font-bold text-zinc-700 uppercase tracking-widest hover:text-[#54410D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#54410D] rounded p-0.5">
            ← Return to Directory
          </Link>
        </nav>

        {heroImageUrl && !imgError && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-zinc-200 bg-zinc-100 relative">
            {/* 🛠️ FIX: Upgraded to native Next.js `<Image />` component with specific dimension bounds for fast rendering performance */}
            <Image 
              src={heroImageUrl} 
              alt={temple?.name || 'Temple Portrait'} 
              fill
              priority
              sizes="(max-w-768px) 100vw, 768px"
              quality={75}
              className="object-cover transform hover:scale-[1.01] transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <header className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            {/* 🛠️ FIX: Changed text-[#7C6214] to text-[#54410D] to hit a > 7:1 contrast ratio for complete AAA compliance */}
            <span className="text-xs font-bold tracking-widest text-[#54410D] uppercase">
              House of the Lord
            </span>
            <h1 className="text-3xl font-serif font-bold text-[#1A2530] tracking-tight">
              {temple?.name || 'Temple Details'}
            </h1>
          </div>
          {/* 🛠️ FIX: Enhanced background/foreground status colors to fulfill readable layout verification checks */}
          <span className={`self-start sm:self-center text-xs font-bold px-3 py-1.5 rounded-full ${
            temple?.status === 'Dedicated' ? 'bg-green-200 text-green-900' : 'bg-amber-200 text-amber-900'
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
            factsArray.sort((a: ITempleFactItem, b: ITempleFactItem) => b.likesCount - a.likesCount);
            setFacts(factsArray);
          }
        }} />

        <section className="space-y-4" aria-label="Community Historical Insights Grid">
          {/* 🛠️ FIX: Boosted category tag text color parameter from text-zinc-500 to text-zinc-700 */}
          <h2 className="text-xs font-bold text-zinc-700 uppercase tracking-widest">
            Community Historical Insights ({facts.length})
          </h2>
          
          {facts.length === 0 ? (
            <div className="bg-white border border-zinc-200 rounded-2xl p-12 text-center text-sm text-zinc-600 shadow-sm">
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
                      factsArray.sort((a: ITempleFactItem, b: ITempleFactItem) => b.likesCount - a.likesCount);
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
