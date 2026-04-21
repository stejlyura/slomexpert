<script>
    import Header from '../Widgets/Header.svelte';
    import Footer from '../Widgets/Footer.svelte';
    import HeroCarousel from '../Features/HeroCarousel.svelte';
    import ContactForm from '../Features/ContactForm.svelte';
    import StatCard from '../Entities/StatCard.svelte';
    import ComparisonItem from '../Entities/ComparisonItem.svelte';
    import ServiceCard from '../Entities/ServiceCard.svelte';
    import Configurator from '../Features/Configurator.svelte';
    import StepCard from '../Entities/StepCard.svelte';
    import MessengerBlock from '../Features/MessengerBlock.svelte';

    const services = [
        { icon: "🏭", title: "Промислові об'єкти", description: "Ангари, заводи, цехи. Тяжка техніка та різання металоконструкцій.", variant: "white" },
        { icon: "🏠", title: "Приватні будинки", description: "Акуратне знесення старих будинків, дач, сараїв зі збереженням матеріалів.", variant: "orange" },
        { icon: "🚪", title: "Квартирний демонтаж", description: "Стяжка, перегородки, плитка. Працюємо тихо (наскільки це можливо).", variant: "white" }
    ];

    const stats = [
        { value: "> 10", label: "Років на ринку" },
        { value: "500+", label: "Успішних об'єктів" },
        { value: "24/7", label: "Графік роботи" },
        { value: "15", label: "Одиниць техніки" }
    ];

    const steps = [
        { number: 1, title: "Заявка", description: "Ви телефонуєте або залишаєте заявку на сайті." },
        { number: 2, title: "Оцінка", description: "Майстер виїжджає на об'єкт, складає кошторис." },
        { number: 3, title: "Демонтаж", description: "Заганяємо техніку, швидко та акуратно ламаємо." },
        { number: 4, title: "Чистота", description: "Вивозимо сміття, ви приймаєте чистий майданчик.", variant: "tire" }
    ];
</script>

