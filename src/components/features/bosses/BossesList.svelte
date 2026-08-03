<script lang="ts">
    import type { BossInfo, BossVoteRequest } from "../../../api/bosses";
    import NotificationMessageIcon from "../../../assets/NotificationMessageIcon.svg.svelte";
    import { getI18n } from "../../../i18n/i18n";
    import { zoneTypeMap } from "../../../utils/zone-helpers";
    import ImageModal from "../../common/modal/ImageModal.svelte";
    import ZoneRowBackground from "../../common/ZoneRowBackground.svelte";
    import { bossTracker } from "./utils/boss-tracker";
    import { bossesNotificationManagement } from "./utils/bosses-notification-management";
    const { bossTrackerStore } = bossTracker;
    const { bossesNotificationsManagementStore, bossesNotificationsEnabled } = bossesNotificationManagement;
    
    interface Props { bosses:BossInfo[]; handleVoteApiCall:(req:BossVoteRequest) => Promise<void> }
	const { bosses, handleVoteApiCall:handleVoteApiCallBase }:Props = $props();
	
	function isLocationASecretPassage(locationName:string) {
		return locationName.includes('passage.');
	}
	
	function parseDate(value:string|number|null|undefined) {
		if (value === null || value === undefined || value === '') return null;
		let date: Date;
		if (typeof value === 'number') {
			date = new Date(value * 1000);
		} else {
			let parsed = value.replace(' ', 'T');
			if (!parsed.endsWith('Z') && !parsed.match(/[+-]\d{2}:?\d{2}$/)) {
				parsed += 'Z';
			}
			date = new Date(parsed);
		}
		if (Number.isNaN(date.valueOf())) return null;
		
		return date;
	}

	function formatLocalDate(date:Date|null) {
		if (date === null) return '';
		return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(date);//month: 'short', day: 'numeric', 
	}

	function getActiveReportAgeColor(date:Date|null) {
		if (date === null) return '';
		const ageMinutes = (Date.now() - date.getTime()) / (1000 * 60);
		if (ageMinutes < 5) return 'fresh';
		if (ageMinutes < 10) return 'warning';
		return 'stale';
	}
	
	let mapModalImage:string|null = $state(null);
	let isVoteLoading = $state(false);
	const handleVoteApiCall = $derived(async (req:BossVoteRequest) => {
		if (isVoteLoading) return;
		isVoteLoading = true;
		await handleVoteApiCallBase(req);
		isVoteLoading = false;
	});
</script>

