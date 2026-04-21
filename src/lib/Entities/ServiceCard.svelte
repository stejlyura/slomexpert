<script>
    let {
        icon = "",
        title = "",
        description = "",
        variant = 'white'
    } = $props();
</script>

<div class="service-card {variant} shadow-brutal-sm">
    <div class="icon">{icon}</div>
    <h4 class="title">{title}</h4>
    <p class="description">{description}</p>
</div>

<style>
    .service-card {
        padding: 1.5rem;
        border: var(--border-width-lg) solid var(--color-tire);
        transition: transform var(--transition-base);
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .service-card:hover {
        transform: translateY(-8px);
    }

    .white {
        background-color: var(--color-white);
        color: var(--color-tire);
    }

    .orange {
        background-color: var(--color-orange);
        color: var(--color-white);
    }

    .icon {
        font-size: 2.5rem;
    }

    .title {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.25rem;
        text-transform: uppercase;
    }

    .description {
        font-weight: 500;
        line-height: 1.4;
    }

    .white .description {
        color: var(--color-steel);
    }
</style>
