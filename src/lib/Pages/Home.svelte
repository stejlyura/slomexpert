<script>
    import Header from "../Widgets/Header.svelte";
    import Footer from "../Widgets/Footer.svelte";
    import HeroCarousel from "../Features/HeroCarousel.svelte";
    import ContactForm from "../Features/ContactForm.svelte";
    import StatCard from "../Entities/StatCard.svelte";
    import ComparisonItem from "../Entities/ComparisonItem.svelte";
    import ServiceCard from "../Entities/ServiceCard.svelte";
    import Configurator from "../Features/Configurator.svelte";
    import StepCard from "../Entities/StepCard.svelte";
    import MessengerBlock from "../Features/MessengerBlock.svelte";
    import ReviewForm from "../Features/ReviewForm.svelte";
    import SEO from "../shared/seo/SEO.svelte";
    import Icon from "../shared/ui/Icon.svelte";

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Slomexpert",
        image: "https://slomexpert.com/og-default.png",
        url: "https://slomexpert.com",
        telephone: "+380672158888",
        email: "info@slomexpert.ua",
        address: {
            "@type": "PostalAddress",
            streetAddress: "вул. Будівельна, 10",
            addressLocality: "Київ",
            postalCode: "01001",
            addressCountry: "UA",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 50.4501,
            longitude: 30.5234,
        },
        openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            opens: "00:00",
            closes: "23:59",
        },
    };

    const services = [
        {
            icon: "🏭",
            title: "Промислові об'єкти",
            description:
                "Ангари, заводи, цехи. Тяжка техніка та різання металоконструкцій.",
            variant: "white",
        },
        {
            icon: "🏠",
            title: "Приватні будинки",
            description:
                "Акуратне знесення старих будинків, дач, сараїв зі збереженням матеріалів.",
            variant: "orange",
        },
        {
            icon: "🚪",
            title: "Квартирний демонтаж",
            description:
                "Стяжка, перегородки, плитка. Працюємо тихо (наскільки це можливо).",
            variant: "white",
        },
    ];

    const stats = [
        { value: "> 10", label: "Років на ринку" },
        { value: "500+", label: "Успішних об'єктів" },
        { value: "24/7", label: "Графік роботи" },
        { value: "15", label: "Одиниць техніки" },
    ];

    const steps = [
        {
            number: 1,
            title: "Заявка",
            description: "Ви телефонуєте або залишаєте заявку на сайті.",
        },
        {
            number: 2,
            title: "Оцінка",
            description: "Майстер виїжджає на об'єкт, складає кошторис.",
        },
        {
            number: 3,
            title: "Демонтаж",
            description: "Заганяємо техніку, швидко та акуратно ламаємо.",
        },
        {
            number: 4,
            title: "Чистота",
            description: "Вивозимо сміття, ви приймаєте чистий майданчик.",
            variant: "tire",
        },
    ];
</script>

<SEO
    title="SLOMEXPERT - Професійний демонтаж в Україні | Знесення будівель"
    description="Професійний демонтаж будівель, промислових об'єктів та квартир по всій Україні. Працюємо 24/7, фіксована ціна, повний вивіз сміття. Замовте безкоштовну оцінку!"
    keywords="демонтаж, знесення будівель, промисловий демонтаж, квартирний демонтаж, вивіз сміття, Київ, Україна, Slomexpert"
    canonical="https://slomexpert.com"
    {jsonLd}
/>

