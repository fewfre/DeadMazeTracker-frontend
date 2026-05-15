import { get } from 'svelte/store';
import { renownApi } from '../../../../api/renown';
import { createNewVoteHistoryWithStore, setReoccurringEventInterval } from '../../../../utils/time-id-store-helpers';

export const friendshipVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"friend-vote",
	resetOccurrence:{ frequency:"daily", hour:3 },
});

setReoccurringEventInterval(friendshipVoteHistory.resetOccurrence, () => get(friendshipVoteHistory.votesHistoryStore).timestamp, () => {
	friendshipVoteHistory.reset();
	renownApi.refreshList();
});