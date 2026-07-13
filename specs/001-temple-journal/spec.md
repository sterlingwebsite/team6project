# Feature Specification: Church of Jesus Christ Temples Journal App

**Feature Branch**: `001-temple-journal`  
**Created**: 2026-07-02  
**Status**: Ready for Implementation  
**Input**: User description: Create a project specification for a Church of Jesus Christ Temples Journal app which will log and display the temple attendance of registered users, along with their spiritual insights and interesting temple facts. It will also include a ranking system where users can "like" specific temple facts to highlight them on a temple details page. Include: a project title and description, the purpose and target audience, user stories for core workflows (sign up, create, read, update, delete), acceptance criteria for each story, API endpoints, and implementation priority.

## Project Title

Church of Jesus Christ Temples Journal

## Project Description

A community-focused journal app for members of The Church of Jesus Christ of Latter-day Saints to record temple attendance, capture spiritual insights, and explore interesting temple facts. The app helps users build a meaningful history of temple service while allowing them to engage with temple content through a simple fact-ranking experience.

## Purpose

The app exists to help users remember and reflect on their temple experiences, strengthen personal spiritual habits, and share meaningful temple-related insights with a supportive community. It also helps highlight the most appreciated temple facts for others to discover.

## Target Audience

- Registered Church members who attend the temple regularly
- Members who want a personal record of temple service and reflections
- Users who enjoy learning temple history, facts, and spiritual insights
- Families or individuals who want a simple way to track meaningful worship experiences

## User Scenarios & Testing

### User Story 1 - Sign Up and Access the App (Priority: P1)

A new user can create an account and sign in to begin using the journal.

**Why this priority**: Account creation is the entry point for all personal records and community interactions.

**Independent Test**: A new user can register, verify their account, and access the dashboard without assistance.

**Acceptance Scenarios**:

1. **Given** a visitor is on the sign-up page, **When** they submit a valid registration form, **Then** an account is created and they are signed in.
2. **Given** a user enters invalid sign-up information, **When** they submit the form, **Then** they receive clear validation feedback and the account is not created.

---

### User Story 2 - Create Temple Journal Entries (Priority: P1)

A registered user can create a journal entry for a temple visit with attendance details and personal insights.

**Why this priority**: Entry creation is the core value of the app and enables the journal experience.

**Independent Test**: A user can create one complete entry that is saved and shown in their journal history.

**Acceptance Scenarios**:

1. **Given** a signed-in user is on the new entry form, **When** they enter temple information, date, and spiritual insights, **Then** the entry is saved to their account.
2. **Given** a user leaves required fields empty, **When** they try to save the entry, **Then** the app prevents submission and explains what is missing.

---

### User Story 3 - Read and Review Temple Entries (Priority: P1)

A user can view their temple journal entries and review past temple attendance and reflections.

**Why this priority**: Reading and reviewing prior records is essential for personal reflection and ongoing use.

**Independent Test**: A user can open their journal and see their saved entries in a readable list or detail view.

**Acceptance Scenarios**:

1. **Given** a user has existing journal entries, **When** they open their journal, **Then** they can see those entries ordered by date or recency.
2. **Given** a user opens one entry, **When** they view the details, **Then** they can read the attendance information and spiritual insights.

---

### User Story 4 - Update and Delete Journal Entries (Priority: P2)

A user can edit or remove their own entries when details change or a record should be deleted.

**Why this priority**: Being able to maintain personal records improves trust and long-term usability.

**Independent Test**: A user can update an entry’s details or delete it without affecting other users’ records.

**Acceptance Scenarios**:

1. **Given** a user owns an existing entry, **When** they submit edits to the entry, **Then** the updated content is saved and displayed.
2. **Given** a user chooses to delete an entry, **When** they confirm the action, **Then** the entry is removed from their journal and no longer appears in the app.

---

### User Story 5 - View Temple Facts and Like Popular Facts (Priority: P2)

A user can browse temple facts and like the facts they find meaningful, which helps surface the most appreciated content on a temple details page.

**Why this priority**: The ranking feature adds community value and makes the app more engaging.