<div class="min-h-screen bg-grid">
    <Header />

    <main>
        <!-- 2. Hero Section -->
        <section
            class="bg-tire text-white py-12 pb-20 border-b-4 border-tire relative"
        >
            <div class="container-brutal">
                <div class="text-center mb-12">
                    <h1
                        class="font-heading font-black text-4xl md:text-[4rem] leading-[1.1] mb-6"
                    >
                        БРУТАЛЬНИЙ ДЕМОНТАЖ <br />
                        <span class="text-orange border-b-4 border-orange"
                            >БЕЗ ЗАЙВОГО БРУДУ</span
                        >
                    </h1>
                    <p class="text-steel text-lg max-w-2xl mx-auto">
                        Зносимо, ламаємо та розчищаємо будь-які об'єкти в
                        Україні. Швидко. Надійно. Під ключ.
                    </p>
                </div>
                <HeroCarousel />
            </div>
        </section>

        <!-- 3. Contact Form 1 -->
        <section id="contact1" class="py-16 md:py-24">
            <div class="container-brutal-sm">
                <ContactForm />
            </div>
        </section>

        <!-- 4. Experience Section -->
        <section
            id="experience"
            class="py-16 md:py-24 bg-tire text-white content-auto"
        >
            <div class="container-brutal">
                <h2
                    class="font-heading font-black text-4xl mb-12 uppercase text-center"
                >
                    НАШ ДОСВІД В ЦИФРАХ
                </h2>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {#each stats as stat}
                        <StatCard {...stat} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 5. Comparison Section -->
        <section class="py-16 md:py-24 content-auto">
            <div class="container-brutal">
                <h2
                    class="font-heading font-black text-4xl mb-12 uppercase text-center"
                >
                    ЧОМУ МИ, А НЕ "ШАБАШНИКИ"?
                </h2>
                <div class="flex flex-col md:flex-row gap-8">
                    <!-- Competitors -->
                    <div
                        class="flex-1 p-8 bg-concrete border-3 border-dashed border-steel opacity-80"
                    >
                        <div
                            class="flex items-center gap-3 mb-6 pb-4 border-b-2 border-steel text-steel"
                        >
                            <Icon name="face-frown" className="text-3xl" />
                            <h3 class="font-heading font-bold text-2xl">
                                Типові конкуренти
                            </h3>
                        </div>
                        <ul class="flex flex-col gap-4 p-0">
                            <ComparisonItem
                                type="negative"
                                text="Ціна зростає під час роботи"
                            />
                            <ComparisonItem
                                type="negative"
                                text="Залишають гори будівельного сміття"
                            />
                            <ComparisonItem
                                type="negative"
                                text="Зривають терміни здачі"
                            />
                            <ComparisonItem
                                type="negative"
                                text="Працюють 'в чорну' без гарантій"
                            />
                        </ul>
                    </div>

                    <!-- Us -->
                    <div class="flex-1 p-8 card-brutal border-orange relative">
                        <div
                            class="absolute -top-4 -right-4 bg-orange text-white font-heading font-black p-2 px-4 rotate-6 border-2 border-tire"
                        >
                            НАШ ПІДХІД
                        </div>
                        <div
                            class="flex items-center gap-3 mb-6 pb-4 border-b-4 border-tire"
                        >
                            <span class="text-3xl">👷‍♂️</span>
                            <h3 class="font-heading font-bold text-2xl">
                                SLOMEXPERT
                            </h3>
                        </div>
                        <ul class="flex flex-col gap-4 p-0">
                            <ComparisonItem
                                type="positive"
                                text="Фіксована ціна в договорі перед стартом"
                            />
                            <ComparisonItem
                                type="positive"
                                text="Повний вивіз сміття та прибирання об'єкта"
                            />
                            <ComparisonItem
                                type="positive"
                                text="Чітке дотримання дедлайнів. Штрафи за затримку"
                            />
                            <ComparisonItem
                                type="positive"
                                text="Всі дозвільні документи та гарантія безпеки"
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- 6. Services Section -->
        <section
            id="services"
            class="py-16 md:py-24 bg-white border-y-4 border-tire content-auto"
        >
            <div class="container-brutal">
                <h2
                    class="font-heading font-black text-4xl mb-12 uppercase text-center"
                >
                    ЩО МИ ДЕМОНТУЄМО?
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {#each services as service}
                        <ServiceCard {...service} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 7. Calculator Section -->
        <section
            id="calculator"
            class="py-16 md:py-24 bg-tire relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:[background:repeating-linear-gradient(45deg,var(--color-orange),var(--color-orange)_40px,var(--color-tire)_40px,var(--color-tire)_80px)] before:opacity-10"
        >
            <div class="container-brutal-sm relative z-10">
                <Configurator />
            </div>
        </section>

        <!-- 8. Workflow Section -->
        <section class="py-16 md:py-24 bg-concrete content-auto">
            <div class="container-brutal">
                <h2
                    class="font-heading font-black text-4xl mb-12 uppercase text-center"
                >
                    ЯК МИ ПРАЦЮЄМО
                </h2>
                <div
                    class="grid grid-cols-1 md:grid-cols-4 gap-8 relative md:before:content-[''] md:before:absolute md:before:top-1/2 md:before:left-0 md:before:w-full md:before:h-2 md:before:bg-tire md:before:-translate-y-1/2 md:before:z-0"
                >
                    {#each steps as step}
                        <StepCard {...step} />
                    {/each}
                </div>
            </div>
        </section>

        <!-- 9. Final Contact Section -->
        <section class="py-16 md:py-24 bg-orange border-b-8 border-tire">
            <div
                class="container-brutal flex flex-col md:flex-row items-center gap-12"
            >
                <div class="flex-1">
                    <h2
                        class="font-heading font-black text-5xl md:text-[3rem] leading-[0.9] mb-6"
                    >
                        ГОТОВІ ДО <br /> ДЕМОНТАЖУ?
                    </h2>
                    <p class="font-bold text-xl mb-8">
                        Пишіть нам туди, де вам зручно. Ми завжди онлайн.
                    </p>
                    <MessengerBlock />
                </div>
                <div class="flex-1 w-full">
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
