<script>
	import database from '$lib/database.js';
	import PropertyCard from '$lib/components/PropertyCard.svelte';
	import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';
	import LastUpdated from '../lib/components/LastUpdated.svelte';

	let searchResults = [];
	let searchAddress = '';
	let searched = false;
	let error;

	const propertySearch = async (address) => {
		searchResults = await database.getAccountId(address);
		error = searchResults.error;
		searched = true;
	};
</script>

<h2>Please read the <a href="/about">FAQ page</a> to understand how this report works</h2>

<h1>Get Your Property Tax Report</h1>
<LastUpdated />
<form on:submit|preventDefault={() => propertySearch(searchAddress)}>
	<input type="textbox" placeholder="Enter Property Address" bind:value={searchAddress} />
	<button type="submit">Search</button>
</form>
<br />
{#if error}
	<div class="error">
		Please check your search request. Ensure it starts with the street number and ends with the
		street address only
	</div>
{:else if searched && searchResults.length === 0}
	<div class="error">No properties found with that address in Harris County, TX</div>
{:else}
	{#each searchResults as property (property.account)}
		<IntersectionObserver let:intersecting bottom={-50}>
			<PropertyCard {property} animate={intersecting} />
		</IntersectionObserver>
	{/each}
{/if}

<style lang="scss">
	h1:before {
		content: 'STEP 1 of 2';
		font-weight: bold;
		font-size: 0.8em;
		opacity: 0.4;
	}

	h1:after {
		font-size: 0.5em;
	}
</style>
