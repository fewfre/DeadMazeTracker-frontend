import { writable } from "svelte/store";
import { loadScript } from "../utils/helpers";

export let BrowserPonies : {
	addInteraction(interaction : unknown) : unknown
	addInteractions(interactions : unknown) : unknown
	addPonies(ponies : unknown) : unknown
	addPony(pony : unknown) : unknown
	clear() : unknown
	convertInteractions(ini : unknown) : unknown
	convertPony(ini : unknown, baseurl : unknown) : unknown
	dumpConfig() : unknown
	getBaseUrl() : unknown
	getFadeDuration() : unknown
	getFps() : unknown
	getInteractionInterval() : unknown
	getInterval() : unknown
	getSpeakProbability() : unknown
	getSpeed() : unknown
	getVolume() : unknown
	isAudioEnabled() : unknown
	isDontSpeak() : unknown
	isPreloadAll() : unknown
	isShowFps() : unknown
	isShowLoadProgress() : unknown
	loadConfig(config : unknown) : unknown
	pause() : unknown
	ponies() : unknown
	preloadAll() : unknown
	preloadSpawned() : unknown
	removePonies(ponies : unknown) : unknown
	removePony(name:string) : unknown
	resume() : unknown
	running() : unknown
	setAudioEnabled(enabled:boolean) : unknown
	setBaseUrl(url:string) : unknown
	setDontSpeak(value : unknown) : unknown
	setFadeDuration(ms : unknown) : unknown
	setFps(fps : unknown) : unknown
	setInteractionInterval(ms : unknown) : unknown
	setInterval(ms : unknown) : unknown
	setPreloadAll(all : unknown) : unknown
	setShowFps(value : unknown) : unknown
	setShowLoadProgress(show:boolean) : unknown
	setSpeakProbability(probability : unknown) : unknown
	setSpeed(speed : unknown) : unknown
	setVolume(value : unknown) : unknown
	spawn(name:string, count:number) : unknown
	spawnRandom(count:number) : unknown
	start() : unknown
	stop() : unknown
	timer() : unknown
	togglePoniesToBackground() : unknown
	unspawn(name:string, count:number) : unknown
	unspawnAll() : unknown
} = (window as any).BrowserPonies;

export const browserPoniesEnabled = writable(false);
export const browserPoniesDisplayOnSiteBackground = writable(false);
export const browserPoniesUseTransparentSite = writable(false);

// `window.toggleBrowserPoniesToBackground` is needed for `BrowserPonies.togglePoniesToBackground()` to work
(window as any).toggleBrowserPoniesToBackground = function() {
	browserPoniesDisplayOnSiteBackground.update(b=>!b);
}

let _poniesInitialized = false;
export function initBrowserPonies() {
	// https://panzi.github.io/Browser-Ponies/
	if(!_poniesInitialized) {
		_poniesInitialized = true;
		browserPoniesEnabled.set(true);
		document.querySelector('head link[rel="icon"]')?.setAttribute("href", "https://panzi.github.io/Browser-Ponies/favicon.ico");
		
		// Load
		Promise.all([
			loadScript("https://panzi.github.io/Browser-Ponies/basecfg.js"),
			loadScript("https://panzi.github.io/Browser-Ponies/browserponies.js")
		]).then(function(){
			BrowserPonies = (window as any).BrowserPonies;
			BrowserPonies.togglePoniesToBackground();
			spawnPonies();
			// (function (cfg) {
			// 	BrowserPonies.setBaseUrl(cfg.baseurl);
			// 	BrowserPonies.loadConfig(BrowserPoniesBaseConfig);
			// 	BrowserPonies.loadConfig(cfg);
			// })({"baseurl":"https://panzi.github.io/Browser-Ponies/","fadeDuration":500,"volume":1,"fps":25,"speed":1,"audioEnabled":false,"showFps":false,"showLoadProgress":true,"speakProbability":0.1,"spawn":{"applejack":1,"fluttershy":1,"pinkie pie":1,"rainbow dash":1,"rarity":1,"twilight sparkle":1},"autostart":true});
		});
	} else {
		spawnPonies();
	}
}

