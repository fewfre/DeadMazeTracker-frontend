import { get } from 'svelte/store';
import { renownApi } from '../../../../api/renown';
import { createNewVoteHistoryWithStore, setReoccurringEventInterval } from '../../../../utils/time-id-store-helpers';

export const antonioVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"antonio-vote",
	resetOccurrence:{ frequency:"daily", hour:4 },
});

setReoccurringEventInterval(antonioVoteHistory.resetOccurrence, () => get(antonioVoteHistory.votesHistoryStore).timestamp, () => {
	antonioVoteHistory.reset();
	renownApi.refreshList();
});