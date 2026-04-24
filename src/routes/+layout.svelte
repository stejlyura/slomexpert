<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();
	let mounted = $state(false);

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		:root {
			--color-tire: #16181a;
			--color-orange: #ff5a00;
			--color-concrete: #e8ecef;
		}
		body {
			background-color: var(--color-concrete);
			color: var(--color-tire);
			margin: 0;
			font-family: system-ui, -apple-system, sans-serif;
		}
		.page-fade {
			transition: opacity 0.6s ease-out;
		}
		@keyframes pulse {
			0%, 100% { opacity: 0.4; transform: scale(0.96); }
			50% { opacity: 1; transform: scale(1); }
		}
		.loader-pulse {
			animation: pulse 1.5s ease-in-out infinite;
		}
	</style>
</svelte:head>

<div class="page-fade">
	{@render children()}
</div>

{#if !mounted}
	<div style="position: fixed; inset: 0; background: #e8ecef; display: flex; align-items: center; justify-content: center; z-index: 9999;">
		<div class="loader-pulse" style="font-family: system-ui, -apple-system, sans-serif; font-weight: 900; font-size: clamp(2rem, 10vw, 3.5rem); color: #16181a; text-transform: uppercase; letter-spacing: -0.05em;">
			SLOM<span style="color: #ff5a00;">EXPERT</span>
		</div>
	</div>
{/if}