**Independent Test**: A signed-in user can view temple facts and increase the ranking of a fact by liking it.

**Acceptance Scenarios**:

1. **Given** a user is viewing a temple details page, **When** they select a fact and like it, **Then** the fact’s like count increases.
2. **Given** multiple liked facts, **When** the page is displayed, **Then** the highest-ranked facts are shown more prominently.

## Resolution of Edge Cases

- **Missing Required Information**: Frontend validations block submission. The backend API drops incomplete payloads with a `400 Bad Request` status code indicating the specific missing columns.
- **Duplicate Likes**: A structural unique constraint on the database level prevents a `userId` from attaching more than one `Like` record to a specific `factId`. Attempting a double-like safely returns a `200 OK` but toggles the like off (unlike behavior) or returns a `409 Conflict`.
- **Unauthorized Cross-User Data Access**: The server strictly validates token sessions. If a user queries `/api/journal/[id]` for a resource owned by another user ID, the backend acts as a shield, responding with a `403 Forbidden` status.

## Requirements

### Functional Requirements

- **FR-001**: The system MUST allow new users to register for an account with valid identifying information.
- **FR-002**: The system MUST allow registered users to sign in and sign out securely.
- **FR-003**: The system MUST allow users to create temple attendance journal entries with date, temple, and spiritual insight details.
- **FR-004**: The system MUST allow users to view their own temple journal entries in a readable format.
- **FR-005**: The system MUST allow users to update their own journal entries.
- **FR-006**: The system MUST allow users to delete their own journal entries.
- **FR-007**: The system MUST allow users to view temple facts associated with a temple details page.
- **FR-008**: The system MUST allow users to like temple facts, and the app MUST record the like count for each fact.
- **FR-009**: The system MUST display the most-liked temple facts prominently on the relevant temple details page.
- **FR-010**: The system MUST prevent users from modifying or viewing entries that do not belong to them.

### API Endpoints

- **POST /api/auth/register** - Create a new user account profile.
- **POST /api/auth/callback** - Authenticate sessions and handle sign-in/sign-out events.
- **GET /api/journal** - Retrieve the active user's personal journal history.
- **POST /api/journal** - Create a new personal temple journal entry.
- **GET /api/journal/[id]** - Retrieve a single, specific journal entry.
- **PUT /api/journal/[id]** - Update an existing journal entry.
- **DELETE /api/journal/[id]** - Delete a specific journal entry.
- **GET /api/temples/[templeId]/facts** - Retrieve crowdsourced facts for a specific temple.
- **POST /api/temples/[templeId]/facts/[factId]/like** - Increment and record a user like for a target fact.

### Key Entities & Relations

- **User**: A registered person who holds an account, authenticates, owns personal journal entries, and likes public facts.
- **JournalEntry**: A private, user-created record tracking attendance date, temple ID, and personal spiritual insights. (Belongs to one `User`).
- **TempleFact**: A public, historical temple-related fact linked to a specific temple ID. (Can have many `Likes`).
- **Like**: A tracking entity mapping a specific `User ID` to a specific `TempleFact ID` ensuring a single unique vote per user per fact.

## UI Navigation & Component Architecture

### Navigation Layout Tabs

- **Dashboard** - Shows user information alongside direct dashboard preview links to the user's primary historical database records.
- **Temples** - Shows a complete, searchable directory overview list populated with separate cards for individual global temples.
- **Entries** - Shows a full, searchable history list tracking personal attendance records with explicit triggers for new logs.
- **Facts** - Shows an compiled timeline view of historical milestones interacted with by the active session account.

### Detailed Tab Specifications

- **Dashboard** View - Renders a personalized user profile context window directly adjacent to short preview lists of top recent history.
- **Temples** View - Serves a master grid panel mapping out cards for every active temple, containing full search box query filtering.
- **Entries** View - Generates a targeted vertical list layout grouping personal user entries, offering full text search and a creation entry point.
- **Facts** View - Compiles a global feed sorting user-tied insights by recency, supporting keyword text searching alongside state category switches.

