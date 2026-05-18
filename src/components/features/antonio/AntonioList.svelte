<script lang="ts">
	import { type AntonioResourceInfo, type AntonioResourceVoteRequest } from "../../../api/antonio";
	import { getI18n } from "../../../i18n/i18n";
	import VoteBox from "../../common/VoteBox.svelte";
	import VoteButtons from "../../common/VoteButtons.svelte";
	import { antonioVoteHistory } from "./utils/antonio-vote-history";
	const { votesHistoryStore } = antonioVoteHistory;
	
	interface Props { resources:AntonioResourceInfo[]; handleVoteApiCall:(req:AntonioResourceVoteRequest) => void; }
	const { resources, handleVoteApiCall }:Props = $props();
	
	const aResourceHasUpvote = $derived( resources.find(({id}) => $votesHistoryStore.votes[id] === 'up')?.id ?? false );
	
	function getResourceName(name:string) { return $getI18n(`resource.${name}` as any, name); }
</script>

<div class='vote-box-list'>
{#each resources as resource(resource.id)}
	{@const { id } = resource}
	<VoteBox
		title={getResourceName(resource.name)}
		active={resource.isGood}
		best={resource.isBest}
	>
		{#snippet voteButtons()}
			<VoteButtons upVotes={resource.votesUp} downVotes={resource.votesDown} active={$votesHistoryStore.votes[id]}
				disableUpvote={aResourceHasUpvote !== false && aResourceHasUpvote !== id}
				onVoteClicked={(upvote, undo)=>handleVoteApiCall({ id, upvote, undo })}
			/>
		{/snippet}
		
		{#snippet addonLeft()}
			<div class='icon-container'>
				<img src={resource.icon} alt={resource.name} />
			</div>
		{/snippet}
	</VoteBox>
{/each}
</div>

<style>
.vote-box-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-evenly;
}

.icon-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding-left: 10px;
	width: 30px;
	height: 100%;
	
	img { max-width: 30px; }
}
</style>