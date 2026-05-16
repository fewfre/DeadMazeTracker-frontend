<script lang="ts">
    import { onMount } from "svelte";
    import { writable } from "svelte/store";
    import { sideMissionApi } from "../../../api/side-missions";
    import { sideMissionsAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import CountdownTimer from "../../common/CountdownTimer.svelte";
    import DoubleOrangeBorderBox from "../../common/DoubleOrangeBorderBox.svelte";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
    import LoadingSpinnerForTable from "../../common/LoadingSpinnerForTable.svelte";
    import RefreshButtonWidget from "../../common/RefreshButtonWidget.svelte";
    import TableHeader from "../../common/TableHeader.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../structure/auth/auth0-helpers";
    import SideMissionServerSelectModal from "./SideMissionServerSelectModal.svelte";
    import SideMissionsTable from "./SideMissionsTable.svelte";
    import { sideMissionsDailyTracker } from "./utils/side-missions-daily-tracker";
    import { sideMissionsServerStore } from "./utils/side-missions-server-store";
    import { sideMissionsVoteHistory } from "./utils/side-missions-vote-history";
	
	const req = writable({ server:$sideMissionsServerStore });
	$effect(() => { req.set({ server:$sideMissionsServerStore }); });
	const { data, error:listSideMissionsError, revalidate, isFetching, mutate } = sideMissionApi.useList(req, { refreshInterval: sideMissionsAutoRefreshInterval });
	const onRefreshClick = () => revalidate();
	
	let alert : { type:AlertType, message: string, dismissible?:boolean } | null = $state(null);
	$effect(() => { alert = $listSideMissionsError ? { type:'danger', message:$listSideMissionsError.message } : null; });
	
	let showServerSelectModal = $state(false);
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>
<section>
	<DoubleOrangeBorderBox>
		<CountdownTimer label="Time Until Reset" occurrence={sideMissionsVoteHistory.resetOccurrence} />
	</DoubleOrangeBorderBox>
	
	<div id="personalTrackerDescCont">
		<div id='personalDailyResetDesc'>
			<strong>
				Personal Daily Tracker
				<span id="personalDailyReset" style="float:right;">
					<button onclick={() => sideMissionsDailyTracker.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
				</span>
			</strong>
			<p>
				Click the ⚐ icon to mark missions completed for the day
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
				Flags auto-reset at 3am UTC (when all missions refresh).
			</p>
		</div>
	</div>
	<p>
		<b class="instr">Page's Purpose:</b> Lets community keep track of available <a href="https://deadmaze.fandom.com/wiki/Side_mission" class="underlined-link">side missions</a> (&lt; link has basics and locations).
	</p>
		<b class="instr">How it Works:</b> If a mission is available click ✔, if not then click ✘.
		Table is cleared every day, and requires the community to update it. Don't make false reports!
	<p>
	</p>
	<p>
		<b class="instr">Table:</b>
		Select your server from the list, and only report sighting on that server. &bull;
		A <b>green background</b> shows a side mission with a positive vote total
		<InfoIconTooltip tooltip="A positive vote total being one or more positive votes than negative votes (positive-negative >= 1)" />
	</p>
</section>
<section>
	<TableHeader>
		Side Missions <RefreshButtonWidget loading={$isFetching} onRefreshClick={onRefreshClick} bind:autoRefreshInterval={$sideMissionsAutoRefreshInterval} />
		<div style:flex-grow=1></div>
		<!-- <button id="serverButton" onclick={() => { showServerSelectModal = true; }}>
			<img src={`images/flags/${$sideMissionsServerStore === 'br' ? 'br_mega' : $sideMissionsServerStore}.png`} alt={$sideMissionsServerStore} width={30} />
		</button> -->
	</TableHeader>
	
	{#if alert}
		<AlertBox type={alert.type} onClose={alert?.dismissible ? ()=>{ alert=null; } : undefined}>{alert.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<LoadingSpinnerForTable />
	{:else}
		<!-- <SideMissionRestartControl restartData={$data?.restartTracker} /> -->
		<SideMissionsTable zones={$data?.zones} handleVoteApiCall={async req => {
			alert = null;
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			
			applyVoteToData($data.zones.flatMap(z=>z.missions).find(o => o.id === req.id)!, req.upvote, !req.undo);
			mutate($data, { revalidate: false });
			sideMissionsVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			const revert = () => {
				sideMissionsVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
				applyVoteToData($data.zones.flatMap(z=>z.missions).find(o => o.id === req.id)!, req.upvote, !!req.undo);
				mutate($data, { revalidate: false });
			};
			
			sideMissionApi.vote(req)
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
	<SideMissionServerSelectModal bind:showModal={showServerSelectModal} onServerChange={(newServer) => { sideMissionsServerStore.set(newServer); }} />
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