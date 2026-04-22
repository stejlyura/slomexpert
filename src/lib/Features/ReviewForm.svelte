<script lang="ts">
    import Input from "$lib/shared/ui/Input.svelte";
    import Button from "$lib/shared/ui/Button.svelte";

    let userName = $state("");
    let rating = $state(5);
    let comment = $state("");
    let websiteUrl = $state(""); // Honeypot
    let isSubmitting = $state(false);
    let feedback = $state({ message: "", type: "" });

    async function handleSubmit(e: Event) {
        e.preventDefault();
        isSubmitting = true;
        feedback = { message: "", type: "" };

        try {
            const response = await fetch('/api/notify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'review',
                    website_url: websiteUrl,
                    data: { name: userName, rating, comment }
                })
            });

            const result = await response.json();

            if (response.ok) {
                feedback = { message: "Дякуємо за ваш відгук! Він буде опублікований після модерації.", type: "success" };
                userName = "";
                rating = 5;
                comment = "";
                websiteUrl = "";
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

<section id="reviews" class="section-padding bg-concrete border-t-brutal">
    <div class="container-sm">
        <div class="card-brutal p-6 md:p-10">
            <div class="text-center mb-8">
                <h2 class="section-title mb-2">ЗАЛИШИТИ ВІДГУК</h2>
                <p class="font-bold text-steel">Ваша думка важлива для нас (і для наступних клієнтів)</p>
            </div>

            <form onsubmit={handleSubmit} class="review-form">
                <!-- Honeypot field -->
                <div class="hidden-field" aria-hidden="true">
                    <input type="text" name="website_url" bind:value={websiteUrl} tabindex="-1" autocomplete="off" />
                </div>

                <div class="form-grid">
                    <div class="field-wrap">
                        <label for="rev-name" class="field-label">Ваше ім'я</label>
                        <Input id="rev-name" placeholder="Олександр Прораб" bind:value={userName} required disabled={isSubmitting} />
                    </div>

                    <div class="field-wrap">
                        <span class="field-label">Ваша оцінка</span>
                        <div class="stars-container">
                            {#each [1, 2, 3, 4, 5] as star}
                                <button 
                                    type="button" 
                                    class="star-btn {rating >= star ? 'active' : ''}" 
                                    onclick={() => rating = star}
                                    aria-label="Оцінити на {star} зірок"
                                    disabled={isSubmitting}
                                >
                                    <i class="fa-solid fa-star"></i>
                                </button>
                            {/each}
                        </div>
                    </div>
                </div>

                <div class="field-wrap mt-6">
                    <label for="rev-comment" class="field-label">Ваш коментар</label>
                    <textarea 
                        id="rev-comment" 
                        class="textarea-brutal" 
                        placeholder="Все розвалили дуже швидко, сміття вивезли. Рекомендую!" 
                        bind:value={comment} 
                        required
                        disabled={isSubmitting}
                    ></textarea>
                </div>

                <div class="mt-8">
                    <Button type="submit" variant="tire" className="w-full py-5 text-xl" disabled={isSubmitting}>
                        {isSubmitting ? "ВІДПРАВКА..." : "ОПУБЛІКУВАТИ ВІДГУК"}
                    </Button>
                </div>

                {#if feedback.message}
                    <div class="feedback {feedback.type}">
                        {feedback.message}
                    </div>
                {/if}
            </form>
        </div>
    </div>
</section>

<style>
    .hidden-field {
        position: absolute;
        left: -9999px;
        top: -9999px;
        opacity: 0;
        pointer-events: none;
    }

    .section-padding {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    .container-sm {
        max-width: 48rem;
        margin: 0 auto;
        padding: 0 1rem;
    }

    .section-title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2.25rem;
        text-transform: uppercase;
    }

    .field-wrap {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .field-label {
        font-weight: 800;
        font-size: 0.875rem;
        text-transform: uppercase;
        color: var(--color-tire);
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .form-grid {
            grid-template-columns: 2fr 1fr;
        }
    }

    .stars-container {
        display: flex;
        gap: 0.5rem;
        padding: 0.5rem 0;
    }

    .star-btn {
        background: none;
        border: none;
        font-size: 1.75rem;
        color: var(--color-steel);
        cursor: pointer;
        transition: transform 0.1s, color 0.1s;
    }

    .star-btn:hover {
        transform: scale(1.2);
        color: var(--color-orange);
    }

    .star-btn.active {
        color: var(--color-orange);
    }

    .textarea-brutal {
        width: 100%;
        min-height: 120px;
        background-color: var(--color-white);
        border: 3px solid var(--color-tire);
        padding: 1rem;
        font-family: var(--font-sans);
        font-weight: 600;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    .textarea-brutal:focus {
        border-color: var(--color-orange);
        box-shadow: 4px 4px 0px var(--color-tire);
    }

    .border-t-brutal {
        border-top: 4px solid var(--color-tire);
    }

    .feedback {
        margin-top: 1.5rem;
        padding: 1rem;
        font-weight: 700;
        border: 3px solid var(--color-tire);
        text-align: center;
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
</style>
