<script lang="ts">
    import { passagesApi } from "../../../api/passages";
    import { passagesTrackerStore } from "../../../stores/trackers/passages-tracker-localstorage-store";
    import ImageModal from "../../common/modal/ImageModal.svelte";
    import VoteBox from "../../common/VoteBox.svelte";
    import VoteButtons from "../../common/VoteButtons.svelte";
    import PassageZoneBossToggle from "./PassageZoneBossToggle.svelte";
	const { passageVoteFlags } = passagesTrackerStore;
	
	const { data } = passagesApi.useList();
	
	// interface Props {
	// 	passagesPromise: Promise<ListPassagesResponse>;
	// }
	// let { passagesPromise } : Props = $props();
	
	let mapModalImage:string|null = $state(null);
</script>

{#if !$data}
	<p>Loading...</p>
{:else}
	<table id="zone-table">
		<thead>
			<tr>
				<th colspan="2">Zone</th>
				<th>Passages</th>
			</tr>
		</thead>
		<tbody>
		{#each $data.zones as zone}
			<tr id='zone{zone.id}' class='zone-info' data-id='{zone.id}'>
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
					{#each zone.passages as passage}
						{@const { votesUp, votesDown } = passage}
						
						{@const goodPassage = votesUp - votesDown > 0}
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
							flagged={passagesTrackerStore.hasFlag($passageVoteFlags, passage.id)}
							actions={[
								{ type:"flag", onclick:()=>{ passagesTrackerStore.toggleFlag(passage.id) } },
								!!tooltip ? { type:'info', tooltip:tooltip } : { type:'blank' },
							]}
						>
							{#snippet voteButtons()}
								<VoteButtons upVotes={votesUp} downVotes={votesDown} onUpVoteClicked={()=>{}} onDownVoteClicked={()=>{}} />
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
{/if}

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
	background: url(../images/map-icon.png) no-repeat;
	background-size: 100%;
}
.map-link:hover {
	border-style: inset;
	text-decoration: none;
	background: rgba(0,0,0,0.15);
}
</style>