// components\TempleFactRow.tsx
'use client';

import { useState } from 'react';

interface TempleFact {
  _id: string;
  text: string;
  likesCount: number;
}

interface TempleFactRowProps {
  fact: TempleFact;
  templeId: string;
  onRefresh: () => Promise<void>;
}

export default function TempleFactRow({ fact, templeId, onRefresh }: TempleFactRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingText, setEditingText] = useState(fact.text);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!editingText.trim()) return;
    setBusy(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${fact._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingText.trim() })
      });
      if (res.ok) {
        setIsEditing(false);
        await onRefresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        setActionError(errData.message || 'Unauthorized. You can only edit facts you created.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Network transmission failure. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you certain you want to permanently erase this entry?')) return;
    setBusy(true);
    setActionError(null);
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${fact._id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefresh();
      } else {
        const errData = await res.json().catch(() => ({}));
        setActionError(errData.message || 'Unauthorized. You can only remove facts you created.');
      }
    } catch (err) {
      console.error(err);
      setActionError('Network transmission failure. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleLike = async () => {
    setActionError(null);
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${fact._id}/like`, { method: 'POST' });
      if (res.ok) await onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col gap-3 transition-all hover:shadow-md">
      <div aria-live="assertive">
        {actionError && (
          <p className="text-xs text-[#C62828] font-semibold bg-red-50 p-2.5 border border-red-200 rounded-lg w-full mb-1">
            ⚠️ {actionError}
          </p>
        )}
      </div>

      <div className="flex items-start justify-between gap-6 w-full">
        <div className="space-y-3 flex-grow w-full">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <input
                type="text"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                disabled={busy}
                className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none"
              />
              <div className="flex gap-2 justify-end">
                <button onClick={handleUpdate} disabled={busy} className="text-xs bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800 focus:ring-2 focus:ring-green-700 font-semibold shadow-sm">Save</button>
                <button onClick={() => { setIsEditing(false); setActionError(null); }} disabled={busy} className="text-xs bg-zinc-100 text-zinc-600 px-3 py-2 rounded-lg hover:bg-zinc-200 focus:ring-2 focus:ring-zinc-400 font-semibold border border-zinc-200">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="text-zinc-600 text-sm leading-relaxed font-medium">"{fact.text}"</p>
          )}

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100">
            <button 
              onClick={handleLike} 
              className="hover:bg-zinc-200 focus:ring-2 focus:ring-[#9A7B1C] focus:outline-none flex items-center gap-1.5 transition-colors bg-zinc-100 px-3 py-1.5 rounded-md text-zinc-700 font-semibold border border-zinc-200 text-xs shadow-sm"
              aria-label={`Mark as helpful. Current votes: ${fact.likesCount || 0}`}
            >
              <span aria-hidden="true">👍</span> <span>{fact.likesCount || 0}</span>
            </button>
            
            {!isEditing && (
              <>
                <button 
                  onClick={() => { setIsEditing(true); setEditingText(fact.text); setActionError(null); }} 
                  className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-md text-zinc-600 bg-zinc-50 hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-[#1A2530]"
                >
                  Edit
                </button>
                
                <button 
                  onClick={handleDelete} 
                  className="text-xs font-semibold px-3 py-1.5 border border-transparent rounded-md text-red-600 bg-red-50 hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
