import { writable } from "svelte/store";

export const BrowserPonies = (window as any).BrowserPonies;

export const browserPoniesEnabled = writable(false);
export const browserPoniesUseTransparentSite = writable(false);

export function toggleBrowserPonies() {
	browserPoniesEnabled.update(b => !b);
}

export function toggleBrowserPoniesSiteTransparency() {
	browserPoniesUseTransparentSite.update(b => !b);
}