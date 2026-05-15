import { get, writable } from 'svelte/store';
import { renownApi } from '../../../../api/renown';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS, setReoccurringEventInterval, type ReoccurringEventProps } from '../../../../utils/time-id-store-helpers';
import { friendshipVoteHistory } from './friendship-vote-history';

export namespace friendshipDailyTracker {
	const FRIEND_TRACKER_LS_KEY = "friend-tracker";

	export const resetOccurrence:ReoccurringEventProps = friendshipVoteHistory.resetOccurrence;
	export const getNewFormattedTimestamp = () => createComparisonTimestamp(resetOccurrence);

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

setReoccurringEventInterval(friendshipDailyTracker.resetOccurrence, () => get(friendshipDailyTracker.friendshipDailyTrackerFlags).timestamp, () => {
	friendshipDailyTracker.resetTracker();
	renownApi.refreshList();
});