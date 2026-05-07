import { createComparisonTimestamp, createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { getDateWithUTCOffset, setOnTheHourInterval } from '../../../../utils/helpers';
import { renownApi } from '../../../../api/renown';
import { get } from 'svelte/store';
import { sideQuestApi } from '../../../../api/sidequest';
import { sideQuestServerStore } from './side-quest-server-store';

export const sideQuestVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"side-quest-vote",
	createTimestamp: () => createComparisonTimestamp('daily', getDateWithUTCOffset(-3))
});

setOnTheHourInterval(()=>{
	const currentTimestamp = get(sideQuestVoteHistory.votesHistoryStore).timestamp;
	if(currentTimestamp != sideQuestVoteHistory.createTimestamp()) {
		sideQuestVoteHistory.reset();
		sideQuestApi.refreshList( get(sideQuestServerStore) );
	}
});