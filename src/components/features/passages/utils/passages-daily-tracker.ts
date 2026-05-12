import { get, writable } from 'svelte/store';
import { getDateWithUTCOffset, setOnTheHourInterval } from '../../../../utils/helpers';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS } from '../../../../utils/time-id-store-helpers';
import { passagesApi } from '../../../../api/passages';

export namespace passagesDailyTracker {
	const PASSAGES_TRACKER_LS_KEY = "passages-tracker";

	export const getNewFormattedTimestamp = () => createComparisonTimestamp('daily', getDateWithUTCOffset(-5));

	export const passageDailyTrackerFlags = writable(parseAndUpdateTimeIdTrackerLS(PASSAGES_TRACKER_LS_KEY, getNewFormattedTimestamp));
	passageDailyTrackerFlags.subscribe(value => { localStorage.setItem(PASSAGES_TRACKER_LS_KEY, JSON.stringify(value)); });

	/**
	 * Toggle a personal vote flag for a specific passage (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		passageDailyTrackerFlags.update(data => ({ ...data, idsFlagged:{  ...data.idsFlagged, [id]:value ?? !data.idsFlagged[id] } }));
	}

	export function resetTracker() {
		passageDailyTrackerFlags.set({ idsFlagged: {}, timestamp: getNewFormattedTimestamp() });
	}
		
	//////////////////////////////
	// Export / Import as json
	//////////////////////////////
	type ExportImportProps = { secretPassagePersonal?:any }
	export function exportData() : ExportImportProps {
		return { secretPassagePersonal: get(passageDailyTrackerFlags) }
	}
	export function importData(pData:ExportImportProps) {
		if(pData.secretPassagePersonal) { passageDailyTrackerFlags.set(pData.secretPassagePersonal); }
		passagesApi.refreshList();
	}
}

setOnTheHourInterval(()=>{
	const currentTimestamp = get(passagesDailyTracker.passageDailyTrackerFlags).timestamp;
	if(currentTimestamp != passagesDailyTracker.getNewFormattedTimestamp()) {
		passagesDailyTracker.resetTracker();
		passagesApi.refreshList();
	}
});