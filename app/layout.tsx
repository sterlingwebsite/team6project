// app/layout.tsx
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import "./globals.css";
import { metadata } from "./metadata";
export { metadata };

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const playfairDisplay = Playfair_Display({ variable: "--font-playfair-display", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#FAFAFA] text-[#1A2530] flex flex-col font-sans">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-grow flex flex-col w-full">
            {children}
          </main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
