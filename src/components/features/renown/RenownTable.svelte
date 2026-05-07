<script lang="ts">
    import type { FriendshipInfo } from "../../../api/renown";
    import { friendshipDailyTracker } from "./utils/friendship-daily-tracker";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
    import { friendshipVoteHistory } from "./utils/friendship-vote-history";
	const { friendshipDailyTrackerFlags } = friendshipDailyTracker;
	const { votesHistoryStore } = friendshipVoteHistory;
	
	interface Props { friends:FriendshipInfo[]; }
	const { friends }:Props = $props();
</script>

<table id="friend-table">
	<thead>
		<tr>
			<th colspan="2">Friend</th>
			<th>Location</th>
		</tr>
	</thead>
	<tbody>
	{#each friends as friend}
		{@const aLocationInFriendshipHasUpvote = friend.locations.find(({id}) => $votesHistoryStore.votes[id])?.id ?? false}
		<tr class='friend-info'>
			<td><div class='npc-portrait' style='background-image:url({friend.portrait});'></div></td>
			<td>
				<button class='personal-daily' class:active={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}
					onclick={() => friendshipDailyTracker.toggleFlag(friend.id)}
					aria-label='Personal friend tracker toggle' aria-pressed={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}
				></button>
				<a href='http://deadmaze.wikia.com/wiki/{friend.name}'>{friend.name}</a>
				<br /><small style='white-space: nowrap;'>{friend.points}</small>
			</td>
			<td>
				<div class='friends vote-box-list'>
				{#each friend.locations as quest}
					{@const { id, votesUp, votesDown } = quest}
					{@const goodPassage = votesUp - votesDown > 0}
					
					<VoteBox
						title={quest.name}
						active={goodPassage}
						best={quest.isBest}
						actions={[
							{ type:"map", link:quest.map },
							{ type:"youtube", videoId:quest.video.split("?v=")[1] }
						]}
					>
						{#snippet voteButtons()}
							<VoteButtons upVotes={votesUp} downVotes={votesDown} active={$votesHistoryStore.votes[id]}
								disableUpvote={aLocationInFriendshipHasUpvote !== false && aLocationInFriendshipHasUpvote !== id}
								onUpVoteClicked={()=>{
									friendshipVoteHistory.toggleVote(id, "up");
								}}
								onDownVoteClicked={()=>{
									friendshipVoteHistory.toggleVote(id, "down");
								}}
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

<style>
#friend-table { border-collapse:collapse; }
#friend-table thead th { padding:2px 0; }
#friend-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#friend-table>tbody>tr>td:nth-of-type(1) { padding-left:5px; padding-right:5px; }
#friend-table>tbody>tr>td:nth-of-type(2) { padding-right:5px; border-right:1px solid #EEE; position: relative; }
#friend-table > tbody > tr:nth-of-type(odd) { background: var(--striped-table-row-bg--secondary, #005500); }

#friend-table .npc-portrait {
	float: left;
	background-size: 50px auto;
	background-position: right top;
	background-repeat: no-repeat;
	width: 40px;
	height: 50px;
}
	
.personal-daily {
	all: unset;
	position: absolute;
	top:0; right:0;
	padding: 2px;
	line-height: 1;
	color:#999;
	background: #FFFFFF11;
	border: 1px solid #FFFFFF44;
	border-bottom-left-radius: 5px;
}
.personal-daily.active { color: white; background: red; }
.personal-daily:before { content:"⚐"; }

.vote-box-list { display: flex; flex-wrap: wrap; }
</style>