### Tab Component Mapping

- **Dashboard** Components - Contains UserInformation, JournalEntryCard(limit=3), and TempleFactCard(limit=3) modules.
- **Temples** Components - Contains Search, TempleCard, and the administrative restriction flag switch module CreateNewTemple.
- **Entries** Components - Contains Search, JournalEntryCard, and the template routing control anchor CreateNewJournalEntry.
- **Facts** Components - Contains Search, TempleFactCard, and the navigation interceptor module CreateNewTempleFact.

### Individual Component Definitions

- **UserInformation** - Displays current session profile data fields alongside a modal portal trigger for secure runtime credential updates.
- **Search** - Houses a clean text-matching data input component targeting state property values to drop mismatched objects.
- **TempleCard** - Embeds a cloud-stored location display image alongside basic geography fields and the highest-rated database quote entry.
- **JournalEntryCard** - Renders a clear creation log date string, a clipped insight text paragraph string, and associated fact tags.
- **TempleFactCard** - Pairs a localized temple icon silhouette profile frame with raw historical text and real-time community engagement counters.
- **CreateNewJournalEntry** - Handles interactive multi-field form fields that serialize and structure draft variables into clean JSON payloads.
- **CreateNewTempleFact** - Intercepts global workflows by shifting the active tab back to the temple directory to pick a reference target.

## Frontend Routes & Pages (MVP)

### Public / Authentication Routes

- `/` - Home / Landing page welcoming users to the journal.
- `/auth/signup` - User registration form.
- `/auth/login` - Secure user sign-in portal.

### Private Journal Routes (Authenticated Users Only)

- `/journal` - User dashboard displaying personal entry history.
- `/journal/new` - Form to create a new journal entry.
- `/journal/[id]` - Read-only view of a specific journal entry.
- `/journal/[id]/edit` - Form to update or delete an existing entry.

### Community & Temple Directory Routes

- `/temples` - Public directory listing all available temples.
- `/temples/[templeId]` - Detailed view of a temple, its facts, and interactive "like" actions.
- `/temples/[templeId]/edit` - Form to modify temple info (Admin restriction).
- `/temples/[templeId]/facts/new` - Form for logged-in users to submit a new fact.
- `/temples/[templeId]/facts/[factId]/edit` - Form to edit a fact (Creator/Admin restriction).

## Backend API Routes

### 1. Authentication Endpoints

- **POST /api/auth/signup** - Validates and creates a new user account profile in the database.
- **POST /api/auth/login** - Verifies user credentials and issues a secure session token (JWT/cookie).
- **POST /api/auth/logout** - Destroys the active session token to securely log the user out.

### 2. Private Journal Endpoints (Requires User Authentication)

- **GET /api/journal** - Fetches the personal journal entry history for the logged-in user.
- **POST /api/journal** - Saves a brand new temple journal entry to the database.
- **GET /api/journal/[id]** - Fetches the complete database record for one specific journal entry.
- **PUT /api/journal/[id]** - Updates the content of an existing journal entry.
- **DELETE /api/journal/[id]** - Permanently removes a specific journal entry from the database.

### 3. Temple Directory Endpoints (Public Access)

- **GET /api/temples** - Fetches a list of all temples (names, locations, images) for the directory.
- **GET /api/temples/[templeId]** - Fetches core details and facts for a specific temple.
- **PUT /api/temples/[templeId]** - Updates core temple metadata (Restricted: Admin Only).

### 4. Crowdsourced Fact Endpoints (Requires User Authentication)

- **POST /api/temples/[templeId]/facts** - Adds a user-submitted fact to a specific temple.
- **PUT /api/temples/[templeId]/facts/[factId]** - Edits an existing temple fact (Restricted: Creator or Admin Only).
- **POST /api/temples/[templeId]/facts/[factId]/like** - Increments and records the "like" count for a target fact.

## Data Model

- **Database Choice**: MongoDB - A document-based NoSQL database fits this project because temple facts and journal entries will scale quickly without complex table joins. MongoDB allows us to nest simple relational arrays directly inside documents and easily manage unstructured user insights.

