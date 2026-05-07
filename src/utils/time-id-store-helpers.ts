import { writable } from "svelte/store";

//////////////////////////////////
// Tracker
//////////////////////////////////

type IdsFlagWithTimestamp = { idsFlagged:Record<number, boolean|undefined>, timestamp:string }
const createNewBlankTrackerObj = (timestamp:string):IdsFlagWithTimestamp => ({ idsFlagged: {}, timestamp });

export function parseAndUpdateTimeIdTrackerLS(lsKey:string, getFormattedTimestamp:()=>string) : IdsFlagWithTimestamp {
	const currentTimestamp = getFormattedTimestamp();
	try {
		const stored = localStorage.getItem(lsKey);

		// If no stored data or day has changed, reset
		if (!stored) return createNewBlankTrackerObj(currentTimestamp);

		const parsed = JSON.parse(stored);
		const storedTimestamp = parsed.timestamp;

		// If day has changed, reset
		if (storedTimestamp !== currentTimestamp) {
			return createNewBlankTrackerObj(currentTimestamp);
		}

		return {
			idsFlagged: typeof parsed.idsFlagged === 'object' ? parsed.idsFlagged : {},
			timestamp: currentTimestamp
		};
	} catch (e) {
		console.error('Failed to parse local tracking from localStorage', e);
		return createNewBlankTrackerObj(currentTimestamp);
	}
}

export function createComparisonTimestamp(format:'daily'|'hourly', date:Date) {
	switch(format) {
		default:
		case "daily": return `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
		case "hourly": return date.getUTCDate()+"-"+date.getUTCMonth()+"-"+date.getUTCFullYear()+":"+date.getUTCHours();
	}
}

//////////////////////////////////
// Votes
//////////////////////////////////
type VoteHistoryVoteType = "up"|"down";
type VoteHistoryWithTimestamp = { votes:Record<number, VoteHistoryVoteType|undefined>, timestamp:string }
const createNewBlankVoteHistoryObj = (timestamp:string):VoteHistoryWithTimestamp => ({ votes: {}, timestamp });

export function parseAndUpdateVoteHistoryLS(lsKey:string, getFormattedTimestamp:()=>string) : VoteHistoryWithTimestamp {
	const currentTimestamp = getFormattedTimestamp();
	try {
		const stored = localStorage.getItem(lsKey);

		// If no stored data or day has changed, reset
		if (!stored) return createNewBlankVoteHistoryObj(currentTimestamp);

		const parsed = JSON.parse(stored);
		// If timestamp value no longer matches current timestamp, reset history
		if (parsed.timestamp !== currentTimestamp) {
			return createNewBlankVoteHistoryObj(currentTimestamp);
		}

		return {
			votes: typeof parsed.votes === 'object' ? parsed.votes : {},
			timestamp: parsed.timestamp
		};
	} catch (e) {
		console.error('Failed to parse local tracking from localStorage', e);
		return createNewBlankVoteHistoryObj(currentTimestamp);
	}
}

interface NewVoteHistoryProps { lsKey:string, createTimestamp:() => string }
export function createNewVoteHistoryWithStore({ lsKey, createTimestamp }:NewVoteHistoryProps) {
	const votesHistoryStore = writable(parseAndUpdateVoteHistoryLS(lsKey, createTimestamp));
	votesHistoryStore.subscribe(value => { localStorage.setItem(lsKey, JSON.stringify(value)); });
	return {
		votesHistoryStore,
		createTimestamp,
		reset() { votesHistoryStore.set(createNewBlankVoteHistoryObj(createTimestamp())); },
		setVote(id: number, value:VoteHistoryVoteType|"none") {
			votesHistoryStore.update(data => ( { ...data, votes:{ ...data.votes, [id]:value === 'none' ? undefined : value } }));
		},
		toggleVote(id: number, type:VoteHistoryVoteType) {
			votesHistoryStore.update(data => ( { ...data, votes:{ ...data.votes, [id]:(data.votes[id] !== type) ? type : undefined } }));
		}
	}
}