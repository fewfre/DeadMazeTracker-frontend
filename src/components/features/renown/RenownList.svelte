<script lang="ts">
    import type { FriendshipInfo, RenownDogVoteRequest } from "../../../api/renown";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
    import { friendshipDailyTracker } from "./utils/friendship-daily-tracker";
    import { friendshipVoteHistory } from "./utils/friendship-vote-history";
	const { friendshipDailyTrackerFlags } = friendshipDailyTracker;
	const { votesHistoryStore } = friendshipVoteHistory;
	
	interface Props { friendships:FriendshipInfo[]; handleVoteApiCall:(req:RenownDogVoteRequest) => void }
	const { friendships, handleVoteApiCall }:Props = $props();
</script>

<ul class="renown-friendships-list">
{#each friendships as friend(friend.id)}
	{@const aLocationInFriendshipHasUpvote = friend.locations.find(({id}) => $votesHistoryStore.votes[id])?.id ?? false}
	<li>
		<div class="main-li-heading">
			<div class='npc-portrait' style='background-image:url({friend.portrait});'></div>
			<button class='personal-daily' class:active={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}
				onclick={() => friendshipDailyTracker.toggleFlag(friend.id)}
				aria-label='Personal friend tracker toggle' aria-pressed={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}
			></button>
			<a href='http://deadmaze.wikia.com/wiki/{friend.name}'>{friend.name}</a>
			<small class='points'>{friend.points}</small>
		</div>
		<div class='friends vote-box-list'>
		{#each friend.locations as loc(loc.id)}
			{@const { id } = loc}
			{@const goodPassage = loc.votesUp - loc.votesDown > 0}
			
			<VoteBox
				title={loc.name}
				active={goodPassage}
				best={loc.isBest}
				actions={[
					{ type:"map", link:loc.map },
					{ type:"youtube", videoId:loc.video.split("?v=")[1] }
				]}
			>
				{#snippet voteButtons()}
					<VoteButtons upVotes={loc.votesUp} downVotes={loc.votesDown} active={$votesHistoryStore.votes[id]}
						disableUpvote={aLocationInFriendshipHasUpvote !== false && aLocationInFriendshipHasUpvote !== id}
						onVoteClicked={(upvote, undo)=>handleVoteApiCall({ id, upvote, undo })}
					/>
				{/snippet}
			</VoteBox>
		{/each}
		</div>
	</li>
{/each}
</ul>

<style>
.renown-friendships-list {
	display:flex; flex-direction:column; gap: 10px; margin:0; padding:0; list-style-type:none;
	--border-radius: 10px;
}
.renown-friendships-list > li {
	margin:0; padding:0;
	box-shadow: 0 0 5px #FFFFFF44;
	border-radius: var(--border-radius);
}

.main-li-heading {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0 8px;
	background: var(--striped-table-row-bg--secondary, #005500);
	border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.npc-portrait {
	background-size: 50px auto;
	background-position: right top;
	background-repeat: no-repeat;
	width: 50px;
	height: 40px;
}
.points {
	white-space: nowrap;
	font-style: italic;
	color: #bbb;
	margin-left: 8px;
}
	
.personal-daily {
	all: unset;
	position: absolute;
	top:0; right:0;
	padding: 2px;
	line-height: 1;
	color:#999;
	background: #FFFFFF11;
	border: 1px solid #ff535344;
	border-bottom-left-radius: 5px;
	border-top-right-radius: var(--border-radius);
}
.personal-daily.active { color: white; background: red; }
.personal-daily:before { content:"⚐"; }

.vote-box-list {
	display: flex; flex-wrap: wrap;
	padding: 4px 5px;
	background: #00000066;
	border-radius: 0 0 var(--border-radius) var(--border-radius);
}
.vote-box-list :global(.vote-box) {
	width: 155px;
	min-width: 155px;
}
</style>