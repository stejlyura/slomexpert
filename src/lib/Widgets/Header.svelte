<script lang="ts">
    import Button from "../shared/ui/Button.svelte";

    export interface NavLink {
        href: string;
        label: string;
    }

    let {
        links = [
            { href: "#experience", label: "Про нас" },
            { href: "#services", label: "Послуги" },
            { href: "#calculator", label: "Конфігуратор" },
        ],
    }: { links?: NavLink[] } = $props();
</script>

<input type="checkbox" id="mobile-menu-toggle" class="hidden-toggle" />

<header class="header">
    <div class="container">
        <div class="header-inner">
            <a href="/" class="logo">
                <span class="logo-emoji">🏗️</span>
                <span class="logo-text"
                    >SLOM<span class="text-orange">EXPERT</span></span
                >
            </a>

            <nav class="desktop-nav">
                {#each links as link}
                    <a href={link.href} class="nav-link">{link.label}</a>
                {/each}
            </nav>

            <div class="header-cta">
                <Button
                    href="#contact1"
                    variant="orange"
                    className="px-6 py-3 text-sm"
                >
                    Замовити дзвінок
                </Button>
            </div>

            <label for="mobile-menu-toggle" class="mobile-toggle-btn">
                <i class="fa-solid fa-bars menu-icon-bars"></i>
                <i class="fa-solid fa-xmark menu-icon-close"></i>
            </label>
        </div>
    </div>
</header>

<nav id="mobile-menu-content" class="mobile-nav">
    {#each links as link}
        <a href={link.href} class="mobile-nav-link">
            <label for="mobile-menu-toggle" class="label-block">
                {link.label}
            </label>
        </a>
    {/each}
    <a href="#contact1" class="mobile-nav-link cta">
        <label for="mobile-menu-toggle" class="label-block">
            Замовити дзвінок
        </label>
    </a>
</nav>

<style>
    .header {
        background-color: var(--color-white);
        border-bottom: var(--border-width-lg) solid var(--color-tire);
        position: sticky;
        top: 0;
        z-index: 100;
    }

    .container {
        max-width: 80rem; /* 1280px */
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .header-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 5rem; /* 80px */
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
        color: var(--color-tire);
    }

    .logo-emoji {
        font-size: 2.25rem;
    }

    .logo-text {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 1.5rem;
        letter-spacing: -0.05em;
    }

    .text-orange {
        color: var(--color-orange);
    }

    .desktop-nav {
        display: none;
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .desktop-nav {
            display: flex;
        }
    }

    .nav-link {
        font-weight: 600;
        text-decoration: none;
        color: var(--color-tire);
        transition: color var(--transition-fast);
    }

    .nav-link:hover {
        color: var(--color-orange);
    }

    .header-cta {
        display: none;
    }

    @media (min-width: 640px) {
        .header-cta {
            display: block;
        }
    }

    .mobile-toggle-btn {
        display: block;
        font-size: 1.875rem;
        cursor: pointer;
        color: var(--color-tire);
        padding: 0.5rem;
    }

    @media (min-width: 768px) {
        .mobile-toggle-btn {
            display: none;
        }
    }

    .menu-icon-close {
        display: none;
    }

    /* CSS Logic for Mobile Menu */
    .hidden-toggle {
        display: none;
    }

    .mobile-nav {
        display: none;
        flex-direction: column;
        background-color: var(--color-tire);
        color: var(--color-white);
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.25rem;
        border-bottom: var(--border-width-lg) solid var(--color-orange);
        position: sticky;
        top: 5rem;
        z-index: 90;
    }

    #mobile-menu-toggle:checked ~ .mobile-nav {
        display: flex;
    }

    #mobile-menu-toggle:checked ~ .header .menu-icon-bars {
        display: none;
    }

    #mobile-menu-toggle:checked ~ .header .menu-icon-close {
        display: block;
    }

    .mobile-nav-link {
        padding: 1rem;
        border-bottom: 1px solid #374151; /* gray-700 */
        text-decoration: none;
        color: inherit;
    }

    .mobile-nav-link:hover {
        background-color: #1f2937; /* gray-800 */
    }

    .mobile-nav-link.cta {
        background-color: var(--color-orange);
        text-align: center;
        border-bottom: none;
    }

    .label-block {
        cursor: pointer;
        display: block;
        width: 100%;
    }
</style>
