// components/TempleCombobox.tsx
"use client";

import { useState, useEffect, useRef } from "react";

type Temple = {
  _id: string;
  name: string;
  location: string;
};

interface TempleComboboxProps {
  temples: Temple[];
  status: "loading" | "ready" | "error";
  onSelect: (id: string) => void;
  hasError: boolean;
}

export function TempleCombobox({ temples, status, onSelect, hasError }: TempleComboboxProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {status === "error" ? (
        <p className="text-sm text-[#C62828]" role="alert">
          Couldn&apos;t load the temple list. Please try again later.
        </p>
      ) : (
        <div className="relative">
          <input
            id="templeSearch"
            type="text"
            placeholder={status === "loading" ? "Loading temples..." : "Type to filter e.g., Salt Lake, Aba..."}
            value={searchQuery}
            disabled={status === "loading"}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              onSelect("");
              setIsOpen(true);
            }}
            aria-invalid={hasError}
            aria-describedby={hasError ? "templeId-error" : undefined}
            className="w-full rounded-lg border border-zinc-300 bg-white text-[#1A2530] px-4 py-2.5 text-sm focus:border-[#9A7B1C] focus:ring-2 focus:ring-[#9A7B1C] focus:outline-none"
          />
          
          {isOpen && status === "ready" && (
            <ul className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg divide-y divide-zinc-50">
              {filteredTemples.length === 0 ? (
                <li className="px-4 py-3 text-sm text-zinc-500 italic">No temples match your search terms</li>
              ) : (
                filteredTemples.map((temple) => (
                  <li key={temple._id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelect(temple._id);
                        setSearchQuery(temple.name);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#1A2530] hover:bg-zinc-50 transition-colors focus:bg-zinc-50 focus:outline-none"
                    >
                      {temple.name}
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
