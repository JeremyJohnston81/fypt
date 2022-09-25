<script>
	import '../app.scss'
	import Stretch from '$lib/components/Stretch.svelte';
	import { pageLoaded } from "$lib/store.js";
</script>

<main>
	{#if $pageLoaded}
	<slot />
	{:else}
	<Stretch />
	{/if}
</main>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding-top: 3rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
