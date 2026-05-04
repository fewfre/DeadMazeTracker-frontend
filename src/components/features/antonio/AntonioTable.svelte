<script lang="ts">
	import { antonioApi } from "../../../api/antonio";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";

	const { data } = antonioApi.useList();
</script>

<div id="tracker-table" class='tracker-data-row-table vote-box-list'>
<!-- <table id="tracker-table" class='tracker-data-row-table'>
<tr> -->

{#each $data?.resources as resource}
	<VoteBox
		title={resource.name}
		active={resource.isGood}
		best={resource.isBest}
	>
		{#snippet voteButtons()}
			<VoteButtons upVotes={0} downVotes={0} onUpVoteClicked={()=>{}} onDownVoteClicked={()=>{}} />
		{/snippet}
	</VoteBox>
{/each}
<!-- </tr>
</table> -->
</div>

<style>
#tracker-table { border-collapse:collapse; }
#tracker-table>tbody>tr { padding:2px 0; border:2px solid #EEE; }
#tracker-table>tbody>tr:first-of-type { border:0; }
#tracker-table > tbody > tr:nth-of-type(2n) { background: #005500; }

#tracker-table .portrait {
	/* float: left; */
	background-size: 26px auto;
	background-position: center;
	background-repeat: no-repeat;
	width: 35px;
	min-width: 35px;
	height: 45px;
	padding-left:10px;
}

.vote-box-list { display: flex; flex-wrap: wrap; }
.vote-box-list .vote-box { flex:1; }

.vote-box .vote-title-and-votes { max-width: calc(100% - 35px); }
.vote-box-list { justify-content: space-evenly; }
</style>