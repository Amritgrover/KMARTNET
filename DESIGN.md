# KMART Forest Premium System - Design Specifications

This document serves as the single source of truth for the KMART progressive web application's styling, typography, color palette, and component behaviors.

---

## Brand & Style Guidelines

This design system introduces a premium **Organic Modernism** vibe to the KMART PWA. It replaces the plain, high-density industrial navy colors and raw emojis with a cohesive, fresh corporate branding scheme tailored for a modern B2B/B2C catalogue and grocery network.

### Visual Pillars
1. **Organic Premium Aesthetic**: A clean, airy off-white canvas with rich forest green header gradients, warm honey/amber accents for critical pricing indicators, and soft drop shadows instead of harsh outlines.
2. **Visual Simplicity & Focus**: Clear visual hierarchy, generous card paddings, and collapsed information panels that hide dense sub-tables (e.g., tier pricing breakdown) behind tidy tap-to-expand details panels.
3. **Approachable Humanism**: Broad rounded corners (`12px` to `16px`) and elegant typography (Plus Jakarta Sans) deliver a professional yet welcoming shopping and cataloging environment.
4. **Fluid Micro-interactions**: Smooth transitions (fade-in, slide-up), loading skeletons, and interactive state feedback (glows, checked scales, shake failure states) to keep the app responsive.

---

## Color Palette

The color palette is built using dynamic HSL shades tailored for food, grocery, and FMCG environments.

| Color Token | Hex Value | Application | Description |
|---|---|---|---|
| **Primary (Header/Brand)** | `#1B4332` | Top app bars, brand logo container, main buttons | A deep, commanding forest green that denotes freshness and trust. |
| **Primary Gradient Tint** | `#2D6A4F` | Gradient transitions, hovered buttons | A slightly lighter, vibrant organic green. |
| **Secondary Accent** | `#D4A843` | Active pills, margins, price display, Cart FAB | Warm amber gold used for active highlights, margins, active categories, pricing emphasis, and floating elements (like the cart FAB). |
| **Tertiary Accent** | `#40916C` | Success states, checked badges | A softer green background tint representing completion. |
| **Background** | `#F8F9FA` | Main body viewport backdrop | Clean, bright off-white to contrast the elevated surfaces. |
| **Surface** | `#FFFFFF` | Product cards, dialog panels, inputs, sidebars | Pure white card elements that float on the background. |
| **Outline & Borders** | `#E2E7E4` | Inner lines, table dividers, inputs | Soft neutral-grey border tint to separate elements. |
| **Error / Warning** | `#BA1A1A` | Offline banner background, error indicators | Highly visible cherry red for alerting the user. |

### Color Mappings for CSS Custom Properties
```css
:root {
  --color-primary-base: #1b4332;
  --color-primary-tint: #2d6a4f;
  --color-primary-light: #e8f5e9;
  --color-secondary-accent: #d4a843;
  --color-tertiary-accent: #40916c;
  --color-neutral-bg: #f8f9fa;
  --color-surface: #ffffff;
  --color-outline: #e2e7e4;
  --color-text-on-primary: #ffffff;
  --color-text-body: #181d19;
  --color-text-muted: #404942;
  --color-error: #ba1a1a;
}
```

---

## Typography

The design system utilizes **Plus Jakarta Sans** across all screens. Its humanist geometric proportions deliver great readability even on low-resolution mobile displays.

- **Display Title (`display-lg`)**: 40px, Bold, -0.02em letter spacing, 48px line height. Used for large welcome headings and splash views.
- **Header Large (`headline-lg`)**: 32px, Bold, -0.01em letter spacing, 40px line height. Used for screen-level titles.
- **Header Medium (`headline-md`)**: 24px, Semi-Bold, 32px line height. Used for secondary widgets and sub-headings.
- **Product Title / Card Header (`headline-sm`)**: 20px, Semi-Bold, 28px line height. Standard size for product catalog item titles.
- **Body Large (`body-lg`)**: 18px, Regular, 28px line height. Used for key descriptions and prominent item parameters.
- **Body Medium / Standard (`body-md`)**: 16px, Regular, 24px line height. Used for secondary SKU descriptions, unit sizes, and values.
- **Price Text (`price-display`)**: 22px, Bold, +0.02em letter spacing, 24px line height. Used for listing price highlights (colored in accent gold).
- **Labels / Badges (`label-sm`)**: 12px, Semi-Bold, +0.05em letter spacing, 16px line height. Used for category labels, wholesale margin pills, and status tags.

---

## Spacing & Spacing Units

Rhythm and alignment decisions follow an **8px modular grid**.

