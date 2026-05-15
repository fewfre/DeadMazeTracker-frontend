import { writable } from "svelte/store";
import { siteLang } from "../stores/string-localstorage-stores";
import { ptBrI18n } from "./pt-br";

export const getI18n = writable<(key:keyof typeof ptBrI18n, en:string)=>string>((key, en)=>en);

siteLang.subscribe(lang => {
	if(lang === 'pt-br') {
		getI18n.set((key, en) => ptBrI18n[key] ?? en);
	} else {
		getI18n.set((key, en)=>en);
	}
	
})