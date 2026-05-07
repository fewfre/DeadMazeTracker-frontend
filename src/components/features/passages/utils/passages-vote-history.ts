import { createComparisonTimestamp, createNewVoteHistoryWithStore } from '../../../../utils/time-id-store-helpers';
import { passagesApi } from '../../../../api/passages';
import { setOnTheHourInterval } from '../../../../utils/helpers';

export const passagesVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"passages-vote",
	createTimestamp: () => createComparisonTimestamp('hourly', new Date())
});

setOnTheHourInterval(()=>{
	passagesVoteHistory.reset();
	passagesApi.refreshList();
});