<script lang="ts">
    import { type PassageVoteRequest, type PassageZoneInfo } from "../../../api/passages";
    import ImageModal from "../../common/modal/ImageModal.svelte";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
    import PassageZoneBossToggle from "./PassageZoneBossToggle.svelte";
    import { passagesDailyTracker } from "./utils/passages-daily-tracker";
    import { passagesVoteHistory } from "./utils/passages-vote-history";
	const { passageDailyTrackerFlags } = passagesDailyTracker;
	const { votesHistoryStore } = passagesVoteHistory;
	
	interface Props { zones:PassageZoneInfo[]; handleVoteApiCall:(req:PassageVoteRequest) => void }
	const { zones, handleVoteApiCall }:Props = $props();
	
	// interface Props {
	// 	passagesPromise: Promise<ListPassagesResponse>;
	// }
	// let { passagesPromise } : Props = $props();
	
	let mapModalImage:string|null = $state(null);
</script>

<ul class="passages-zone-list">
{#each zones as zone(zone.id)}
	{@const aPassageInZoneHasUpvote = zone.passages.find(({id}) => $votesHistoryStore.votes[id])?.id ?? false}
	<li class="passages-zone-row">
		<div class="zone-info">
			<img src='{zone.icon}' width='35' alt='{zone.name}' />
			<div class="zone-info-name-cont">
				<a href='http://deadmaze.wikia.com/wiki/{zone.name}'>{zone.name}</a>
				{#if zone.mapLink}
					<a href='{zone.mapLink}' class='map-link' onclick={(e)=>{ e.preventDefault(); mapModalImage = zone.mapLink; }}>
						<span class="map-link-inner"><img src='images/map-icon.png' width='21' height='21' alt='' /> Map</span>
					</a>
				{/if}
			</div>
			{#if zone.bossImage}
				<PassageZoneBossToggle bossImage={zone.bossImage} zone={zone.id} />
			{/if}
		</div>
		<div class='vote-box-list'>
		{#each zone.passages as passage(passage.id)}
			{@const { id } = passage}
			
			{@const goodPassage = passage.votesUp - passage.votesDown > 0}
			{@const tooltip = [
				passage.openTwoRoundsAgo ? "This passage was open two rounds ago." : "",
				passage.openOneRoundAgo ? "This passage was open in the previous round. As the same SP is never open two rounds in a row, this will very likely not be open this round." : "",
				goodPassage ? "This passage has a positive vote total, indicating it is most likely open." : "",
				passage.broken ? "This passage is currently broken, and does not appear to open anymore." : "",
			].filter(s=>!!s)[0]}
			<VoteBox
				title={passage.name}
				subtitle={passage.altName}
				active={goodPassage}
				grayOut={passage.openOneRoundAgo && passage.votesUp <= 0}
				lightlyGrayOut={passage.openTwoRoundsAgo && passage.votesUp <= 0}
				broken={passage.broken}
				flagged={$passageDailyTrackerFlags.idsFlagged[id]}
				actions={[
					{ type:"flag", onclick:()=>{ passagesDailyTracker.toggleFlag(id) } },
					!!tooltip ? { type:'info', tooltip:tooltip } : { type:'blank' },
				]}
			>
				{#snippet voteButtons()}
					<VoteButtons upVotes={passage.votesUp} downVotes={passage.votesDown} active={$votesHistoryStore.votes[id]}
						disableUpvote={aPassageInZoneHasUpvote !== false && aPassageInZoneHasUpvote !== id}
						onVoteClicked={(upvote, undo)=>handleVoteApiCall({ id, upvote, undo })}
					/>
				{/snippet}
			</VoteBox>
		{/each}
		</div>
	</li>
{/each}
</ul>
<ImageModal bind:modalImage={mapModalImage} />

<style>
.passages-zone-list {
	display:flex; flex-direction:column; gap: 10px; margin:0; padding:0; list-style-type:none;
	--border-radius: 10px;
}
.passages-zone-row {
	display: flex;
	align-items: stretch;
	min-height: 65.5px;
	margin:0; padding:0;
	box-shadow: 0 0 5px #FFFFFF44;
	border-radius: var(--border-radius);
}

.zone-info {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5em;
	width: 175px;
	padding: 0 8px;
	background: var(--table-list-heading-bg, #005500);
	border-radius: var(--border-radius) 0 0 var(--border-radius);
}
.zone-info-name-cont {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 5px;
}
.passages-zone-row:nth-of-type(even) .zone-info {
	background: var(--table-list-heading-bg-even, darkgreen);
}

.vote-box-list {
	flex: 1;
	display: flex;
	flex-wrap: nowrap; /* We don't want it wrapping for SPs */
	padding: 2px 8px;
	background: #00000066;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}
.passages-zone-row:nth-of-type(even) .vote-box-list {
	background: #00000022;
}
@media (max-width:1000px) {
	.vote-box-list { flex-wrap: wrap; }
}

.map-link {
	display: flex;
	align-items: center;
	width: fit-content;
	padding: 1px 4px 0 2px;
	background: rgba(0,0,0,0.1);
	border: outset 1px lightgreen;
	border-radius: 4px;
}
.map-link-inner {
	display: flex;
	align-items: center;
}
.map-link:hover {
	border-style: inset;
	text-decoration: none;
	background: rgba(0,0,0,0.15);
}
.map-link:hover .map-link-inner {
	transform: scale(0.95);
}
</style>