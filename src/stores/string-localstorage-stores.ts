import { writable } from "svelte/store";

export function createLocalStorageStringStore(key: string, defaultValue?:string) {
	const store = writable(localStorage.getItem(key) ?? defaultValue);
	store.subscribe(value => {
		if(value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
	});
	return store;
}