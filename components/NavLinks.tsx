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
    <div className="flex items-center gap-6">
      {links.map((link) => {
        const isActive = pathname === link.href || (link.href !== '/journal' && pathname.startsWith(link.href));
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium flex items-center gap-1.5 transition-colors pb-1 border-b-2 ${
              isActive
                ? 'text-[#D4AF37] border-[#D4AF37]'
                : 'text-gray-600 border-transparent hover:text-[#D4AF37]'
            }`}
          >
            <span>{link.icon}</span>
            <span>{link.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
