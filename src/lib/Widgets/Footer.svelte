<script>
    export let year = new Date().getFullYear();
</script>

<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Branding -->
            <div class="branding">
                <div class="logo">
                    SLOM<span class="text-orange">EXPERT</span>
                </div>
                <p class="tagline">
                    Професійні демонтажні роботи по всій території України.<br>
                    Без вихідних та свят.
                </p>
            </div>

            <!-- Contacts -->
            <div class="contacts">
                <p class="address">м. Київ, вул. Будівельна, 10</p>
                <p class="email">Email: info@slomexpert.ua</p>
            </div>

            <!-- Copyright -->
            <div class="copyright">
                <p>&copy; {year} Slomexpert. Всі права захищено.</p>
                <p class="credits">Розроблено брутально та з любов'ю. Без JS.</p>
            </div>
        </div>
    </div>
</footer>

<style>
    .footer {
        background-color: var(--color-tire);
        color: var(--color-steel);
        padding-top: 3rem;
        padding-bottom: 3rem;
        border-top: var(--border-width-lg) solid var(--color-orange);
        text-align: center;
    }

    @media (min-width: 768px) {
        .footer {
            text-align: left;
        }
    }

    .container {
        max-width: 80rem;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .footer-grid {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        gap: 2rem;
    }

    @media (min-width: 768px) {
        .footer-grid {
            flex-direction: row;
        }
    }

    .logo {
        font-family: var(--font-heading);
        font-weight: 900;
        font-size: 1.5rem;
        color: var(--color-white);
        margin-bottom: 0.5rem;
    }

    .text-orange {
        color: var(--color-orange);
    }

    .tagline {
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.5;
    }

    .contacts {
        font-weight: 700;
        font-size: 0.875rem;
    }

    .address {
        margin-bottom: 0.25rem;
    }

    .copyright {
        font-size: 0.75rem;
        font-weight: 600;
        opacity: 0.6;
    }

    .credits {
        margin-top: 0.25rem;
    }
</style>
