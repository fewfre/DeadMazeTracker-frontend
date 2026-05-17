import { get, writable } from 'svelte/store';
import { sideMissionApi } from '../../../../api/side-missions';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS, setReoccurringEventInterval, type ReoccurringEventProps } from '../../../../utils/time-id-store-helpers';
import { sideMissionsServerStore } from './side-missions-server-store';
import { sideMissionsVoteHistory } from './side-missions-vote-history';

export namespace sideMissionsDailyTracker {
	const SIDE_MISSIONS_TRACKER_LS_KEY = "side-missions-tracker";
			
	export const resetOccurrence:ReoccurringEventProps = sideMissionsVoteHistory.resetOccurrence;
	export const getNewFormattedTimestamp = () => createComparisonTimestamp(resetOccurrence);

	export const sideMissionsDailyTrackerStore = writable(parseAndUpdateTimeIdTrackerLS(SIDE_MISSIONS_TRACKER_LS_KEY, getNewFormattedTimestamp));
	sideMissionsDailyTrackerStore.subscribe(value => { localStorage.setItem(SIDE_MISSIONS_TRACKER_LS_KEY, JSON.stringify(value)); });

	/**
	 * Toggle a personal vote flag for a specific side quest (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		sideMissionsDailyTrackerStore.update(data => ({ ...data, idsFlagged:{  ...data.idsFlagged, [id]:value ?? !data.idsFlagged[id] } }));
	}
	
	export function resetTracker() {
		sideMissionsDailyTrackerStore.set({ idsFlagged: {}, timestamp: getNewFormattedTimestamp() });
	}
	
	//////////////////////////////
	// Export / Import as json
	//////////////////////////////
	type ExportImportProps = { sideQuestPersonal?:any }
	export function exportData() : ExportImportProps {
		return { sideQuestPersonal: get(sideMissionsDailyTrackerStore) }
	}
	export function importData(pData:ExportImportProps) {
		if(pData.sideQuestPersonal) { sideMissionsDailyTrackerStore.set(pData.sideQuestPersonal); }
		sideMissionApi.refreshList( get(sideMissionsServerStore) );
	}
}

setReoccurringEventInterval(sideMissionsDailyTracker.resetOccurrence, () => get(sideMissionsDailyTracker.sideMissionsDailyTrackerStore).timestamp, () => {
	sideMissionsDailyTracker.resetTracker()
});