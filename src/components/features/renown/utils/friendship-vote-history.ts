import { createComparisonTimestamp, createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { getDateWithUTCOffset, setOnTheHourInterval } from '../../../../utils/helpers';
import { renownApi } from '../../../../api/renown';
import { get } from 'svelte/store';

export const friendshipVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"friend-vote",
	createTimestamp: () => createComparisonTimestamp('daily', getDateWithUTCOffset(-3))
});

setOnTheHourInterval(()=>{
	const currentTimestamp = get(friendshipVoteHistory.votesHistoryStore).timestamp;
	if(currentTimestamp != friendshipVoteHistory.createTimestamp()) {
		friendshipVoteHistory.reset();
		renownApi.refreshList();
	}
});