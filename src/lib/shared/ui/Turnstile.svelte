<script>
    import { onMount } from 'svelte';

    import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
    
    let { 
        sitekey = PUBLIC_TURNSTILE_SITE_KEY || "1x00000000000000000000AA", 
        onVerify = (token) => {},
        theme = "light"
    } = $props();

    let container;
    let widgetId;

    onMount(() => {
        const checkTurnstile = setInterval(() => {
            if (window.turnstile) {
                clearInterval(checkTurnstile);
                widgetId = window.turnstile.render(container, {
                    sitekey,
                    theme,
                    callback: (token) => onVerify(token),
                });
            }
        }, 100);

        return () => {
            if (widgetId && window.turnstile) {
                window.turnstile.remove(widgetId);
            }
        };
    });

    export function reset() {
        if (widgetId && window.turnstile) {
            window.turnstile.reset(widgetId);
        }
    }
</script>

<div bind:this={container} class="turnstile-container"></div>

<style>
    .turnstile-container {
        margin: 1rem 0;
        min-height: 65px;
    }
</style>
