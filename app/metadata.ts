// app/metadata.ts
import type { Metadata } from "next";

// Changed variable token target export name to metadata to comply with standard Next.js layout engine lookups
export const metadata: Metadata = {
  title: {
    default: 'Sacred Spaces | Temple Journal',
    template: '%s | Temple Journal'
  },
  description: 'Record spiritual insights, track personal milestones, and discover historical facts about temples.',
};
