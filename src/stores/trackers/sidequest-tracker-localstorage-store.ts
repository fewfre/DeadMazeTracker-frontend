import { writable } from 'svelte/store';
import { getDateWithUTCOffset } from '../../utils/helpers';

export namespace sideQuestTrackerStore {
	const SIDE_QUEST_TRACKER_LS_KEY = "side-quest-tracker";

	/**
	 * Get daily tracker timestamp in format: DD-MM-YYYY
	 */
	function getDailyTrackerTimestamp(): string {
		const tDate = getDateWithUTCOffset(-5);
		return `${tDate.getDate()}-${tDate.getMonth()}-${tDate.getFullYear()}`;
	}

	interface PersonalDailyData {
		votes: boolean[];
		timestamp: string|number;
	}

	function getLocalStorageObject(): PersonalDailyData {
		try {
			const currentTimestamp = getDailyTrackerTimestamp();
			const stored = localStorage.getItem(SIDE_QUEST_TRACKER_LS_KEY);

			// If no stored data or day has changed, reset
			if (!stored) {
				return {
					votes: [],
					timestamp: currentTimestamp
				};
			}

			const parsed = JSON.parse(stored);
			const storedTimestamp = parsed.timestamp;

			// If day has changed, reset
			if (storedTimestamp !== currentTimestamp) {
				return {
					votes: [],
					timestamp: currentTimestamp
				};
			}

			return {
				votes: Array.isArray(parsed.votes) ? parsed.votes : [],
				timestamp: currentTimestamp
			};
		} catch (e) {
			console.error('Failed to parse personal daily votes from localStorage', e);
			return {
				votes: [],
				timestamp: getDailyTrackerTimestamp()
			};
		}
	}

	export const sideQuestVoteFlags = writable(getLocalStorageObject());

	sideQuestVoteFlags.subscribe(value => {
		localStorage.setItem(SIDE_QUEST_TRACKER_LS_KEY, JSON.stringify(value));
	});

	/**
	 * Toggle a personal vote flag for a specific side quest (by index)
	 */
	export function toggleFlag(id: number, value?: boolean) {
		sideQuestVoteFlags.update(data => {
			const newVotes = [...data.votes];
			newVotes[id] = value !== undefined ? value : !newVotes[id];
			return { ...data, votes: newVotes };
		});
	}

	/**
	 * Reset all personal daily votes
	 */
	export function resetTracker() {
		sideQuestVoteFlags.set({
			votes: [],
			timestamp: getDailyTrackerTimestamp()
		});
	}

	/**
	 * Check if a flag was marked for a specific side quest
	 */
	export function hasFlag(store:PersonalDailyData, id: number): boolean {
		return store.votes[id] ?? false;
	}
}
