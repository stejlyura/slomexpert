<script>
    import Icon from "../shared/ui/Icon.svelte";
    let {
        slides = [
            {
                title: "Знесення будівель",
                img: "/images/hero-1.png"
            },
            {
                title: "Механізований демонтаж",
                img: "/images/hero-2.png"
            },
            {
                title: "Ручний демонтаж квартир",
                img: "/images/hero-3.png"
            }
        ]
    } = $props();
</script>

<div class="relative max-w-4xl mx-auto border-4 border-orange bg-tire carousel-container">
    <!-- Hidden Radio Buttons for CSS-only State -->
    {#each slides as _, i}
        <input 
            type="radio" 
            name="slider" 
            id="s{i + 1}" 
            checked={i === 0} 
            class="hidden"
        >
    {/each}

    <!-- Viewport -->
    <div class="w-full overflow-hidden relative">
        <div class="flex transition-transform duration-500 ease-in-out w-full carousel-track">
            {#each slides as slide}
                <div class="shrink-0 w-full h-[300px] md:h-[450px] relative flex flex-col items-center justify-center text-white overflow-hidden">
                    <img 
                        src={slide.img} 
                        alt={slide.title} 
                        class="absolute inset-0 w-full h-full object-cover grayscale-[0.5] contrast-125"
                    />
                    <div class="absolute inset-0 bg-tire/40"></div>
                    <div class="relative z-10 text-center px-4">
                        <h3 class="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter drop-shadow-brutal">
                            {slide.title}
                        </h3>
                    </div>
                </div>
            {/each}
        </div>
    </div>


    <!-- Navigation Arrows -->
    <div class="absolute inset-0 pointer-events-none arrows">
        {#each slides as _, i}
            {@const prev = i === 0 ? slides.length : i}
            {@const next = i === slides.length - 1 ? 1 : i + 2}
            
            <label for="s{prev}" class="hidden absolute top-1/2 -translate-y-1/2 bg-orange text-white w-12 h-12 items-center justify-center cursor-pointer pointer-events-auto text-2xl transition-colors duration-100 hover:bg-orange-hover z-10 left-0 border-r-4 border-y-4 border-tire s{i + 1}-nav">
                <Icon name="chevron-left" />
            </label>
            <label for="s{next}" class="hidden absolute top-1/2 -translate-y-1/2 bg-orange text-white w-12 h-12 items-center justify-center cursor-pointer pointer-events-auto text-2xl transition-colors duration-100 hover:bg-orange-hover z-10 right-0 border-l-4 border-y-4 border-tire s{i + 1}-nav">
                <Icon name="chevron-right" />
            </label>
        {/each}
    </div>
</div>

<style>
    /* CSS Logic for Switching - kept in style block because Tailwind peer/group logic is limited for nth-siblings */
    #s1:checked ~ .carousel-viewport .carousel-track,
    #s1:checked ~ div .carousel-track { transform: translateX(0%); }
    #s2:checked ~ .carousel-viewport .carousel-track,
    #s2:checked ~ div .carousel-track { transform: translateX(-100%); }
    #s3:checked ~ .carousel-viewport .carousel-track,
    #s3:checked ~ div .carousel-track { transform: translateX(-200%); }

    #s1:checked ~ .arrows .s1-nav { display: flex; }
    #s2:checked ~ .arrows .s2-nav { display: flex; }
    #s3:checked ~ .arrows .s3-nav { display: flex; }
</style>
