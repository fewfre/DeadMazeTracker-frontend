<script lang="ts">
    import { onMount } from "svelte";
    import { passagesApi } from "../../../api/passages";
    import { passagesAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
    import RefreshBox from "../../common/RefreshBox.svelte";
    import TimerBox from "../../common/TimerBox.svelte";
    import { cancelEarlyIfNotAuthenticated } from "../../structure/auth/auth0-helpers";
    import PassagesTable from "./PassagesTable.svelte";
    import { bossTracker } from "./utils/boss-tracker";
    import { passagesDailyTracker } from "./utils/passages-daily-tracker";
    import { passagesVoteHistory } from "./utils/passages-vote-history";
	
	const { data, error:listPassagesError, revalidate, isFetching, mutate } = passagesApi.useList({}, { refreshInterval: passagesAutoRefreshInterval });
	const onRefreshClick = () => revalidate();
	
	let alert : { type:AlertType, message: string, dismissible?:boolean } | null = $state(null);
	$effect(() => { alert = $listPassagesError ? { type:'danger', message:$listPassagesError.message } : null; });
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>

<section>
	<TimerBox label="Time Until Reset" occurrence={passagesVoteHistory.resetOccurrence} timer2={{ label: "Boss Reset", occurrence:bossTracker.resetOccurrence }} />
	
	<div class="two-column-layout">
		<div>
			<div id="personalTrackerDescCont">
				<div id='personalDailyResetDesc'>
					<strong>
						Personal SP Log
						<span id="personalDailyReset" style="float:right;">
							<button onclick={() => passagesDailyTracker.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
						</span>
					</strong>
					<p>
						Click the ⚐ icons below to mark passages completed for the day
						<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
						Flags auto-reset at 5am UTC (when all containers refresh).
					</p>
				</div>
			</div>
			
			<p>
				<b class="instr">Page's Purpose:</b>
				This is a community tracker for which passages are currently open.
				If a passage is open click ✔, if closed click ✘.
				Table is automatically cleared every hour, and requires the community to update it. Don't make false reports!
			</p>
			<!--
				The purpose of this page is to let people mark what passages are currently open or closed.
				This is a simple script, and other than resetting every hour requires input by the community to be useful.
				Don't make false reports!
			-->
			<p>
				<b class="instr">Information:</b>
				<!-- Join the international (EN) server
				<InfoIconTooltip tooltip="Only make reports from the international server. This is to avoid conflicting reports, and also make it easier to form groups. You can change your server when logging in by clicking the country flag." />
				<button id="memoButton">how?</button>
				&bull; -->
				Read <a href="https://deadmaze.wikia.com/wiki/Secret_passage" style:text-decoration='underline'>the wiki</a> for basics and locations
				<InfoIconTooltip tooltip="Don't pester people about locations / basics without first doing a little research!" />
				&bull;
				Join <code>/chat sp</code> in-game
				<InfoIconTooltip tooltip="This chat is useful for making real time reports, forming groups, and getting help." />
				&bull;
				In-game sp chat is <b>only</b> for sp discussions; for other topics use <code>/chat dm-trade</code>, <code>/chat dm-help</code>, etc
			</p>
			<!--
			<p>
				Join <code>/chat sp</code> in-game for real time reports and help!
				If you're new to what secret passages are, you can read the <a href="https://deadmaze.wikia.com/wiki/Secret_passage" style:text-decoration='underline'>wiki article</a> which has basic information including locations.
			</p>
			
			<p style="color:white; font-weight:bold; background:rgba(255,255,255,0.1); padding:2px;">
				Please join the international (EN) server, and only make reports from that server.
				This is to avoid conflicting reports.
				You can change your server when logging in by clicking the country flag.
			</p>
			-->
			
			<p>
				<b class="instr">Table:</b>
				A <b>green background</b> shows a passage with a positive vote total
				<InfoIconTooltip tooltip="A positive vote total being one or more positive votes than negative votes (positive-negative >= 1)" />
				&bull;
				Passages with "∅" icons were voted open in their zone the prior hour and should most likely not be open again.
			</p>
		</div>
		<div>
			<div id='personalBossResetDesc'>
				<strong>
					Personal Boss Log
					<span id="personalBossReset" style="float:right;">
						<button onclick={() => bossTracker.resetTracker()}>Manual Reset</button>
					</span>
				</strong>
				<p>
					
					Boss tracking auto-resets 0:00 UTC on Thursdays.
				</p>
			</div>
			
			<p>
				<b class="instr">Marking complete:</b>
				Click the <a href="https://deadmaze.fandom.com/wiki/Boss" target="_blank">boss</a> image next to zone names on the table below to track them
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
			</p>
			<p>
				<b class="instr">Finding Bosses:</b>
				The best way to be notified of boss sightings is to join the <code>/chat boss</code> in-game chat. You can also use the "Boss" tab on this site's chat window.
			</p>
		</div>
	</div>
</section>
<section>
	<!-- <div style="overflow-x:hidden;"> -->
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		Locations <RefreshBox loading={$isFetching} onRefreshClick={onRefreshClick} bind:autoRefreshInterval={$passagesAutoRefreshInterval} />
	</h2>
	<!-- </div> -->
	
	{#if alert}
		<AlertBox type={alert.type} onClose={alert?.dismissible ? ()=>{ alert=null; } : undefined}>{alert.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<p>Loading...</p>
	{:else}
		<PassagesTable zones={$data.zones} handleVoteApiCall={async req => {
			alert = null;
			if(await cancelEarlyIfNotAuthenticated()) return;
			
			const applyVoteToData = (entry:{ votesUp:number; votesDown:number; }, upvote:boolean, add:boolean) => { entry[upvote ? 'votesUp' : 'votesDown'] += add ? 1 : -1; }
			
			applyVoteToData($data.zones.flatMap(z=>z.passages).find(o => o.id === req.id)!, req.upvote, !req.undo);
			mutate($data, { revalidate: false });
			passagesVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
			const revert = () => {
				passagesVoteHistory.toggleVote(req.id, req.upvote ? 'up' : 'down');
				applyVoteToData($data.zones.flatMap(z=>z.passages).find(o => o.id === req.id)!, req.upvote, !!req.undo);
				mutate($data, { revalidate: false });
			};
			
			passagesApi.vote(req)
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
.two-column-layout {
	display: grid;
	grid-template-columns: 1fr minmax(350px, 0.5fr);
	gap: 6px;
}
.two-column-layout > *:nth-child(2) {
	border-left: 1px solid #cccccc66;
	padding-left: 6px;
}
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
#personalBossResetDesc {
	padding:2px 3px;
	margin-top: 2px;
	border:2px solid rgba(255,255,0,0.7);
}
#personalBossResetDesc strong:after {
	content:"";
	display: block;
	clear:both;
}
</style>