import { derived, get } from "svelte/store";
import type { BossInfo } from "../../../../api/bosses";
import { getI18n } from "../../../../i18n/i18n";
import { createLocalStorageBasicJsonStore } from "../../../../stores/localstorage-stores";
import { bossesAutoRefreshInterval } from "../../../../stores/number-localstorage-stores";
import { parseDate, secondsSince } from "../../../../utils/date-helpers";
import { sendNotification } from "../../../../utils/notification-utils";
import { bossTracker } from "./boss-tracker";

export namespace bossesNotificationManagement {
	let previousActiveLocations: Record<number, number | null> = {};
	let initialized = false;

	export const bossesNotificationsManagementStore = createLocalStorageBasicJsonStore("bosses-notif-mgmt", () => ({ enabled:false, deselectedIds:[] as number[] }));
	export const bossesNotificationsEnabled = derived(
		[bossesNotificationsManagementStore, bossesAutoRefreshInterval],
		([bnmStore, arInterval]) => bnmStore.enabled && arInterval !== null
	);

	export function toggleBossId(id: number) {
		bossesNotificationsManagementStore.update(obj => ({
			...obj,
			deselectedIds: obj.deselectedIds.includes(id)
				? obj.deselectedIds.filter(i => i !== id)
				: [...obj.deselectedIds, id]
		}));
	}

	export function getListOfIdsToTrackForNotifications(bosses: BossInfo[] | undefined) {
		const flaggedIds = get(bossTracker.bossTrackerStore).idsFlagged;
		const deselectedIds = new Set(get(bossesNotificationsManagementStore).deselectedIds);
		if (!bosses) return [];
		return bosses
			.map(boss => boss.id)
			.filter(id => !deselectedIds.has(id) && !flaggedIds[id]);
	}

	export function detectChangesToBossActiveLocations(bosses: BossInfo[] | undefined) {
		if (!bosses) return;

		const trackedIds = new Set(getListOfIdsToTrackForNotifications(bosses));
		const trackedBosses = bosses.filter(boss => trackedIds.has(boss.id));
		const nowActive = trackedBosses.filter(boss => {
			const previous = previousActiveLocations[boss.id] ?? null;
			return boss.activeLocationId !== null && boss.activeLocationId !== previous;
		});

		if (!initialized) {
			initialized = true;
			if (nowActive.length > 0) {
				sendNotificationForBosses(nowActive);
			}
			previousActiveLocations = bosses.reduce<Record<number, number | null>>((acc, boss) => {
				acc[boss.id] = boss.activeLocationId;
				return acc;
			}, {});
			return;
		}

		if (nowActive.length === 0) {
			previousActiveLocations = bosses.reduce<Record<number, number | null>>((acc, boss) => {
				acc[boss.id] = boss.activeLocationId;
				return acc;
			}, {});
			return;
		}

		sendNotificationForBosses(nowActive);
		previousActiveLocations = bosses.reduce<Record<number, number | null>>((acc, boss) => {
			acc[boss.id] = boss.activeLocationId;
			return acc;
		}, {});
	}
	
	export const SECONDS_ACTIVE_LOCATION_IS_CONSIDERED_ACTIVE = 20 * 60; // 20 minutes in seconds
	export function getBossActiveLocation(boss: BossInfo) {
		if (boss.activeLocationId === null || boss.activeReportedOn === null) return null;
		const parsedActiveReportedOn = parseDate(boss.activeReportedOn);
		if (!parsedActiveReportedOn) return null;
		if (secondsSince(parsedActiveReportedOn) > SECONDS_ACTIVE_LOCATION_IS_CONSIDERED_ACTIVE) return null; // If the active report is older than 20 minutes, don't show it as active
		const activeLocation = boss.locations.find(l => l.id === boss.activeLocationId);
		return activeLocation ? { ...activeLocation, activeReportedOn: parsedActiveReportedOn } : null;
	}

	export function sendNotificationForBosses(bosses: BossInfo[]) {
		if (!get(bossesNotificationsEnabled)) return;
		const i18n = get(getI18n);
		const bossNames = bosses.map(boss => {
			const bossName = i18n(boss.name as any, boss.name);
			const activeLocation = getBossActiveLocation(boss);
			const locationName = activeLocation ? i18n(activeLocation.name as any, activeLocation.name) : null;
			return locationName ? `${bossName} at ${locationName}` : bossName;
		});
		sendNotification({
			title: "Boss Update",
			body: bossNames.length > 1 ? `Bosses active: ${bossNames.join(", ")}` : `Boss active: ${bossNames[0]}`
		});
	}
}