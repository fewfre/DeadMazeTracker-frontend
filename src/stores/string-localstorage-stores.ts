import { writable } from "svelte/store";

function createLocalStorageStringStore(key: string) {
	const store = writable(localStorage.getItem(key));
	store.subscribe(value => {
		if(value === null) localStorage.removeItem(key);
		else localStorage.setItem(key, value);
	});
	return store;
}

export const siteLang = createLocalStorageStringStore("lang");