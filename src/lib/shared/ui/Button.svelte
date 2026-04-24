<script>
    let {
        variant = 'orange',
        type = 'button',
        className = '',
        href = '',
        children,
        ...rest
    } = $props();

    const variants = {
        orange: 'bg-[var(--color-orange)] text-[var(--color-white)] hover:bg-[var(--color-orange-hover)]',
        white: 'bg-[var(--color-white)] text-[var(--color-tire)] hover:bg-[var(--color-concrete)]',
        tire: 'bg-[var(--color-tire)] text-[var(--color-white)] hover:bg-[#25282b]'
    };
</script>

{#if href}
    <a 
        {href} 
        class="btn-brutal {variants[variant]} {className}"
        {...rest}
    >
        {@render children?.()}
    </a>
{:else}
    <button 
        {type} 
        class="btn-brutal {variants[variant]} {className}"
        {...rest}
    >
        {@render children?.()}
    </button>
{/if}

<style>
    /* Base styles are defined in layout.css @theme and @utility */
    .btn-brutal {
        /* Ensuring base styles are applied if not globally loaded yet */
        text-transform: uppercase;
        font-family: var(--font-heading);
        font-weight: 700;
    }
</style>
