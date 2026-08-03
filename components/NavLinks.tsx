// components\NavLinks.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLinks() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/temples', label: 'Temples' },
    { href: '/journal', label: 'Journal' },
    { href: '/facts', label: 'My Facts' }
  ];

  return (
    <nav className="flex items-center gap-6" aria-label="Main Application Navigation">
      {links.map((link) => {
        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-[#7C6214] rounded px-1.5 py-0.5 ${
              isActive 
                ? 'text-[#7C6214] border-b-2 border-[#7C6214]' 
                : 'text-zinc-700 hover:text-[#7C6214]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
