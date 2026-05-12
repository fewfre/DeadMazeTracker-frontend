<script>
    import { onMount } from "svelte";
    import { renownApi } from "../../../api/renown";
    import RenownTable from "./RenownTable.svelte";
    import RefreshBox from "../../common/RefreshBox.svelte";
    import TimerBox from "../../common/TimerBox.svelte";
    import { friendshipDailyTracker } from "./utils/friendship-daily-tracker";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
    import AlertBox from "../../common/AlertBox.svelte";
	
	const { data, error:listFriendshipsError, mutate, isFetching } = renownApi.useList();
	const onRefreshClick = () => { mutate(undefined); };
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>

<section>
	<TimerBox label="Time Until Reset" format='hms' offset={-3} />
	
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
	<!-- <p>
		<b class="instr">Requirements:</b>
		Read <a href="http://deadmaze.wikia.com/wiki/Side_quest" style="text-decoration:underline;">the wiki</a> for basics and locations.
	</p> -->
	
	<p>
		<b class="instr">Renown Table:</b>
		A <b>green background</b> shows a location with a positive vote total.
		<InfoIconTooltip tooltip="A positive vote total being one or more postive votes than negative votes (positive-negative >= 1)" />
	</p>
</section>
<section>
	<div style="overflow-x:hidden;">
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		Renown Table <RefreshBox loading={$isFetching} onRefreshClick={onRefreshClick} onAutoRefreshToggled={()=>{}} />
	</h2>
	</div>
	
	{#if $listFriendshipsError}
		<AlertBox type="danger">{$listFriendshipsError?.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<p>Loading...</p>
	{:else}
		<RenownTable friends={$data.friends} />
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