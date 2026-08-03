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
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorAlert(null);
    if (!newFactText.trim()) return;

    if (newFactText.trim().length < 5) {
      setErrorAlert("Fact description details must contain at least 5 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/temples/${templeId}/facts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newFactText.trim() })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setNewFactText('');
        await onSuccess();
      } else {
        setErrorAlert(data.error || 'Failed to register fact. Please check your session state.');
      }
    } catch (err) {
      console.error(err);
      setErrorAlert('Network transmission failure. Please check your connectivity and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4" aria-label="Contribute Historical Insight Form">
      <h2 className="text-xs font-bold text-[#1A2530] uppercase tracking-wider">Contribute Historical Fact</h2>
      
      <div aria-live="assertive">
        {errorAlert && (
          <p className="text-xs text-[#C62828] font-semibold bg-red-50 p-2.5 border border-red-200 rounded-lg">
            ⚠️ {errorAlert}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newFactText" className="sr-only">Historical Fact Description</label>
        <input
          id="newFactText"
          type="text"
          placeholder="e.g., This house of the Lord stands on a historic hill site..."
          value={newFactText}
          onChange={(e) => setNewFactText(e.target.value)}
          disabled={submitting}
          className="flex-grow px-4 py-2.5 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none transition-all disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !newFactText.trim()}
          className="bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] font-semibold px-6 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
        >
          {submitting ? "Submitting..." : "Submit Fact"}
        </button>
      </form>
    </section>
  );
}
