import { variables } from '$lib/variables';
import { fetcher } from 'itty-fetcher';

const api = fetcher({ base: variables.fyptApiUrl });

async function getAccountId(address) {
	return await api.get(`/search/${address}`);
}

async function getComps(account) {
	return await api.get(`/comps/${account}`);
}

async function getLastUpdated() {
	return await api.get(`/lastUpdated`);
}

const database = {
	getAccountId,
	getComps,
	getLastUpdated
};

export default database;
