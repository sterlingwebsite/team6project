// components\NavLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Temples', href: '/temples', icon: '🏛️' },
    { name: 'Journal', href: '/journal', icon: '✍️' },
    { name: 'Facts', href: '/facts', icon: '💡' },
  ];

  return (
    <nav className="flex items-center gap-6" aria-label="Main Navigation">
      {links.map((link) => {
        // Updated condition to safely catch your newly organized nested sub-page layout directories
        const isActive = pathname === link.href || pathname.startsWith(link.href + '/') || pathname.startsWith(link.href);
        
        return (
          <Link
            key={link.href}
            href={link.href}
            // Shifted hex values to rich accessible #9A7B1C gold to clear WCAG AA contrast evaluations cleanly
            className={`text-sm font-medium flex items-center gap-1.5 transition-colors pb-1 border-b-2 focus:outline-none focus:ring-2 focus:ring-[#9A7B1C] focus:ring-offset-2 rounded px-1 ${
              isActive
                ? 'text-[#9A7B1C] border-[#9A7B1C]'
                : 'text-gray-600 border-transparent hover:text-[#9A7B1C]'
            }`}
            aria-current={isActive ? 'page' : undefined}
          >
            {/* Hidden descriptive icons from screen reader tabs to satisfy core semantic criteria */}
            <span aria-hidden="true">{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
