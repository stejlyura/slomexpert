<script>
    export let type = "checkbox"; // "checkbox" or "radio"
    export let name = "";
    export let value = "";
    export let checked = false;
    export let label = "";
    export let className = "";
    export let id = "";
</script>

<label class="toggle-brutal {className} {checked ? 'is-checked' : ''}" for={id}>
    <input 
        {id}
        {type}
        {name}
        {value}
        bind:checked
        class="hidden"
        on:change
    />
    <slot>{label}</slot>
</label>

<style>
    .toggle-brutal {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border: 2px solid var(--color-tire);
        background-color: var(--color-white);
        color: var(--color-tire);
        font-family: var(--font-sans);
        font-weight: 700;
        cursor: pointer;
        transition: all var(--transition-fast);
        user-select: none;
        text-align: center;
    }

    .toggle-brutal:hover {
        background-color: var(--color-orange);
        color: var(--color-white);
    }

    .toggle-brutal.is-checked {
        background-color: var(--color-tire);
        color: var(--color-white);
    }

    .hidden {
        display: none;
    }
</style>
