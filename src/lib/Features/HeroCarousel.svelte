<script>
    export let slides = [
        {
            title: "Знесення будівель",
            emoji: "🏢💥",
            bg: "var(--color-concrete)"
        },
        {
            title: "Механізований демонтаж",
            emoji: "🚜",
            bg: "#D1D5DB" /* gray-300 */
        },
        {
            title: "Ручний демонтаж квартир",
            emoji: "🔨",
            bg: "#9CA3AF" /* gray-400 */
        }
    ];
</script>

<div class="carousel-container">
    <!-- Hidden Radio Buttons for CSS-only State -->
    {#each slides as _, i}
        <input 
            type="radio" 
            name="slider" 
            id="s{i + 1}" 
            checked={i === 0} 
            class="hidden-radio"
        >
    {/each}

    <!-- Viewport -->
    <div class="carousel-viewport">
        <div class="carousel-track">
            {#each slides as slide}
                <div class="slide" style="background-color: {slide.bg}">
                    <div class="slide-content">
                        <span class="slide-emoji">{slide.emoji}</span>
                        <h3 class="slide-title">{slide.title}</h3>
                        <p class="slide-placeholder">[Фото об'єкта]</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>

    <!-- Navigation Arrows -->
    <div class="arrows">
        {#each slides as _, i}
            {@const prev = i === 0 ? slides.length : i}
            {@const next = i === slides.length - 1 ? 1 : i + 2}
            
            <label for="s{prev}" class="nav-btn prev-btn s{i + 1}-nav">
                <i class="fa-solid fa-chevron-left"></i>
            </label>
            <label for="s{next}" class="nav-btn next-btn s{i + 1}-nav">
                <i class="fa-solid fa-chevron-right"></i>
            </label>
        {/each}
    </div>
</div>

<style>
    .carousel-container {
        position: relative;
        max-width: 56rem; /* 896px */
        margin-left: auto;
        margin-right: auto;
        border: var(--border-width-lg) solid var(--color-orange);
        background-color: var(--color-tire);
    }

    .hidden-radio {
        display: none;
    }

    .carousel-viewport {
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .carousel-track {
        display: flex;
        transition: transform 0.5s ease-in-out;
        width: 100%;
    }

    .slide {
        flex-shrink: 0;
        width: 100%;
        height: 300px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--color-tire);
    }

    @media (min-width: 768px) {
        .slide {
            height: 450px;
        }
    }

    .slide-content {
        text-align: center;
    }

    .slide-emoji {
        font-size: 4rem;
        margin-bottom: 1rem;
        display: block;
    }

    @media (min-width: 768px) {
        .slide-emoji {
            font-size: 6rem;
        }
    }

    .slide-title {
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.5rem;
    }

    .slide-placeholder {
        font-family: monospace;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        opacity: 0.5;
    }

    /* Navigation Arrows */
    .arrows {
        position: absolute;
        inset: 0;
        pointer-events: none;
    }

    .nav-btn {
        display: none;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--color-orange);
        color: var(--color-white);
        width: 3rem;
        height: 3rem;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        pointer-events: auto;
        font-size: 1.5rem;
        transition: background-color var(--transition-fast);
        z-index: 10;
    }

    .nav-btn:hover {
        background-color: var(--color-orange-hover);
    }

    .prev-btn {
        left: 0;
        border-right: 4px solid var(--color-tire);
        border-top: 4px solid var(--color-tire);
        border-bottom: 4px solid var(--color-tire);
    }

    .next-btn {
        right: 0;
        border-left: 4px solid var(--color-tire);
        border-top: 4px solid var(--color-tire);
        border-bottom: 4px solid var(--color-tire);
    }

    /* CSS Logic for Switching */
    #s1:checked ~ .carousel-viewport .carousel-track { transform: translateX(0%); }
    #s2:checked ~ .carousel-viewport .carousel-track { transform: translateX(-100%); }
    #s3:checked ~ .carousel-viewport .carousel-track { transform: translateX(-200%); }

    /* Display arrows based on active slide */
    #s1:checked ~ .arrows .s1-nav { display: flex; }
    #s2:checked ~ .arrows .s2-nav { display: flex; }
    #s3:checked ~ .arrows .s3-nav { display: flex; }
</style>
