<script lang="ts">
    import { onMount } from "svelte";
    import { renownApi } from "../../../api/renown";
    import { renownAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import CountdownTimer from "../../common/CountdownTimer.svelte";
    import DoubleOrangeBorderBox from "../../common/DoubleOrangeBorderBox.svelte";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
    import LoadingSpinnerForTable from "../../common/LoadingSpinnerForTable.svelte";
    import RefreshButtonWidget from "../../common/RefreshButtonWidget.svelte";
    import TableHeader from "../../common/TableHeader.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../structure/auth/auth0-helpers";
    import RenownTable from "./RenownTable.svelte";
    import { friendshipDailyTracker } from "./utils/friendship-daily-tracker";
    import { friendshipVoteHistory } from "./utils/friendship-vote-history";
	
	const { data, error:listFriendshipsError, revalidate, isFetching, mutate } = renownApi.useList({}, { refreshInterval: renownAutoRefreshInterval });
	const onRefreshClick = () => revalidate();
	
	let alert : { type:AlertType, message: string, dismissible?:boolean } | null = $state(null);
	$effect(() => { alert = $listFriendshipsError ? { type:'danger', message:$listFriendshipsError.message } : null; });
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>

<section>
	<DoubleOrangeBorderBox>
		<CountdownTimer label="Time Until Reset" occurrence={friendshipVoteHistory.resetOccurrence} />
	</DoubleOrangeBorderBox>
	
	<div id="personalTrackerDescCont">
	<div id='personalDailyResetDesc'>
		<strong>
			Personal Daily Tracker
			<span id="personalDailyReset" style="float:right;">
				<button onclick={() => friendshipDailyTracker.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
			</span>
		</strong>
		<p>
			Click the ⚐ icon to mark friendship tasks completed for the day
			<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
			Flags auto-reset at 3am UTC (when all quests refresh).
		</p>
	</div>
	</div>
	<p>
		<b class="instr">Page's Purpose:</b> Lets community keep track of available friendship locations.
		<b class="instr">How it Works:</b> If a location is available click ✔, if not then click ✘. Table is cleared every day, and requires the community to update it. Don't make false reports!
	</p>
	<p>
		<b class="instr">Information:</b>
		Read <a href="https://deadmaze.fandom.com/wiki/Renown" style:text-decoration='underline'>the wiki</a> for basics and locations.
	</p>
	<p>
		<b class="instr">Table:</b>
		A <b>green background</b> shows a location with a positive vote total.
		<InfoIconTooltip tooltip="A positive vote total being one or more postive votes than negative votes (positive-negative >= 1)" />
	</p>
</section>
<section>
	<TableHeader>
		Friendships <RefreshButtonWidget loading={$isFetching} onRefreshClick={onRefreshClick} bind:autoRefreshInterval={$renownAutoRefreshInterval} />
	</TableHeader>
	
	{#if alert}
		<AlertBox type={alert.type} onClose={alert?.dismissible ? ()=>{ alert=null; } : undefined}>{alert.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<LoadingSpinnerForTable />
	{:else}
		<RenownTable friendships={$data.friendships} handleVoteApiCall={async req => {
			alert = null;
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			
			applyVoteToData($data.friendships.flatMap(z=>z.locations).find(o => o.id === req.id)!, req.upvote, !req.undo);
			mutate($data, { revalidate: false });
			friendshipVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			const revert = () => {
				friendshipVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
				applyVoteToData($data.friendships.flatMap(z=>z.locations).find(o => o.id === req.id)!, req.upvote, !!req.undo);
				mutate($data, { revalidate: false });
			};
			
			renownApi.vote(req)
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

<style>
#personalTrackerDescCont {
	float:right;
}
#personalTrackerDescCont button { line-height: 1; padding:1px 5px; font-size: 12px; }

#personalDailyResetDesc {
	width:275px;
	padding:2px 3px;
	margin-left: 5px;
	border:2px solid rgba(255,0,0,0.7);
}
#personalDailyResetDesc strong:after {
	content:"";
	display: block;
	clear:both;
}
</style>