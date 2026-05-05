<script lang="ts">
    import { type QuestZoneInfo } from "../../../api/sidequest";
    import { sideQuestTrackerStore } from "../../../stores/trackers/sidequest-tracker-localstorage-store";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
	const { sideQuestVoteFlags } = sideQuestTrackerStore;

	interface Props { list:QuestZoneInfo[] | undefined; }
	const { list }:Props = $props();
</script>

{#if !list}
	<p>Loading...</p>
{:else}
	<table id="quest-table">
		<thead>
			<tr>
				<th colspan="2">Zone</th>
				<th>Side Quests</th>
			</tr>
		</thead>
		<tbody>
		{#each list as zone}
			<tr id='zone{zone.id}' class='zone-info' data-id={zone.id}>
				<td><img src={zone.icon} alt="" width='35' /></td>
				<td>
					<a href='http://deadmaze.wikia.com/wiki/{zone.name}'>{zone.name}</a>
				</td>
				<td>
					<div class='quests vote-box-list'>
					{#each zone.quests as quest}
						{@const { votesUp, votesDown } = quest}
						{@const goodPassage = votesUp - votesDown > 0}
			<!-- $passageOnOtherServer = $goodPassage ? "" : (!isset($highestQuests[$quest["id"]]) || $highestQuests[$quest["id"]]["votes_diff"] == 0 ? "" : ( $highestQuests[$quest["id"]]["server"] == 'br' ? 'br_mega' : $highestQuests[$quest["id"]]["server"] ));
			$passageOnOtherServer = !$passageOnOtherServer ? "" : "<span class='action disabled other-server'><img src='images/flags/{$passageOnOtherServer}.png' height='15' /></span>"; -->
	
						<!-- {@const mapType = !quest.npcMap && quest.npcMap.indexOf("//fewfre.com/dmmap") !== -1 ? "iframe" : "image"} -->
								<!-- $mapType = !empty($quest["npc_map"]) && strpos($quest["npc_map"], "//fewfre.com/dmmap") !== false ? "iframe" : "image";
			$map = !empty($quest["npc_map"]) ? " <a href='{$quest["npc_map"]}' class='action action-map-icon' data-featherlight='{$mapType}' data-featherlight-iframe-width='1024' data-featherlight-iframe-height='640'></a>" : ""; -->
						<VoteBox
							title={quest.npcName}
							active={goodPassage}
							flagged={sideQuestTrackerStore.hasFlag($sideQuestVoteFlags, quest.id)}
							actions={[
								{ type:"flag", onclick:()=>{ sideQuestTrackerStore.toggleFlag(quest.id) } },
								{ type:"map", link:quest.npcMap }
							]}
						>
							{#snippet voteButtons()}
								<VoteButtons upVotes={votesUp} downVotes={votesDown} onUpVoteClicked={()=>{}} onDownVoteClicked={()=>{}} />
							{/snippet}
		
							{#snippet addonLeft()}
								<div class='npc-portrait' style='background-image:url({quest.npcPortrait});'></div>
							{/snippet}
						</VoteBox>
					{/each}
					</div>
				</td>
			</tr>
		{/each}
		</tbody>
	</table>
{/if}

<style>
#quest-table { border-collapse:collapse; }
#quest-table thead th { padding:2px 0; }
#quest-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#quest-table>tbody>tr>td:nth-of-type(1) { padding-left:5px; }
#quest-table>tbody>tr>td:nth-of-type(2) { padding-right:5px; border-right:1px solid #EEE; position: relative; }
#quest-table > tbody > tr:nth-of-type(odd) { background: var(--striped-table-row-bg--secondary, #005500); }

.vote-box-list { display: flex; flex-wrap: wrap; }

.npc-portrait {
	background-size: 50px auto;
	background-position: center top;
	background-repeat: no-repeat;
	width: 40px;
	min-width: 40px;
	height: 50px;
}

/* .vote-box .vote-title { width: auto; } */

/* .quests { text-align: center; border-collapse:collapse; }
.quests .passage-info {
	min-width:155px; float: left; color:#222; border:1px solid purple; background:#EEE;
	position: relative; vertical-align: bottom; background-clip: padding-box;
}
.quests .passage-info.secondlastopened { opacity:0.9; }
.quests .passage-info.lastopened { opacity: 0.7; }
.quests .passage-info.lastopened:before { content:'∅'; position:absolute; bottom:0; left:6px; }
.quests .passage-info.lastopened:after { content:'∅'; position:absolute; bottom:0; right:6px; }
.quests .passage-info.active { background-color:#A0FFA0; }
.quests .passage-info.dailyvoted { border-color: red; box-shadow: inset 0 0 5px 1px orangered; }

.personal-daily { position: absolute; top:0; right:0; padding: 2px; line-height: 1; color:#666; }
.dailyvoted .personal-daily { color: white; background: red; border-bottom-left-radius: 5px; }
.personal-daily:before { content:"⚐"; }
.other-server { position: absolute; top:0; left:0; } */
</style>