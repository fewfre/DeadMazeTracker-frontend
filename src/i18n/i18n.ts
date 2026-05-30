import { writable } from "svelte/store";
import { createLocalStorageStringStore } from "../stores/string-localstorage-stores";
import { esI18n } from "./es.i18n";
import { ptBrI18n } from "./pt-br";

const langMap = new Map(Object.entries({
	"pt-br": ptBrI18n,
	"es": esI18n
}))

function getDefaultSupportedLang() {
	const browserLang = (navigator.languages?.[0] || navigator.language).toLowerCase();
	if (browserLang.startsWith('pt')) return 'pt-br';
	if (browserLang.startsWith('es')) return 'es';
	return "en";
}
export const siteLang = createLocalStorageStringStore("lang", getDefaultSupportedLang());

export const getI18n = writable<(key:keyof typeof ptBrI18n, en:string)=>string>((key, en)=>en);
siteLang.subscribe(lang => {
	if(langMap.has(lang)) {
		getI18n.set((key, en) => langMap.get(lang)![key] || en);
	} else {
		getI18n.set((key, en)=>en);
	}
});