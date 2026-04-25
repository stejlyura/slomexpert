<script>
    const serviceCategories = [
        {
            title: "Демонтаж в квартирах та офісах",
            icon: "🏢",
            description: "Повний спектр внутрішніх робіт зі збереженням опорних конструкцій та комунікацій.",
            items: [
                "Демонтаж стяжки",
                "Демонтаж штукатурки",
                "Демонтаж стін та перегородок",
                "Демонтаж плитки",
                "Демонтаж паркету та ламінату",
                "Дерев'яні підлоги",
                "Дверні та віконні коробки",
                "Знімання шпалер"
            ]
        },
        {
            title: "Алмазна різка бетону та цегли",
            icon: "💎",
            description: "Високоточна різка без вібрацій та пилу. Ідеально для житлових приміщень.",
            items: [
                "Різка стін та перекриттів",
                "Різка фундаментів",
                "Вирізання та розширення проємів",
                "Підвіконні тумби",
                "Балконні екрани",
                "Бетонні сантехкабіни",
                "Різка штроб під комунікації"
            ]
        },
        {
            title: "Алмазне свердління",
            icon: "🕳️",
            description: "Свердління отворів будь-якого діаметру в армованому бетоні, цеглі та камені.",
            items: [
                "Отвори під вентиляцію",
                "Отвори під сантехніку",
                "Отвори під електрику",
                "Глибоке свердління"
            ]
        },
        {
            title: "Механізований демонтаж",
            icon: "🚜",
            description: "Знесення капітальних споруд з використанням спеціалізованої важкої техніки.",
            items: [
                "Демонтаж фундаментів",
                "Демонтаж старих будівель",
                "Демонтаж приватних будинків",
                "Промисловий демонтаж"
            ]
        },
        {
            title: "Підсилення проємів",
            icon: "🏗️",
            description: "Професійний монтаж металоконструкцій для забезпечення стабільності будівлі після перепланування.",
            items: [
                "Монтаж швелерів",
                "Посилення кутником",
                "Зварювальні роботи",
                "Проектний розрахунок"
            ]
        },
        {
            title: "Вивезення сміття",
            icon: "🚛",
            description: "Організований збір, фасування та вивезення будівельних відходів на полігон.",
            items: [
                "Фасування в мішки",
                "Завантаження на авто",
                "Газель, ЗІЛ, Камаз",
                "Прибирання території"
            ]
        }
    ];
</script>

<section class="py-16 md:py-24 bg-concrete border-y-4 border-tire" id="services">
    <div class="container-brutal">
        <div class="mb-16 text-center">
            <h2 class="font-heading font-black text-4xl md:text-5xl uppercase mb-6">НАШІ ПОСЛУГИ</h2>
            <p class="max-w-3xl mx-auto text-lg font-bold text-steel">
                Професійний підхід до кожного об'єкта. Використовуємо сертифіковане обладнання Hilti та Husqvarna для досягнення найкращого результату.
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each serviceCategories as category}
                <div class="card-brutal group hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-200">
                    <div class="flex items-center gap-4 mb-6">
                        <span class="text-4xl p-3 bg-concrete border-2 border-tire shadow-brutal-sm group-hover:bg-orange group-hover:text-white transition-colors">
                            {category.icon}
                        </span>
                        <h3 class="font-heading font-black text-xl leading-tight">{category.title}</h3>
                    </div>
                    
                    <p class="mb-6 text-sm leading-relaxed border-l-4 border-orange pl-4 italic font-semibold">
                        {category.description}
                    </p>

                    <ul class="space-y-2">
                        {#each category.items as item}
                            <li class="flex items-start gap-2 text-sm font-bold">
                                <span class="text-orange">/</span>
                                {item}
                            </li>
                        {/each}
                    </ul>

                    <div class="mt-8 pt-6 border-t-2 border-tire/10 flex justify-between items-center opacity-60">
                        <span class="text-xs uppercase font-black tracking-wider">Expert Grade</span>
                        <div class="flex gap-1">
                            <div class="w-2 h-2 bg-orange"></div>
                            <div class="w-2 h-2 bg-tire"></div>
                            <div class="w-2 h-2 bg-steel"></div>
                        </div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-20 p-8 border-4 border-dashed border-tire bg-white/50 text-center">
            <h4 class="font-heading font-black text-2xl mb-4">ШУКАЄТЕ ЩОСЬ ОСОБЛИВЕ?</h4>
            <p class="font-bold mb-6">Ми виконуємо складні та нестандартні задачі, які потребують інженерного підходу та спеціальної техніки.</p>
            <a href="#contact1" class="btn-brutal text-lg">ОТРИМАТИ КОНСУЛЬТАЦІЮ</a>
        </div>
    </div>
</section>

<style>
    /* EEAT Optimization: Adding subtle expertise markers */
    .card-brutal {
        display: flex;
        flex-direction: column;
    }

    .card-brutal ul {
        flex-grow: 1;
    }
</style>
