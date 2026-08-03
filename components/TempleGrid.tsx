// components\TempleGrid.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ITemple } from '../utils/templeHelpers';

interface IPaginatedTemple extends ITemple {
  _id: string;
}

interface TempleGridProps {
  initialTemples: IPaginatedTemple[];
}

export default function TempleGrid({ initialTemples }: TempleGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredTemples = (initialTemples || []).filter(temple => 
    temple.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    temple.country?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (temple.state && temple.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
    temple.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 max-w-md">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search by Temple Name, City, or Country
        </label>
        <input
          id="search"
          type="text"
          placeholder="e.g., Aba Nigeria, Salt Lake..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none text-gray-900 bg-white"
        />
        <p className="text-xs text-gray-400 mt-1" aria-live="polite">
          Showing {filteredTemples.length} of {initialTemples.length} records matching criteria
        </p>
      </div>

      {filteredTemples.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium">No temples found matching your search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemples.map((temple, index) => {
            const imageUrl = temple.image?.thumb || temple.image?.full;
            const isImageBroken = brokenImages[temple.slug || index];
            const hasImage = imageUrl && !isImageBroken;
            
            const targetId = temple._id || temple.slug || index;

            return (
              <Link 
                href={`/temples/${targetId}`} 
                key={temple.slug ? `${temple.slug}-${index}` : `grid-${index}`}
                className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md focus-within:ring-2 focus-within:ring-[#9A7B1C] focus-within:outline-none transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-gray-50 overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                      <img 
                        src={imageUrl} 
                        alt={temple.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={() => setBrokenImages(prev => ({ ...prev, [temple.slug || index]: true }))}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gray-50 text-center">
                        <span className="text-3xl mb-1 text-[#9A7B1C]" aria-hidden="true">🏛️</span>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 line-clamp-2">{temple.name}</p>
                      </div>
                    )}
                    
                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                      temple.status === 'Dedicated' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {temple.status}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-lg text-[#1A2530] line-clamp-1 group-hover:text-[#9A7B1C] transition-colors">
                      {temple.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {temple.city}{temple.state ? `, ${temple.state}` : ''}, {temple.country}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <span className="inline-flex items-center text-sm font-medium text-[#9A7B1C] group-hover:underline">
                    View Journal & Details →
                  </span>
                </div>
              </Link>
            );
          })}

        </div>
      )}
    </div>
  );
}
