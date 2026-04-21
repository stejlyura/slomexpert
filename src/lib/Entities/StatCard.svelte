<script>
    export let value = "";
    export let label = "";
</script>

<div class="stat-card">
    <div class="value">{value}</div>
    <div class="label">{label}</div>
</div>

<style>
    .stat-card {
        border: var(--border-width-lg) solid var(--color-orange);
        padding: 1.5rem;
        text-align: center;
        background-color: rgba(22, 24, 26, 0.5); /* tire color with opacity */
        position: relative;
        overflow: hidden;
        color: var(--color-white);
    }

    .value {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 3rem;
        color: var(--color-orange);
        margin-bottom: 0.5rem;
    }

    .label {
        font-weight: 700;
        font-size: 1.125rem;
    }
</style>
