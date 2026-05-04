<script lang="ts">
	import { antonioApi } from "../../../api/antonio";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";

	const { data } = antonioApi.useList();
</script>

<div class='tracker-data-row-table vote-box-list'>
<!-- <table id="tracker-table" class='tracker-data-row-table'>
<tr> -->

{#each $data?.resources as resource}
	<VoteBox
		title={resource.name}
		active={resource.isGood}
		best={resource.isBest}
	>
		{#snippet voteButtons()}
			<VoteButtons upVotes={resource.votesUp} downVotes={resource.votesDown} onUpVoteClicked={()=>{}} onDownVoteClicked={()=>{}} />
		{/snippet}
		
		{#snippet addonLeft()}
			<div class='icon-container'>
				<img src={resource.icon} alt={resource.name} />
			</div>
		{/snippet}
	</VoteBox>
{/each}
<!-- </tr>
</table> -->
</div>

<style>
/* #tracker-table { border-collapse:collapse; }
#tracker-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#tracker-table>tbody>tr:first-of-type { border:0; }
#tracker-table > tbody > tr:nth-of-type(2n) { background: #005500; } */

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