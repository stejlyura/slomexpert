<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";

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

    let demolitions: BaseRow[]    = $state([{ id: uid(), price: 0, qty: 0 }]);
    let cuttings: BaseRow[]       = $state([{ id: uid(), price: 0, qty: 0 }]);
    let drillings: DrillingRow[]  = $state([{ id: uid(), price: 0, depth: 0, qty: 0 }]);
    let reinforcements: BaseRow[] = $state([{ id: uid(), price: 0, qty: 0 }]);
    let trashBags: number = $state(0);
    let truckPrice: number = $state(0);
    let userName: string = $state("");
    let userPhone: string = $state("");

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
                    data: {
                        userName,
                        userPhone,
                        totalPrice: formattedTotal,
                        details
                    }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Розрахунок зафіксовано! Очікуйте на дзвінок менеджера.", type: "success" };
                // Reset basic info
                userName = "";
                userPhone = "";
            } else {
                feedback = { message: result.error || "Помилка відправки. Спробуйте пізніше.", type: "error" };
            }
        } catch (err) {
            feedback = { message: "Сервер недоступний. Перевірте мережу.", type: "error" };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<section id="calculator" class="calc-section">
    <div class="calc-bg-pattern"></div>

    <div class="calc-card">
        <h2 class="calc-title">Прайс-Калькулятор</h2>
        <p class="calc-subtitle">
            Оберіть послуги згідно з нашим прайсом. Ви можете додавати декілька позицій в кожному блоці.
        </p>

        <form onsubmit={handleSubmit} class="calc-form">

            <!-- 1. Демонтаж -->
            <div class="calc-block">
                <h3 class="calc-block-title">
                    <i class="fa-solid fa-hammer icon-orange"></i> Основний демонтаж
                </h3>
                {#each demolitions as item, i (item.id)}
                    <div class="row-grid {i > 0 ? 'row-separator' : ''}">
                        <div class="field-wrap">
                            <label class="field-label" for="dem-type-{item.id}">Вид робіт</label>
                            <div class="select-wrap">
                                <select id="dem-type-{item.id}" class="c-select" bind:value={item.price} disabled={isSubmitting}>
                                    <option value={0}>Оберіть послугу...</option>
                                    {#each demolitionOptions as o}<option value={o.value}>{o.label}</option>{/each}
                                </select>
                                <span class="select-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="field-wrap">
                            <label class="field-label" for="dem-qty-{item.id}">Площа (м²) або Кількість (шт)</label>
                            <input id="dem-qty-{item.id}" type="number" min="0" class="c-input" placeholder="0" bind:value={item.qty} disabled={isSubmitting} />
                        </div>
                        {#if demolitions.length > 1}
                            <button type="button" class="btn-remove" onclick={() => demolitions = removeRow(demolitions, item.id)} title="Видалити" disabled={isSubmitting}>
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        {/if}
                    </div>
                {/each}
                <button type="button" class="btn-add" onclick={() => demolitions = addRow(demolitions, { price:0, qty:0 })} disabled={isSubmitting}>
                    <i class="fa-solid fa-plus"></i> Додати ще демонтаж
                </button>
            </div>

            <!-- 2. Різання -->
            <div class="calc-block">
                <h3 class="calc-block-title">
                    <i class="fa-solid fa-burst icon-orange"></i> Алмазне різання
                </h3>
                {#each cuttings as item, i (item.id)}
                    <div class="row-grid {i > 0 ? 'row-separator' : ''}">
                        <div class="field-wrap">
                            <label class="field-label" for="cut-type-{item.id}">Тип матеріалу</label>
                            <div class="select-wrap">
                                <select id="cut-type-{item.id}" class="c-select" bind:value={item.price} disabled={isSubmitting}>
                                    <option value={0}>Оберіть послугу...</option>
                                    {#each cuttingOptions as o}<option value={o.value}>{o.label}</option>{/each}
                                </select>
                                <span class="select-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                            </div>
                        </div>
                        <div class="field-wrap">
                            <label class="field-label" for="cut-qty-{item.id}">Довжина (м.п.) або Кількість (шт)</label>
                            <input id="cut-qty-{item.id}" type="number" min="0" class="c-input" placeholder="0" bind:value={item.qty} disabled={isSubmitting} />
                        </div>
                        {#if cuttings.length > 1}
                            <button type="button" class="btn-remove" onclick={() => cuttings = removeRow(cuttings, item.id)} title="Видалити" disabled={isSubmitting}>
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        {/if}
                    </div>
                {/each}
                <button type="button" class="btn-add" onclick={() => cuttings = addRow(cuttings, { price:0, qty:0 })} disabled={isSubmitting}>
                    <i class="fa-solid fa-plus"></i> Додати ще різку
                </button>
            </div>

            <!-- 3. Свердління + Підсилення -->
            <div class="two-col-grid">
                <!-- Свердління -->
                <div class="calc-block">
                    <h3 class="calc-block-title" style="font-size:1rem;">
                        <i class="fa-solid fa-circle-dot icon-orange"></i> Алмазне свердління
                    </h3>
                    {#each drillings as item, i (item.id)}
                        <div class="drill-group {i > 0 ? 'row-separator' : ''}">
                            <div class="field-wrap">
                                <label class="field-label" for="dr-type-{item.id}">Діаметр коронки</label>
                                <div class="select-wrap">
                                    <select id="dr-type-{item.id}" class="c-select" bind:value={item.price} disabled={isSubmitting}>
                                        <option value={0}>Оберіть...</option>
                                        {#each drillingOptions as o}<option value={o.value}>{o.label}</option>{/each}
                                    </select>
                                    <span class="select-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                                </div>
                            </div>
                            <div class="row-inline">
                                <div class="field-wrap">
                                    <label class="field-label field-label-xs" for="dr-depth-{item.id}">Глибина (см)</label>
                                    <input id="dr-depth-{item.id}" type="number" min="0" class="c-input" placeholder="0" bind:value={item.depth} disabled={isSubmitting} />
                                </div>
                                <div class="field-wrap">
                                    <label class="field-label field-label-xs" for="dr-qty-{item.id}">К-сть (шт)</label>
                                    <input id="dr-qty-{item.id}" type="number" min="0" class="c-input" placeholder="0" bind:value={item.qty} disabled={isSubmitting} />
                                </div>
                                {#if drillings.length > 1}
                                    <button type="button" class="btn-remove btn-remove-sm" onclick={() => drillings = removeRow(drillings, item.id)} title="Видалити" disabled={isSubmitting}>
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                    <button type="button" class="btn-add" onclick={() => drillings = addRow(drillings, { price:0, depth:0, qty:0 })} disabled={isSubmitting}>
                        <i class="fa-solid fa-plus"></i> Додати ще отвори
                    </button>
                </div>

                <!-- Підсилення -->
                <div class="calc-block">
                    <h3 class="calc-block-title" style="font-size:1rem;">
                        <i class="fa-solid fa-door-open icon-orange"></i> Підсилення пройомів
                    </h3>
                    {#each reinforcements as item, i (item.id)}
                        <div class="drill-group {i > 0 ? 'row-separator' : ''}">
                            <div class="field-wrap">
                                <label class="field-label" for="re-type-{item.id}">Конструкція підсилення</label>
                                <div class="select-wrap">
                                    <select id="re-type-{item.id}" class="c-select" bind:value={item.price} disabled={isSubmitting}>
                                        <option value={0}>Оберіть...</option>
                                        {#each reinforcementOptions as o}<option value={o.value}>{o.label}</option>{/each}
                                    </select>
                                    <span class="select-arrow"><i class="fa-solid fa-chevron-down"></i></span>
                                </div>
                            </div>
                            <div class="row-inline">
                                <div class="field-wrap" style="flex:1;">
                                    <label class="field-label field-label-xs" for="re-qty-{item.id}">Кількість пройомів (шт)</label>
                                    <input id="re-qty-{item.id}" type="number" min="0" class="c-input" placeholder="0" bind:value={item.qty} disabled={isSubmitting} />
                                </div>
                                {#if reinforcements.length > 1}
                                    <button type="button" class="btn-remove btn-remove-sm" onclick={() => reinforcements = removeRow(reinforcements, item.id)} title="Видалити" disabled={isSubmitting}>
                                        <i class="fa-solid fa-xmark"></i>
                                    </button>
                                {/if}
                            </div>
                        </div>
                    {/each}
                    <button type="button" class="btn-add" onclick={() => reinforcements = addRow(reinforcements, { price:0, qty:0 })} disabled={isSubmitting}>
                        <i class="fa-solid fa-plus"></i> Додати ще підсилення
                    </button>
                </div>
            </div>

            <!-- 4. Вивіз сміття -->
            <div class="calc-block calc-block--orange">
                <h3 class="calc-block-title">
                    <i class="fa-solid fa-truck-fast icon-orange"></i> Вивезення сміття
                </h3>
                <div class="trash-label">
                    <span class="trash-label-text">Фасування в мішки (100 ₴ / шт)</span>
                    <input
                        id="trashBags"
                        type="number"
                        min="0"
                        class="c-input trash-input"
                        placeholder="0 шт"
                        bind:value={trashBags}
                        disabled={isSubmitting}
                    />
                </div>
                <div class="truck-grid">
                    <label class="truck-option {truckPrice === 0 ? 'truck-option--active' : ''}">
                        <input type="radio" name="truck" value="0" class="hidden-radio" onclick={() => truckPrice = 0} disabled={isSubmitting} /> Без машини
                    </label>
                    <label class="truck-option {truckPrice === 2500 ? 'truck-option--active' : ''}">
                        <input type="radio" name="truck" value="2500" class="hidden-radio" onclick={() => truckPrice = 2500} disabled={isSubmitting} /> ЗІЛ 5т (+2500 ₴)
                    </label>
                    <label class="truck-option {truckPrice === 4500 ? 'truck-option--active' : ''}">
                        <input type="radio" name="truck" value="4500" class="hidden-radio" onclick={() => truckPrice = 4500} disabled={isSubmitting} /> КАМАЗ 10т (+4500 ₴)
                    </label>
                </div>
            </div>

            <!-- Ваші контакти -->
            <div class="calc-block">
                <h3 class="calc-block-title">
                    <i class="fa-solid fa-user icon-orange"></i> Ваші контакти
                </h3>
                <div class="row-grid">
                    <div class="field-wrap">
                        <label class="field-label" for="user-name">Ваше ім'я</label>
                        <Input id="user-name" placeholder="Олександр" bind:value={userName} required disabled={isSubmitting} />
                    </div>
                    <div class="field-wrap">
                        <label class="field-label" for="user-phone">Номер телефону</label>
                        <Input id="user-phone" type="tel" placeholder="+38 (0XX) XXX-XX-XX" bind:value={userPhone} required disabled={isSubmitting} />
                    </div>
                </div>
            </div>

            <!-- Підсумок -->
            <div class="calc-summary">
                <div class="summary-total">
                    <p class="summary-label">Загальна сума згідно з прайсом:</p>
                    <div class="summary-price">
                        <span id="totalPrice">{formattedTotal}</span>
                        <span class="summary-currency">₴</span>
                    </div>
                </div>
                <button type="submit" class="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? "ВІДПРАВКА..." : "ЗАФІКСУВАТИ ЦІНУ"}
                </button>
            </div>

            {#if feedback.message}
                <div class="feedback {feedback.type}">
                    {feedback.message}
                </div>
            {/if}
        </form>
    </div>
</section>

<style>
    .feedback {
        margin-top: 1.5rem;
        padding: 1rem;
        font-weight: 700;
        border: 4px solid var(--color-tire);
        text-align: center;
    }
    .feedback.success { background-color: #dcfce7; color: #166534; border-color: #166534; }
    .feedback.error { background-color: #fee2e2; color: #991b1b; border-color: #991b1b; }

    /* ── Section ── */
    .calc-section {
        padding: 5rem 1rem;
        background-color: var(--color-tire);
        position: relative;
        overflow: hidden;
    }
    .calc-bg-pattern {
        position: absolute;
        inset: 0;
        z-index: 0;
        opacity: 0.1;
        background: repeating-linear-gradient(45deg, #FF5A00, #FF5A00 40px, #16181A 40px, #16181A 80px);
        pointer-events: none;
    }

    /* ── Card ── */
    .calc-card {
        position: relative;
        z-index: 10;
        max-width: 64rem;
        margin: 0 auto;
        background: var(--color-white);
        border: 4px solid var(--color-orange);
        box-shadow: 8px 8px 0 var(--color-tire);
        padding: 2rem;
    }
    @media (min-width: 768px) {
        .calc-card { padding: 3rem; }
    }

    /* ── Heading ── */
    .calc-title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: clamp(1.75rem, 4vw, 2.5rem);
        text-transform: uppercase;
        text-align: center;
        margin: 0 0 0.5rem;
        color: var(--color-tire);
    }
    .calc-subtitle {
        text-align: center;
        font-weight: 600;
        color: var(--color-steel);
        margin: 0 0 2rem;
    }

    /* ── Form ── */
    .calc-form { display: flex; flex-direction: column; gap: 1.5rem; }

    /* ── Block ── */
    .calc-block {
        padding: 1.5rem;
        background-color: var(--color-concrete);
        border: 4px solid var(--color-tire);
    }
    .calc-block--orange {
        background-color: var(--color-white);
        border-color: var(--color-orange);
    }
    .calc-block-title {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.25rem;
        margin: 0 0 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--color-tire);
    }
    .icon-orange { color: var(--color-orange); }

    /* ── Two-column layout ── */
    .two-col-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    @media (min-width: 1024px) {
        .two-col-grid { grid-template-columns: 1fr 1fr; }
    }

    /* ── Row grid (1fr 1fr auto) ── */
    .row-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        align-items: end;
    }
    @media (min-width: 768px) {
        .row-grid { grid-template-columns: 1fr 1fr auto; }
    }
    .row-separator {
        padding-top: 1.5rem;
        margin-top: 1.5rem;
        border-top: 2px dashed rgba(22,24,26,0.2);
    }

    /* ── Drilling group ── */
    .drill-group { display: flex; flex-direction: column; gap: 1rem; }
    .row-inline { display: flex; gap: 0.5rem; align-items: flex-end; }

    /* ── Field ── */
    .field-wrap { display: flex; flex-direction: column; width: 100%; }
    .field-label {
        font-weight: 700;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        color: var(--color-tire);
    }
    .field-label-xs { font-size: 0.75rem; }

    /* ── Select ── */
    .select-wrap { position: relative; width: 100%; }
    .c-select {
        width: 100%;
        background: var(--color-white);
        border: 2px solid var(--color-tire);
        padding: 0.75rem 2.5rem 0.75rem 0.75rem;
        font-family: var(--font-sans);
        font-weight: 700;
        font-size: 0.875rem;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        transition: border-color 0.2s;
        color: var(--color-tire);
    }
    .c-select:focus { border-color: var(--color-orange); box-shadow: 4px 4px 0 var(--color-tire); }
    .select-arrow {
        position: absolute;
        right: 0.75rem;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 0.7rem;
        color: var(--color-tire);
    }

    /* ── Input ── */
    .c-input {
        width: 100%;
        background: var(--color-white);
        border: 2px solid var(--color-tire);
        padding: 0.75rem;
        font-family: var(--font-sans);
        font-weight: 700;
        outline: none;
        transition: border-color 0.2s;
        color: var(--color-tire);
        box-sizing: border-box;
    }
    .c-input:focus { border-color: var(--color-orange); box-shadow: 4px 4px 0 var(--color-tire); }
    .c-input::placeholder { color: var(--color-steel); opacity: 0.7; }

    /* ── Buttons ── */
    .btn-add {
        margin-top: 1.5rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-sans);
        font-weight: 700;
        font-size: 0.875rem;
        text-transform: uppercase;
        color: var(--color-orange);
        background: none;
        border: none;
        border-bottom: 2px dashed var(--color-orange);
        padding-bottom: 2px;
        cursor: pointer;
        transition: color 0.15s;
    }
    .btn-add:hover { color: var(--color-orange-hover); }

    .btn-remove {
        flex-shrink: 0;
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fee2e2;
        color: #dc2626;
        border: 2px solid #dc2626;
        cursor: pointer;
        font-size: 1.25rem;
        transition: background 0.15s, color 0.15s;
    }
    .btn-remove:hover { background: #dc2626; color: #fff; }
    .btn-remove-sm { width: 2.75rem; height: 2.75rem; font-size: 1rem; }

    /* ── Trash block ── */
    .trash-label {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--color-concrete);
        border: 2px solid var(--color-tire);
        padding: 0.75rem;
        margin-bottom: 1rem;
        transition: border-color 0.2s;
        cursor: default;
    }
    .trash-label:hover { border-color: var(--color-orange); }
    .trash-label-text { font-weight: 700; font-size: 0.9rem; color: var(--color-tire); }
    .trash-input { width: 6rem; text-align: center; height: 2.5rem; padding: 0.25rem 0.5rem; }

    /* ── Truck options ── */
    .truck-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
    @media (min-width: 768px) { .truck-grid { grid-template-columns: repeat(3, 1fr); } }
    .truck-option {
        border: 2px solid var(--color-tire);
        padding: 0.75rem 1rem;
        text-align: center;
        cursor: pointer;
        font-weight: 700;
        font-size: 0.875rem;
        color: var(--color-tire);
        background: var(--color-white);
        transition: background 0.15s, color 0.15s;
        user-select: none;
    }
    .truck-option:hover { background: var(--color-orange); color: var(--color-white); }
    .truck-option--active { background: var(--color-tire); color: var(--color-white); }
    .hidden-radio { display: none; }

    /* ── Summary ── */
    .calc-summary {
        padding-top: 1.5rem;
        border-top: 4px solid var(--color-tire);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }
    @media (min-width: 768px) {
        .calc-summary { flex-direction: row; justify-content: space-between; }
    }
    .summary-total { text-align: center; }
    @media (min-width: 768px) { .summary-total { text-align: left; } }
    .summary-label {
        font-weight: 700;
        font-size: 0.75rem;
        text-transform: uppercase;
        color: var(--color-steel);
        margin: 0 0 0.25rem;
    }
    .summary-price {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: clamp(2rem, 5vw, 3rem);
        color: var(--color-tire);
        line-height: 1;
    }
    .summary-currency { font-size: 1.5rem; color: var(--color-orange); }

    .btn-submit {
        background: var(--color-orange);
        color: var(--color-white);
        border: none;
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 1.25rem;
        text-transform: uppercase;
        padding: 1.25rem 2.5rem;
        cursor: pointer;
        box-shadow: var(--shadow-brutal);
        transition: background 0.15s, transform 0.1s, box-shadow 0.1s;
        width: 100%;
    }
    @media (min-width: 768px) { .btn-submit { width: auto; } }
    .btn-submit:hover { background: var(--color-orange-hover); }
    .btn-submit:active { transform: translate(3px, 3px); box-shadow: 2px 2px 0 var(--color-tire); }
</style>
