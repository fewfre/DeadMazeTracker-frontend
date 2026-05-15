import { createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { renownApi } from '../../../../api/renown';
import { get } from 'svelte/store';

export const antonioVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"antonio-vote",
	resetOccurrence:{ frequency:"daily", hour:4 },
});

setOnTheHourInterval(()=>{
	const currentTimestamp = get(antonioVoteHistory.votesHistoryStore).timestamp;
	if(currentTimestamp != antonioVoteHistory.createTimestamp()) {
		antonioVoteHistory.reset();
		renownApi.refreshList();
	}
});