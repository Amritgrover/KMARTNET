## 2026-06-22T10:27:40Z
Update the file `c:\Users\Amritpal Singh\Downloads\kmartnet\kmartnet\PROJECT.md` to reflect the 12 design/UX improvements project milestones and interface contracts.
Overwrite the file content exactly with the following content:

```markdown
# Project: KMart Net 12 Design & UX Improvements

## Architecture
- **Bundles to modify**:
  - `dist/assets/index-DYXXu0wA.js` and `dist/assets/index-D0CI6L84.js` (UI logic, states, DOM element injection)
  - `dist/assets/index-BiACt3m9.css` (Premium forest green gradient, rounded corners, soft shadows, shake animations)
  - `dist/sw.js` (Bump version strings for precache to invalidate client cache)
- **Data flow**: Supabase maps standard fields via product mapper `yl` (needs mapping of `image_url` from DB).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Testing Track | Design E2E test infra and cases (Tiers 1-4). Create `TEST_INFRA.md` and publish `TEST_READY.md`. | None | PLANNED |
| 2 | Card & Image Updates | Map `image_url` in `yl`, display real product image thumbnails/fallbacks, hide tier pricing. | M1 | PLANNED |
| 3 | Mobile Nav & Scroll UX | Add persistent bottom nav for Customers & Salesmen. Category filter scroll indicator, item counts, and distinct active pill. | M1 | PLANNED |
| 4 | Loading & Cart micro-interactions | Shimmer skeleton, fade-in/slide-up transitions, success micro-animations, red circular badge, and cart FAB. | M1 | PLANNED |
| 5 | Advanced Features & Dashboard | PIN keypad feedback, shake animation, success spinner, search autocomplete, connectivity dot, offline banner, install app prompt, rich Admin metric cards, low-stock warnings, and SVG stats charts. | M1 | PLANNED |
| 6 | Sw Version & Verification | Bump sw.js precache versions. Verify all E2E tests pass (Tier 1-4), perform adversarial hardening (Tier 5), and review/audit. | M2, M3, M4, M5 | PLANNED |

## Interface Contracts
- **Supabase Products**: `products.image_url` must map to `image_url` property in mapped product objects.
- **Client Cache**: `sw.js` precache revision must change for assets to ensure the browser fetches the new bundle immediately.
```

Your working directory is: `c:\Users\Amritpal Singh\Downloads\kmartnet\kmartnet\.agents\worker_project_setup`.
Write the file, verify it was written correctly, write your progress.md/handoff.md, and send me a message when done.
Include the MANDATORY INTEGRITY WARNING: DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
