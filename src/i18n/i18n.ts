import { writable } from "svelte/store";
import { createLocalStorageStringStore } from "../stores/string-localstorage-stores";
import { enI18n } from "./_en.i18n";
import { esI18n } from "./es.i18n";
import { ptBrI18n } from "./pt-br.i18n";
import { trI18n } from "./tr.i18n";

type I18nKey = keyof typeof enI18n;

export const langList = [
	{ code:"en", name:"English", flag:"images/flags/en.png" },
	{ code:"pt-br", name:"Português do Brasil", flag:"images/flags/br.png" },
	{ code:"es", name:"Español", flag:"images/flags/es.png" },
	{ code:"tr", name:"Türkçe", flag:"images/flags/tr.png" },
];

const langDataMap = new Map(Object.entries({
	"en": enI18n,
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

export const getI18n = writable<(key:I18nKey, backupEn?:string)=>string>((key, backupEn)=>backupEn || key);
siteLang.subscribe(lang => {
	if(langDataMap.has(lang) && lang !== "en") {
		getI18n.set((key, backupEn) => (langDataMap.get(lang) as any)[key] || enI18n[key] || backupEn || key);
	} else {
		getI18n.set((key, backupEn) => enI18n[key] || backupEn || key);
	}
});