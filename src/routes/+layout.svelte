<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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
			font-family: "Inter", system-ui, -apple-system, sans-serif;
		}
	</style>
</svelte:head>

<div class="page-fade">
	{@render children()}
</div>
