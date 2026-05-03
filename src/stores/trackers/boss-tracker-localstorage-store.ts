import { writable } from 'svelte/store';

export namespace bossTrackerStore {
	const BOSS_TRACKER_LS_KEY = "dm-tracker-personal-bosses";
	
	function getLocalStorageObject() {
		let json:Record<string, any> = {};
		try {
			const stored = localStorage.getItem(BOSS_TRACKER_LS_KEY);
			if (stored) {
				json = JSON.parse(stored);
			}
		} catch (e) { console.error('Failed to parse personal bosses from localStorage', e); }
		
		return {
			lastVoteDate: typeof json.lastVoteDate === 'string' ? new Date(json.lastVoteDate) : null,
			bosses: Array.isArray(json.bosses) ? json.bosses : []
		};
	}
	
	export const bossTracker = writable(getLocalStorageObject());

	bossTracker.subscribe(value => {
		localStorage.setItem(BOSS_TRACKER_LS_KEY, JSON.stringify(value));
	});

	export function toggleBossInBossTracker(boss:string) {
		bossTracker.update(data => ({ ...data,
			bosses: data.bosses.includes(boss) ? data.bosses.filter(b => b !== boss) : [...data.bosses, boss],
			lastVoteDate: new Date()
		}));
	}

	export function resetBossTracker() {
		bossTracker.set({ lastVoteDate: null, bosses: [] });
	}
}





	// // var _bossTrackerTimestamp = _getDailyTrackerTimestamp();
	// var _personalBossHistory = [];
	// if(Cookies.get("personalBoss")) {//} && (Cookies.get("personalBossTime")==null || Cookies.get("personalDailyTime") == _dailyTrackerTimestamp)) {
	// 	_personalBossHistory = Cookies.getJSON('personalBoss');
	// 	_applyPersonalBoss();
	// }
	
	// function _savePersonalBossHistory() {
	// 	// Cookies.set("personalBossTime", _bossTrackerTimestamp, { expires: 1 });
	// 	Cookies.set("personalBoss", _personalBossHistory, { expires: 7 });
	// }










