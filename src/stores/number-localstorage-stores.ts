import { writable } from "svelte/store";

function createLocalStorageNumberStore(key: string) {
	const defaultLsValue = localStorage.getItem(key);
	const store = writable(defaultLsValue === null ? null : parseFloat(defaultLsValue));
	store.subscribe(value => {
		if(value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value.toString());
	});
	return store;
}

export const antonioAutoRefreshInterval = createLocalStorageNumberStore("antonio-refresh-interval");
export const passagesAutoRefreshInterval = createLocalStorageNumberStore("passages-refresh-interval");
export const renownAutoRefreshInterval = createLocalStorageNumberStore("renown-refresh-interval");
export const sideMissionsAutoRefreshInterval = createLocalStorageNumberStore("side-missions-refresh-interval");