### Core Data Entities and Fields

#### User Entity

- Represents a registered person who holds an account, authenticates, owns personal journal entries, and likes public facts.

- **\_id**: ObjectId (Primary Key)
- **username**: String (Unique, Required)
- **email**: String (Unique, Required)
- **passwordHash**: String (Required, encrypted)
- **role**: String (Enum: 'user', 'admin', default: 'user')
- **createdAt**: Date (Automatically generated timestamp)

#### JournalEntry Entity

- A private, user-created record tracking a specific personal temple visit.

- **\_id**: ObjectId (Primary Key)
- **userId**: ObjectId (Foreign Key, references User._id, Required)
- **templeId**: ObjectId (Foreign Key, references Temple._id, Required)
- **visitDate**: Date (Required)
- **insights**: String (Required)
- **createdAt**: Date (Timestamp)

#### Temple Entity

- A public record representing a physical temple location and its static metadata.

- **\_id**: ObjectId (Primary Key)
- **name**: String (Unique, Required)
- **location**: String (Required, e.g., "Salt Lake City, Utah")
- **imageUrl**: String (Required, URL path to CDN or asset folder)
- **createdAt**: Date (Timestamp)

#### TempleFact Entity

- A public, historical temple-related milestone or detail.

- **\_id**: ObjectId (Primary Key)
- **templeId**: ObjectId (Foreign Key, references Temple._id, Required)
- **creatorId**: ObjectId (Foreign Key, references User._id, Required)
- **factText**: String (Required)
- **likesCount**: Number (Default: 0)
- **createdAt**: Date (Timestamp)

#### Like Entity

- A tracking mapping to ensure a single unique vote per user per fact.

- **\_id**: ObjectId (Primary Key)
- **userId**: ObjectId (Foreign Key, references User._id, Required)
- **factId**: ObjectId (Foreign Key, references TempleFact._id, Required)
- **createdAt**: Date (Timestamp)

### Entity Relationships

- **One-to-Many** (User ➔ JournalEntry): One user can create many private journal entries. Each journal entry belongs to exactly one user.
- **One-to-Many** (Temple ➔ JournalEntry): One temple can have many user journal entries recorded at its location.
- **One-to-Many** (Temple ➔ TempleFact): One temple can house many crowdsourced community facts.
- **One-to-Many** (User ➔ TempleFact): One user can submit/create many public temple facts.
- **Many-to-Many** (User TempleFact via Like): A user can like many temple facts, and a temple fact can be liked by many users. The Like entity acts as a junction to prevent duplicate votes by enforcing a unique compound constraint on userId + factId.

## Design Theme and Branding

### Color Palette

- The color scheme is designed to feel reverent, clean, and peaceful, leaning heavily on soft marbles, golds, and deep obsidian tones reminiscent of temple architecture.

- **Primary** Accent (Deep Gold / Brass): #D4AF37
  - High-priority actions, active navbar tabs, and highlighted "like" metrics.
- **Secondary** / Depth (Deep Slate Blue / Navy): #1A2530
  - Main headers, active text links, and dark-mode framing accents.
- **Background** Base (Soft Alabaster White): #FAFAFA
  - Main application and page backgrounds to keep the layout open and readable.
- **Surface** Elevation (Pure White / Off-White): #FFFFFF / #F3F4F6
  - Individual TempleCard, JournalEntryCard, and dashboard modules.
- **Success** / Validation: #2E7D32 (Soft Forest Green)
- **Error**: #C62828 (Crimson Red)

### Typography

- To balance a traditional, reverent tone with high modern readability, the app uses a clean serif/sans-serif pairing.

- **Headings (H1, H2, H3)**: Playfair Display or Merriweather (Serif font family)
  - Evokes a classic, reflective, and journal-like emotional response.
- **Body Text & Metadata**: Inter or Geist (Modern, geometric sans-serif font family)
  - Optimizes scannability, search filtering, and dense paragraph legibility across small mobile layouts and large screens.

### Layout Patterns, Spacing, Shared UI

- Prettier, Lint, and Tailwind
