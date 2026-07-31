'use client';

import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPublicRoute = 
    pathname === "/" || 
    pathname?.startsWith("/auth/");

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#FAFAFA] text-[#1A2530] flex flex-col font-sans">
        {!isPublicRoute && <Header />}
        
        <div className="flex-grow flex flex-col w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