<ul class="bosses-list">
{#each bosses as boss(boss.id)}
	{@const activeLocation = bossesNotificationManagement.getBossActiveLocation(boss)}
	{@const zone = zoneTypeMap[boss.zoneId]}
	<li class="boss-row" class:flagged={$bossTrackerStore.idsFlagged[boss.id]}>
		<div class="boss-left-cell" class:is-crawler={boss.name === 'boss.crawler'}>
			<img src={boss.bossImage} width='35' alt={$getI18n(boss.name as any)} />
		</div>
		<div class="boss-header-cell">
			<div class="boss-header-main">
				<div class="boss-title-container">
					<div class="boss-name">{$getI18n(boss.name as any)}</div>
					<div class="boss-zone-name">
						<img class="zone-name-icon" src={zone.icon} alt="{zone.nameShort} icon" />
						{$getI18n(`zone.${zone.name}` as any, zone.name)}
						<a href='{boss.bossMap}' class='map-link' onclick={(e)=>{ e.preventDefault(); mapModalImage = boss.bossMap; }}>
							<span class="map-link-inner"><img src='images/map-icon.png' width='16' height='16' alt='' /> Map</span>
						</a>
					</div>
				</div>
				<div class="boss-last-killed">Last reported killed: <span class="boss-last-killed-date">{formatLocalDate(parseDate(boss.lastKilled)) || boss.lastKilled}</span></div>
			</div>
			<div class="boss-header-actions">
				{#if $bossesNotificationsEnabled}
				{@const isNotificationEnabledForThisBoss = !$bossesNotificationsManagementStore.deselectedIds.includes(boss.id)}
					<button class='header-action-bttn boss-notification-button' class:notification-on={isNotificationEnabledForThisBoss}
						onclick={() => bossesNotificationManagement.toggleBossId(boss.id)}
						aria-label='Toggle boss notifications'
						data-tooltip={isNotificationEnabledForThisBoss ? "Disable browser notifications for this boss" : "Trigger browser notifications when the votes change from neutral to positive (will not fire when flag is used to mark it as done)"}
						data-tooltip-position="left"
					>
						<NotificationMessageIcon size={18} />
					</button>
				{/if}
				<button class='header-action-bttn flagged-boss-button' onclick={() => bossTracker.toggleFlag(boss.id)}
					aria-label='Personal friend tracker toggle' aria-pressed={$bossTrackerStore.idsFlagged[boss.id]}
					data-tooltip={$bossTrackerStore.idsFlagged[boss.id] ? "Unmark boss as done" : "Mark boss as done until next reset"}
				>⚐</button>
			</div>
		</div>
		{#if !activeLocation}
			<div class='boss-content-cell vote-box-list'>
			<ZoneRowBackground zoneId={boss.zoneId} />
			{#each boss.locations as location(location.id)}
				{@const { id } = location}
				{@const isSecretPassage = isLocationASecretPassage(location.name)}
				<button class:is-secret-passage={isSecretPassage} class:active={boss.activeLocationId === id}
					onclick={() => handleVoteApiCall({ bossId: boss.id, action: 'open', locationId: id })}
					disabled={isVoteLoading}
				>
					{#if isSecretPassage}
						<img class="secret-passage-icon" src="images/tabicon-sp-crate.png" alt="Secret passage" width="16" />
					{/if}
					{$getI18n(location.name as any)}
				</button>
			{/each}
			</div>
		{:else}
			<div class="boss-content-cell boss-active-location-alert">
				<ZoneRowBackground zoneId={boss.zoneId} />
				<div class="boss-active-location-text">
					<span class="boss-active-label">Reported at: <span class={[ "active-report", getActiveReportAgeColor(activeLocation?.activeReportedOn ?? null) ]}>{boss.activeReportedOn ? formatLocalDate(activeLocation?.activeReportedOn ?? null) || boss.activeReportedOn : 'Unknown'}</span></span>
					<span class="boss-active-location-name">
						{#if activeLocation && isLocationASecretPassage(activeLocation.name)}
							<img class="secret-passage-icon" src="images/tabicon-sp-crate.png" alt="Secret passage" width="16" />
						{/if}
						{activeLocation ? $getI18n(activeLocation.name as any) : 'Unknown location'}
					</span>
				</div>
				<div class="boss-active-location-actions">
					<button class="boss-action-button boss-action-killed" onclick={() => handleVoteApiCall({ bossId: boss.id, action: 'killed' })} disabled={isVoteLoading}>
						Killed
					</button>
					<button class="boss-action-button boss-action-incorrect" onclick={() => handleVoteApiCall({ bossId: boss.id, action: 'incorrect' })} disabled={isVoteLoading}>
						Incorrect
					</button>
				</div>
			</div>
		{/if}
	</li>
{/each}
</ul>
<ImageModal bind:modalImage={mapModalImage} />

<style>
.bosses-list {
	--info-width: 150px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin:0;
	padding:0;
	list-style-type:none;
	--border-radius: 10px;
}
.boss-row {
	--boss-heading-bg: var(--table-list-heading-bg, #005500);
	position: relative;
	display: grid;
	grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
	grid-template-rows: auto 1fr;
	align-items: stretch;
	min-height: 65.5px;
	margin:0; padding:0;
	border-radius: var(--border-radius);
	box-shadow: 0 0 5px #FFFFFF44;
	
	&:not(:last-child):after {
		content: "";
		position: absolute;
		display: block;
		width: calc(100% - (var(--border-radius) * 2));
		height: 1px;
		bottom: -6px;
		left: var(--border-radius);
		background: #FFFFFF55;
	}
	
	&:nth-of-type(even) {
		--boss-heading-bg: var(--table-list-heading-bg-even, darkgreen);
	}
	&.flagged {
		opacity: 0.35;
	}
}

/* Boss Header & Image */

.boss-left-cell {
	grid-row: 1 / span 2;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0 10px;
	background: var(--boss-heading-bg);
	border-radius: var(--border-radius) 0 0 var(--border-radius);
	
	/* Scaled up as special exception since so much smaller height-wise (using scale so it doesn't change container size / fight against padding; luckily size of images just have small amount of pixels so not to jarring to touch sides of container) */
	&.is-crawler img {
		transform: scale(1.5);
	}
}

.boss-header-cell {
	grid-column: 2;
	grid-row: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 0.75em;
	padding: 5px 8px 5px 10px;
	background: var(--boss-heading-bg);
	border-radius: 0 var(--border-radius) 0 0;
}

.boss-header-main {
	display: flex;
	flex-direction: column;
	gap: 0.3rem;
	min-width: 0;
}

.boss-title-container {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 0.75em;
	min-width: 0;
}

.boss-name {
	font-size: 1rem;
	font-weight: 700;
	white-space: nowrap;
}

.boss-zone-name {
	display: inline-flex;
	align-items: center;
	gap: 0.35em;
	font-size: 0.85rem;
	opacity: 0.9;
	white-space: nowrap;
}

.map-link {
	display: flex;
	align-items: center;
	width: fit-content;
	padding: 0 4px 0 2px;
	margin-left: 6px;
	font-size: 12px;
	background: rgba(0,0,0,0.1);
	border: outset 1px lightgreen;
	border-radius: 4px;
	
	.map-link-inner {
		display: flex;
		align-items: center;
	}
	
	&:hover {
		border-style: inset;
		text-decoration: none;
		background: rgba(0,0,0,0.15);
		
		.map-link-inner {
			transform: scale(0.95);
		}
	}
}

.boss-last-killed {
	font-size: 0.8rem;
	opacity: 0.85;
	padding-right: 18px;
}
.boss-last-killed-date {
	font-weight: 700;
}

.boss-header-actions {
	display: inline-flex;
	align-items: center;
	gap: 6px;
}

.header-action-bttn {
	all: unset;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	line-height: 1;
	color: #AAA;
	background: #FFFFFF22;
	border: 1px solid #999;
	border-radius: 8px;
	cursor: pointer;
	
	&:hover { filter: brightness(120%); transform: scale(1.05); }
}

.flagged .flagged-boss-button { color: white; background: var(--flagged-item-color); }

.boss-notification-button {
	color: #AAAAAA99;
	z-index: 2;
	&:hover { filter: brightness(120%); transform: scale(1.05); }
}
.boss-notification-button.notification-on {
	color: white;
	background: var(--tab-bg-color--active, green);
	filter: brightness(120%);
	&:hover { filter: brightness(140%); }
}

/* Boss Content */

.boss-content-cell {
	position: relative;
	grid-column: 2;
	grid-row: 2;
	padding: 8px 10px 10px;
	background: rgba(0, 0, 0, 0.15);
	border-radius: 0 0 var(--border-radius) 0;
	--parent-border-radius: var(--border-radius);
	& :global(.background) {
		--border-radius: 0 0 var(--parent-border-radius) 0;
	}
}

.zone-name-icon {
	width: 18px;
	height: 18px;
	border-radius: 4px;
	object-fit: contain;
}

/* Locations list */
.vote-box-list {
	flex: 1;
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	padding: 6px 8px;
	background: #00000066;
}
.vote-box-list button {
	position: relative;
	margin: 2px 4px 2px 0;
	padding: 5px 10px;
	border: none;
	border-radius: 6px;
	background: rgba(15, 180, 0, 0.6);
	color: white;
	font-size: 0.95em;
	display: inline-flex;
	align-items: center;
	gap: 0.35em;
	
	&:not(:disabled):hover {
		box-shadow: inset 0 0 3px 2px white;
		&:active {
			box-shadow: inset 0 0 7px 1px white;
		}
	}
	
	&:disabled {
		filter: brightness(70%);
	}
}
.vote-box-list button.is-secret-passage {
	background: #339739;
	color: #e9f8e3;
}

/* Active boss location alert */
.boss-active-location-alert {
	flex: 1;
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 24px;
	padding: 12px 14px;
	background: #24312f;
	box-shadow: inset 0 0 2px 1px #4e856f;
	color: white;
}
.boss-active-location-text {
	display: flex;
	flex-direction: column;
	gap: 4px;
	min-width: 0;
}
.boss-active-label {
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	font-size: 0.8rem;
	opacity: 0.85;
}
.boss-active-location-name {
	font-size: 1.35rem;
	font-weight: 700;
	line-height: 1.1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.active-report.fresh {
	color: #a1ffa1;
}

.active-report.warning {
	color: #ffe779;
}

.active-report.stale {
	color: #ffb7b7;
}
.boss-active-location-actions {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}
.boss-action-button {
	all: unset;
	line-height: 1;
	padding: 10px 16px;
	border-radius: 8px;
	font-size: 0.95rem;
	font-weight: 700;
	cursor: pointer;
	
	&:not(:disabled):hover {
		box-shadow: inset 0 0 3px 2px white;
		&:active {
			box-shadow: inset 0 0 7px 1px white;
		}
	}
	
	&:disabled {
		filter: brightness(70%);
	}
}
.boss-action-killed {
	background: #c33b3b;
	color: white;
}
.boss-action-incorrect {
	background: #d6a951;
	color: white;
}
</style>