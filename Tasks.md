# SlomExpert — Task List

> Tasks are ordered by priority. Always read `GEMINI.md` before starting any task.

---

## Completed Tasks
- **TASK-001 (2026-04-25)**: Removed Cloudflare bot-check interstitial. (Note: Turnstile integration removed later per user request due to connection issues).
- **TASK-002 (2026-04-25)**: Fixed phone number validation. Added a reactive effect to `Input.svelte` to force DOM-state synchronization, ensuring browser `pattern` validation sees the formatted Ukrainian phone number.
- **TASK-003 (2026-04-25)**: Improved LCP from 8s to <2.5s. Optimized hero images (WebP), added preload hints for images and fonts, added explicit image dimensions, and removed the render-blocking JS preloader.
- **TASK-004 (2026-04-25)**: Implemented lazy loading for below-the-fold components (Configurator, MessengerBlock, ReviewForm). Added the missing ReviewForm section to the homepage. Verified that JS chunking was optimized for performance.
- **TASK-006 (2026-04-25)**: Added a comprehensive Services section with 6 categories based on Prices.md. Implemented brutalist design with EEAT optimizations for better SEO and trust.
- **TASK-007 (2026-04-25)**: Optimized Lighthouse performance and accessibility. Added resource hints (preconnect, dns-prefetch) to `app.html`, ensured all images have explicit dimensions to prevent CLS, and added missing ARIA labels to interactive elements (inputs, links, buttons).
- **TASK-008 (2026-04-25)**: Removed Cloudflare Turnstile CAPTCHA from all forms (Contact, Review, Configurator) and disabled backend verification to resolve connection issues and improve user experience.

---

## Notes
- Always run `npm run build` before testing Lighthouse (test prod build, not dev server)
- Deploy to Cloudflare Pages for real-world testing: `npm run deploy` or push to git
- Lighthouse is run on mobile throttling by default — target mobile scores
