import { writable } from "svelte/store";

	const SIDE_QUEST_MEGA_SERVER_LS_KEY = "sideMissionsMegaServer";
	export const sideMissionsServerStore = writable((()=>{
		let lang = localStorage.getItem(SIDE_QUEST_MEGA_SERVER_LS_KEY);
		const validServers = ["en", "e2", "fr", "br", "es", "tr", "pl", "ru", "cn", "no", "hu", "nl", "ro", "id", "de", "ar", "ph", "jp", "fi", "it", "lt", "he", "cz", "hr", "bg", "lv", "et", "pt"];
		if(!validServers.includes(lang || "")) { lang = "en"; }
		return lang || "en";
	})());
	sideMissionsServerStore.subscribe(value => { localStorage.setItem(SIDE_QUEST_MEGA_SERVER_LS_KEY, value); });