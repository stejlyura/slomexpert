<script>
    let {
        number = 1,
        title = "",
        description = "",
        variant = "white"
    } = $props();
</script>

<div class="step-card {variant} shadow-brutal-sm">
    <div class="badge">{number}</div>
    <h4 class="title">{title}</h4>
    <p class="description">{description}</p>
</div>

<style>
    .step-card {
        padding: 1.5rem;
        border: var(--border-width-lg) solid var(--color-tire);
        position: relative;
        z-index: 10;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    .white {
        background-color: var(--color-white);
        color: var(--color-tire);
    }

    .tire {
        background-color: var(--color-tire);
        color: var(--color-white);
        border-color: var(--color-orange);
        box-shadow: var(--shadow-brutal-orange);
    }

    .badge {
        width: 3rem;
        height: 3rem;
        background-color: var(--color-orange);
        color: var(--color-white);
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid var(--color-tire);
        border-radius: 50%;
        margin-bottom: 1rem;
    }

    .tire .badge {
        background-color: var(--color-white);
        color: var(--color-orange);
        border-color: var(--color-orange);
    }

    .title {
        font-weight: 700;
        font-size: 1.125rem;
        text-transform: uppercase;
    }

    .description {
        font-size: 0.875rem;
        font-weight: 500;
    }
</style>
