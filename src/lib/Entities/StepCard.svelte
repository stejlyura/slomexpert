<script>
    let {
        number = 1,
        title = "",
        description = "",
        variant = "white"
    } = $props();
</script>

<div 
    class="p-6 border-4 relative z-10 text-center flex flex-col items-center gap-2 {variant === 'white' ? 'bg-white text-tire border-tire shadow-brutal-sm' : 'bg-tire text-white border-orange shadow-brutal-orange'}"
>
    <div 
        class="w-12 h-12 font-heading font-black text-2xl flex items-center justify-center border-2 rounded-full mb-4 {variant === 'white' ? 'bg-orange text-white border-tire' : 'bg-white text-orange border-orange'}"
    >
        {number}
    </div>
    <h4 class="font-bold text-lg uppercase">{title}</h4>
    <p class="text-sm font-medium">{description}</p>
</div>
