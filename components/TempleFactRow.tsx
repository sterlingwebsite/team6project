// components/TempleFactRow.tsx
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

  const handleUpdate = async () => {
    if (!editingText.trim()) return;
    setBusy(true);
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
        alert('Unauthorized. You can only edit facts you created.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you certain you want to permanently erase this entry?')) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${fact._id}`, { method: 'DELETE' });
      if (res.ok) {
        await onRefresh();
      } else {
        alert('Unauthorized. You can only remove facts you created.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await fetch(`/api/temples/${templeId}/facts/${fact._id}/like`, { method: 'POST' });
      if (res.ok) await onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex items-start justify-between gap-6 transition-all hover:shadow-md">
      <div className="space-y-3 flex-grow w-full">
        {isEditing ? (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <input
              type="text"
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              disabled={busy}
              className="flex-grow px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#D4AF37]"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={handleUpdate} disabled={busy} className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 font-semibold shadow-sm">Save</button>
              <button onClick={() => setIsEditing(false)} disabled={busy} className="text-xs bg-zinc-100 text-zinc-600 px-3 py-2 rounded-lg hover:bg-zinc-200 font-semibold border border-zinc-200">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-zinc-600 text-sm leading-relaxed font-medium">"{fact.text}"</p>
        )}

        <div className="flex items-center gap-4 text-xs font-bold text-zinc-400 pt-1">
          <button onClick={handleLike} className="hover:text-amber-500 flex items-center gap-1 transition-colors bg-amber-50/50 px-2 py-1 rounded-md border border-amber-100/50">
            👍 <span className="text-zinc-700 font-bold">{fact.likesCount || 0}</span>
          </button>
          {!isEditing && (
            <>
              <button onClick={() => { setIsEditing(true); setEditingText(fact.text); }} className="hover:text-[#D4AF37] transition-colors">Edit</button>
              <button onClick={handleDelete} className="hover:text-red-500 transition-colors">Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
