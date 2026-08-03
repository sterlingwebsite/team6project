// app/temples/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { ITemple } from '@/utils/templeHelpers';

interface IPaginatedTemple extends ITemple {
  _id: string;
  mostLikedFact?: string;
}

export default function TemplesPage() {
  const [temples, setTemples] = useState<IPaginatedTemple[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    async function loadTemples() {
      setLoading(true);
      try {
        const response = await fetch(`/api/temples?page=${page}&search=${encodeURIComponent(debouncedSearch)}`);
        if (response.ok) {
          const data = await response.json();
          setTemples(data.temples || []);
          setTotalCount(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to load paginated temples:", error);
      } finally {
        setLoading(false);
      }
    }
    loadTemples();
  }, [page, debouncedSearch]);

  const totalPages = Math.ceil(totalCount / 20) || 1;

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-8 pb-16">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-12 border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-serif font-bold text-[#1A2530]">Temple Directory</h1>
          <p className="text-gray-600 mt-2">Explore temples around the world, record your attendance, and log personal entries.</p>
        </header>

        <div className="mb-8 max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search by Temple Name, City, or Country
          </label>
          <input
            id="search"
            type="text"
            placeholder="Search e.g., Aba Nigeria, Salt Lake..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#6E5611] focus:border-[#6E5611] focus:outline-none text-gray-900 bg-white"
          />
          <p className="text-xs text-gray-600 mt-1" aria-live="polite">
            {loading ? "Updating results..." : `Found ${totalCount} matching temples`}
          </p>
        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-gray-500 animate-pulse font-medium">Updating directory index columns...</p>
          </div>
        ) : temples.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 font-medium">No temples found matching your search term.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {temples.map((temple, index) => {
                const imageUrl = temple.image?.thumb || temple.image?.full;
                const hasImage = imageUrl && !brokenImages[temple.slug || index];
                const itemKey = temple._id ? `temple-${temple._id}` : `temple-${index}`;
                const targetId = temple._id || temple.slug;

                // 💡 Flag the first row of items (index 0-3) as above-the-fold content
                const isAboveTheFold = index < 4;

                return (
                  <Link 
                    href={`/temples/${targetId}`} 
                    key={itemKey}
                    className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md focus-within:ring-2 focus-within:ring-[#6E5611] focus-within:outline-none transition-shadow duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                        {hasImage ? (
                          <Image 
                            src={imageUrl} 
                            alt={temple.name || "Temple Illustration"}
                            fill
                            sizes="(max-w-640px) 100vw, (max-w-768px) 50vw, 300px"
                            quality={60}
                            priority={isAboveTheFold}
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            onError={() => setBrokenImages(prev => ({ ...prev, [temple.slug || index]: true }))}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 text-center">
                            <span className="text-3xl mb-1 text-[#6E5611]" aria-hidden="true">🏛️</span>
                            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-2 line-clamp-2">{temple.name}</p>
                          </div>
                        )}
                        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full z-10 ${
                          temple.status === 'Dedicated' ? 'bg-green-200 text-green-900' : 'bg-amber-200 text-amber-900'
                        }`}>
                          {temple.status}
                        </span>
                      </div>

                      <div className="p-5">
                        <h2 className="font-serif font-bold text-lg text-[#1A2530] line-clamp-1 group-hover:text-[#6E5611] transition-colors">
                          {temple.name}
                        </h2>
                        
                        <p className="text-xs text-amber-900 font-medium italic mt-3 pt-2 border-t border-gray-100 line-clamp-2">
                          💡 Fact: &quot;{temple.mostLikedFact || 'Explore historical community insights inside.'}&quot;
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <span className="inline-flex items-center text-sm font-medium text-[#6E5611] group-hover:underline">
                        View Journal & Details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-6 max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setPage(p => Math.max(p - 1, 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#6E5611] focus:outline-none transition-colors"
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-500 font-medium" aria-live="polite">
                Page <span className="text-gray-900 font-bold">{page}</span> of {totalPages}
              </span>

              <button
                onClick={() => {
                  setPage(p => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                disabled={page === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-[#6E5611] focus:outline-none transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
