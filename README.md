# 🏛️ Temple Journal & Facts Vault

A full-stack, responsive Next.js application designed to record temple attendance, capture personal spiritual insights, and highlight core temple facts through an interactive community logging and ranking platform.

**Production Live Deployment:** [https://team6project.vercel.app/](https://team6project.vercel.app/)

---

## 👥 Team 6 Engineering Roster
* **Brayden Joshua Wayman**
* **Brigham Young Iga**
* **David Okocha**
* **Rowland Momoh**
* **Sterling Steele**

---

## 🔑 Evaluator Access & Test Credentials
To assist with grading, use the following pre-configured credentials to bypass manual registration checks and inspect core authenticated CRUD workflows:

* **Authentication Protocol:** Auth.js v5 (NextAuth) Credentials Provider
* **Test Username / Email:** `sterling@example.com`
* **Test Profile Password:** `password123`

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

Our project uses the **Next.js App Router** architecture integrated with raw **MongoDB collections** to perform optimized full-stack network request lifecycles.

### 1. Journal Records Pipeline (`/api/journal`)
* **`GET`**: Validates the active server authentication token session and pulls all personal journal logs associated with the signed-in profile matching individual data objects.
* **`POST`**: Validates client-side data fields dynamically against backend schemas and inserts a new journal entry linked to a valid temple record layout object identifier.
* **`DELETE`**: Accepts a specific `?id=` payload parameter string, confirms user ownership permissions, and deletes the targeting log record from the active collection bucket.

### 2. Temple Data Node Sync (`/api/temples`)
* **`GET`**: Yields a complete array overview containing active global temple listings (names, structural locations) utilized to seed form selectors inside client engines.

---

## ⚠️ Known Platform Issues & Strategic Opportunities

### 1. Verification of Server-Side Time Zone Configurations
* **Issue Log:** The application converts local date inputs using standardized ISO string patterns. Depending on the time zone footprint of the evaluation engine, submissions attempted late in the evening might create minor validation warnings flagging local records as being in the future.
* **Mitigation Strategy:** Local evaluation algorithms have been deployed inside form components to process localized year, month, and day calculations dynamically, balancing accuracy between client browsers and backend databases.

### 2. Contrast Enhancement for High-Visibility Interactions
* **Issue Log:** Standard implementation choices featuring light gold color values (`#D4AF37`) fail automated WCAG contrast checks when placed over white panel boards.
* **Mitigation Strategy:** Interactive labels, focus layout boundaries, and navigational anchor paths across critical views have been shifted to deep slate anchors (`#1A2530`) or darkened gold tints (`#9A7B1C`) to guarantee full WCAG AA accessibility approval.
* **External Image Compression Constraints**: The platform achieved an excellent 95/100 mobile performance rating. The remaining image optimization warnings stem from the authoritative third-party `templedb.org` API asset proxy ignoring local url query width adjustments and serving static uncompressed source imagery.