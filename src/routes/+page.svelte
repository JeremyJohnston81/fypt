<script>
    import database from '$lib/database.js' 
    import PropertyCard from '$lib/components/PropertyCard.svelte'
    import IntersectionObserver from '$lib/components/IntersectionObserver.svelte';

    let searchResults = []
    let searchAddress = ""
    let searched = false
    let error

    const propertySearch = async(address) => {
        searchResults = await database.getAccountId(address)
        error = searchResults.error
        searched = true
    }

</script>

<h1>Protest Your Property Taxes</h1>
<form on:submit|preventDefault="{() => propertySearch(searchAddress)}">
    <input type="textbox" placeholder="Enter Property Address" bind:value={searchAddress}>
    <button type="submit">Search</button>
</form>
<br />
{#if error}
    <div class="error">Please check your search request. Ensure it starts with the street number and ends with the street address only</div>
{:else if searched && searchResults.length === 0}
    <div class="error">No properties found with that address in Harris County, TX</div> 
{:else}
    {#each searchResults as property (property.account)}
    <IntersectionObserver let:intersecting bottom={-150} top={-150}>
        <PropertyCard property={property} animate={intersecting} />
    </IntersectionObserver>
    {/each}
{/if}

<style lang="scss">

</style>
