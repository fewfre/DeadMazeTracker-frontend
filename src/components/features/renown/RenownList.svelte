<script lang="ts">
    import type { FriendshipInfo, RenownDogVoteRequest } from "../../../api/renown";
    import { getI18n } from "../../../i18n/i18n";
    import { zoneTypeMap } from "../../../utils/zone-helpers";
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
	{@const aLocationInFriendshipHasUpvote = friend.locations.find(({id}) => $votesHistoryStore.votes[id] === 'up')?.id ?? false}
	<li class="friendship-row" class:flagged={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}>
		<div class="main-li-heading">
			<div class='npc-portrait' style='background-image:url({friend.portrait});'></div>
			<button class='flagged-npc-button' onclick={() => friendshipDailyTracker.toggleFlag(friend.id)}
				aria-label='Personal friend tracker toggle' aria-pressed={$friendshipDailyTrackerFlags.idsFlagged[friend.id]}
			></button>
			<a href='http://deadmaze.wikia.com/wiki/{friend.name}'>{friend.name}</a>
			<small class='points'>{friend.points}</small>
		</div>
		<div class='friends vote-box-list'>
		{#each friend.locations as loc(loc.id)}
			{@const { id } = loc}
			{@const zone = zoneTypeMap[loc.zoneId] ?? { name: "", icon: "" }}
			{@const goodPassage = loc.votesUp - loc.votesDown > 0}
			
			<VoteBox
				title={$getI18n(`friend_quest.${loc.name}` as any, loc.name)}
				subtitle={$getI18n(`zone.${zone.nameShort}` as any, zone.nameShort)}
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

				{#snippet addonLeft()}
					<div class="zone-icon-cont">
						<img src={zone.icon ?? ''} width="30" alt="{loc.name} zone icon" />
					</div>
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
.friendship-row {
	margin:0; padding:0;
	box-shadow: 0 0 5px #FFFFFF44;
	border-radius: var(--border-radius);
}
.friendship-row.flagged {
	opacity: 0.35;
}

.main-li-heading {
	position: relative;
	display: flex;
	align-items: center;
	gap: 0.5em;
	padding: 0 8px;
	background: var(--table-list-heading-bg, #005500);
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
	
.flagged-npc-button {
	all: unset;
	position: absolute;
	top:0; right:0;
	padding: 2px;
	line-height: 1;
	color:#AAA;
	background: #FFFFFF22;
	border: 1px solid #999;
	border-bottom-left-radius: 5px;
	border-top-right-radius: var(--border-radius);
}
.flagged-npc-button:hover { filter: brightness(120%); transform: scale(1.1); transform-origin: top right; }
.flagged .flagged-npc-button { color: white; background: var(--flagged-item-color); }
.flagged-npc-button:before { content:"⚐"; }

.vote-box-list {
	display: flex; flex-wrap: wrap;
	padding: 4px 5px;
	background: #00000066;
	border-radius: 0 0 var(--border-radius) var(--border-radius);
}

.zone-icon-cont {
	display: flex; align-items: center; justify-content: center;
	height: 100%;
	padding: 0 2px 0 4px;
}
</style>