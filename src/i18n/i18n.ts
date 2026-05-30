import { writable } from "svelte/store";
import { createLocalStorageStringStore } from "../stores/string-localstorage-stores";
import { esI18n } from "./es.i18n";
import { ptBrI18n } from "./pt-br";
import { trI18n } from "./tr.i18n";

export const langList = [
	{ code:"en", name:"English", flag:"images/flags/en.png" },
	{ code:"pt-br", name:"Português do Brasil", flag:"images/flags/br.png" },
	{ code:"es", name:"Español", flag:"images/flags/es.png" },
	{ code:"tr", name:"Türkçe", flag:"images/flags/tr.png" },
];

const langDataMap = new Map(Object.entries({
	"pt-br": ptBrI18n,
	"es": esI18n,
	'tr': trI18n,
}))

function getDefaultSupportedLang() {
	const browserLang = (navigator.languages?.[0] || navigator.language).toLowerCase();
	if (browserLang.startsWith('pt')) return 'pt-br';
	if (browserLang.startsWith('es')) return 'es';
	if (browserLang.startsWith('tr')) return 'tr';
	return "en";
}
export const siteLang = createLocalStorageStringStore("lang", getDefaultSupportedLang());

export const getI18n = writable<(key:keyof typeof ptBrI18n, en:string)=>string>((key, en)=>en);
siteLang.subscribe(lang => {
	if(langDataMap.has(lang)) {
		getI18n.set((key, en) => langDataMap.get(lang)![key] || en);
	} else {
		getI18n.set((key, en)=>en);
	}
});