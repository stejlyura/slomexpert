<script>
    import Icon from "../shared/ui/Icon.svelte";
    let {
        messengers = [
            { name: 'Telegram', icon: 'telegram', color: '#0088cc', href: 'https://t.me/+380672158888' },
            { name: 'Viber', icon: 'viber', color: '#7360f2', href: 'viber://chat?number=%2B380672158888' },
            { name: 'WhatsApp', icon: 'whatsapp', color: '#25D366', href: 'https://wa.me/380672158888' }
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
                aria-label="Написати у {messenger.name}"
                target="_blank"
                rel="noopener noreferrer"
                style="color: {messenger.color}"
            >
                <Icon name={messenger.icon} />
            </a>
        {/each}
    </div>

    <a 
        href="tel:+380672158888" 
        class="font-heading font-black text-3xl md:text-4xl bg-tire text-white p-3 px-6 border-4 border-tire inline-block w-fit shadow-brutal-sm no-underline hover:bg-orange transition-colors duration-100"
        aria-label="Подзвонити нам: {phoneNumber}"
    >
        {phoneNumber}
    </a>
</div>
