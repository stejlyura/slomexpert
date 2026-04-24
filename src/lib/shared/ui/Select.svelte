<script lang="ts">
    import Icon from "./Icon.svelte";
    // Описуємо структуру для опцій
    export interface SelectOption {
        value: string | number;
        label: string;
    }

    // Дозволяємо value бути або рядком, або числом
    let {
        value = $bindable(""),
        options = [],
        placeholder = "",
        className = "",
        name = "",
        id = "",
        required = false,
        ...rest
    }: {
        value?: string | number;
        options?: SelectOption[];
        placeholder?: string;
        className?: string;
        name?: string;
        id?: string;
        required?: boolean;
        [key: string]: any;
    } = $props();
</script>

<div class="relative w-full {className}">
    <select 
        {id} 
        {name} 
        {required} 
        bind:value 
        class="peer w-full bg-concrete border-4 border-tire p-4 pr-12 font-sans font-semibold outline-none cursor-pointer appearance-none transition-all duration-200 focus:border-orange focus:shadow-brutal-sm focus-visible:ring-3 focus-visible:ring-orange/30" 
        {...rest}
    >
        {#if placeholder}
            <option value="" disabled selected hidden>{placeholder}</option>
        {/if}
        {#each options as option}
            <option value={option.value}>{option.label}</option>
        {/each}
    </select>
    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-tire text-[0.8rem] peer-focus:text-orange">
        <Icon name="chevron-down" />
    </div>
</div>

