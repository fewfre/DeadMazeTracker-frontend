import { writable } from "svelte/store";

export const nyanCatBodyClass = 'nyancat';

export const nyanCatEnabled = writable(false);

export function toggleNyanCat() {
	nyanCatEnabled.update(b => !b);
}