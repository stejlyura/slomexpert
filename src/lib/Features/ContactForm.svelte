<script>
    import Input from '../shared/ui/Input.svelte';
    import Button from '../shared/ui/Button.svelte';

    let {
        title = "Швидка оцінка об'єкта",
        description = "Залишіть заявку, і наш спеціаліст зв'яжеться з вами протягом 15 хвилин.",
        buttonText = "ВИКЛИКАТИ МАЙСТРА",
        id = "contact-form"
    } = $props();

    let name = $state("");
    let phone = $state("");
    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });

    async function handleSubmit() {
        isSubmitting = true;
        feedback = { message: "", type: "" };

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    data: { name, phone }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Дякуємо! Ми зателефонуємо вам найближчим часом.", type: "success" };
                name = "";
                phone = "";
            } else {
                feedback = { message: result.error || "Помилка відправки. Спробуйте пізніше.", type: "error" };
            }
        } catch (err) {
            feedback = { message: "Сервер недоступний. Перевірте з'єднання.", type: "error" };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="card-brutal" {id}>
    <h2 class="title">{title}</h2>
    <p class="description">{description}</p>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="form-layout">
        <Input 
            bind:value={name} 
            placeholder="Ваше ім'я" 
            required 
            disabled={isSubmitting}
            className="flex-1"
        />
        <Input 
            bind:value={phone} 
            type="tel" 
            placeholder="+38 (0__) ___-__-__" 
            required 
            disabled={isSubmitting}
            className="flex-1"
        />
        <Button type="submit" variant="orange" className="px-8 py-4 text-lg min-w-[200px]" disabled={isSubmitting}>
            {isSubmitting ? "ВІДПРАВКА..." : buttonText}
        </Button>
    </form>

    {#if feedback.message}
        <div class="feedback {feedback.type}">
            {feedback.message}
        </div>
    {/if}
</div>

<style>
    .feedback {
        margin-top: 1.5rem;
        padding: 1rem;
        font-weight: 700;
        border: 3px solid var(--color-tire);
    }
    .feedback.success {
        background-color: #dcfce7;
        color: #166534;
        border-color: #166534;
    }
    .feedback.error {
        background-color: #fee2e2;
        color: #991b1b;
        border-color: #991b1b;
    }

    .title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2rem;
        margin-bottom: 0.5rem;
    }

    @media (min-width: 768px) {
        .title {
            font-size: 2.5rem;
        }
    }

    .description {
        color: var(--color-steel);
        font-weight: 500;
        margin-bottom: 2rem;
    }

    .form-layout {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    @media (min-width: 768px) {
        .form-layout {
            flex-direction: row;
            align-items: stretch;
        }
    }
</style>
