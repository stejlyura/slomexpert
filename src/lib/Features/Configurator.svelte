<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Select from "$lib/shared/ui/Select.svelte";
    import Turnstile from "$lib/shared/ui/Turnstile.svelte";
    import Icon from "$lib/shared/ui/Icon.svelte";
    import FeedbackMessage from "$lib/shared/ui/FeedbackMessage.svelte";

    import ServiceBlock from "./Configurator/ServiceBlock.svelte";
    import TruckSelector from "./Configurator/TruckSelector.svelte";
    import PriceSummary from "./Configurator/PriceSummary.svelte";

    interface ServiceOption { value: number; label: string; }
    interface BaseRow { id: string; price: number; qty: number; }
    interface DrillingRow extends BaseRow { depth: number; }

    let idCounter = 0;
    const uid = () => `row-${idCounter++}`;

    const demolitionOptions: ServiceOption[] = [
        { value: 150, label: "Перегородки не штукатурені (газо-, шлакоблок, цегла) - 150 ₴/м²" },
        { value: 180, label: "Перегородки штукатурені - 180 ₴/м²" },
        { value: 375, label: "Стіна 250мм - 375 ₴/м²" },
        { value: 120, label: "Перегородка, фальш стіна ГКЛ - 120 ₴/м²" },
        { value: 160, label: "ГКЛ усилений, утеплений - 160 ₴/м²" },
        { value: 150, label: "Штукатурка, стяжка - 150 ₴/м²" },
        { value: 150, label: "Плитка без клею - 150 ₴/м²" },
        { value: 300, label: "Плитка з клеєм - 300 ₴/м²" },
        { value: 70,  label: "Шпалери - 70 ₴/м²" },
        { value: 100, label: "Паркет, Ламінат, вагонка - 100 ₴/м²" },
        { value: 350, label: "Скловата, Металопластик - 350 ₴/м²" },
        { value: 15000, label: "Сантехкабіна бетонна - 15000 ₴/шт" },
    ];
    const cuttingOptions: ServiceOption[] = [
        { value: 400,  label: "Цегла, стяжка, газоблок (до 120мм) - 400 ₴/м.п." },
        { value: 1000, label: "Залізобетон - 1000 ₴/м.п." },
        { value: 4500, label: "Тумба підвіконна (до 1000мм) - 4500 ₴/шт" },
    ];
    const drillingOptions: ServiceOption[] = [
        { value: 25, label: "Діаметр до 100мм - 25 ₴/см" },
        { value: 26, label: "Діаметр 110мм - 26 ₴/см" },
    ];
    const reinforcementOptions: ServiceOption[] = [
        { value: 10000, label: "В бетоні (2100x900, периметр швелерами) - 10000 ₴" },
        { value: 10000, label: "В цеглі (2100x900, швелер зверху, стягнення) - 10000 ₴" },
        { value: 17500, label: "В цеглі (2100x900, кутники по периметру) - 17500 ₴" },
    ];

    import { formatUkrainianPhone } from "$lib/shared/utils/phone";

    let demolitions: BaseRow[]    = $state([{ id: uid(), price: 0, qty: 0 }]);
    let cuttings: BaseRow[]       = $state([{ id: uid(), price: 0, qty: 0 }]);
    let drillings: DrillingRow[]  = $state([{ id: uid(), price: 0, depth: 0, qty: 0 }]);
    let reinforcements: BaseRow[] = $state([{ id: uid(), price: 0, qty: 0 }]);
    let trashBags: number = $state(0);
    let truckPrice: number = $state(0);
    let userName: string = $state("");
    let userPhone: string = $state("");

    function handlePhoneInput(e: Event) {
        const input = e.target as HTMLInputElement;
        userPhone = formatUkrainianPhone(input.value);
    }
    let turnstileToken: string = $state("");
    let websiteUrl: string = $state(""); // Honeypot
    let turnstileComponent: any = $state();

    function addRow<T extends { id: string }>(arr: T[], fields: Omit<T, "id">): T[] {
        return [...arr, { id: uid(), ...fields } as T];
    }
    function removeRow<T extends { id: string }>(arr: T[], id: string): T[] {
        return arr.filter(r => r.id !== id);
    }

    let totalSum = $derived(
        demolitions.reduce((s, r) => s + (r.price||0)*(r.qty||0), 0) +
        cuttings.reduce((s, r) => s + (r.price||0)*(r.qty||0), 0) +
        drillings.reduce((s, r) => s + (r.price||0)*(r.depth||0)*(r.qty||0), 0) +
        reinforcements.reduce((s, r) => s + (r.price||0)*(r.qty||0), 0) +
        (trashBags||0)*100 + (truckPrice||0)
    );
    let formattedTotal = $derived(totalSum.toLocaleString("uk-UA"));

    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });

    async function handleSubmit(e: Event) {
        e.preventDefault();

        if (userName.trim().length < 2) {
            feedback = { message: "Будь ласка, введіть коректне ім'я (мінімум 2 символи).", type: "error" };
            return;
        }

        if (!turnstileToken) {
            feedback = { message: "Будь ласка, підтвердіть, що ви не робот.", type: "error" };
            return;
        }

        isSubmitting = true;
        feedback = { message: "", type: "" };

        const details: any[] = [];
        demolitions.filter(r => r.price > 0 && r.qty > 0).forEach(r => {
            details.push({ label: demolitionOptions.find(o => o.value === r.price)?.label, qty: r.qty });
        });
        cuttings.filter(r => r.price > 0 && r.qty > 0).forEach(r => {
            details.push({ label: cuttingOptions.find(o => o.value === r.price)?.label, qty: r.qty });
        });
        drillings.filter(r => r.price > 0 && r.depth > 0 && r.qty > 0).forEach(r => {
            details.push({ label: `${drillingOptions.find(o => o.value === r.price)?.label} (гл. ${r.depth}см)`, qty: r.qty });
        });
        reinforcements.filter(r => r.price > 0 && r.qty > 0).forEach(r => {
            details.push({ label: reinforcementOptions.find(o => o.value === r.price)?.label, qty: r.qty });
        });
        if (trashBags > 0) details.push({ label: "Мішки для сміття", qty: trashBags });
        if (truckPrice > 0) details.push({ label: truckPrice === 2500 ? "ЗІЛ 5т" : "КАМАЗ 10т", qty: 1 });

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'configurator',
                    website_url: websiteUrl,
                    data: {
                        userName,
                        userPhone,
                        totalPrice: formattedTotal,
                        details,
                        turnstileToken
                    }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Розрахунок зафіксовано! Очікуйте на дзвінок менеджера.", type: "success" };
                // Reset basic info
                userName = "";
                userPhone = "";
                websiteUrl = "";
                turnstileToken = "";
                turnstileComponent?.reset();
            } else {
                feedback = { message: result.error || "Помилка відправки. Спробуйте пізніше.", type: "error" };
                turnstileComponent?.reset();
            }
        } catch (err) {
            feedback = { message: "Сервер недоступний. Перевірте мережу.", type: "error" };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section id="calculator" class="py-20 px-4 bg-tire relative overflow-hidden">
    <div class="absolute inset-0 z-0 opacity-10 [background:repeating-linear-gradient(45deg,#FF5A00,#FF5A00_40px,#16181A_40px,#16181A_80px)] pointer-events-none"></div>

    <div class="relative z-10 max-w-5xl mx-auto bg-white border-4 border-orange shadow-brutal p-8 md:p-12">
        <h2 class="font-heading font-black text-3xl md:text-5xl uppercase text-center mb-2 text-tire">Прайс-Калькулятор</h2>
        <p class="text-center font-semibold text-steel mb-8">
            Оберіть послуги згідно з нашим прайсом. Ви можете додавати декілька позицій в кожному блоці.
        </p>

        <form onsubmit={handleSubmit} class="flex flex-col gap-6">
            <!-- Honeypot field -->
            <div class="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                <input type="text" name="website_url" bind:value={websiteUrl} tabindex="-1" autocomplete="off" />
            </div>

            <!-- 1. Демонтаж -->
            <ServiceBlock 
                title="Основний демонтаж" 
                icon="hammer" 
                items={demolitions} 
                addButtonText="Додати ще демонтаж" 
                isSubmitting={isSubmitting}
                onAdd={() => demolitions = addRow(demolitions, { price:0, qty:0 })}
            >
                {#snippet children(item)}
                    <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <div class="flex flex-col w-full">
                            <label class="font-bold text-sm mb-2 text-tire" for="dem-type-{item.id}">Вид робіт</label>
                            <Select 
                                id="dem-type-{item.id}" 
                                bind:value={item.price} 
                                options={demolitionOptions} 
                                placeholder="Оберіть послугу..." 
                                disabled={isSubmitting} 
                            />
                        </div>
                        <div class="flex flex-col w-full">
                            <label class="font-bold text-sm mb-2 text-tire" for="dem-qty-{item.id}">Площа (м²) або Кількість (шт)</label>
                            <Input 
                                id="dem-qty-{item.id}" 
                                type="number" 
                                min="0" 
                                placeholder="0" 
                                bind:value={item.qty} 
                                disabled={isSubmitting} 
                            />
                        </div>
                        {#if demolitions.length > 1}
                            <button type="button" class="shrink-0 w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 border-2 border-red-600 cursor-pointer text-xl transition-colors duration-150 hover:bg-red-600 hover:text-white" onclick={() => demolitions = removeRow(demolitions, item.id)} title="Видалити" disabled={isSubmitting}>
                                <Icon name="xmark" />
                            </button>
                        {/if}
                    </div>
                {/snippet}
            </ServiceBlock>

            <!-- 2. Різання -->
            <ServiceBlock 
                title="Алмазне різання" 
                icon="burst" 
                items={cuttings} 
                addButtonText="Додати ще різку" 
                isSubmitting={isSubmitting}
                onAdd={() => cuttings = addRow(cuttings, { price:0, qty:0 })}
            >
                {#snippet children(item)}
                    <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                        <div class="flex flex-col w-full">
                            <label class="font-bold text-sm mb-2 text-tire" for="cut-type-{item.id}">Тип матеріалу</label>
                            <Select 
                                id="cut-type-{item.id}" 
                                bind:value={item.price} 
                                options={cuttingOptions} 
                                placeholder="Оберіть послугу..." 
                                disabled={isSubmitting} 
                            />
                        </div>
                        <div class="flex flex-col w-full">
                            <label class="font-bold text-sm mb-2 text-tire" for="cut-qty-{item.id}">Довжина (м.п.) або Кількість (шт)</label>
                            <Input 
                                id="cut-qty-{item.id}" 
                                type="number" 
                                min="0" 
                                placeholder="0" 
                                bind:value={item.qty} 
                                disabled={isSubmitting} 
                            />
                        </div>
                        {#if cuttings.length > 1}
                            <button type="button" class="shrink-0 w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 border-2 border-red-600 cursor-pointer text-xl transition-colors duration-150 hover:bg-red-600 hover:text-white" onclick={() => cuttings = removeRow(cuttings, item.id)} title="Видалити" disabled={isSubmitting}>
                                <Icon name="xmark" />
                            </button>
                        {/if}
                    </div>
                {/snippet}
            </ServiceBlock>

            <!-- 3. Свердління + Підсилення -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Свердління -->
                <ServiceBlock 
                    title="Алмазне свердління" 
                    icon="circle-dot" 
                    items={drillings} 
                    addButtonText="Додати ще отвори" 
                    isSubmitting={isSubmitting}
                    onAdd={() => drillings = addRow(drillings, { price:0, depth:0, qty:0 })}
                >
                    {#snippet children(item)}
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col w-full">
                                <label class="font-bold text-sm mb-2 text-tire" for="dr-type-{item.id}">Діаметр коронки</label>
                                <Select 
                                    id="dr-type-{item.id}" 
                                    bind:value={item.price} 
                                    options={drillingOptions} 
                                    placeholder="Оберіть..." 
                                    disabled={isSubmitting} 
                                />
                            </div>
                            <div class="flex gap-2 items-end">
                                <div class="flex flex-col w-full">
                                    <label class="font-bold text-[0.75rem] mb-2 text-tire" for="dr-depth-{item.id}">Глибина (см)</label>
                                    <Input 
                                        id="dr-depth-{item.id}" 
                                        type="number" 
                                        min="0" 
                                        placeholder="0" 
                                        bind:value={item.depth} 
                                        disabled={isSubmitting} 
                                    />
                                </div>
                                <div class="flex flex-col w-full">
                                    <label class="font-bold text-[0.75rem] mb-2 text-tire" for="dr-qty-{item.id}">К-сть (шт)</label>
                                    <Input 
                                        id="dr-qty-{item.id}" 
                                        type="number" 
                                        min="0" 
                                        placeholder="0" 
                                        bind:value={item.qty} 
                                        disabled={isSubmitting} 
                                    />
                                </div>
                                {#if drillings.length > 1}
                                    <button type="button" class="shrink-0 w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 border-2 border-red-600 cursor-pointer text-base transition-colors duration-150 hover:bg-red-600 hover:text-white" onclick={() => drillings = removeRow(drillings, item.id)} title="Видалити" disabled={isSubmitting}>
                                        <Icon name="xmark" />
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/snippet}
                </ServiceBlock>

                <!-- Підсилення -->
                <ServiceBlock 
                    title="Підсилення пройомів" 
                    icon="door-open" 
                    items={reinforcements} 
                    addButtonText="Додати ще підсилення" 
                    isSubmitting={isSubmitting}
                    onAdd={() => reinforcements = addRow(reinforcements, { price:0, qty:0 })}
                >
                    {#snippet children(item)}
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col w-full">
                                <label class="font-bold text-sm mb-2 text-tire" for="re-type-{item.id}">Конструкція підсилення</label>
                                <Select 
                                    id="re-type-{item.id}" 
                                    bind:value={item.price} 
                                    options={reinforcementOptions} 
                                    placeholder="Оберіть..." 
                                    disabled={isSubmitting} 
                                />
                            </div>
                            <div class="flex gap-2 items-end">
                                <div class="flex flex-col w-full">
                                    <label class="font-bold text-[0.75rem] mb-2 text-tire" for="re-qty-{item.id}">Кількість пройомів (шт)</label>
                                    <Input 
                                        id="re-qty-{item.id}" 
                                        type="number" 
                                        min="0" 
                                        placeholder="0" 
                                        bind:value={item.qty} 
                                        disabled={isSubmitting} 
                                    />
                                </div>
                                {#if reinforcements.length > 1}
                                    <button type="button" class="shrink-0 w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 border-2 border-red-600 cursor-pointer text-base transition-colors duration-150 hover:bg-red-600 hover:text-white" onclick={() => reinforcements = removeRow(reinforcements, item.id)} title="Видалити" disabled={isSubmitting}>
                                        <Icon name="xmark" />
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/snippet}
                </ServiceBlock>
            </div>

            <!-- 4. Вивіз сміття -->
            <TruckSelector bind:trashBags bind:truckPrice {isSubmitting} />

            <!-- Ваші контакти -->
            <div class="p-6 bg-concrete border-4 border-tire">
                <h3 class="font-heading font-bold text-xl mb-4 flex items-center gap-2 text-tire">
                    <Icon name="user" className="text-orange" /> Ваші контакти
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <div class="flex flex-col w-full">
                        <label class="font-bold text-sm mb-2 text-tire" for="user-name">Ваше ім'я</label>
                        <Input 
                            id="user-name" 
                            placeholder="Олександр" 
                            bind:value={userName} 
                            required 
                            minlength={2}
                            maxlength={50}
                            disabled={isSubmitting} 
                        />
                    </div>
                    <div class="flex flex-col w-full">
                        <label class="font-bold text-sm mb-2 text-tire" for="user-phone">Номер телефону</label>
                        <Input 
                            id="user-phone" 
                            type="tel" 
                            placeholder="+38 (0XX) XXX-XX-XX" 
                            bind:value={userPhone}
                            required 
                            disabled={isSubmitting} 
                            pattern="^\+38\s\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$"
                            inputmode="tel"
                            oninput={handlePhoneInput}
                        />
                    </div>
                </div>
            </div>

            <!-- Підсумок -->
            <PriceSummary 
                formattedTotal={formattedTotal} 
                isSubmitting={isSubmitting} 
                bind:turnstileComponent 
                onVerify={(token) => turnstileToken = token} 
            />

            <FeedbackMessage message={feedback.message} type={feedback.type as "success" | "error"} />
        </form>
    </div>
</section>
