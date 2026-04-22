<script>
    let {
        messengers = [
            { name: 'Telegram', icon: 'fa-brands fa-telegram', color: '#0088cc', href: '#' },
            { name: 'Viber', icon: 'fa-brands fa-viber', color: '#7360f2', href: '#' },
            { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: '#25D366', href: '#' },
            { name: 'Signal', icon: 'fa-solid fa-comment-dots', color: '#3A76F0', href: '#' }
        ],
        phoneNumber = "+38 (067) 215-88-88"
    } = $props();
</script>

<div class="flex flex-col gap-8">
    <div class="flex flex-wrap gap-4">
        {#each messengers as messenger}
            <a 
                href={messenger.href} 
                class="w-16 h-16 bg-white border-3 border-tire flex items-center justify-center text-3xl transition-all duration-100 hover:bg-concrete hover:-translate-x-0.5 hover:-translate-y-0.5 shadow-brutal-sm" 
                title={messenger.name}
                style="color: {messenger.color}"
            >
                <i class={messenger.icon}></i>
            </a>
        {/each}
    </div>

    <div class="font-heading font-black text-3xl md:text-4xl bg-tire text-white p-3 px-6 border-4 border-tire inline-block w-fit shadow-brutal-sm">
        {phoneNumber}
    </div>
</div>
