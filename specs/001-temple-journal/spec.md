# Feature Specification: Church of Jesus Christ Temples Journal App

**Feature Branch**: `001-temple-journal`  
**Created**: 2026-07-02  
**Status**: Draft  
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

---

### Edge Cases

- What happens when a user tries to create an entry without required information?
- What happens when a user tries to like the same fact more than once?
- What happens when a user attempts to access another user’s private journal entry?

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

### Key Entities

- **User**: A registered person who holds an account, authenticates, owns personal journal entries, and likes public facts.
- **JournalEntry**: A private, user-created record tracking attendance date, temple ID, and personal spiritual insights.
- **TempleFact**: A public, crowdsourced temple-related fact linked to a specific temple ID.
- **Like**: A tracking entity mapping a specific User ID to a specific TempleFact ID to prevent multiple likes.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can successfully create and save a new temple journal entry in under 2 minutes.
- **SC-002**: At least 95% of active users can complete the entire create, read, update, and delete workflow without experiencing runtime failures.
- **SC-003**: The fact ranking engine correctly sorts and reorders liked facts on the details screen in under 500 milliseconds after a user triggers a like.

## Implementation Priority

### Phase 1 - Core Foundation

- User authentication and account registration
- Basic journal entry create, read, update, and delete workflows
- Secure ownership and access control for user data

### Phase 2 - Engagement Features

- Temple facts display on temple details pages
- Like and ranking functionality for temple facts
- Prominent display of highly liked facts

### Phase 3 - Polish and Expansion

- Search or filtering for journal entries
- Improved profile or history views
- Additional temple-related content or community features
