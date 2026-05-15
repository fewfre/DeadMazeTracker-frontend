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

<table id="missions-table">
	<thead>
		<tr>
			<th colspan="2">Zone</th>
			<th>Side Missions</th>
		</tr>
	</thead>
	<tbody>
	{#each zones as zone(zone.id)}
		<tr class='zone-info'>
			<td><img src={zone.icon} alt="" width='35' /></td>
			<td>
				<a href='http://deadmaze.wikia.com/wiki/{zone.name}'>{zone.name}</a>
			</td>
			<td>
				<div class='missions vote-box-list'>
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
								onUpVoteClicked={()=>handleVoteApiCall({ id, upvote:true, undo:$votesHistoryStore.votes[id] === 'up' })}
								onDownVoteClicked={()=>handleVoteApiCall({ id, upvote:false, undo:$votesHistoryStore.votes[id] === 'down' })}
							/>
						{/snippet}
	
						{#snippet addonLeft()}
							<div class='npc-portrait' style='background-image:url({mission.npcPortrait});'></div>
						{/snippet}
					</VoteBox>
				{/each}
				</div>
			</td>
		</tr>
	{/each}
	</tbody>
</table>

<style>
#missions-table { border-collapse:collapse; }
#missions-table thead th { padding:2px 0; }
#missions-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#missions-table>tbody>tr>td:nth-of-type(1) { padding-left:5px; }
#missions-table>tbody>tr>td:nth-of-type(2) { padding-right:5px; border-right:1px solid #EEE; position: relative; }
#missions-table > tbody > tr:nth-of-type(odd) { background: var(--striped-table-row-bg--secondary, #005500); }

.vote-box-list { display: flex; flex-wrap: wrap; }

.npc-portrait {
	background-size: 50px auto;
	background-position: center top;
	background-repeat: no-repeat;
	width: 40px;
	min-width: 40px;
	height: 50px;
}
</style>