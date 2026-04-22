# SLOMEXPERT — Deploy Readiness Audit

> **Status**: ⚠️ Builds successfully, but has critical issues to fix before production  
> **Build time**: ~29s (client 6s + SSR 23s)  
> **Adapter**: `@sveltejs/adapter-cloudflare`  
> **Build warning**: _routes.json exceeds Cloudflare limits (2015 excess exclude rules)

---

## 🔴 CRITICAL — Must Fix Before Deploy

---

## 🟡 HIGH — Should Fix Before Deploy


---


---


### TASK-008 · SEO component exists but is never used

**Description**: `SEO.svelte` component is fully implemented with Open Graph, Twitter Cards, and JSON-LD support, but it's never included in any page. The only SEO comes from hardcoded tags in `app.html`.

**What to do**:
1. Add `<SEO />` to `Home.svelte` with proper Ukrainian SEO content
2. Set `title`, `description`, `keywords` relevant to demolition services in Ukraine
3. Add JSON-LD structured data (LocalBusiness schema)
4. Add canonical URL
5. Replace placeholder `@yourhandle` in `SEO.svelte:14`
6. Create or generate an `og-default.png` image and place in `static/`

**Files**: `src/lib/Pages/Home.svelte`, `src/lib/shared/seo/SEO.svelte`, `static/`

**Hints**: For LocalBusiness JSON-LD see schema.org/LocalBusiness. Title should be ~60 chars, description ~155 chars.

---

### TASK-009 · `robots.txt` missing sitemap reference

**Description**: `robots.txt` only has `User-agent: *` and `Disallow:`. No `Sitemap:` directive, and no sitemap is generated.

**What to do**:
1. Add `Sitemap: https://slomexpert.com/sitemap.xml` to `robots.txt`
2. Create a `static/sitemap.xml` (or generate dynamically via a `+server.ts` route)
3. Since it's a single-page site, the sitemap can be simple with just `/`

**Files**: `static/robots.txt`

**Hints**: For a single-page site, a static sitemap.xml in `static/` is sufficient.

---

### TASK-010 · Cloudflare `_routes.json` limit exceeded

**Description**: The build warns: `_routes.json limits exceeded, dropping 2015 exclude rules — this will cause unnecessary function invocations`. This means every static asset request will invoke a Cloudflare Worker function unnecessarily, increasing latency and cost.

