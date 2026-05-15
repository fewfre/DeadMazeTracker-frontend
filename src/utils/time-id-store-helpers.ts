import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { writable } from "svelte/store";

dayjs.extend(utc);

//////////////////////////////////
// Time Comparison Helpers
//////////////////////////////////

export type ReoccurringEventProps = 
	| { frequency:"weekly", weekday:0|1|2|3|4|5|6, hour:number }
	| { frequency:"daily", hour:number }
	| { frequency:"hourly" };

const monthIds = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

function nextOccurrenceOfHour(now:dayjs.Dayjs, hour:number) {
	let next = now.hour(hour).minute(0).second(0).millisecond(0);
	if (next.isBefore(now)) next = next.add(1, 'day');
	return next;
}

export function getUtcDateOfNextEvent(occurrence:ReoccurringEventProps): dayjs.Dayjs {
	const now = dayjs.utc();
	switch(occurrence.frequency) {
		default:
		case "hourly": return now.add(1, "hour").minute(0).second(0).millisecond(0);
		case "daily": return nextOccurrenceOfHour(now, occurrence.hour);
		case "weekly": {
			let date = nextOccurrenceOfHour(now, occurrence.hour).day(occurrence.weekday);
			if (date.isBefore(now)) date = date.add(1, 'week');
			return date;
		}
	}
}
export function getUtcDateOfCurrentEvent(occurrence:ReoccurringEventProps): dayjs.Dayjs {
	const date = getUtcDateOfNextEvent(occurrence);
	switch(occurrence.frequency) {
		default:
		case "hourly": return date.subtract(1, "hour");
		case "daily": return date.subtract(1, "day");
		case "weekly": return date.subtract(1, "week");
	}
}

export function createComparisonTimestamp(occurrence:ReoccurringEventProps) {
	let date = getUtcDateOfCurrentEvent(occurrence);
	switch(occurrence.frequency) {
		default:
		case "hourly": return [date.year(), monthIds[date.month()], date.date(), date.hour()].join("¦");
		case "daily":
		case "weekly": // Weekly can use the same timestamp as daily since `getUtcDateOfCurrentEvent` makes it consistent - honestly might be able to have all 3 use same one now, but meh
			return [date.year(), monthIds[date.month()], date.date()].join("¦");
	}
}

// // https://stackoverflow.com/a/37399351/1411473
// export function getDateWithUTCOffset(inputTzOffset: number, options?:{ weekdayOffset?:number }): Date {
// 	const now = new Date(); // get the current time

// 	const currentTzOffset = -now.getTimezoneOffset() / 60 // in hours, i.e. -4 in NY
// 	const deltaTzOffset = inputTzOffset - currentTzOffset; // timezone diff

// 	var nowTimestamp = now.getTime(); // get the number of milliseconds since unix epoch
// 	var deltaTzOffsetMilli = deltaTzOffset * 1000 * 60 * 60; // convert hours to milliseconds (tzOffsetMilli*1000*60*60)
// 	var outputDate = new Date(nowTimestamp + deltaTzOffsetMilli) // your new Date object with the timezone offset applied.

// 	if(options?.weekdayOffset !== undefined) {
// 		const currentWeekday = outputDate.getDay();
// 		const daysToAdd = (options.weekday - currentWeekday + 7) % 7;
// 		outputDate.setDate(outputDate.getDate() + daysToAdd);
// 	}
	
// 	return outputDate;
// }

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

interface NewVoteHistoryProps { lsKey:string, resetOccurrence:ReoccurringEventProps }
export function createNewVoteHistoryWithStore({ lsKey, resetOccurrence }:NewVoteHistoryProps) {
	const createTimestamp = () => createComparisonTimestamp(resetOccurrence);
	const votesHistoryStore = writable(parseAndUpdateVoteHistoryLS(lsKey, createTimestamp));
	votesHistoryStore.subscribe(value => { localStorage.setItem(lsKey, JSON.stringify(value)); });
	return {
		votesHistoryStore,
		resetOccurrence,
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