export function spawnPonies() {
	// var tPoniesList = {"apple bloom":1,"applejack":1,"applejack (filly)":1,"big mac":1,"carrot top":1,"changeling":1,"cheerilee":1,"colgate":1,"daring do":1,"derpy hooves":1,"dinky hooves":1,"doctor whooves":1,"doctor whooves (fan character)":1,"gilda":1,"ginger snap":1,"grace manewitz":1,"hoity-toity":1,"king sombra":1,"lyra":1,"mayor mare":1,"mistress marevelous":1,"mr breezy":1,"mr cake":1,"mrs cake":1,"mysterious mare do well":1,"nightmare moon":1,"nurse redheart":1,"pinkie pie":1,"pinkie pie (filly)":1,"pipsqueak":1,"pound cake":1,"princess cadance":1,"princess cadance (teenager)":1,"princess celestia":1,"princess celestia (alternate filly)":1,"princess celestia (filly)":1,"princess luna":1,"princess luna (filly)":1,"princess luna (season 1)":1,"princess twilight sparkle":1,"pumpkin cake":1,"queen chrysalis":1,"radiance":1,"rainbow dash":1,"rainbow dash (filly)":1,"rarity":1,"rarity (filly)":1,"royal night guard":1,"saddle rager":1,"scootaloo":1,"screwball":1,"shadowbolt":1,"shopkeeper":1,"soarin'":1,"sunset shimmer":1,"surprise":1,"sweetie belle":1,"tank":1,"trixie":1,"twilight sparkle":1,"twilight sparkle (filly)":1,"vinyl scratch":1,"zapp":1};
	var tPoniesList = {};
	
	const BrowserPoniesBaseConfig = (window as any).BrowserPoniesBaseConfig ??= undefined;
	const BrowserPoniesConfig = (window as any).BrowserPoniesConfig ??= undefined;
	(function (srcs:any,cfg:any) { var cbcount = 1; var callback = function() { --cbcount; if (cbcount === 0) { BrowserPonies.setBaseUrl(cfg.baseurl); if (!BrowserPoniesBaseConfig.loaded) { BrowserPonies.loadConfig(BrowserPoniesBaseConfig); BrowserPoniesBaseConfig.loaded = true; } BrowserPonies.loadConfig(cfg); if (!BrowserPonies.running()) BrowserPonies.start(); } }; if (typeof(BrowserPoniesConfig) === "undefined") { (window as any).BrowserPoniesConfig = {}; } if (typeof(BrowserPoniesBaseConfig) === "undefined") { ++cbcount; BrowserPoniesConfig.onbasecfg = callback; } if (typeof(BrowserPonies) === "undefined") { ++ cbcount; BrowserPoniesConfig.oninit = callback; } var node = (document.body || document.documentElement || document.getElementsByTagName('head')[0]); for (var id in srcs) { if (document.getElementById(id)) continue; if (node) { var s = document.createElement('script'); s.type = 'text/javascript'; s.id = id; s.src = srcs[id]; node.appendChild(s); } else { document.write('\u003cscript type="text/javscript" src="'+ srcs[id]+'" id="'+id+'"\u003e\u003c/script\u003e'); } } callback(); })
		({"browser-ponies-script":"https://panzi.github.io/Browser-Ponies/browserponies.js","browser-ponies-config":"https://panzi.github.io/Browser-Ponies/basecfg.js"},
		{"baseurl":"https://panzi.github.io/Browser-Ponies/","fadeDuration":500,"volume":1,"fps":25,"speed":1,"audioEnabled":false,"showFps":true,"showLoadProgress":true,"speakProbability":0.1,"spawn":tPoniesList, "spawnRandom":5
	});
}