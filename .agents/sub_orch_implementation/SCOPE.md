# Scope: KMart Net 12 Design & UX Improvements Implementation

## Architecture
- Modifying minified React client bundles to implement 12 design/UX requirements.
- Assets:
  - `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js` (UI logic/layout/state updates)
  - `dist/assets/index-BiACt3m9.css` (Premium look, forest green header, card rounded corners, shake animations)
  - `dist/sw.js` (Precache version updates to bypass client browser cache)
- Data model mappings:
  - Supabase database columns mapped to frontend model properties using `yl` mapper in JS bundles.
  - Adding mapping for `image_url` property from DB to `image_url` property in UI product objects.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 2 | Card & Image Updates (R1) | Map `image_url` in mapper `yl`, display real product image thumbnails/fallbacks, hide tier pricing on customer cards. | None | DONE |
| 3 | Mobile Nav & Scroll UX (R2) | Persistent bottom nav on mobile, category filter horizontal scroll gradient fade overlay, category product count display, active pill distinction. | M2 | IN_PROGRESS |
| 4 | Loading & Cart micro-interactions (R3, R4) | Animated shimmer skeleton loader, fade-in/slide-up transitions, green checkmark / pop-scale cart add feedback, red circular cart count badge, mobile sticky floating action button (FAB). | M3 | PLANNED |
| 5 | Advanced Features & Dashboard (R4, R5, R6, R7) | PIN keypad feedback (tap scale, dot scale, error shake, success spinner), premium color scheme / styling, search autocomplete & clear button, offline banner, PWA install prompt, Admin insight cards, low-stock warnings, interactive SVG charts. | M4 | PLANNED |
| 6 | Sw Version & Verification | Bump precache versions in sw.js. Verify against full E2E test suite (Phase 1) and adversarial coverage hardening (Phase 2). | M2, M3, M4, M5 | PLANNED |

## Interface Contracts
- **Supabase Products mapping**: `products.image_url` must map to `image_url` property on frontend.
- **Client Cache**: `sw.js` precache revision must change for updated assets to make browser download them.
- **Verification**: E2E test commands specified in `TEST_READY.md` must pass with exit code 0.
