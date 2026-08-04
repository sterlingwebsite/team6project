# 🏛️ Temple Journal & Facts Vault

A full-stack, highly accessible, and performance-optimized Next.js application designed to record temple attendance, safeguard personal spiritual reflections, and explore community crowdsourced historical facts.

**Production Live Deployment:** [https://team6project.vercel.app/](https://team6project.vercel.app/)

---

## 👥 Team 6 Engineering Roster

- **Brayden Joshua Wayman**
- **Brigham Young Iga**
- **David Okocha**
- **Rowland Momoh**
- **Sterling Steele**

---

## 🔑 Evaluator Access & Test Credentials

To assist with grading, use the following pre-configured credentials to bypass manual registration checks and inspect core authenticated CRUD workflows:

- **Authentication Protocol:** Auth.js v5 (NextAuth) Credentials Provider
- **Test Username / Email:** `any@example.com` (any correct email will do)
- **Test Profile Password:** `password123` (any password will do)

* email and password are saved

---

## 🚀 Local Installation & Environmental Configuration

### 1. Clone the Workspace Repository

```bash
git clone https://github.com
cd team6project
```

### 2. Populate Local Environment Keys

Create an `.env.local` configuration file right inside your root workspace root folder and populate these parameters:

```env
MONGODB_URI="your_mongodb_atlas_connection_string"
MONGODB_DB="temple_journal_db"
NEXTAUTH_SECRET="generate_a_random_32_character_hash_string"
```

### 3. Install Module Dependencies & Fire the Engine

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) inside your web browser to test your local deployment portal.

---

## 🛠️ System Architecture & Full-Stack API Specifications

Our project uses the **Next.js App Router** architecture integrated with **MongoDB Atlas** and decoupled, client-side sub-components to maximize information density, isolate system states, and ensure snappy execution lifecycles.

### 1. Journal Records Pipeline (`/api/journal`)

- **`GET`**: Validates the active server authentication token session and pulls all personal journal logs associated with the signed-in profile matching individual data objects.
- **`POST`**: Validates client-side data fields dynamically against backend schemas and inserts a new journal entry linked to a valid temple record layout object identifier.
- **`DELETE`**: Accepts a specific `?id=` payload parameter string, confirms user ownership privileges, and deletes the targeting log record from the active collection bucket.

### 2. Temple Data Node Sync (`/api/temples`)

- **`GET`**: Yields a complete array overview containing active global temple listings (names, structural locations) utilized to seed form selectors inside client engines. Supports pagination search filtering parameters (`?page=1&search=`) to maintain zero layout shifting.

### 3. Crowdsourced Facts Routing (`/api/temples/[templeId]/facts/[factId]`)

- **`PUT` / `DELETE`**: Manages interactive individual fact mutations safely. Verifies database ownership permissions to allow community contributors to cleanly modify or remove entries.

---

## 🏆 Production Performance & High-Visibility Accessibility Audits

The platform was systematically audited using Chrome DevTools Lighthouse and the CSS Overview engine to guarantee best-in-class performance and structural inclusivity.

### 1. Advanced Image Optimization & LCP Performance (Score: 99-100%)

- **Challenge:** The application consumes crowdsourced imagery hosted externally by `templedb.org`. Initial audits flagged uncompressed, multi-megabyte payloads that stalled Largest Contentful Paint (LCP) speeds.
- **Solution:** Replaced raw `<img>` tags with the native Next.js `<Image />` component. By defining custom `remotePatterns` and optimized viewport layout bounds (`sizes="(max-w-640px) 100vw, 350px"`), we forced the backend to crop and deliver quality-compressed (`quality={60}`) **WebP/AVIF** slices. This dropped image weights from **1.8 MB to under 20 KB**, securing an exceptional performance baseline.
- **Resource Hinting:** Removed manual global preconnect links to prevent unrequested origin alerts on the landing page. Implemented route-specific dynamic preconnecting inside `app/temples/layout.tsx` to accelerate asset delivery only when required. Top-row cards use the `priority` attribute to ensure instant above-the-fold image loads.

### 2. Enhanced Semantic Hierarchy & Keyboard Navigation

- **Challenge:** Early UI layout frames featured mismatched heading sequences (`<h1>` skipping straight to `<h3>` or `<h4>` cells), creating document mapping friction for screen readers.
- **Solution:** Standardized all application views (Dashboard, Directory, and Logs) to follow a sequentially descending order (`<h1>` → `<h2>` → `<h3>`). Form buttons dynamically use `disabled:hover` blocks to visually convey non-interactive states while maintaining proper focus ring trapping.

### 3. WCAG AA / AAA Color Contrast Compliance

- **Challenge:** Standard brand identities featuring light gold colors fail color contrast analysis math when sitting on top of light panels or white form backgrounds. Emojis also cause platform-specific contrast tracking failures.
- **Solution:** All interactive text strings, button focus rings, active layout navigation anchors, and status badges were shifted to an ultra-high-contrast deep gold hue (**`#54410D`**), crossing the strict **WCAG AAA 7:1 contrast ratio threshold**. Raw system text emojis were replaced with crisp, semantic SVG vectors that scale and map safely against automated color analyzer tools.