- **`xs` (4px)**: Tiny gaps, inline emoji spacing.
- **`base` (8px)**: Internal list gap, margin between label and details.
- **`sm` (12px)**: Margin between sections in product cards, row gaps.
- **`md` (24px)**: Standard card padding, modal content padding.
- **`lg` (32px)**: Header vertical space, splash screen sections.
- **`xl` (48px)**: Outer page margins on large screens.
- **`container-margin` (16px)**: Standard mobile edge-to-edge padding to prevent text touching borders.
- **`gutter` (16px)**: Grid gap between catalogue cards on multi-column layouts.

---

## Shape Language & Elevation

### Border Radius
- **`rounded-sm` (4px)**: Small tags, input validation checkboxes.
- **`rounded-md` (8px)**: Action buttons (outlined and filled), text inputs.
- **`rounded-lg` (12px)**: Category filter pills.
- **`rounded-xl` (16px)**: Main product cards, admin dashboard metrics panels, bottom sheet dialogs.
- **`rounded-full` (9999px)**: Floating Action Buttons, cart badges, profile avatars.

### Shadows (Elevation)
To maintain the organic floating aesthetic, borders are minimized, and elements are separated by soft, ambient drop shadows:
- **Low Elevation (Product Cards in Feed)**:
  `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);`
- **Medium Elevation (Active pills, dropdown menus, focused input elements)**:
  `box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);`
- **High Elevation (Bottom persistent nav, Floating Action Buttons, Dialog boxes, Dropdowns)**:
  `box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);`
  *Note:* Modals must render over a dark translucent backdrop scrim (`rgba(0, 0, 0, 0.40)`).

---

## Component Specs

### 1. Modernized Catalogue Product Cards
Product cards must be styled clean and spacious, emphasizing image over plain text.
- **Visual Image Frame**: Square `1:1` aspect-ratio top-aligned container. Renders the mapped `image_url` property from DB. If empty, displays a clean circle with a Category Emoji (e.g. 🍪 for Biscuits) on a soft green background tint (`#E8F5E9`).
- **Collapsible Tier Pricing**: The face of the card should only show the primary retail price (accent gold, `price-display`). The tier-pricing table is collapsed by default behind a clean disclosure button. Tapping the disclosure button slides down the tier list with a smooth CSS transition.
- **Dual Quantity Selector**: Instead of basic buttons, it features two distinct stepper units aligned horizontally:
  - **Pcs Stepper**: Transparent pill with thin green borders, used to adjust individual units.
  - **Cases Stepper**: Filled forest green pill with white text, used to adjust bulk case ordering (displays the cases count and package size multiplier).

### 2. Persistent bottom Navigation (Viewport < 768px)
- Aligned to the absolute bottom of the device screen with high elevation and a thin grey border on top.
- **Tabs (Customer)**: Home/Catalogue | Search | Cart | Profile.
- **Tabs (Salesman)**: Catalogue | Cart | Orders | Profile.
- **Active tab highlight**: Selected tab is styled with a green background highlight (`#E8F5E9`), dark green icon, and bold title.
- **Cart Badge**: A circular red bubble (`#BA1A1A`) on the Cart icon tab displaying the active items count.

### 3. Horizontal Scrollable Category Pills
- Pill container spans full-width with horizontal scroll enabled.
- The right-edge is covered by a fixed `16px` linear-gradient overlay (`linear-gradient(to right, rgba(248, 249, 250, 0), #F8F9FA)`) to signal scrollable overflow.
- **Active category pill**: Scales up by `1.05x`, utilizes a dark forest green background (`#1B4332`) and bold white text, while inactive pills remain light grey.
- Displays the category product count inline, e.g. `Snacks (12)`.

### 4. Floating Action Button (FAB - Cart)
- Positioned `16px` from bottom-right on mobile screens.
- Rich amber-gold background, floating at high elevation.
- Implements a keyframe pulse animation (`transform: scale(1.02)`) triggered briefly when items are added to the cart.

### 5. Secure PIN Input Login Pad
- Styled as a clean number keypad with rounded grid buttons.
- **Tap feedback**: Key buttons scale down to `0.95x` on active touch.
- **Input indicator dots**: Key entry renders large circles that scale up and outline with an active glow.
- **Failure state**: Incorrect PIN inputs trigger a horizontal shake animation (`shake` keyframes) on the PIN card container and show a thin warning border.
- **Success state**: Renders a loading spinner that morphs smoothly into a green validation checkmark.

### 6. Interactive Admin Insights Dashboard
- **Metric Cards**: Display core indicators (Total Sales, Active Customers, Margins) inside elevated white panels with trend flags (e.g., green `▲ +2.3%` or red `▼ -1.1%`) and mini SVG line charts (sparklines) showing weekly progress.
- **Low Stock Panel**: Highlight section styled with a light amber-gold background, listing products below batch thresholds.
- **SVG Graphs**: Renders light SVG visual charts:
  - *Pie Chart*: Showing category inventory distribution.
  - *Bar Chart*: Showing inventory levels of top-performing items.
