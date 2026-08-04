// components/FactCard.tsx
'use client';

import { useState } from "react";
import Link from "next/link";

interface IUserFact {
  _id: string;
  templeId: string;
  templeName: string;
  text: string;
  likesCount: number;
  createdAt: string;
}

interface FactCardProps {
  fact: IUserFact;
  onUpdate: (factId: string, templeId: string, updatedText: string) => Promise<void>;
  onDelete: (factId: string, templeId: string) => Promise<void>;
}

export default function FactCard({ fact, onUpdate, onDelete }: FactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(fact.text);

  const handleSave = async () => {
    if (!editingText.trim()) return;
    await onUpdate(fact._id, fact.templeId, editingText.trim());
    setIsEditing(false);
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-xl shadow-sm space-y-4 transition-all hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between border-b border-zinc-100 pb-3 gap-2">
        <div className="flex items-center gap-1.5">
          <svg 
            className="w-5 h-5 text-[#54410D] shrink-0" 
            fill="currentColor" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path d="M12 2L2 7v2h20V7L12 2zm1 14h3v3h-3v-3zm-5 0h3v3H8v-3zm11 3v-3h2v3h-2zM4 16v-3h2v3H4zm4-5h2v3H8v-3zm5 0h3v3h-3v-3zM2 22h20v2H2v-2z" />
          </svg>
          
          <Link 
            href={`/temples/${fact.templeId}`}
            className="font-serif font-bold text-base text-[#1A2530] hover:text-[#54410D] transition-all hover:underline focus:ring-2 focus:ring-[#54410D] rounded p-0.5"
          >
            {fact.templeName || 'View Temple Details'}
          </Link>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-zinc-600">
          <span>👍 {fact.likesCount || 0} Peer Votes</span>
          <span>• Added {new Date(fact.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium', timeZone: 'UTC' })}</span>
        </div>
      </div>

      <div>
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full pt-1">
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#54410D] focus:border-[#54410D] focus:outline-none"
            />
            <div className="flex gap-2 justify-end">
              <button 
                onClick={handleSave}
                className="text-xs bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-700 font-semibold shadow-sm"
              >
                Save
              </button>
              <button 
                onClick={() => { setIsEditing(false); setEditingText(fact.text); }}
                className="text-xs bg-zinc-100 text-zinc-700 px-3 py-2 rounded-lg hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-600 font-semibold border border-zinc-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-1">
            <p className="text-zinc-700 text-sm leading-relaxed max-w-2xl">
              &quot;{fact.text}&quot;
            </p>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-700 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1A2530]"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(fact._id, fact.templeId)}
                className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-800 bg-red-50 hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
