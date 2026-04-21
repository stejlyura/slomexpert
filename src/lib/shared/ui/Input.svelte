<script>
    let {
        value = $bindable(""),
        type = "text",
        placeholder = "",
        required = false,
        className = "",
        name = "",
        id = "",
        ...rest
    } = $props();
</script>

<input 
    {id}
    {name}
    {type}
    {placeholder}
    {required}
    bind:value
    class="input-brutal {className}"
    {...rest}
/>

<style>
    .input-brutal {
        width: 100%;
        background-color: var(--color-concrete);
        border: var(--border-width-lg) solid var(--color-tire);
        padding: 1rem;
        font-family: var(--font-sans);
        font-weight: 600;
        outline: none;
        transition: border-color var(--transition-base), box-shadow var(--transition-base);
    }

    .input-brutal:focus {
        border-color: var(--color-orange);
        /* Slight shadow on focus to make it pop */
        box-shadow: 4px 4px 0px var(--color-tire);
    }

    .input-brutal::placeholder {
        color: var(--color-steel);
        opacity: 0.7;
    }
</style>
