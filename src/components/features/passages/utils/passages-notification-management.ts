import { derived, get } from "svelte/store";
import type { PassageInfo } from "../../../../api/passages";
import { createLocalStorageBasicJsonStore } from "../../../../stores/localstorage-stores";
import { passagesAutoRefreshInterval } from "../../../../stores/number-localstorage-stores";
import { sendNotification } from "../../../../utils/notification-utils";
import { passagesDailyTracker } from "./passages-daily-tracker";

export namespace passagesNotificationManagement {
	let previousVotes: Record<string, number> = {};
	let initialized = false;
	
	export const passagesNotificationsManagementStore = createLocalStorageBasicJsonStore("passages-notif-mgmt", () => ({ enabled:false, selectedIds:[] as number[] }));
	// Since you can only enable notifications while auto refresh is enabled (since it depends on it), this is a derived store
	export const passagesNotificationsEnabled = derived([passagesNotificationsManagementStore, passagesAutoRefreshInterval], ([pnmStore, arInterval]) => pnmStore.enabled && arInterval !== null);
	
	export function togglePassageId(id: number) {
		passagesNotificationsManagementStore.update(obj => ({ ...obj, selectedIds: obj.selectedIds.includes(id) ? obj.selectedIds.filter(i=>i!==id) : [...obj.selectedIds, id] }))
	}
	
	export function getListOfIdsToTrackForNotifications() {
		const flaggedIds = get(passagesDailyTracker.passageDailyTrackerFlags).idsFlagged;
		return get(passagesNotificationsManagementStore).selectedIds.filter(id => !flaggedIds[id]);
	}
	
	export function detectChangesToPassageVotes(passages: PassageInfo[] | undefined) {
		if (!passages) return;

		const currentVoteTotals = passages.reduce<Record<string, number>>((acc, passage) => {
			acc[passage.id.toString()] = passage.votesUp - passage.votesDown;
			return acc;
		}, {});

		// This avoids a bunch of messages when first turning it on / visiting the page
		if (!initialized) {
			previousVotes = currentVoteTotals;
			initialized = true;
			return;
		}

		const trackedIds = new Set(getListOfIdsToTrackForNotifications());

		const newlyPositive = passages
			.filter(passage => {
				if (!trackedIds.has(passage.id)) {
					return false;
				}

				const previousTotal = previousVotes[passage.id.toString()] ?? 0;
				const currentTotal = passage.votesUp - passage.votesDown;
				return previousTotal <= 0 && currentTotal > 0;
			})
			.map(passage => `${passage.name}`);

		previousVotes = currentVoteTotals;

		if (newlyPositive.length === 0) return;

		sendNotificationForPassages(newlyPositive);
	}
	
	export function sendNotificationForPassages(passageNames: string|string[]) {
		if(!get(passagesNotificationsEnabled)) return;
		passageNames = Array.isArray(passageNames) ? passageNames : [passageNames];
		sendNotification({
			title: "Passage Update",
			body: passageNames.length > 1 ? `Passages likely open: ${passageNames.join(", ")}` : `Passage likely open: ${passageNames}`
		});
	}
}