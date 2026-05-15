import { get, writable } from 'svelte/store';
import { createComparisonTimestamp, parseAndUpdateTimeIdTrackerLS, setReoccurringEventInterval, type ReoccurringEventProps } from '../../../../utils/time-id-store-helpers';

export namespace bossTracker {
	const BOSS_TRACKER_LS_KEY = "dm-tracker-personal-bosses";

	export const resetOccurrence: ReoccurringEventProps = { frequency: "weekly", weekday: 4, hour: 0 };
	export const getNewFormattedTimestamp = () => createComparisonTimestamp(resetOccurrence);

	export const bossTrackerStore = writable(parseAndUpdateTimeIdTrackerLS(BOSS_TRACKER_LS_KEY, getNewFormattedTimestamp));
	bossTrackerStore.subscribe(value => { localStorage.setItem(BOSS_TRACKER_LS_KEY, JSON.stringify(value)); });

	/**
	 * Toggle a personal vote flag for a specific passage (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		bossTrackerStore.update(data => ({ ...data, idsFlagged: { ...data.idsFlagged, [id]: value ?? !data.idsFlagged[id] } }));
	}

	export function resetTracker() {
		bossTrackerStore.set({ idsFlagged: {}, timestamp: getNewFormattedTimestamp() });
	}

	//////////////////////////////
	// Export / Import as json
	//////////////////////////////
	type ExportImportProps = { bossPersonal?: any }
	export function exportData(): ExportImportProps {
		return { bossPersonal: get(bossTrackerStore) }
	}
	export function importData(pData: ExportImportProps) {
		if (pData.bossPersonal) { bossTrackerStore.set(pData.bossPersonal); }
	}
}

setReoccurringEventInterval(bossTracker.resetOccurrence, () => get(bossTracker.bossTrackerStore).timestamp, () => {
	bossTracker.resetTracker();
});