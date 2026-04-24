<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Checkbox from "$lib/shared/ui/Checkbox.svelte";
    import Icon from "$lib/shared/ui/Icon.svelte";

    let { 
        trashBags = $bindable(0), 
        truckPrice = $bindable(0), 
        isSubmitting = false 
    } = $props();
</script>

<div class="p-6 bg-white border-4 border-orange">
    <h3 class="font-heading font-bold text-xl mb-4 flex items-center gap-2 text-tire">
        <Icon name="truck-fast" className="text-orange" /> Вивезення сміття
    </h3>
    <div class="flex justify-between items-center bg-concrete border-2 border-tire p-3 mb-4 transition-colors duration-200 cursor-default hover:border-orange group">
        <span class="font-bold text-[0.9rem] text-tire">Фасування в мішки (100 ₴ / шт)</span>
        <Input
            id="trashBags"
            type="number"
            min="0"
            className="!w-20 !p-1 !px-2 !border-2 !text-center bg-white"
            placeholder="0"
            bind:value={trashBags}
            disabled={isSubmitting}
        />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Checkbox 
            type="radio" 
            name="truck" 
            value={0} 
            bind:group={truckPrice} 
            label="Без машини" 
            disabled={isSubmitting} 
        />
        <Checkbox 
            type="radio" 
            name="truck" 
            value={2500} 
            bind:group={truckPrice} 
            label="ЗІЛ 5т (+2500 ₴)" 
            disabled={isSubmitting} 
        />
        <Checkbox 
            type="radio" 
            name="truck" 
            value={4500} 
            bind:group={truckPrice} 
            label="КАМАЗ 10т (+4500 ₴)" 
            disabled={isSubmitting} 
        />
    </div>
</div>
