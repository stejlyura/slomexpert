<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Button from "$lib/shared/ui/Button.svelte";
    import Turnstile from "$lib/shared/ui/Turnstile.svelte";
    import FeedbackMessage from "$lib/shared/ui/FeedbackMessage.svelte";

    import { formatUkrainianPhone } from "$lib/shared/utils/phone";

    let {
        title = "Швидка оцінка об'єкта",
        description = "Залишіть заявку, і наш спеціаліст зв'яжеться з вами протягом 15 хвилин.",
        buttonText = "ВИКЛИКАТИ МАЙСТРА",
        id = "contact-form"
    } = $props();

    let name = $state("");
    let phone = $state("");

    function handlePhoneInput(e: Event) {
        const input = e.target as HTMLInputElement;
        phone = formatUkrainianPhone(input.value);
    }
    let turnstileToken = $state("");
    let websiteUrl = $state(""); // Honeypot
    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });
    let turnstileComponent: any = $state();

    async function handleSubmit() {
        if (name.trim().length < 2) {
            feedback = { message: "Будь ласка, введіть коректне ім'я (мінімум 2 символи).", type: "error" };
            return;
        }
        if (!turnstileToken) {
            feedback = { message: "Будь ласка, підтвердіть, що ви не робот.", type: "error" };
            return;
        }

        isSubmitting = true;
        feedback = { message: "", type: "" };

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'contact',
                    website_url: websiteUrl,
                    data: { name, phone, turnstileToken }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Дякуємо! Ми зателефонуємо вам найближчим часом.", type: "success" };
                name = "";
                phone = "";
                websiteUrl = "";
                turnstileToken = "";
                turnstileComponent?.reset();
            } else {
                feedback = { message: result.error || "Помилка відправки. Спробуйте пізніше.", type: "error" };
                turnstileComponent?.reset();
            }
        } catch (err) {
            feedback = { message: "Сервер недоступний. Перевірте з'єднання.", type: "error" };
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="card-brutal" {id}>
    <h2 class="font-heading font-black text-3xl md:text-4xl mb-2">{title}</h2>
    <p class="text-steel font-medium mb-8">{description}</p>

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] items-stretch gap-4">
        <!-- Honeypot field -->
        <div class="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
            <input type="text" name="website_url" bind:value={websiteUrl} tabindex="-1" autocomplete="off" />
        </div>
        <Input 
            bind:value={name} 
            placeholder="Ваше ім'я" 
            required 
            minlength={2}
            maxlength={50}
            disabled={isSubmitting}
        />
        <Input 
            value={phone} 
            type="tel" 
            placeholder="+38 (0__) ___-__-__" 
            required 
            disabled={isSubmitting}
            pattern="^\+38\s\(0\d{2}\)\s\d{3}-\d{2}-\d{2}$"
            inputmode="tel"
            oninput={handlePhoneInput}
        />
        
        <div class="flex flex-col gap-2 min-w-[300px] md:col-span-2 lg:col-span-1">
            <Turnstile 
                bind:this={turnstileComponent}
                onVerify={(token) => turnstileToken = token} 
            />
            <Button type="submit" variant="orange" className="px-8 py-4 text-lg w-full" disabled={isSubmitting}>
                {isSubmitting ? "ВІДПРАВКА..." : buttonText}
            </Button>
        </div>
    </form>

    <FeedbackMessage message={feedback.message} type={feedback.type as "success" | "error"} />
</div>
