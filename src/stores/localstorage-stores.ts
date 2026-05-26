import { writable } from "svelte/store";

function getJsonFromLocalStorageOrDefault<T extends {}>(lsKey: string, makeDefault:()=>T) {
	try {
		const stored = localStorage.getItem(lsKey);

		// If no stored data or day has changed, reset
		if (!stored) return makeDefault();

		const parsed = JSON.parse(stored);
		return {  ...makeDefault(), ...parsed } as T;
	} catch (e) {
		console.error('Failed to parse json from localStorage', e);
		return makeDefault();
	}
}
export function createLocalStorageBasicJsonStore<T extends {}>(lsKey: string, makeDefault:()=>T) {
	const store = writable(getJsonFromLocalStorageOrDefault(lsKey, makeDefault));
	store.subscribe(value => {
		if(value === null) localStorage.removeItem(lsKey);
		else localStorage.setItem(lsKey, JSON.stringify(value));
	});
	return store;
}