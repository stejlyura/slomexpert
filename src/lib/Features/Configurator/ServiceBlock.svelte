<script lang="ts">
    import Icon from "$lib/shared/ui/Icon.svelte";

    let { 
        title, 
        icon, 
        items, 
        addButtonText, 
        onAdd, 
        isSubmitting,
        children,
        className = ""
    } = $props();
</script>

<div class="p-6 bg-concrete border-4 border-tire {className}">
    <h3 class="font-heading font-bold text-xl mb-4 flex items-center gap-2 text-tire">
        <Icon name={icon} className="text-orange" /> {title}
    </h3>
    
    {#each items as item, i (item.id)}
        <div class="{i > 0 ? 'pt-6 mt-6 border-t-2 border-dashed border-tire/20' : ''}">
            {@render children(item, i)}
        </div>
    {/each}

    <button 
        type="button" 
        class="mt-6 inline-flex items-center gap-2 font-sans font-bold text-sm uppercase text-orange bg-transparent border-none border-b-2 border-dashed border-orange pb-0.5 cursor-pointer transition-colors duration-150 hover:text-orange-hover" 
        onclick={onAdd} 
        disabled={isSubmitting}
    >
        <Icon name="plus" /> {addButtonText}
    </button>
</div>
