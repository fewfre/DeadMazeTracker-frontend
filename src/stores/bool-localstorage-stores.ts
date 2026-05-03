import { writable } from "svelte/store";

function createLocalStorageBooleanStore(key: string) {
	const store = writable(localStorage.getItem(key) === 'true' || localStorage.getItem(key) === '1');
	store.subscribe(value => {
		localStorage.setItem(key, (+value).toString());
	});
	return store;
}

export const cookieConsent = createLocalStorageBooleanStore("cookie-consent");
export const disableChat = createLocalStorageBooleanStore("disable-chat");
export const forceChatBelow = createLocalStorageBooleanStore("force-chat-below");
export const disableBlur = createLocalStorageBooleanStore("disable-blur");
export const disableMaxWidth = createLocalStorageBooleanStore("disable-max-width");
export const antonioInHeader = createLocalStorageBooleanStore("antonio-in-header");