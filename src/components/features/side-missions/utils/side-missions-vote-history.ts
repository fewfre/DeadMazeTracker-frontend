import { get } from 'svelte/store';
import { sideMissionApi } from '../../../../api/side-missions';
import { createNewVoteHistoryWithStore, setReoccurringEventInterval } from '../../../../utils/time-id-store-helpers';
import { sideMissionsServerStore } from './side-missions-server-store';

export const sideMissionsVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"side-missions-vote",
	resetOccurrence:{ frequency:"daily", hour:3 },
});

setReoccurringEventInterval(sideMissionsVoteHistory.resetOccurrence, () => get(sideMissionsVoteHistory.votesHistoryStore).timestamp, () => {
	sideMissionsVoteHistory.reset();
	sideMissionApi.refreshList( get(sideMissionsServerStore) );
});