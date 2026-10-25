# NFT Marketplace Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive NFT marketplace with mock-backed discovery, collection, checkout, account, and real-time flows.

**Architecture:** React presentation is organized by route and domain. Axios is the sole REST transport, MSW owns mock business state, TanStack Query owns remote cache, TanStack Router owns URL state, and an encapsulated Socket.IO client reconciles live updates.

**Tech Stack:** React, strict TypeScript, Vite, TanStack Router/Query, Axios, Tailwind CSS, shadcn/ui primitives, MSW, Socket.IO Client, Playwright, Lighthouse.

**Spec:** `README.md` (user-provided challenge specification) and the pasted master prompt in the conversation.

## Global Constraints

- Keep ETH as decimal strings at transport boundaries and use integer wei for arithmetic.
- Keep mock REST as the source of truth for all transactions.
- Isolate user data and query cache by session identity.
- Treat Socket.IO events as versioned hints; reconcile from REST.
- Keep the app runnable without private services.
- Do not claim Figma fidelity where the design file cannot be inspected.

## Review Focus

- Query parameter combinations must round-trip through refresh and browser history.
- Retried order creation must not duplicate an order.
- Session changes must not expose cached private data.
- Old or duplicated socket events must not move catalog or order state backwards.
- Failures must preserve unpurchased cart quantities.

## File Map

- `src/app/`: providers and route tree.
- `src/features/catalog/`: catalog contracts, query, and views.
- `src/features/cart/`, `checkout/`, `account/`: business flows.
- `src/lib/http/`, `query/`, `socket/`: infrastructure clients.
- `src/mocks/`: MSW browser/server handlers and in-memory state.
- `tests/e2e/`, `tests/visual/`: Playwright coverage.
- `docs/`: API, events, architecture, and operational notes.

## Tasks

1. **Foundation and first vertical slice:** initialize strict Vite/React, Tailwind and shadcn/ui primitives; add Router, Query, Axios, MSW, and Socket.IO; render responsive catalog with URL-driven search and detail route. Verify typecheck and production build.
2. **Domain and mock persistence:** implement typed catalog, session, favorites, cart, quote, and order models; add REST handlers, safe integer pricing, persistence and reset scenarios. Verify domain tests and handler integration.
3. **Account and purchase flows:** implement auth, profile, wallets, cart, checkout and receipt; require API-confirmed order state and idempotency; protect routes and clear user cache. Verify Playwright happy and failure paths.
4. **Live updates and recovery:** versioned Socket.IO updates, duplicate/old-event guards, reconnect reconciliation, pending order recovery. Verify simulated socket paths through the client.
5. **Quality and delivery:** responsive/accessibility refinements, visual baselines, Lighthouse reports, docs, SPA hosting configuration, and deploy validation.

## Current Increment

Implement Task 1 as the first reviewable slice. Figma URL was inaccessible in this environment; visual tokens are provisional until references are supplied. Deployment credentials and repository URL are not present in the checkout.
