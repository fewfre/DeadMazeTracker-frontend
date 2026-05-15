import { passagesApi } from '../../../../api/passages';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';

export const passagesVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"passages-vote",
	resetOccurrence:{ frequency:"hourly" },
});

setOnTheHourInterval(()=>{
	passagesVoteHistory.reset();
	passagesApi.refreshList();
});