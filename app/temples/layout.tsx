// app/temples/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  other: {
    "preconnect": "https://templedb.org", 
  }
};

export default function TemplesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
