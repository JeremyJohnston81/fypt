<script>
	import database from '$lib/database.js';

	let lastUpdatedDate;

	const getLastUpdated = async () => {
		const lastUpdated = await database.getLastUpdated();
		lastUpdatedDate = new Date(lastUpdated.lastUpdated).toLocaleDateString('en-us', {
			year: 'numeric',
			day: '2-digit',
			month: 'short'
		});
	};

	getLastUpdated();
</script>

<div class="lastUpdated">
	<p>Data from HCAD last updated: {lastUpdatedDate}</p>
</div>

<style lang="scss">
	.lastUpdated {
		color: var(--primary-color);
	}
</style>
