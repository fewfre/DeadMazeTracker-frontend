<script lang="ts">
    import { onMount } from "svelte";
    import { passagesApi } from "../../../api/passages";
    import { bossTracker } from "./utils/boss-tracker";
    import { passagesDailyTracker } from "./utils/passages-daily-tracker";
    import RefreshBox from "../../common/RefreshBox.svelte";
    import TimerBox from "../../common/TimerBox.svelte";
    import PassagesTable from "./PassagesTable.svelte";
    import AlertBox from "../../common/AlertBox.svelte";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
	
	const { data, error:listPassagesError, mutate } = passagesApi.useList();
	
	const onRefreshClick = () => {
		mutate(undefined);
	};
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>

<section>
	<TimerBox label="Time Until Reset" format='ms' offset={0} />
	
	<div id="personalTrackerDescCont">
		<div id='personalDailyResetDesc'>
			<strong>
				Personal SP Log
				<span id="personalDailyReset" style="float:right;">
					<button onclick={() => passagesDailyTracker.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
				</span>
			</strong>
			<p>
				Click the ⚐ icon to mark passages completed for the day
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
				Flags auto-reset at 5am UTC (when all containers refresh).
			</p>
		</div>
		<div id='personalBossResetDesc'>
			<strong>
				Personal Boss Log
				<span id="personalBossReset" style="float:right;">
					<button onclick={() => bossTracker.resetBossTracker()}>Reset</button>
				</span>
			</strong>
			<p>
				Click the boss image next to zone name to mark it for the week
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
				Doesn't auto reset.
			</p>
		</div>
	</div>
	
	<p>
		<b class="instr">Page's Purpose:</b> Lets community keep track of open secret passages.
		<b class="instr">How it Works:</b> If a passage is open click ✔, if closed click ✘. Table is cleared every hour, and requires the community to update it. Don't make false reports!
	</p>
	<!--
		The purpose of this page is to let people mark what passages are currently open or closed.
		This is a simple script, and other than reseting every hour requires input by the community to be useful.
		Don't make false reports!
	-->
	<p>
		<b class="instr">Requirements:</b>
		<!-- Join the international (EN) server
		<InfoIconTooltip tooltip="Only make reports from the international server. This is to avoid conflicting reports, and also make it easier to form groups. You can change your server when logging in by clicking the country flag." />
		<button id="memoButton">how?</button>
		&bull; -->
		Read <a href="https://deadmaze.wikia.com/wiki/Secret_passage" style="text-decoration:underline;">the wiki</a> for basics and locations
		<InfoIconTooltip tooltip="Don't pester people about locations / basics without first doing a little research!" />
		&bull;
		Join <code>/chat sp</code> in-game
		<InfoIconTooltip tooltip="This chat is useful for making real time reports, forming groups, and getting help." />
		&bull;
		In-game sp chat is <b>only</b> for sp discussions; for other topics use <code>/chat boss</code>, <code>/chat dm-trade</code>, <code>/chat dm-help</code>, etc
	</p>
	<!--
	<p>
		Join <code>/chat sp</code> in-game for real time reports and help!
		If you're new to what secret passages are, you can read the <a href="https://deadmaze.wikia.com/wiki/Secret_passage" style="text-decoration:underline;">wiki article</a> which has basic information including locations.
	</p>
	
	<p style="color:white; font-weight:bold; background:rgba(255,255,255,0.1); padding:2px;">
		Please join the international (EN) server, and only make reports from that server.
		This is to avoid conflicting reports.
		You can change your server when logging in by clicking the country flag.
	</p>
	-->
	
	<p>
		<b class="instr">Locations Table:</b>
		A <b>green background</b> shows a passage with a positive vote total.
		<InfoIconTooltip tooltip="A positive vote total being one or more postive votes than negative votes (positive-negative >= 1)" />
		&bull;
		Passages with a "∅" icon had the highest vote total for their zone the prior hour and shouldn't be open again.
	</p>
</section>
<section>
	<!-- <div style="overflow-x:hidden;"> -->
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		Locations Table <RefreshBox onRefreshClick={onRefreshClick} onAutoRefreshToggled={()=>{}} />
	</h2>
	<!-- </div> -->
	
	<div id="zoneNotifications"></div>
	
	{#if $listPassagesError}
		<AlertBox type="danger">{$listPassagesError?.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<p>Loading...</p>
	{:else}
		<PassagesTable zones={$data.zones} />
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
#personalBossResetDesc {
	width:275px;
	padding:2px 3px;
	margin-top: 2px;
	margin-left: 5px;
	border:2px solid rgba(255,255,0,0.7);
}
#personalBossResetDesc strong:after {
	content:"";
	display: block;
	clear:both;
}
</style>