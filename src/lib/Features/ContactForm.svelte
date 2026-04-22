<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Button from "$lib/shared/ui/Button.svelte";
    import Turnstile from "$lib/shared/ui/Turnstile.svelte";

    let {
        title = "Швидка оцінка об'єкта",
        description = "Залишіть заявку, і наш спеціаліст зв'яжеться з вами протягом 15 хвилин.",
        buttonText = "ВИКЛИКАТИ МАЙСТРА",
        id = "contact-form"
    } = $props();

    let name = $state("");
    let phone = $state("");
    let turnstileToken = $state("");
    let websiteUrl = $state(""); // Honeypot
    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });
    let turnstileComponent: any = $state();

    async function handleSubmit() {
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

    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col md:flex-row md:items-stretch gap-4">
        <!-- Honeypot field -->
        <div class="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
            <input type="text" name="website_url" bind:value={websiteUrl} tabindex="-1" autocomplete="off" />
        </div>
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
        
        <div class="flex flex-col gap-2 min-w-[300px]">
            <Turnstile 
                bind:this={turnstileComponent}
                onVerify={(token) => turnstileToken = token} 
            />
            <Button type="submit" variant="orange" className="px-8 py-4 text-lg w-full" disabled={isSubmitting}>
                {isSubmitting ? "ВІДПРАВКА..." : buttonText}
            </Button>
        </div>
    </form>

    {#if feedback.message}
        <div 
            class="mt-6 p-4 font-bold border-3 {feedback.type === 'success' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-red-100 text-red-800 border-red-800'}"
        >
            {feedback.message}
        </div>
    {/if}
</div>
