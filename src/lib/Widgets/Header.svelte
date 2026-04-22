<script lang="ts">
    import Button from "../shared/ui/Button.svelte";

    export interface NavLink {
        href: string;
        label: string;
    }

    let {
        links = [
            { href: "#experience", label: "Про нас" },
            { href: "#services", label: "Послуги" },
            { href: "#calculator", label: "Конфігуратор" },
        ],
    }: { links?: NavLink[] } = $props();
</script>

<input type="checkbox" id="mobile-menu-toggle" class="peer hidden" />

<header class="bg-white border-b-4 border-tire sticky top-0 z-[100] header">
    <div class="max-w-[80rem] mx-auto px-4">
        <div class="flex justify-between items-center h-20">
            <a href="/" class="flex items-center gap-2 no-underline text-tire">
                <span class="text-4xl">🏗️</span>
                <span class="font-heading font-black text-2xl tracking-tighter">
                    SLOM<span class="text-orange">EXPERT</span>
                </span>
            </a>

            <nav class="hidden md:flex gap-8">
                {#each links as link}
                    <a href={link.href} class="font-semibold no-underline text-tire transition-colors duration-100 hover:text-orange">{link.label}</a>
                {/each}
            </nav>

            <div class="hidden sm:block">
                <Button
                    href="#contact1"
                    variant="orange"
                    className="px-6 py-3 text-sm"
                >
                    Замовити дзвінок
                </Button>
            </div>

            <label for="mobile-menu-toggle" class="block md:hidden text-3xl cursor-pointer text-tire p-2">
                <i class="fa-solid fa-bars peer-checked:hidden"></i>
                <i class="fa-solid fa-xmark hidden peer-checked:block"></i>
            </label>
        </div>
    </div>
</header>

<nav id="mobile-menu-content" class="hidden peer-checked:flex flex-col bg-tire text-white font-heading font-bold text-xl border-b-4 border-orange sticky top-20 z-[90]">
    {#each links as link}
        <a href={link.href} class="p-4 border-b border-gray-700 no-underline color-inherit hover:bg-gray-800">
            <label for="mobile-menu-toggle" class="cursor-pointer block w-full">
                {link.label}
            </label>
        </a>
    {/each}
    <a href="#contact1" class="p-4 bg-orange text-center no-underline color-inherit hover:bg-orange-hover">
        <label for="mobile-menu-toggle" class="cursor-pointer block w-full">
            Замовити дзвінок
        </label>
    </a>
</nav>

<style>
    /* We still need a tiny bit of CSS for the icon toggle because peer-checked doesn't work deep inside sibling tree easily without specific setup */
    #mobile-menu-toggle:checked ~ .header .fa-bars {
        display: none;
    }
    #mobile-menu-toggle:checked ~ .header .fa-xmark {
        display: block;
    }
</style>
