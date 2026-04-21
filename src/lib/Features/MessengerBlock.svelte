<script>
    export let messengers = [
        { name: 'Telegram', icon: 'fa-brands fa-telegram', color: '#0088cc', href: '#' },
        { name: 'Viber', icon: 'fa-brands fa-viber', color: '#7360f2', href: '#' },
        { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#25D366', href: '#' },
        { name: 'Signal', icon: 'fa-solid fa-comment-dots', color: '#3A76F0', href: '#' }
    ];
    export let phoneNumber = "+38 (067) 215-88-88";
</script>

<div class="messenger-block">
    <div class="messengers-grid">
        {#each messengers as messenger}
            <a 
                href={messenger.href} 
                class="messenger-btn shadow-brutal-sm" 
                title={messenger.name}
                style="--icon-color: {messenger.color}"
            >
                <i class={messenger.icon}></i>
            </a>
        {/each}
    </div>

    <div class="phone-display shadow-brutal-sm">
        {phoneNumber}
    </div>
</div>

<style>
    .messenger-block {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .messengers-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .messenger-btn {
        width: 4rem;
        height: 4rem;
        background-color: var(--color-white);
        border: var(--border-width) solid var(--color-tire);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.875rem;
        color: var(--icon-color);
        text-decoration: none;
        transition: transform var(--transition-fast), background-color var(--transition-fast);
    }

    .messenger-btn:hover {
        background-color: var(--color-concrete);
        transform: translate(-2px, -2px);
    }

    .phone-display {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 1.875rem;
        background-color: var(--color-tire);
        color: var(--color-white);
        padding: 0.75rem 1.5rem;
        border: var(--border-width-lg) solid var(--color-tire);
        display: inline-block;
        width: fit-content;
    }

    @media (min-width: 768px) {
        .phone-display {
            font-size: 2rem;
        }
    }
</style>
