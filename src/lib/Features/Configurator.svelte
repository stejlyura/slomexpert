<script>
    import Select from '../shared/ui/Select.svelte';
    import Checkbox from '../shared/ui/Checkbox.svelte';
    import Button from '../shared/ui/Button.svelte';

    export let id = "configurator";

    const objectTypes = [
        { value: 'house', label: 'Приватний будинок' },
        { value: 'flat', label: 'Квартира (перегородки/підлога)' },
        { value: 'commercial', label: 'Комерційне приміщення' },
        { value: 'metal', label: 'Металоконструкції' }
    ];

    const materials = [
        { id: 'm1', value: 'brick', label: 'Цегла' },
        { id: 'm2', value: 'concrete', label: 'Бетон', checked: true },
        { id: 'm3', value: 'wood', label: 'Дерево' },
        { id: 'm4', value: 'metal', label: 'Метал' }
    ];

    let selectedType = "";
    let selectedMaterial = "concrete";
    let wasteRemoval = true;
    let keepMaterials = false;

    function handleSubmit() {
        console.log("Config submitted:", {
            selectedType,
            selectedMaterial,
            wasteRemoval,
            keepMaterials
        });
    }
</script>

<div class="card-brutal border-orange" {id}>
    <h2 class="title">Конфігуратор робіт</h2>
    <p class="subtitle">Виберіть параметри вашого об'єкта для попереднього розрахунку</p>

    <form on:submit|preventDefault={handleSubmit} class="config-form">
        <!-- Object Type -->
        <div class="field-group">
            <label class="label">Тип об'єкта</label>
            <Select 
                bind:value={selectedType}
                placeholder="[ Оберіть тип демонтажу ]"
                options={objectTypes}
                required
            />
        </div>

        <!-- Material Selection (Radio) -->
        <div class="field-group">
            <label class="label">Основний матеріал</label>
            <div class="grid-selection">
                {#each materials as material}
                    <Checkbox 
                        type="radio" 
                        name="material" 
                        value={material.value} 
                        checked={selectedMaterial === material.value}
                        on:change={() => selectedMaterial = material.value}
                        id={material.id}
                        label={material.label}
                        className="w-full"
                    />
                {/each}
            </div>
        </div>

        <!-- Services (Checkbox) -->
        <div class="field-group">
            <label class="label">Додаткові послуги (опціонально)</label>
            <div class="stack-selection">
                <label class="checkbox-row">
                    <input type="checkbox" bind:checked={wasteRemoval} class="native-checkbox">
                    <span class="checkbox-text">Вивіз будівельного сміття (Надаємо свої КАМАЗи)</span>
                </label>
                <label class="checkbox-row">
                    <input type="checkbox" bind:checked={keepMaterials} class="native-checkbox">
                    <span class="checkbox-text">Збереження цілісних матеріалів (цегла, балки)</span>
                </label>
            </div>
        </div>

        <!-- Footer -->
        <div class="form-footer">
            <Button type="submit" variant="tire" className="w-full md:w-auto text-xl px-12 py-5 border-orange">
                <span class="text-orange">ЗАМОВИТИ АУДИТ ТА ПРОРАХУНОК</span>
            </Button>
            <p class="footer-note">*Аудит безкоштовний і ні до чого вас не зобов'язує</p>
        </div>
    </form>
</div>

<style>
    .border-orange {
        border-color: var(--color-orange);
    }

    .title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2rem;
        text-transform: uppercase;
        text-align: center;
        margin-bottom: 1.5rem;
    }

    .subtitle {
        text-align: center;
        font-weight: 700;
        color: var(--color-steel);
        margin-bottom: 2rem;
    }

    .config-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .field-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .label {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.875rem;
    }

    .grid-selection {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    @media (min-width: 768px) {
        .grid-selection {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    .stack-selection {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .checkbox-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        cursor: pointer;
    }

    .native-checkbox {
        width: 1.25rem;
        height: 1.25rem;
        accent-color: var(--color-orange);
        border: 2px solid var(--color-tire);
    }

    .form-footer {
        padding-top: 1rem;
        border-top: var(--border-width-lg) solid var(--color-tire);
        text-align: center;
    }

    .text-orange {
        color: var(--color-orange);
    }

    .footer-note {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--color-steel);
        margin-top: 1rem;
    }
</style>
