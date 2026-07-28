import { Metadata } from 'next';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: 'Sacred Spaces | Temple Journal',
    template: '%s | Temple Journal'
  },
  description: 'Record spiritual insights, track personal milestones, and discover historical facts about temples.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
