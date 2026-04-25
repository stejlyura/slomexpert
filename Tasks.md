# SlomExpert — Task List

> Tasks are ordered by priority. Always read `GEMINI.md` before starting any task.

---

## TASK-001 · Remove Cloudflare Bot Interstitial Challenge ⚡ HIGH PRIORITY

**Status:** TODO  
**Goal:** Completely remove the Cloudflare bot-check interstitial that pauses page rendering on slow devices.

### Why
Cloudflare's bot challenge injects a JS-heavy interstitial page before the real site loads. On slow mobile devices this blocks rendering, causing blank-screen flash and broken page flow. The site already has a **honeypot** on all forms — that's sufficient bot protection.

### Files to check & edit
- `src/app.html` — check for any CF challenge scripts, remove them
- `src/routes/+layout.svelte` — check for any CF Turnstile-based page-level guard logic (not the form widget, but any page-blocking check)
- `src/lib/Features/ContactForm.svelte` — keep `Turnstile` component, it is for forms only (NOT the interstitial)
- `src/lib/Features/Configurator.svelte` — same, keep form-level Turnstile

### What to look for
Any code pattern like:
```js
// Block rendering until CF challenge resolves
if (!cfToken) { /* show spinner / block page */ }
```
Or any `<script src="challenges.cloudflare.com/...">` that is used for **page-level** gating (not the Turnstile form widget).

> **Note:** The Turnstile widget in ContactForm and Configurator is **FORM-level** — keep it. Only remove page-level blocking.

### Expected result
Page renders immediately on load. No interstitial, no spinner waiting for CF verification at page level.

---

## TASK-002 · Fix Phone Number Validation in ContactForm ⚡ HIGH PRIORITY

**Status:** TODO  
**Goal:** Make the phone field accept valid Ukrainian phone numbers like `098 234 67 77` without validation errors.

### Why
Users enter valid Ukrainian numbers (e.g. `098 234 67 77`) and get "invalid input" errors. The `formatUkrainianPhone()` formatter correctly transforms the input to `+38 (098) 234-67-77`, but the HTML `pattern` attribute validation on the underlying `<input>` may not see the formatted value because the Input component uses a controlled value approach.

### Files to edit
1. **`src/lib/shared/utils/phone.ts`** — verify `formatUkrainianPhone()` logic
2. **`src/lib/Features/ContactForm.svelte`** — check the Input binding for phone:
   ```svelte
   <Input 
     value={phone}         <!-- NOT bind:value — may cause mismatch -->
     type="tel" 
     pattern="^\\+38\\s\\(0\\d{2}\\)\\s\\d{3}-\\d{2}-\\d{2}$"
     oninput={handlePhoneInput}
   />
   ```
3. **`src/lib/shared/ui/Input.svelte`** — check how `value` prop is applied to the DOM `<input>`. If the component doesn't propagate the updated `value` back to the DOM after formatting, the browser sees the raw typed value, which doesn't match the pattern.

### Root cause hypothesis
The `Input` component likely renders `<input {value} ...>` which sets the initial value but may not reactively update the DOM value when `value` prop changes in Svelte 5. The browser's constraint validation sees the unformatted raw text.

### Fix approach
Option A (preferred): In `Input.svelte`, use a reactive effect to imperatively set `inputEl.value = value` whenever the `value` prop changes:
```ts
let inputEl: HTMLInputElement;
$effect(() => { if (inputEl) inputEl.value = value ?? ''; });
```
Option B: In `ContactForm.svelte`, remove the `pattern` attribute and do manual validation in `handleSubmit()` by checking that `phone` matches the regex after formatting.

### Validation pattern
```
/^\+38\s\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$/
```
This must match `+38 (098) 234-67-77`.

### Test cases
- `098 234 67 77` → valid ✓
- `0982346777` → valid ✓ 
- `+380982346777` → valid ✓
- `123` → invalid ✗ (too short)
- `abc` → invalid ✗

---

## TASK-003 · Improve Largest Contentful Paint (LCP) — 8.0s → < 2.5s 🚀 HIGH PRIORITY

**Status:** TODO  
**Goal:** Fix the critical LCP score (currently 0.02 / 8.0s). This is the most impactful performance issue.

### Lighthouse Data Summary
- **FCP**: 2.0s (score 0.85) — acceptable
- **LCP**: 8.0s (score 0.02) — **CRITICAL, needs fix**
- **Speed Index**: 2.0s (score 0.99) — good

