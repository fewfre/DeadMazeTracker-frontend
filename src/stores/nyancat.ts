import { writable } from "svelte/store";

export const nyancatBodyClass = 'nyancat';

export const nyanCatEnabled = writable(false);

export function toggleNyanCat() {
	nyanCatEnabled.update(b => !b);
}