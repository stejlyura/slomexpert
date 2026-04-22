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

<label 
    class="flex items-center justify-center gap-2 p-3 px-4 border-2 border-tire bg-white text-tire font-sans font-bold cursor-pointer transition-all duration-100 select-none text-center hover:bg-orange hover:text-white {className}" 
    class:bg-tire={type === 'radio' ? group === value : checked}
    class:text-white={type === 'radio' ? group === value : checked}
    for={id}
>
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
