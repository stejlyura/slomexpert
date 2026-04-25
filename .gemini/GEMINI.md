# SlomExpert — Project Context for AI Models

## Project Overview
**SlomExpert** (slomexpert.com) — Ukrainian demolition & construction services company website.
Built with **SvelteKit 5** (runes architecture), deployed on **Cloudflare Pages**.
Stack: SvelteKit 5, Svelte 5 runes ($props, $state, $derived, $bindable), TailwindCSS v4, TypeScript, Cloudflare Workers/Pages.

## Tech Stack
- **Framework**: SvelteKit 5 with SSG (static adapter via `@sveltejs/adapter-static` or Cloudflare adapter)
- **Reactivity**: Svelte 5 runes only — `$props()`, `$state()`, `$derived()`, `$bindable()`. NO legacy `export let` / `$:` syntax.
- **Styling**: TailwindCSS v4 (imported via `@plugin` in `layout.css`). Custom brutalist design with CSS variables: `--color-tire: #16181a`, `--color-orange: #ff5a00`, `--color-concrete: #e8ecef`.
- **Deployment**: Cloudflare Pages + Workers (API routes run as CF Workers)
- **Config files**: `svelte.config.js`, `vite.config.ts`, `wrangler.jsonc`

## Architecture (FSD — Feature-Sliced Design)
```
src/
  app.html              ← HTML shell
  routes/
    +layout.svelte      ← Global layout, CSS import, favicon, loader
    +page.svelte        ← Main page (renders Home component)
    layout.css          ← TailwindCSS v4 entry + global styles
    api/
      notify/+server.ts ← Cloudflare Worker API for form submissions
  lib/
    Pages/
      Home.svelte        ← Main page composition (all sections)
    Features/
      Configurator.svelte  ← Price calculator form
      ContactForm.svelte   ← Quick contact form (name + phone)
      HeroCarousel.svelte  ← Hero image slider
      MessengerBlock.svelte
      ReviewForm.svelte
    Widgets/             ← Larger composed blocks
    Entities/            ← Business entities
    shared/
      ui/                ← Reusable UI: Button, Input, Select, Checkbox, Turnstile, FeedbackMessage, SEO
      utils/
        phone.ts         ← formatUkrainianPhone() formatter
      seo/
      styles/
    assets/              ← Static assets (favicon.svg, images)
```

## Key Design Decisions

### Brutalist Design System
- Card style: `.card-brutal` (black border, box-shadow offset)
- Typography: uppercase headings, `font-black`, heavy weights
- Colors: black (`--color-tire`), orange (`--color-orange`), light grey (`--color-concrete`)
- No soft shadows — use hard pixel offsets

### Form Handling
- Forms use `Turnstile` (Cloudflare widget) for bot protection — **NOT** for general CF bot check
- Honeypot field: `website_url` hidden input — if filled, server rejects silently
- API: POST `/api/notify` → JSON payload `{ type, website_url, data: { name, phone, turnstileToken } }`
- Phone: Ukrainian format `+38 (0XX) XXX-XX-XX`, formatted live via `formatUkrainianPhone()`

### Security
- Honeypot on all forms (already implemented)
- Cloudflare Turnstile on contact/configurator forms
- NO Cloudflare Bot Fight Mode / Interstitial challenge pages — these were removed by request

### Environment Variables
- `PUBLIC_TURNSTILE_SITE_KEY` — public CF Turnstile key (in `.env`)
- Server-side secrets in Cloudflare worker environment (not in `.env`)

## Known Issues & Gotchas
1. **LCP is 8.0s** (Lighthouse score 0.02) — the hero image/largest element loads too late
2. **Cloudflare Bot Check interstitial** — was removed from layout (check `+layout.svelte`)
3. **Phone input validation** — pattern `^\\+38\\s\\(0\\d{2}\\)\\s\\d{3}-\\d{2}-\\d{2}$` must match formatted output exactly
4. **JS deferred loading** — scripts should load after page render (use `defer`/`async` on non-critical JS)
5. **CSS inlining** — small CSS chunks should be inlined in HTML for faster FCP

## Performance Targets (from Lighthouse)
| Metric | Current | Target |
|--------|---------|--------|
| FCP    | 2.0s    | < 1.8s |
| LCP    | 8.0s    | < 2.5s |
| TBT    | (check) | < 200ms |
| CLS    | (check) | < 0.1  |

## Component Conventions
- All components: Svelte 5 runes syntax
- Props: `let { propName = defaultValue } = $props();`
- State: `let value = $state(initialValue);`
- No `onMount` for UI logic — prefer CSS-driven animations
- Event handlers: `onclick={handler}` not `on:click={handler}` (Svelte 5 syntax)

## Services Offered (from Prices.md)
The site covers these demolition services:
- Demolition in apartments & offices (screed, plaster, walls, tiles, flooring, doors/windows, wallpapers)
- Diamond concrete/brick cutting (walls, slabs, foundations, openings, balcony panels, plumbing chases)
- Diamond drilling (concrete & brick)
- Mechanized building demolition (foundations, old buildings, houses)
- Metal construction reinforcement of openings
- Construction waste removal (bagging, loading, trucks: Gazelle, ZIL, KamAZ)

## File Naming
- Components: `PascalCase.svelte`
- Utilities: `camelCase.ts`
- Routes: SvelteKit conventions (`+page.svelte`, `+layout.svelte`, `+server.ts`)
