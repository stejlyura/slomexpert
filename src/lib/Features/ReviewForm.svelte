<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Button from "$lib/shared/ui/Button.svelte";
    import Turnstile from "$lib/shared/ui/Turnstile.svelte";
    import Icon from "$lib/shared/ui/Icon.svelte";
    import FeedbackMessage from "$lib/shared/ui/FeedbackMessage.svelte";

    let userName = $state("");
    let rating = $state(5);
    let comment = $state("");
    let turnstileToken = $state("");
    let websiteUrl = $state(""); // Honeypot
    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });
    let turnstileComponent: any = $state();

    async function handleSubmit(e: Event) {
        e.preventDefault();

        if (userName.trim().length < 2) {
            feedback = { message: "Будь ласка, введіть ваше ім'я (мінімум 2 символи).", type: "error" };
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
                    type: 'review',
                    website_url: websiteUrl,
                    data: { name: userName, rating, comment, turnstileToken }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Дякуємо за ваш відгук! Він буде опублікований після модерації.", type: "success" };
                userName = "";
                rating = 5;
                comment = "";
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

<section id="reviews" class="py-16 bg-concrete border-t-4 border-tire">
    <div class="container-brutal-sm">
        <div class="card-brutal p-6 md:p-10">
            <div class="text-center mb-8">
                <h2 class="font-heading font-black text-4xl uppercase mb-2">ЗАЛИШИТИ ВІДГУК</h2>
                <p class="font-bold text-steel">Ваша думка важлива для нас (і для наступних клієнтів)</p>
            </div>

            <form onsubmit={handleSubmit} class="review-form">
                <!-- Honeypot field -->
                <div class="absolute -left-[9999px] -top-[9999px] opacity-0 pointer-events-none" aria-hidden="true">
                    <input type="text" name="website_url" bind:value={websiteUrl} tabindex="-1" autocomplete="off" />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="rev-name" class="font-extrabold text-sm uppercase text-tire">Ваше ім'я</label>
                        <Input 
                            id="rev-name" 
                            placeholder="Олександр Прораб" 
                            bind:value={userName} 
                            required 
                            minlength={2}
                            maxlength={50}
                            disabled={isSubmitting} 
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <span class="font-extrabold text-sm uppercase text-tire">Ваша оцінка</span>
                        <div class="flex gap-2 py-2">
                            {#each [1, 2, 3, 4, 5] as star}
                                <button 
                                    type="button" 
                                    class="bg-transparent border-none text-3xl cursor-pointer transition-all duration-100 hover:scale-120 hover:text-orange focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-4 {rating >= star ? 'text-orange' : 'text-steel'}" 
                                    onclick={() => rating = star}
                                    aria-label="Оцінити на {star} зірок"
                                    disabled={isSubmitting}
                                >
                                    <Icon name="star" />
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-2 mt-6">
                    <label for="rev-comment" class="font-extrabold text-sm uppercase text-tire">Ваш коментар</label>
                    <textarea 
                        id="rev-comment" 
                        class="w-full min-h-[120px] bg-white border-3 border-tire p-4 font-sans font-semibold outline-none transition-all duration-200 focus:border-orange focus:shadow-brutal-sm" 
                        placeholder="Все розвалили дуже швидко, сміття вивезли. Рекомендую!" 
                        bind:value={comment} 
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <div class="mt-8 flex flex-col items-center gap-4">
                    <Turnstile 
                        bind:this={turnstileComponent}
                        onVerify={(token) => turnstileToken = token} 
                    />
                    <Button type="submit" variant="tire" className="w-full py-5 text-xl" disabled={isSubmitting}>
                        {isSubmitting ? "ВІДПРАВКА..." : "ОПУБЛІКУВАТИ ВІДГУК"}
                    </Button>
                </div>

                <FeedbackMessage message={feedback.message} type={feedback.type as "success" | "error"} />
            </form>
        </div>
    </div>
</section>
