// components/CreateFactForm.tsx
'use client';

import { useState } from 'react';

interface CreateFactFormProps {
  templeId: string;
  onSuccess: () => Promise<void>;
}

export default function CreateFactForm({ templeId, onSuccess }: CreateFactFormProps) {
  const [newFactText, setNewFactText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        setNewFactText('');
        await onSuccess();
      } else {
        alert('Failed to register fact. Please check your session state.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4">
      <h3 className="text-xs font-bold text-[#1A2530] uppercase tracking-wider">Contribute Historical Fact</h3>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="e.g., This house of the Lord stands on a historic hill site..."
          value={newFactText}
          onChange={(e) => setNewFactText(e.target.value)}
          disabled={submitting}
          className="flex-grow px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !newFactText.trim()}
          className="bg-[#D4AF37] text-white hover:bg-[#bfa032] font-semibold px-6 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 shadow-sm whitespace-nowrap"
        >
          Submit Fact
        </button>
      </form>
    </section>
  );
}
