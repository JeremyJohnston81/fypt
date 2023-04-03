<script>
	import '../app.scss';
	import { headerIsOpen } from '$lib/store.js';
	import Nav from '$lib/layout/Nav.svelte';
	import { navlink } from 'svelte-navlink-action';

	const closeMenu = () => {
		$headerIsOpen = false;
	};
</script>

<Nav sticky collapsible>
	<a href="/" use:navlink={{ exact: true }} on:click={closeMenu}>Home</a>
	<a href="/about" use:navlink on:click={closeMenu}>About</a>
	<!-- <a href="/donate" use:navlink on:click={closeMenu}>Donate</a> -->
</Nav>

<main>
	<slot />
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
