'use client';

import { useEffect, useState } from 'react';

export default function TestDataPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function testImageUrls() {
      try {
        const res = await fetch('/api/temples');
        if (!res.ok) throw new Error("Local API endpoint failed");
        const temples = await res.json();

        const sampleSize = temples.slice(0, 3);
        const testRuns = [];

        for (const temple of sampleSize) {
          const fileName = temple.image ? temple.image : temple.slug + "-main.jpg";
          
          const baseHost = "https://templedb.org";
          const urlOptionA = new URL(fileName, baseHost).href;
          const urlOptionB = new URL("images/" + fileName, baseHost).href;

          const statusA = await fetch(urlOptionA, { method: 'HEAD' }).then(r => r.status).catch(() => 'FETCH_ERROR');
          const statusB = await fetch(urlOptionB, { method: 'HEAD' }).then(r => r.status).catch(() => 'FETCH_ERROR');

          testRuns.push({
            name: temple.name,
            slug: temple.slug,
            localApiImageField: temple.image ? temple.image : "MISSING",
            testUrlA: { url: urlOptionA, responseStatus: statusA },
            testUrlB: { url: urlOptionB, responseStatus: statusB }
          });
        }
        setResults(testRuns);
      } catch (err) {
        console.error("Diagnostic test runner failed:", err);
      } finally {
        setLoading(false);
      }
    }
    testImageUrls();
  }, []);

  if (loading) return <p className="p-8 font-mono text-yellow-500 animate-pulse">Running live network image checks...</p>;

  return (
    <div className="p-8 font-mono bg-gray-900 text-green-400 min-h-screen">
      <h1 className="text-xl font-bold mb-4 text-white">📡 Live Network Image URL Diagnostics</h1>
      <p className="mb-4 text-gray-300">Testing image path availability on the remote server:</p>

      {results.map((run, i) => (
        <div key={i} className="mb-6 p-4 border border-gray-700 bg-gray-950 rounded">
          <h2 className="text-yellow-400 font-bold text-base mb-2">🏛️ {run.name}</h2>
          <p className="text-xs text-gray-400 mb-2">Slug: {run.slug} | Field value from API: "{run.localApiImageField}"</p>
          
          <div className="ml-4 mb-3">
            <span className="text-white font-semibold text-sm">Test URL Path A (Root Directory):</span>
            <pre className="text-xs mt-1 p-2 rounded bg-gray-900 text-white">
              URL: {run.testUrlA.url}&#10;
              HTTP Status: {run.testUrlA.responseStatus}
            </pre>
          </div>

          <div className="ml-4">
            <span className="text-white font-semibold text-sm">Test URL Path B (/images/ Directory):</span>
            <pre className="text-xs mt-1 p-2 rounded bg-gray-900 text-white">
              URL: {run.testUrlB.url}&#10;
              HTTP Status: {run.testUrlB.responseStatus}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
