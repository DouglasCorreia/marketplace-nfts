# Marketplace Figma Fidelity and Tailwind Migration Plan

> **For agentic workers:** Implementation is authorized by the user. Work directly in the current checkout and verify with build plus desktop/mobile screenshots.

**Goal:** Align every implemented marketplace route and shared flow with the Figma reference while replacing hand-authored visual CSS with Tailwind utilities and theme tokens.

**Architecture:** Keep React/TanStack behavior and API hooks. Express page geometry, responsive states, and shared layout through Tailwind; retain only Tailwind import, theme tokens, browser reset, and the overlapping range-thumb implementation in global CSS.

**Tech Stack:** React, TypeScript, TanStack Router/Query, Tailwind CSS v4, Lucide.

**Spec:** Figma clone `tqAqUwFixkfhFB86cjrRGW`; existing user-provided captures for Home, auth, NFT detail, cart, payment, and order confirmation.

## Global Constraints
- Tailwind is the styling standard; use theme tokens for Figma colors and shared typography.
- Preserve existing user flows and API interactions.
- Match the supplied Figma layouts at 1440px desktop and 414px mobile where a frame exists.
- Do not replace image assets with generated drawings or remote temporary Figma URLs.

## Review Focus
- Mobile modal/login/register controls remain usable at 414px.
- Cart and checkout totals preserve API values while matching the screen structure.
- NFT detail actions, variant states, and responsive sticky purchase area remain functional.
- No route retains hidden dependence on removed legacy CSS.
- All page backgrounds and typography use the Kurio tokens.

---

### Task 1: Theme and shared shell
**Files:** `src/styles/globals.css`, `src/components/layout/AppShell.tsx`, `src/components/layout/SiteFooter.tsx`, `src/components/ui/button.tsx`, `src/main.tsx`.

- [ ] Reduce global CSS to Tailwind import, `@theme`, reset/base, and range-thumb rules.
- [ ] Rebuild shared header/footer/nav/modal scaffolding with Tailwind utilities and responsive states.
- [ ] Remove obsolete footer and journal CSS imports/files.
- [ ] Build and render Home to confirm no legacy selector dependency.

### Task 2: Auth modal, detail and catalog shared components
**Files:** `src/features/account/LoginPage.tsx`, `RegisterPage.tsx`, `src/features/catalog/Artwork.tsx`, `NFTPage.tsx`.

- [ ] Convert all remaining visual classes to Tailwind utilities and match desktop/mobile designs.
- [ ] Keep forms, loading/error states, favorites, edition quantity, cart actions, tabs, and modal behavior.
- [ ] Build and render at desktop/mobile.

### Task 3: Cart, payment, and order confirmation
**Files:** `src/features/cart/CartPage.tsx`, `src/features/checkout/CheckoutPage.tsx`, `OrderPage.tsx`.

- [ ] Convert desktop tables, totals, recommendations, checkout form, wallet options, and confirmation to Tailwind.
- [ ] Match mobile sticky summary/actions and visible wallet state.
- [ ] Build and render cart, checkout, and confirmation at desktop/mobile.

### Task 4: Full visual verification
**Files:** all screen components above.

- [ ] Capture desktop and mobile screenshots for every implemented route.
- [ ] Resolve issues visible in one final combined review pass.
- [ ] Run `npm run build` and report any Figma frames that could not be inspected due plugin access limits.
