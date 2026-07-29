# GitHub Copilot Custom Instructions: Temples Journal App

## 📦 Tech Stack & Core Architecture
- **Framework**: Next.js 15 (App Router, Server Components by default).
- **Language**: TypeScript (Strict mode, explicit types, absolutely no `any`).
- **Styling**: Tailwind CSS (Utility-first classes, layout spacing tokens, zero custom CSS files).
- **Database**: MongoDB (Native Node.js driver, no Prisma ORM, no SQL migrations).

## 🗄️ Database & Native Driver Patterns
- All active database operations MUST import and chain the global cached utility instance:
  ```ts
  import clientPromise from "@/lib/mongodb";
  ```
- Inline example for standard Route Handler generation scripts:
  ```ts
  const client = await clientPromise;
  const db = client.db("templeJournal");
  const collection = db.collection("entries");
  ```

## 🔌 API Route Handlers (`/app/api/.../route.ts`)
- Always validate input, utilize `async/await`, and return standard `Response.json()`.
- **GET Layout**:
  ```ts
  export async function GET() {
    const db = (await clientPromise).db("templeJournal");
    const entries = await db.collection("entries").find().toArray();
    return Response.json(entries);
  }
  ```
- **POST Layout**:
  ```ts
  export async function POST(req: Request) {
    const data = await req.json();
    const db = (await clientPromise).db("templeJournal");
    const result = await db.collection("entries").insertOne(data);
    return Response.json({ insertedId: result.insertedId });
  }
  ```

## 🧱 TypeScript Data Model Schemas
- **JournalEntry Representation**:
  ```ts
  export interface JournalEntry {
    _id?: string;
    userId?: string;
    templeId: string;
    visitDate: string;
    insights: string;
    createdAt?: string;
  }
  ```

## 🔐 Authentication Patterns (Updated Week 05)
- App uses **NextAuth.js** powered by a standalone **Credentials Provider** strategy.
- Sessions explicitly utilize JSON Web Tokens (`strategy: "jwt"`).
- Never generate or associate a structural database adapter instance inside the main route engine configuration file.
- Enforce protected endpoint checks using `getServerSession` within server side configurations.

## 📈 Metadata and Discoverability Rules (Updated Week 05)
- Always include structured Next.js 15 `Metadata` export configurations in root layouts and distinct page layout files.
- Enforce clean fallback patterns using descriptive titles and short Open Graph summary definitions.

## 📁 Repository Directory Rules
- **Pages/Routing**: `/app/journal`, `/app/journal/new`, `/app/journal/[id]`, `/app/temples`.
- **Global Context Layouts**: Shared view modules are located inside `/components/` (e.g., `Header.tsx`, `JournalEntryCard.tsx`).
- **Utilities / Types**: Base driver connection configurations reside in `/lib/mongodb.ts`.

## 🎨 Component Development Conventions
- **Naming Metrics**: PascalCase for React component definitions, camelCase for local helper functions.
- **Interactivity Intercept**: Append `'use client'` only to files utilizing state hooks, event listeners, or forms.

## 🚫 Explicit Code Generation Restrictions
- DO NOT inject `PrismaClient`, `schema.prisma`, or Knex migration dependencies.
- DO NOT create structural boilerplate scripts using legacy Pages directory routing (`/pages/api`).
- DO NOT author application components in vanilla JavaScript; enforce TypeScript.