### Why LCP is 8s
The LCP element is likely the hero image or a large heading in `HeroCarousel.svelte` or `Home.svelte`. Common causes:
1. Hero image is not preloaded (`<link rel="preload">` missing)
2. Hero image is lazy-loaded (`loading="lazy"` should be `loading="eager"` for LCP)
3. Hero image is loaded via JavaScript (carousel initializes after JS load)
4. Large image without proper `width/height` or `srcset`

### Files to check
- `src/lib/Features/HeroCarousel.svelte` — check the first/hero image
- `src/lib/Pages/Home.svelte` — check what element is rendered first (largest)
- `src/app.html` — add preload hints for critical resources

### Fix approach
1. **Identify the LCP element** — likely `HeroCarousel`'s first slide image
2. **Add `<link rel="preload">` in `src/app.html`** for the hero image:
   ```html
   <link rel="preload" as="image" href="/hero.webp" />
   ```
3. **Set `loading="eager"` and `fetchpriority="high"`** on the first carousel image:
   ```html
   <img src="/hero.webp" loading="eager" fetchpriority="high" alt="..." />
   ```
4. **Convert images to WebP** if not already (check `static/` folder for image formats)
5. **Add `width` and `height` attributes** to prevent layout shifts
6. **If carousel uses JS to show first slide** — make first slide visible via CSS by default, no JS needed for initial render

### Expected result
LCP < 2.5s. Lighthouse LCP score > 0.5.

---

## TASK-004 · Defer Non-Critical JavaScript Loading 🚀 MEDIUM PRIORITY

**Status:** TODO  
**Goal:** Load JavaScript after the page is rendered (visually complete), so the page paints fast and JS loads in the background while the user reads.

### Why
Currently JS may block or delay page rendering. Forms won't work immediately on slow connections, but the page content should be visible first. This improves FCP and TTI perception.

### Approach

#### 1. SvelteKit JS chunking (already handled by Vite)
SvelteKit already code-splits JS by route. Verify in `vite.config.ts` that no `manualChunks` is causing large bundles.

#### 2. Defer Cloudflare Turnstile script
In `src/app.html`, the Turnstile script is loaded with `async defer` — this is correct. Verify it's not blocking:
```html
<!-- Current (correct): -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
```

#### 3. Lazy-load non-critical feature components
In `src/lib/Pages/Home.svelte`, use dynamic imports for below-the-fold components:
```svelte
<script>
  import { onMount } from 'svelte';
  let ReviewForm = $state(null);
  
  onMount(async () => {
    const mod = await import('$lib/Features/ReviewForm.svelte');
    ReviewForm = mod.default;
  });
</script>

{#if ReviewForm}
  <svelte:component this={ReviewForm} />
{:else}
  <div class="review-placeholder" style="min-height: 200px;"></div>
{/if}
```

Apply lazy loading to: `ReviewForm`, `Configurator` (if below fold), `MessengerBlock`.
**Keep eager loading for:** `ContactForm` (in hero area), `HeroCarousel`.

#### 4. Verify `+layout.svelte` JS usage
The `onMount` in `+layout.svelte` controls the page loader. Ensure the loader doesn't block paint by using CSS animations instead of JS-controlled opacity.

### Files to edit
- `src/app.html` — verify script attributes
- `src/lib/Pages/Home.svelte` — add dynamic imports for below-fold components
- `src/routes/+layout.svelte` — minimize JS in critical path

### Expected result
Page content visible within FCP window. JS for forms loads asynchronously. Forms may have ~0.5-1s delay on slow connections but page text/layout is visible immediately.

---

## TASK-005 · Inline Critical CSS in HTML 📦 MEDIUM PRIORITY

**Status:** TODO  
**Goal:** Inline the critical (above-the-fold) CSS directly into the HTML response so the browser can render the page without waiting for a separate CSS file download.

### Decision criteria (read before implementing)
Only implement if:
- The total CSS size after inlining is **< 14KB** (one TCP round-trip)
- The site's build process supports it
- It doesn't make the HTML significantly larger than the CSS file saves

If inlining would make things worse (large CSS, complex build), **do not implement** — just document why and skip this task.

### How to check
1. Build the project: `npm run build`
2. Check `.svelte-kit/output/client/_app/immutable/assets/*.css` — note file sizes
3. If total critical CSS < 10KB → proceed with inlining
4. If > 20KB → skip, add note here

### Implementation approach (if proceeding)
SvelteKit with Vite supports inlining small CSS via Vite config:

In `vite.config.ts`:
```ts
export default defineConfig({
  build: {
    cssCodeSplit: false,  // bundles all CSS together (only if small)
  }
});
```

