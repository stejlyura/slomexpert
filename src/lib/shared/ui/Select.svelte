<script>
    export let value = "";
    export let options = []; // Array of { value, label }
    export let placeholder = "";
    export let className = "";
    export let name = "";
    export let id = "";
    export let required = false;
</script>

<div class="select-wrapper {className}">
    <select 
        {id}
        {name}
        {required}
        bind:value
        class="select-brutal"
        on:change
    >
        {#if placeholder}
            <option value="" disabled selected hidden>{placeholder}</option>
        {/if}
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
        <slot />
    </select>
    <div class="select-arrow">
        <i class="fa-solid fa-chevron-down"></i>
    </div>
</div>

<style>
    .select-wrapper {
        position: relative;
        width: 100%;
    }

    .select-brutal {
        width: 100%;
        background-color: var(--color-concrete);
        border: var(--border-width-lg) solid var(--color-tire);
        padding: 1rem;
        padding-right: 3rem; /* Space for arrow */
        font-family: var(--font-sans);
        font-weight: 600;
        outline: none;
        cursor: pointer;
        appearance: none;
        transition: border-color var(--transition-base), box-shadow var(--transition-base);
    }

    .select-brutal:focus {
        border-color: var(--color-orange);
        box-shadow: 4px 4px 0px var(--color-tire);
    }

    .select-arrow {
        position: absolute;
        right: 1.25rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--color-tire);
        font-size: 0.8rem;
    }

    .select-brutal:focus + .select-arrow {
        color: var(--color-orange);
    }
</style>
