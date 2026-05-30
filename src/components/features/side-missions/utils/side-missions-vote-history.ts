import { get } from 'svelte/store';
import { sideMissionApi } from '../../../../api/side-missions';
import { createLocalStorageBasicJsonStore } from '../../../../stores/localstorage-stores';
import { setOnTheHourInterval } from '../../../../utils/helpers';
import { createNewVoteHistoryWithStore, setReoccurringEventInterval, type ReoccurringEventProps } from '../../../../utils/time-id-store-helpers';
import { sideMissionsServerStore } from './side-missions-server-store';

export const sideMissionsVoteHistory = createNewVoteHistoryWithStore({
	lsKey:"side-missions-vote",
	resetOccurrence:{ frequency:"daily", hour:3 },
});

setReoccurringEventInterval(sideMissionsVoteHistory.resetOccurrence, () => get(sideMissionsVoteHistory.votesHistoryStore).timestamp, () => {
	sideMissionsVoteHistory.reset();
	sideMissionApi.refreshList( get(sideMissionsServerStore) );
});

///////////////////////////////////
// Server restart logic
///////////////////////////////////

export namespace serverRestartVoteHistory {
	export const resetOccurrence:ReoccurringEventProps = { frequency:"hourly" };
	export const voteHistoryStore = createLocalStorageBasicJsonStore<{ vote:"up"|"down"|undefined, resetCount:number }>("side-missions-server-restart-votes", ()=>({ vote: undefined, resetCount:0 }));
	
	export function resetVote() {
		voteHistoryStore.update(data => ( { ...data, vote:undefined } ));
	}
	export function setVote(value:'up'|'down'|'none') {
		voteHistoryStore.update(data => ( { ...data, vote:value === 'none' ? undefined : value } ));
	}
	export function toggleVote(type:'up'|'down') {
		voteHistoryStore.update(data => ( { ...data, vote:data.vote !== type ? type : undefined } ));
	}
	
	export function resetIfResetCountNewer(newResetCount:number) {
		if(!newResetCount) return; // Don't reset if newResetCount is 0 or undefined, since that means we don't have a valid reset count / server hasn't sent us a reset count yet
		const oldResetCount = get(voteHistoryStore).resetCount;
		if(newResetCount > oldResetCount) {
			voteHistoryStore.set({ vote:undefined, resetCount:newResetCount });
			sideMissionsVoteHistory.reset();
		}
	}
}
// Server resets the votes for a reset once an hour (wether or not a manual vote also cleared it too)
setOnTheHourInterval(() => {
	serverRestartVoteHistory.resetVote();
});