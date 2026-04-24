<script>
    let { year = new Date().getFullYear() } = $props();
</script>

<footer class="bg-tire text-steel py-12 border-t-4 border-orange text-center md:text-left">
    <div class="container-brutal">
        <div class="flex flex-col md:flex-row justify-between items-center gap-8">
            <!-- Branding -->
            <div class="branding">
                <div class="font-heading font-black text-2xl text-white mb-2">
                    SLOM<span class="text-orange">EXPERT</span>
                </div>
                <p class="text-sm font-medium leading-relaxed">
                    Професійні демонтажні роботи по всій території України.<br>
                    Без вихідних та свят.
                </p>
            </div>

            <!-- Contacts -->
            <div class="font-bold text-sm">
                <p class="mb-1">
                    <a href="https://www.google.com/maps/search/?api=1&query=Київ+вул+Будівельна+10" target="_blank" rel="noopener noreferrer" class="no-underline hover:text-orange">м. Київ, вул. Будівельна, 10</a>
                </p>
                <p class="mb-1">
                    <a href="tel:+380672158888" class="no-underline hover:text-orange">+38 (067) 215-88-88</a>
                </p>
                <p>
                    <a href="mailto:info@slomexpert.ua" class="no-underline hover:text-orange">info@slomexpert.ua</a>
                </p>
            </div>

            <!-- Copyright -->
            <div class="text-[0.75rem] font-semibold opacity-60">
                <p>&copy; {year} Slomexpert. Всі права захищено.</p>
                <p class="mt-1">Розроблено брутально та з любов'ю. Без JS.</p>
            </div>
        </div>
    </div>
</footer>
