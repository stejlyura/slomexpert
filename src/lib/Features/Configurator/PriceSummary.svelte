<script lang="ts">
    let { 
        formattedTotal, 
        isSubmitting 
    } = $props();
</script>

<div class="pt-6 border-t-4 border-tire flex flex-col md:flex-row md:justify-between items-center gap-6">
    <div class="text-center md:text-left">
        <p class="font-bold text-[0.75rem] uppercase text-steel mb-1">Загальна сума згідно з прайсом:</p>
        <div class="font-heading font-black text-4xl md:text-5xl text-tire leading-none">
            <span id="totalPrice">{formattedTotal}</span>
            <span class="text-2xl text-orange">₴</span>
        </div>
    </div>
    <div class="flex flex-col items-center md:items-end gap-2">
        <button type="submit" class="bg-orange text-white border-none font-heading font-black text-xl uppercase p-5 px-10 cursor-pointer shadow-brutal transition-all duration-150 hover:bg-orange-hover active:translate-x-[3px] active:translate-y-[3px] active:shadow-[2px_2px_0_#16181A] w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "ВІДПРАВКА..." : "ЗАФІКСУВАТИ ЦІНУ"}
        </button>
    </div>
</div>