Or use a Vite plugin like `vite-plugin-critical` to extract and inline critical CSS.

Alternatively, manually inline the CSS variables and base styles in `src/app.html`:
```html
<style>
  :root { --color-tire: #16181a; --color-orange: #ff5a00; --color-concrete: #e8ecef; }
  body { background: var(--color-concrete); margin: 0; font-family: system-ui, sans-serif; }
</style>
```

### Files to check/edit
- `vite.config.ts`
- `src/app.html`
- `src/routes/layout.css` (current CSS entry point)

### Expected result
If implemented: FCP improves by 200-400ms (eliminates CSS render-blocking round-trip).
If skipped: Add a comment here explaining the CSS size and why it was not done.

---

## TASK-006 · Add Services Section to the Website 🏗️ MEDIUM PRIORITY

**Status:** TODO  
**Goal:** Add a "Наші послуги" (Our Services) section to the homepage, populated from the services list in `Prices.md`.

### Services data (from `Prices.md`)
The services are grouped into 6 categories:

1. **Демонтаж в квартирах та офісах**
   - Демонтаж стяжки, штукатурки, стін та перегородок, плитки, паркету, ламінату, дерев'яних підлог, дверних та віконних коробок, знімання шпалер

2. **Алмазна різка бетону та цегли**
   - Різка стін та перекриттів, фундаментів, вирізання проємів в стінах/перекриттях, розширення проємів, вирізання підвіконних тумб, балконних екранів, бетонних сантехкабін, різка штроб

3. **Алмазне свердління отворів в бетоні та цеглі**

4. **Механізований демонтаж будівель**
   - Демонтаж фундаментів, старих будівель, будинків

5. **Підсилення проємів металоконструкціями**

6. **Прибирання та вивезення будівельного сміття**
   - Фасування сміття в мішки, переміщення та завантаження, вивезення (Газель, ЗІЛ, Камаз)

### Files to edit
- `src/lib/Pages/Home.svelte` — add `<Services />` section import and placement
- **Create new file**: `src/lib/Widgets/Services.svelte` — new Services section component

### Design requirements
- **Max CSS, minimal JS** — use CSS Grid/Flexbox for layout
- Match brutalist design: black borders, orange accents, uppercase headings
- Each category = a card with `.card-brutal` class
- Sub-items listed below category title
- Responsive: 1 column mobile, 2-3 columns desktop
- NO JavaScript needed for this component — pure HTML + CSS

### Component structure (`Services.svelte`)
```svelte
<section class="services-section" id="services">
  <div class="container">
    <h2 class="section-title">НАШІ ПОСЛУГИ</h2>
    <div class="services-grid">
      {#each services as service}
        <div class="card-brutal service-card">
          <h3 class="service-title">{service.category}</h3>
          {#if service.items.length}
            <ul class="service-items">
              {#each service.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          {/if}
        </div>
      {/each}
    </div>
  </div>
</section>
```

### Placement in Home.svelte
Place the Services section **after** the hero/contact section and **before** the configurator or reviews. It should be a natural part of the page flow.

### Expected result
A fully styled services grid visible on the homepage. No JS required. Works with CSS animations only (hover effects on cards via CSS `:hover`).

---

## TASK-007 · Other Lighthouse Performance Improvements 📊 LOW PRIORITY

**Status:** TODO  
**Goal:** Address remaining Lighthouse audit failures beyond LCP.

> Run only after TASK-003 is complete. Check fresh Lighthouse report first.

### Areas to investigate
1. **Total Blocking Time (TBT)** — if high, look for large synchronous JS on the main thread
2. **Cumulative Layout Shift (CLS)** — ensure all images have `width`/`height`, fonts don't cause layout shifts
3. **Render-blocking resources** — check for any synchronous `<script>` or `<link rel="stylesheet">` in `<head>`
4. **Unused JavaScript** — use Lighthouse "Coverage" tab to identify unused chunks
5. **Image formats** — ensure all images in `static/` are WebP or AVIF
6. **Font loading** — if using Google Fonts, add `display=swap` and preconnect

### Files to check
- `src/app.html` — resource hints
- `src/routes/layout.css` — font imports
- `static/` — image assets
- All `.svelte` component files for `<img>` tags missing `width`/`height`

---

## Completed Tasks
*(Move tasks here when done, with date and summary)*

---

## Notes
- Always run `npm run build` before testing Lighthouse (test prod build, not dev server)
- Deploy to Cloudflare Pages for real-world testing: `npm run deploy` or push to git
- Lighthouse is run on mobile throttling by default — target mobile scores
