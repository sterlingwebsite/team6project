<!--
Sync Impact Report
- Version change: 0.0.0 -> 1.0.0
- Modified principles: [PRINCIPLE_1_NAME] -> Purpose-Driven Spiritual Experience; [PRINCIPLE_2_NAME] -> Type-Safe Engineering; [PRINCIPLE_3_NAME] -> Tailwind-First UI; [PRINCIPLE_4_NAME] -> Next.js App Router Discipline; [PRINCIPLE_5_NAME] -> Verified Quality; [SECTION_2_NAME] -> Technical Standards; [SECTION_3_NAME] -> Development Workflow
- Added sections: Technical Standards, Development Workflow
- Removed sections: None
- Templates requiring updates: .specify/templates/plan-template.md ✅ updated, .specify/templates/spec-template.md ✅ updated, .specify/templates/tasks-template.md ✅ updated
- Follow-up TODOs: None
-->

# Church of Jesus Christ Temples Journal App Constitution

## Core Principles

### I. Purpose-Driven Spiritual Experience

Every feature must serve the app’s core purpose: helping members record temple attendance, reflect on spiritual experiences, and share meaningful insights in a respectful, uplifting way. Product choices must prioritize clarity, dignity, and accessibility over novelty. User‑generated content must remain respectful, doctrinally appropriate, and aligned with the sacred nature of temples.

### II. Type-Safe Engineering

All application code MUST use TypeScript in strict mode. The any type is prohibited unless explicitly approved for a temporary migration; developers must prefer explicit interfaces, unions, and utility types. Type errors MUST be resolved before merge.

### III. Tailwind-First UI

User interfaces MUST be built with Tailwind CSS utility classes first. Custom CSS should be used only when Tailwind cannot express the requirement without creating unnecessary complexity or when a framework requirement demands it. Styling changes must remain readable, maintainable, and consistent with the design system.

### IV. Next.js App Router Discipline

The app MUST follow Next.js App Router conventions. Server components are the default for data fetching and rendering; client components are used only when interactivity, browser APIs, or hooks are required. Routing MUST use file-based segments and shared layouts intentionally, with clear separation between page, layout, and component responsibilities.

### V. Verified Quality

Features MUST be implemented with a test-first mindset: behavior should be defined by tests or clear acceptance criteria before implementation. Unit, integration, or component tests must cover new user-facing behavior, and regressions must be caught before release.

### VI. Clear Naming and Collaborative Workflow

Code, files, routes, and branches MUST use consistent naming conventions: PascalCase for React components, camelCase for functions and variables, kebab-case for route segments and files, and descriptive names that reflect purpose. Team collaboration MUST use small, reviewable changes, documented decisions, and constructive code review.

## Technical Standards

Projects in this repository MUST remain aligned with the required stack: Next.js (App Router), TypeScript, and Tailwind CSS. New features must avoid unnecessary libraries, preserve performance, and keep the implementation understandable to the whole team. When a choice between server and client rendering is ambiguous, the simpler server-first option is preferred unless interactivity requires otherwise.

## Development Workflow

All work must follow a lightweight but disciplined workflow: document intent in the feature spec or implementation plan, write or update tests for the relevant behavior, implement the smallest complete change, and verify the result through linting and relevant tests before requesting review. Pull requests MUST be focused, explain the user value, and include enough context for reviewers to evaluate compliance with these principles.

## Governance

This constitution supersedes ad hoc practices for this project. Amendments require a documented rationale, a version bump, and review by the team before implementation. Compliance is reviewed during planning, pull request review, and release readiness, and any deviation must be explicitly justified and tracked.

**Version**: 1.0.0 | **Ratified**: 2026-07-02 | **Last Amended**: 2026-07-02