**What to do**:
1. Delete the massive `static/fonts/fontawesome/fontawesome-free-6.4.0-web/` subdirectory (it's a duplicate of the parent)
2. Delete unused FA dirs: `less/`, `scss/`, `js/`, `metadata/`, `sprites/`, `svgs/`
3. This reduces static file count from 2105 → ~20 files, well under the _routes.json limit
4. Alternatively, add `routes.exclude` in `svelte.config.js` adapter options

**Files**: `static/fonts/fontawesome/`, `svelte.config.js`

**Hints**: Cloudflare Pages has a 100-rule limit for `_routes.json`. The 2105 FA files massively blow this limit.

---

## 🟢 MEDIUM — Improvements

### TASK-011 · Messenger links are all `href="#"` (placeholder)

**Description**: The `MessengerBlock.svelte` component has Telegram, Viber, WhatsApp, and Signal buttons, but all links point to `#`. These need real URLs before deployment.

**What to do**:
1. Set Telegram link: `https://t.me/YOUR_USERNAME`
2. Set Viber link: `viber://chat?number=YOUR_PHONE`
3. Set WhatsApp link: `https://wa.me/380XXXXXXXXX`
4. Set Signal link or remove if not used
5. Phone number should also be a clickable `tel:` link

**Files**: `src/lib/Features/MessengerBlock.svelte:3-8`

**Hints**: Pass real URLs via props or hardcode them. The phone number display should be wrapped in `<a href="tel:+380672158888">`.

---

### TASK-012 · HeroCarousel has placeholder slides (no real images)

**Description**: The carousel displays emojis and text `[Фото об'єкта]` instead of actual project photos. This looks unprofessional for production.

**What to do**:
1. Prepare 3 high-quality photos of completed demolition projects
2. Optimize images: WebP format, max 1200px wide, quality 80
3. Place in `static/images/` or import via `$lib/assets/`
4. Update slide data in `HeroCarousel.svelte` to use `<img>` instead of emoji/text

**Files**: `src/lib/Features/HeroCarousel.svelte`

**Hints**: Use `<img>` with `loading="lazy"`, `width`, `height` attributes. Add `alt` text in Ukrainian for accessibility.

---

### TASK-013 · Replace FontAwesome with inline SVG icons (save ~100 KB)

**Description**: The project uses only ~15 unique FA icons but loads the entire FA library (99.6 KB CSS + ~300 KB webfonts). Replacing with inline SVGs would save ~400 KB of static assets and eliminate render-blocking CSS.

**Icons used** (deduplicated):
`fa-bars`, `fa-xmark`, `fa-face-frown`, `fa-star`, `fa-telegram`, `fa-viber`, `fa-whatsapp`, `fa-comment-dots`, `fa-chevron-left`, `fa-chevron-right`, `fa-chevron-down`, `fa-check`, `fa-hammer`, `fa-burst`, `fa-circle-dot`, `fa-door-open`, `fa-truck-fast`, `fa-user`, `fa-plus`

**What to do**:
1. Create an `Icon.svelte` component in `src/lib/shared/ui/`
2. Embed only the ~19 needed SVG paths as a map
3. Replace all `<i class="fa-...">` with `<Icon name="..." />`
4. Remove FA CSS link from `+layout.svelte`
5. Remove FA CDN link from `app.html`
6. Delete `static/fonts/fontawesome/` entirely

**Files**: All components using `fa-` classes, `src/routes/+layout.svelte`, `src/app.html`

**Hints**: Get SVG paths from fontawesome.com/icons (free tier). Each icon is just a `<svg><path d="..."/></svg>`. Total inline SVG size: ~5 KB vs 400 KB for FA.

---

### TASK-014 · `@tailwindcss/forms` plugin may be unnecessary

**Description**: `@tailwindcss/forms` is installed and loaded via `@plugin` in `layout.css`. However, all form elements already have fully custom styles (`.c-input`, `.c-select`, `.input-brutal`). The plugin resets browser form defaults — which are then overridden by custom styles anyway.

**What to do**:
1. Try removing `@plugin "../../node_modules/@tailwindcss/forms"` from `layout.css`
2. Test all forms (ContactForm, Configurator, ReviewForm)
3. If no visual changes — remove the plugin from `package.json` devDependencies
4. Run `npm install` to update lockfile

**Files**: `src/routes/layout.css:2`, `package.json:18`

**Hints**: The plugin adds ~4 KB of CSS. Test on Chrome + Safari to verify form elements look correct without it.

---

### TASK-015 · Container class defined 3 times

**Description**: `.container` is defined in `Home.svelte`, `Header.svelte`, and `Footer.svelte` with identical values (`max-width: 80rem; margin: 0 auto; padding: 0 1rem`). `.container-sm` is duplicated in `Home.svelte` and `ReviewForm.svelte`.

**What to do**:
1. After migrating to Tailwind, replace `.container` with `mx-auto max-w-7xl px-4`
2. Replace `.container-sm` with `mx-auto max-w-3xl px-4`
3. Or define `@utility container` in `layout.css` for reuse

**Files**: `src/lib/Pages/Home.svelte`, `src/lib/Widgets/Header.svelte`, `src/lib/Widgets/Footer.svelte`, `src/lib/Features/ReviewForm.svelte`

**Hints**: Tailwind v4 `@utility` directive lets you define custom utilities. Prefer inline classes for simple layouts.

---

### TASK-016 · Feedback message component is duplicated in 3 forms

**Description**: The `.feedback`, `.feedback.success`, `.feedback.error` CSS + markup is copy-pasted identically in `ContactForm.svelte`, `Configurator.svelte`, and `ReviewForm.svelte`.

**What to do**:
1. Create a `FeedbackMessage.svelte` component in `src/lib/shared/ui/`
2. Accept `message` and `type` ('success' | 'error') as props
3. Replace the 3 inline implementations with `<FeedbackMessage {message} {type} />`

**Files**: `src/lib/Features/ContactForm.svelte:73-77,81-96`, `src/lib/Features/Configurator.svelte:337-341,347-355`, `src/lib/Features/ReviewForm.svelte:103-107,210-226`

**Hints**: Simple component: `{#if message}<div class="...">{message}</div>{/if}`. Use Tailwind classes after migration.

---

### TASK-017 · Add phone number input validation/masking

**Description**: Phone inputs accept any text. No validation pattern, no input mask. Users can submit invalid phone numbers.

**What to do**:
1. Add `pattern` attribute for Ukrainian phone format: `^\+?3?8?(0\d{9})$`
2. Add `inputmode="tel"` for mobile keyboard
3. Consider a simple format function on input (no heavy lib needed)
4. Add Zod phone validation on the server side (current schema only checks `min(10).max(20)`)

**Files**: `src/lib/Features/ContactForm.svelte`, `src/lib/Features/Configurator.svelte`, `src/routes/api/notify/+server.ts:9`

**Hints**: Use `inputmode="tel"` and a `pattern` attribute. For masking, a 20-line Svelte `$effect` is enough — no library needed.

---

### TASK-018 · `Configurator.svelte` is too large (638 lines) — split into sub-components

**Description**: The Configurator is a single 638-line file handling 4 service categories, form submission, state management, and all styling. This hurts maintainability.

**What to do**:
1. Extract `ServiceBlock.svelte` — reusable block for demolition/cutting/reinforcement rows
2. Extract `TruckSelector.svelte` — the truck radio group
3. Extract `PriceSummary.svelte` — the total + submit button
4. Keep `Configurator.svelte` as the orchestrator

**Files**: `src/lib/Features/Configurator.svelte`

**Hints**: Each service section follows the same pattern: title → rows → add button. Abstract the row logic into a generic component. Pass `options[]` and slot/render callback for fields.

---

### TASK-019 · No loading skeleton or page transition

**Description**: When the page loads, there's no visual feedback until all content renders. On slow connections, users see a blank page.

**What to do**:
1. Add a minimal CSS-only loading state in `app.html` body
2. Use `svelte:head` to add critical CSS inline
3. Consider `content-visibility: auto` on below-fold sections for paint performance

**Files**: `src/app.html`, `src/routes/+layout.svelte`

**Hints**: A simple CSS spinner or brand name in the `%sveltekit.body%` div suffices. SvelteKit removes it on hydration.

---

### TASK-020 · Missing `<a>` tag for phone number in Footer

**Description**: The footer displays the email as plain text `info@slomexpert.ua` but it's not a clickable `mailto:` link. Same for the address — could link to Google Maps.

**What to do**:
1. Wrap email with `<a href="mailto:info@slomexpert.ua">`
2. Consider adding a phone number to the footer
3. Optionally wrap address with a Google Maps link

**Files**: `src/lib/Widgets/Footer.svelte:22`

**Hints**: Use `target="_blank" rel="noopener noreferrer"` for external links.

---

### TASK-021 · ReviewForm is commented out in Home.svelte

**Description**: Line 227 has `<!-- <ReviewForm /> -->`. Either enable it or remove the dead import.

**What to do**:
1. If reviews feature is ready — uncomment it
2. If not ready — remove the import on line 12 and the comment on line 227
3. This prevents shipping unused JS to the client

**Files**: `src/lib/Pages/Home.svelte:12,227`

**Hints**: Unused imports still contribute to the Svelte compiled output even when commented in template.

---

### TASK-022 · `index.html` at project root (44 KB) — likely leftover

**Description**: There's a 44 KB `index.html` file at the project root. This is likely the original static HTML template used to build the Svelte components from. It should be removed or moved to documentation.

**What to do**:
1. Verify it's not used by any build step or reference
2. Move to `docs/` for reference or delete
3. Add to `.gitignore` if kept

**Files**: `index.html` (root)

**Hints**: SvelteKit uses `src/app.html` as its template, not root `index.html`.

---

### TASK-023 · Accessibility — missing alt text, ARIA labels, and focus styles

**Description**: Several accessibility issues:
- Carousel radio inputs have no accessible labels
- Mobile menu toggle label has no accessible text
- No visible focus indicators on custom-styled buttons
- Star rating buttons use `onclick` without keyboard support

**What to do**:
1. Add `aria-label` to carousel radio inputs
2. Add `aria-label="Відкрити меню"` to mobile menu toggle label
3. Add focus-visible outlines to `.btn-brutal`, `.c-input`, `.c-select`
4. Ensure star rating works with keyboard (Enter/Space)

**Files**: `src/lib/Features/HeroCarousel.svelte`, `src/lib/Widgets/Header.svelte`, `src/lib/shared/styles/base.css`

**Hints**: Use `focus-visible:ring-2 focus-visible:ring-orange` in Tailwind for focus styles. `<button>` handles Enter/Space natively.

---

---

## 📦 LIBRARY & BUNDLE RECOMMENDATIONS

### R-001 · Remove `zod` from runtime dependencies (or keep judiciously)

| Package | Size (minified) | gzipped | Verdict |
|---|---|---|---|
| `zod` v4 | ~57 KB | ~14 KB | ⚠️ **Acceptable** — only used server-side in `+server.ts` |

**Analysis**: Zod is only imported in the API endpoint (`+server.ts`), which runs on the server. It does NOT ship to the client bundle. **Keep it** — it provides valuable input validation. However, ensure it's not accidentally imported in any client-side Svelte component.

---

### R-002 · Remove `@tailwindcss/forms` (~4 KB CSS)

**Verdict**: 🔴 **Remove** — all form elements are fully custom-styled. The plugin's reset CSS is overridden by component styles. See TASK-014.

---

### R-003 · Replace FontAwesome with inline SVGs (save ~400 KB static assets)

**Verdict**: 🔴 **Replace** — only 19 icons used out of 2000+. Loading `all.min.css` (99.6 KB) + webfonts (~300 KB) for 19 icons is wasteful. See TASK-013.

| Current | Proposed |
|---|---|
| `all.min.css` — 99.6 KB | Inline SVGs — ~5 KB |
| `webfonts/` — ~300 KB | None needed |
| Static dir — 21.37 MB (2105 files) | 0 files |
| **2 render-blocking requests** | **0 extra requests** |

---

### R-004 · Remove duplicate CSS files (`base.css` + `variables.css`)

**Verdict**: 🔴 **Remove** — these files duplicate what's already in `layout.css` `@theme`. After Tailwind migration, delete both. See TASK-006.

| File | Size | Can remove? |
|---|---|---|
| `variables.css` | 968 B | ✅ Values already in `@theme` |
| `base.css` | 3,274 B | ✅ After migrating utilities to TW |

---

### R-005 · Current bundle sizes (client)

| Asset | Raw | Gzipped | Notes |
|---|---|---|---|
| Page CSS (base) | 32.59 KB | 7.14 KB | Includes Tailwind reset + custom styles |
| Page CSS (page) | 24.77 KB | 4.48 KB | Component scoped styles |
| Svelte runtime | 51.89 KB | 19.77 KB | `CqSBRKbH.js` — expected |
| Page JS (main) | 34.31 KB | 10.25 KB | `2.JDMi_iI5.js` — Configurator heavy |
| App bootstrap | 2.72 KB | 1.24 KB | Reasonable |
| **Total JS** | **~90 KB** | **~32 KB** | Good |
| **Total CSS** | **~57 KB** | **~12 KB** | Can be reduced by ~40% after dedup |
| **FontAwesome** | **~400 KB** | **~120 KB** | 🔴 Eliminate |

**After all optimizations**: Expected total bundle ~90 KB JS + ~35 KB CSS gzipped (excluding FA). Currently ~90 KB JS + ~132 KB CSS gzipped (with FA).

---

### R-006 · No unnecessary runtime libraries detected

The project is lean:
- `svelte` — required
- `@sveltejs/kit` — required  
- `tailwindcss` + `@tailwindcss/vite` — required (but clean up usage)
- `zod` — server-only, acceptable
- `typescript` — dev only
- No router libs, no state management libs, no animation libs — ✅ Good

**No libraries to add.** The project correctly avoids heavy frameworks. Keep it this way.
