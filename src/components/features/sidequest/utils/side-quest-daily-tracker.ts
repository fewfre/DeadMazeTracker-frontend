import { get, writable } from 'svelte/store';
import { getDateWithUTCOffset, setOnTheHourInterval } from '../../../../utils/helpers';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS } from '../../../../utils/time-id-store-helpers';
import { sideQuestApi } from '../../../../api/sidequest';
import { sideQuestServerStore } from './side-quest-server-store';

export namespace sideQuestDailyTracker {
	const SIDE_QUEST_TRACKER_LS_KEY = "side-quest-tracker";
	
	export const getNewFormattedTimestamp = () => createComparisonTimestamp('daily', getDateWithUTCOffset(-3));

	export const sideQuestDailyTrackerStore = writable(parseAndUpdateTimeIdTrackerLS(SIDE_QUEST_TRACKER_LS_KEY, getNewFormattedTimestamp));
	sideQuestDailyTrackerStore.subscribe(value => { localStorage.setItem(SIDE_QUEST_TRACKER_LS_KEY, JSON.stringify(value)); });

	/**
	 * Toggle a personal vote flag for a specific side quest (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		sideQuestDailyTrackerStore.update(data => ({ ...data, idsFlagged:{  ...data.idsFlagged, [id]:value ?? !data.idsFlagged[id] } }));
	}
	
	export function resetTracker() {
		sideQuestDailyTrackerStore.set({ idsFlagged: {}, timestamp: getNewFormattedTimestamp() });
	}
}

setOnTheHourInterval(()=>{
	const currentTimestamp = get(sideQuestDailyTracker.sideQuestDailyTrackerStore).timestamp;
	if(currentTimestamp != sideQuestDailyTracker.getNewFormattedTimestamp()) {
		sideQuestDailyTracker.resetTracker();
		sideQuestApi.refreshList( get(sideQuestServerStore) );
	}
});
