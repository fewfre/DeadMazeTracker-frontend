import { createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { get } from 'svelte/store';
import { sideMissionsServerStore } from './side-missions-server-store';
import { sideMissionApi } from '../../../../api/side-missions';

export const sideMissionsVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"side-missions-vote",
	resetOccurrence:{ frequency:"daily", hour:3 },
});

setOnTheHourInterval(()=>{
	const currentTimestamp = get(sideMissionsVoteHistory.votesHistoryStore).timestamp;
	if(currentTimestamp != sideMissionsVoteHistory.createTimestamp()) {
		sideMissionsVoteHistory.reset();
		sideMissionApi.refreshList( get(sideMissionsServerStore) );
	}
});