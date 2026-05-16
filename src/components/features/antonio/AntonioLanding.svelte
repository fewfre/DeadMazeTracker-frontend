<script lang="ts">
    import { onMount } from "svelte";
    import { antonioApi } from "../../../api/antonio";
    import { antonioAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import CountdownTimer from "../../common/CountdownTimer.svelte";
    import DoubleOrangeBorderBox from "../../common/DoubleOrangeBorderBox.svelte";
    import LoadingSpinnerForTable from "../../common/LoadingSpinnerForTable.svelte";
    import RefreshButtonWidget from "../../common/RefreshButtonWidget.svelte";
    import TableHeader from "../../common/TableHeader.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../structure/auth/auth0-helpers";
    import AntonioTable from "./AntonioTable.svelte";
    import { antonioVoteHistory } from "./utils/antonio-vote-history";

	const { data, error:listAntonioError, revalidate, isFetching, mutate } = antonioApi.useList({}, { refreshInterval: antonioAutoRefreshInterval });
	const onRefreshClick = () => revalidate();
	
	let alert : { type:AlertType, message: string, dismissible?:boolean } | null = $state(null);
	$effect(() => { alert = $listAntonioError ? { type:'danger', message:$listAntonioError.message } : null; });
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>
<section>
	<DoubleOrangeBorderBox>
		<CountdownTimer label="Time Until Reset" occurrence={antonioVoteHistory.resetOccurrence} />
	</DoubleOrangeBorderBox>
	
	<p>
		<a href="https://deadmaze.wikia.com/wiki/Antonio" style:text-decoration='underline'>Antonio</a> is a shop NPC who buys resources.
		He can be found in the main building behind the counter in Lakeview Lane.
	</p>
</section>
<section>
	<TableHeader>
		Resources List <RefreshButtonWidget loading={$isFetching} onRefreshClick={onRefreshClick} bind:autoRefreshInterval={$antonioAutoRefreshInterval} />
	</TableHeader>
	
	{#if alert}
		<AlertBox type={alert.type} onClose={alert?.dismissible ? ()=>{ alert=null; } : undefined}>{alert.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<LoadingSpinnerForTable />
	{:else}
		<AntonioTable resources={$data.resources} handleVoteApiCall={async req => {
			alert = null;
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			
			applyVoteToData($data.resources.find(o => o.id === req.id)!, req.upvote, !req.undo);
			mutate($data, { revalidate: false });
			antonioVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			const revert = () => {
				antonioVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
				applyVoteToData($data.resources.find(o => o.id === req.id)!, req.upvote, !!req.undo);
				mutate($data, { revalidate: false });
			};
			
			antonioApi.vote(req)
			.then(function(resp){
				if('error' in resp) {
					alert = { type:'warning', message:resp.error, dismissible:true };
					revert();
				}
			})
			.catch(function(err:Error){
				alert = { type:'danger', message:err?.message || "There was an error submitting your vote", dismissible:true }
				console.error(err);
				revert();
			})
			.finally(()=>onRefreshClick());
		}} />
	{/if}
</section>