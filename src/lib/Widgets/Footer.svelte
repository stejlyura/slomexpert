<script>
    let { year = new Date().getFullYear() } = $props();
</script>

<footer class="bg-tire text-steel py-12 border-t-4 border-orange text-center md:text-left">
    <div class="max-w-[80rem] mx-auto px-4">
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
                <p class="mb-1">м. Київ, вул. Будівельна, 10</p>
                <p>Email: info@slomexpert.ua</p>
            </div>

            <!-- Copyright -->
            <div class="text-[0.75rem] font-semibold opacity-60">
                <p>&copy; {year} Slomexpert. Всі права захищено.</p>
                <p class="mt-1">Розроблено брутально та з любов'ю. Без JS.</p>
            </div>
        </div>
    </div>
</footer>
