<script>
    let {
        icon = "",
        title = "",
        description = "",
        variant = 'white'
    } = $props();
</script>

<div 
    class="p-6 border-4 border-tire transition-transform duration-200 flex flex-col gap-4 hover:-translate-y-2 shadow-brutal-sm {variant === 'white' ? 'bg-white text-tire' : 'bg-orange text-white'}"
>
    <div class="text-4xl">{icon}</div>
    <h4 class="font-heading font-bold text-xl uppercase">{title}</h4>
    <p class="font-medium leading-[1.4] {variant === 'white' ? 'text-steel' : 'text-white'}">{description}</p>
</div>