<div class="page-wrapper bg-grid">
    <Header />

    <main>
        <!-- 2. Hero Section -->
        <section class="hero-section">
            <div class="container">
                <div class="hero-text">
                    <h1 class="hero-title">
                        БРУТАЛЬНИЙ ДЕМОНТАЖ <br> 
                        <span class="text-orange underline-brutal">БЕЗ ЗАЙВОГО БРУДУ</span>
                    </h1>
                    <p class="hero-subtitle">
                        Зносимо, ламаємо та розчищаємо будь-які об'єкти в Україні. Швидко. Надійно. Під ключ.
                    </p>
                </div>
                <HeroCarousel />
            </div>
        </section>

        <!-- 3. Contact Form 1 -->
        <section id="contact1" class="section-padding">
            <div class="container-sm">
                <ContactForm />
            </div>
        </section>

        <!-- 4. Experience Section -->
        <section id="experience" class="section-padding bg-tire text-white">
            <div class="container">
                <h2 class="section-title text-center">НАШ ДОСВІД В ЦИФРАХ</h2>
                <div class="stats-grid">
                    {#each stats as stat}
                        <StatCard {...stat} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 5. Comparison Section -->
        <section class="section-padding">
            <div class="container">
                <h2 class="section-title text-center">ЧОМУ МИ, А НЕ "ШАБАШНИКИ"?</h2>
                <div class="comparison-grid">
                    <!-- Competitors -->
                    <div class="comparison-card competitors">
                        <div class="card-header">
                            <i class="fa-solid fa-face-frown text-3xl"></i>
                            <h3 class="card-title">Типові конкуренти</h3>
                        </div>
                        <ul class="comparison-list">
                            <ComparisonItem type="negative" text="Ціна зростає під час роботи" />
                            <ComparisonItem type="negative" text="Залишають гори будівельного сміття" />
                            <ComparisonItem type="negative" text="Зривають терміни здачі" />
                            <ComparisonItem type="negative" text="Працюють 'в чорну' без гарантій" />
                        </ul>
                    </div>

                    <!-- Us -->
                    <div class="comparison-card us card-brutal">
                        <div class="badge-brutal">НАШ ПІДХІД</div>
                        <div class="card-header">
                            <span class="text-3xl">👷‍♂️</span>
                            <h3 class="card-title">SLOMEXPERT</h3>
                        </div>
                        <ul class="comparison-list">
                            <ComparisonItem type="positive" text="Фіксована ціна в договорі перед стартом" />
                            <ComparisonItem type="positive" text="Повний вивіз сміття та прибирання об'єкта" />
                            <ComparisonItem type="positive" text="Чітке дотримання дедлайнів. Штрафи за затримку" />
                            <ComparisonItem type="positive" text="Всі дозвільні документи та гарантія безпеки" />
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- 6. Services Section -->
        <section id="services" class="section-padding bg-white border-y-brutal">
            <div class="container">
                <h2 class="section-title text-center">ЩО МИ ДЕМОНТУЄМО?</h2>
                <div class="services-grid">
                    {#each services as service}
                        <ServiceCard {...service} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 7. Calculator Section -->
        <section id="calculator" class="section-padding bg-tire-pattern">
            <div class="container-sm">
                <Configurator />
            </div>
        </section>

        <!-- 8. Workflow Section -->
        <section class="section-padding bg-concrete">
            <div class="container">
                <h2 class="section-title text-center">ЯК МИ ПРАЦЮЄМО</h2>
                <div class="workflow-grid">
                    {#each steps as step}
                        <StepCard {...step} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 9. Final Contact Section -->
        <section class="section-padding bg-orange border-b-brutal-lg">
            <div class="container flex-md-row">
                <div class="contact-info">
                    <h2 class="contact-title">ГОТОВІ ДО <br> ДЕМОНТАЖУ?</h2>
                    <p class="contact-subtitle">Пишіть нам туди, де вам зручно. Ми завжди онлайн.</p>
                    <MessengerBlock />
                </div>
                <div class="contact-form-final">
                    <ContactForm 
                        id="contact2"
                        title="Або замовте зворотний дзвінок"
                        description=""
                        buttonText="ЧЕКАЮ ДЗВІНКА"
                    />
                </div>
            </div>
        </section>
    </main>

    <Footer />
</div>

<style>
    .page-wrapper {
        min-height: 100vh;
    }

    .container {
        max-width: 80rem;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .container-sm {
        max-width: 48rem; /* 768px */
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .section-padding {
        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    @media (min-width: 768px) {
        .section-padding {
            padding-top: 6rem;
            padding-bottom: 6rem;
        }
    }

    .section-title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2.25rem;
        margin-bottom: 3rem;
        text-transform: uppercase;
    }

    /* Hero */
    .hero-section {
        background-color: var(--color-tire);
        color: var(--color-white);
        padding: 3rem 0 5rem;
        border-bottom: var(--border-width-lg) solid var(--color-tire);
        position: relative;
    }

    .hero-text {
        text-align: center;
        margin-bottom: 3rem;
    }

    .hero-title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 2.5rem;
        line-height: 1.1;
        margin-bottom: 1.5rem;
    }

    @media (min-width: 768px) {
        .hero-title {
            font-size: 4rem;
        }
    }

    .text-orange {
        color: var(--color-orange);
    }

    .underline-brutal {
        border-bottom: 4px solid var(--color-orange);
    }

    .hero-subtitle {
        color: var(--color-steel);
        font-size: 1.125rem;
        max-width: 42rem;
        margin: 0 auto;
    }

    /* Experience */
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }

    @media (min-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    /* Comparison */
    .comparison-grid {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .comparison-grid {
            flex-direction: row;
        }
    }

    .comparison-card {
        flex: 1;
        padding: 2rem;
    }

    .competitors {
        background-color: var(--color-concrete);
        border: var(--border-width) dashed var(--color-steel);
        opacity: 0.8;
    }

    .us {
        border-color: var(--color-orange);
        position: relative;
    }

    .badge-brutal {
        position: absolute;
        top: -1rem;
        right: -1rem;
        background-color: var(--color-orange);
        color: var(--color-white);
        font-family: var(--font-heading);
        font-weight: 900;
        padding: 0.5rem 1rem;
        transform: rotate(6deg);
        border: 2px solid var(--color-tire);
    }

    .card-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 4px solid var(--color-tire);
    }

    .competitors .card-header {
        border-bottom-width: 2px;
        border-bottom-color: var(--color-steel);
        color: var(--color-steel);
    }

    .card-title {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.5rem;
    }

    .comparison-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
    }

    /* Services */
    .services-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .services-grid {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    .border-y-brutal {
        border-top: var(--border-width-lg) solid var(--color-tire);
        border-bottom: var(--border-width-lg) solid var(--color-tire);
    }

    /* Calculator */
    .bg-tire-pattern {
        background-color: var(--color-tire);
        position: relative;
        overflow: hidden;
    }

    .bg-tire-pattern::before {
        content: "";
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(45deg, var(--color-orange), var(--color-orange) 40px, var(--color-tire) 40px, var(--color-tire) 80px);
        opacity: 0.1;
    }

    /* Workflow */
    .workflow-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        position: relative;
    }

    @media (min-width: 768px) {
        .workflow-grid {
            grid-template-columns: repeat(4, 1fr);
        }
        /* Connection line */
        .workflow-grid::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 8px;
            background-color: var(--color-tire);
            transform: translateY(-50%);
            z-index: 0;
        }
    }

    /* Final Contact */
    .flex-md-row {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        align-items: center;
    }

    @media (min-width: 768px) {
        .flex-md-row {
            flex-direction: row;
        }
    }

    .contact-info {
        flex: 1;
    }

    .contact-title {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 3rem;
        line-height: 0.9;
        margin-bottom: 1.5rem;
    }

    .contact-subtitle {
        font-weight: 700;
        font-size: 1.25rem;
        margin-bottom: 2rem;
    }

    .contact-form-final {
        flex: 1;
        width: 100%;
    }

    .bg-orange {
        background-color: var(--color-orange);
    }

    .border-b-brutal-lg {
        border-bottom: 8px solid var(--color-tire);
    }
</style>
