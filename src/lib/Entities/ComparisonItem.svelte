<script>
    let { text = "", type = "positive" } = $props();
</script>

<li class="comparison-item {type}">
    <span class="icon">
        {#if type === 'positive'}
            <i class="fa-solid fa-check"></i>
        {:else}
            <i class="fa-solid fa-xmark"></i>
        {/if}
    </span>
    <span class="text">{text}</span>
</li>

<style>
    .comparison-item {
        display: flex;
        align-items: flex-start;
        gap: 0.75rem;
        font-weight: 700;
        list-style: none;
    }

    .icon {
        font-size: 1.25rem;
        margin-top: 0.125rem;
    }

    .positive {
        color: var(--color-tire);
        font-size: 1.125rem;
    }

    .positive .icon {
        color: var(--color-orange);
    }

    .negative {
        color: var(--color-steel);
        text-decoration: line-through;
        text-decoration-color: rgba(239, 68, 68, 0.5); /* red-500/50 */
        text-decoration-thickness: 2px;
        opacity: 0.8;
    }

    .negative .icon {
        color: #EF4444; /* red-500 */
    }
</style>
