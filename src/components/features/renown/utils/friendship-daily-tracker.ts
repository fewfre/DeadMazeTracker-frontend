import { get, writable } from 'svelte/store';
import { getDateWithUTCOffset, setOnTheHourInterval } from '../../../../utils/helpers';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS } from '../../../../utils/time-id-store-helpers';
import { renownApi } from '../../../../api/renown';

export namespace friendshipDailyTracker {
	const FRIEND_TRACKER_LS_KEY = "friend-tracker";

	export const getNewFormattedTimestamp = () => createComparisonTimestamp('daily', getDateWithUTCOffset(-3));

	export const friendshipDailyTrackerFlags = writable(parseAndUpdateTimeIdTrackerLS(FRIEND_TRACKER_LS_KEY, getNewFormattedTimestamp));
	friendshipDailyTrackerFlags.subscribe(value => { localStorage.setItem(FRIEND_TRACKER_LS_KEY, JSON.stringify(value)); });

	/**
	 * Toggle a personal vote flag for a specific friend (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		friendshipDailyTrackerFlags.update(data => ({ ...data, idsFlagged:{  ...data.idsFlagged, [id]:value ?? !data.idsFlagged[id] } }));
	}
	
	export function resetTracker() {
		friendshipDailyTrackerFlags.set({ idsFlagged: {}, timestamp: getNewFormattedTimestamp() });
	}
}

setOnTheHourInterval(()=>{
	const currentTimestamp = get(friendshipDailyTracker.friendshipDailyTrackerFlags).timestamp;
	if(currentTimestamp != friendshipDailyTracker.getNewFormattedTimestamp()) {
		friendshipDailyTracker.resetTracker();
		renownApi.refreshList();
	}
});