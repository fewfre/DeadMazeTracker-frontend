import { createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { renownApi } from '../../../../api/renown';
import { get } from 'svelte/store';

export const friendshipVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"friend-vote",
	resetOccurrence:{ frequency:"daily", hour:3 },
});

setOnTheHourInterval(()=>{
	const currentTimestamp = get(friendshipVoteHistory.votesHistoryStore).timestamp;
	if(currentTimestamp != friendshipVoteHistory.createTimestamp()) {
		friendshipVoteHistory.reset();
		renownApi.refreshList();
	}
});