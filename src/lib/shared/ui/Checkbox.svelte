<script lang="ts">
    // Описуємо всі пропси, які очікує компонент
    interface Props {
        type?: "checkbox" | "radio";
        name?: string;
        value?: string | number;
        checked?: boolean;
        group?: any;
        label?: string;
        className?: string;
        id?: string;
        [key: string]: any; // Дозволяє передавати будь-які інші HTML-атрибути (...rest)
    }

    let {
        type = "checkbox",
        name = "",
        value = "",
        checked = $bindable(false),
        group = $bindable(undefined),
        label = "",
        className = "",
        id = "",
        children,
        ...rest
    }: Props = $props();
</script>

<label class="toggle-brutal {className} {checked ? 'is-checked' : ''}" for={id}>
    {#if type === "radio"}
        <input
            {id}
            type="radio"
            {name}
            {value}
            bind:group
            class="hidden"
            {...rest}
        />
    {:else}
        <input
            {id}
            type="checkbox"
            {name}
            {value}
            bind:checked
            class="hidden"
            {...rest}
        />
    {/if}
    {@render children?.()}{label}
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
