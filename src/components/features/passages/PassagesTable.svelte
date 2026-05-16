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

<table id="zone-table">
	<thead>
		<tr>
			<th colspan="2">Zone</th>
			<th>Passages</th>
		</tr>
	</thead>
	<tbody>
	{#each zones as zone(zone.id)}
		{@const aPassageInZoneHasUpvote = zone.passages.find(({id}) => $votesHistoryStore.votes[id])?.id ?? false}
		<tr class='zone-info'>
			<td><img src='{zone.icon}' width='35' alt='{zone.name}' /></td>
			<td>
				{#if zone.bossImage}
					<PassageZoneBossToggle bossImage={zone.bossImage} zone={zone.id} />
				{/if}
				<a href='http://deadmaze.wikia.com/wiki/{zone.name}'>{zone.name}</a>
				<br />
				<div style='z-index: 1; position: relative; display:inline-block;'>
					{#if zone.mapLink}
						<a href='{zone.mapLink}' class='map-link' onclick={(e)=>{ e.preventDefault(); mapModalImage = zone.mapLink; }}>Map</a>
					{/if}
				</div>
			</td>
			<td>
				<div class='passages vote-box-list'>
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
						grayOut={passage.openOneRoundAgo}
						lightlyGrayOut={passage.openTwoRoundsAgo}
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
								onUpVoteClicked={()=>handleVoteApiCall({ id, upvote:true, undo:$votesHistoryStore.votes[id] === 'up' })}
								onDownVoteClicked={()=>handleVoteApiCall({ id, upvote:false, undo:$votesHistoryStore.votes[id] === 'down' })}
							/>
						{/snippet}
					</VoteBox>
				{/each}
				</div>
			</td>
		</tr>
	{/each}
	</tbody>
</table>
<ImageModal bind:modalImage={mapModalImage} />

<style>
#zone-table { border-collapse:collapse; }
#zone-table thead th { padding:2px 0; }
#zone-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#zone-table>tbody>tr>td:nth-of-type(1) { padding-left:5px; }
#zone-table>tbody>tr>td:nth-of-type(2) { padding-right:5px; border-right:1px solid #EEE; position: relative; }

/* We don't want it wrapping for SPs */
.vote-box-list { display: flex; flex-wrap: nowrap; }

@media (max-width:600px) {
	.vote-box-list { flex-wrap: wrap; }
}

.map-link {
	display: inline-flex;
	align-items: center;
	background: rgba(0,0,0,0.1);
	padding: 1px 2px 0 2px;
	vertical-align: middle;
	border: outset 1px lightgreen;
	border-radius: 4px;
}
.map-link:before {
	content: "";
	display:inline-block;
	width:21px; height:21px;
	background: url(/images/map-icon.png) no-repeat;
	background-size: 100%;
}
.map-link:hover {
	border-style: inset;
	text-decoration: none;
	background: rgba(0,0,0,0.15);
}
</style>