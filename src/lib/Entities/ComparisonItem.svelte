<script>
    import Icon from "../shared/ui/Icon.svelte";
    let { text = "", type = "positive" } = $props();
</script>

<li 
    class="flex items-start gap-3 font-bold list-none {type === 'positive' ? 'text-tire text-lg' : 'text-steel line-through decoration-red-500/50 decoration-2 opacity-80'}"
>
    <span class="text-xl mt-0.5 {type === 'positive' ? 'text-orange' : 'text-red-500'}">
        {#if type === 'positive'}
            <Icon name="check" />
        {:else}
            <Icon name="xmark" />
        {/if}
    </span>
    <span>{text}</span>
</li>

