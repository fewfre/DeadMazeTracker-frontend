<script lang="ts">
    import { type SideMissionVoteRequest, type SideMissionZoneInfo } from "../../../api/side-missions";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
    import { sideMissionsDailyTracker } from "./utils/side-missions-daily-tracker";
    import { sideMissionsVoteHistory } from "./utils/side-missions-vote-history";
	const { sideMissionsDailyTrackerStore } = sideMissionsDailyTracker;
	const { votesHistoryStore } = sideMissionsVoteHistory;

	interface Props { zones:SideMissionZoneInfo[]; handleVoteApiCall:(req:SideMissionVoteRequest) => void }
	const { zones, handleVoteApiCall }:Props = $props();
</script>

<ul class="side-missions-zone-list">
{#each zones as zone(zone.id)}
	<li class="side-missions-zone-row">
		<div class="zone-info">
			<img src='{zone.icon}' width='35' alt='{zone.name}' />
			<a href='http://deadmaze.wikia.com/wiki/{zone.name}'>{zone.name}</a>
		</div>
		<div class='vote-box-list'>
		{#each zone.missions as mission(mission.id)}
			{@const { id } = mission}
			{@const goodPassage = mission.votesUp - mission.votesDown > 0}
<!-- $passageOnOtherServer = $goodPassage ? "" : (!isset($highestQuests[$mission["id"]]) || $highestQuests[$mission["id"]]["votes_diff"] == 0 ? "" : ( $highestQuests[$mission["id"]]["server"] == 'br' ? 'br_mega' : $highestQuests[$mission["id"]]["server"] ));
$passageOnOtherServer = !$passageOnOtherServer ? "" : "<span class='action disabled other-server'><img src='images/flags/{$passageOnOtherServer}.png' height='15' /></span>"; -->

			<!-- {@const mapType = !mission.npcMap && mission.npcMap.indexOf("//fewfre.com/dmmap") !== -1 ? "iframe" : "image"} -->
					<!-- $mapType = !empty($mission["npc_map"]) && strpos($mission["npc_map"], "//fewfre.com/dmmap") !== false ? "iframe" : "image";
$map = !empty($mission["npc_map"]) ? " <a href='{$mission["npc_map"]}' class='action action-map-icon' data-featherlight='{$mapType}' data-featherlight-iframe-width='1024' data-featherlight-iframe-height='640'></a>" : ""; -->
			<VoteBox
				title={mission.npcName}
				active={goodPassage}
				flagged={$sideMissionsDailyTrackerStore.idsFlagged[id]}
				actions={[
					{ type:"flag", onclick:()=>{ sideMissionsDailyTracker.toggleFlag(id) } },
					{ type:"map", link:mission.npcMap }
				]}
			>
				{#snippet voteButtons()}
					<VoteButtons upVotes={mission.votesUp} downVotes={mission.votesDown} active={$votesHistoryStore.votes[id]}
						onVoteClicked={(upvote, undo)=>handleVoteApiCall({ id, upvote, undo })}
					/>
				{/snippet}

				{#snippet addonLeft()}
					<div class='npc-portrait' style='background-image:url({mission.npcPortrait});'></div>
				{/snippet}
			</VoteBox>
		{/each}
		</div>
	</li>
{/each}
</ul>

<style>
.side-missions-zone-list {
	display:flex; flex-direction:column; gap: 10px; margin:0; padding:0; list-style-type:none;
	--border-radius: 10px;
}
.side-missions-zone-row {
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
.side-missions-zone-row:nth-of-type(even) .zone-info {
	background: #00000022;
	background: var(--table-list-heading-bg-even, darkgreen);
}

.vote-box-list {
	flex: 1;
	display: flex;
	flex-wrap: wrap;
	padding: 2px 8px;
	background: #00000066;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}
.side-missions-zone-row:nth-of-type(even) .vote-box-list {
	background: #00000022;
}
.vote-box-list :global(.vote-box) {
	width: 162px;
	min-width: 162px;
}

.npc-portrait {
	margin-top: 2px;
	background-size: 65px auto;
	background-position: center top;
	background-repeat: no-repeat;
	width: 50px;
	min-width: 50px;
	height: 100%;
	min-height: 54px;
	transition: background-size 0.2s;
}
:global(.vote-box:hover) .npc-portrait {
	background-size: 75px auto;
}
</style>