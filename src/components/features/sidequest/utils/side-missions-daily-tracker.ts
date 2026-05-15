import { get, writable } from 'svelte/store';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS, type ReoccurringEventProps } from '../../../../utils/time-id-store-helpers';
import { sideMissionsServerStore } from './side-missions-server-store';
import { sideMissionApi } from '../../../../api/side-missions';
import { sideMissionsVoteHistory } from './side-missions-vote-history';

export namespace sideMissionsDailyTracker {
	const SIDE_QUEST_TRACKER_LS_KEY = "side-missions-tracker";
			
	export const resetOccurrence:ReoccurringEventProps = sideMissionsVoteHistory.resetOccurrence;
	export const getNewFormattedTimestamp = () => createComparisonTimestamp(resetOccurrence);

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
	
	//////////////////////////////
	// Export / Import as json
	//////////////////////////////
	type ExportImportProps = { sideQuestPersonal?:any }
	export function exportData() : ExportImportProps {
		return { sideQuestPersonal: get(sideQuestDailyTrackerStore) }
	}
	export function importData(pData:ExportImportProps) {
		if(pData.sideQuestPersonal) { sideQuestDailyTrackerStore.set(pData.sideQuestPersonal); }
		sideMissionApi.refreshList( get(sideMissionsServerStore) );
	}
}

setOnTheHourInterval(()=>{
	const currentTimestamp = get(sideMissionsDailyTracker.sideQuestDailyTrackerStore).timestamp;
	if(currentTimestamp != sideMissionsDailyTracker.getNewFormattedTimestamp()) {
		sideMissionsDailyTracker.resetTracker();
		sideMissionApi.refreshList( get(sideMissionsServerStore) );
	}
});