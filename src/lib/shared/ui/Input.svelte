<script lang="ts">
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

    let inputEl = $state<HTMLInputElement>();

    // Force DOM synchronization for controlled input (e.g. phone masks)
    $effect(() => {
        if (inputEl && inputEl.value !== (value ?? "")) {
            inputEl.value = value ?? "";
        }
    });
</script>

<input 
    {id}
    {name}
    {type}
    {placeholder}
    aria-label={placeholder}
    {required}
    bind:this={inputEl}
    bind:value
    class="w-full bg-concrete border-4 border-tire p-4 font-sans font-semibold outline-none transition-all duration-200 focus:border-orange focus:shadow-brutal-sm focus-visible:ring-3 focus-visible:ring-orange/30 placeholder:text-steel placeholder:opacity-70 {className}"
    {...rest}
/>
