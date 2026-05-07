<script>
    import { writable } from "svelte/store";
    import SideQuestTable from "./SideQuestTable.svelte";
    import TimerBox from "../../common/TimerBox.svelte";
    import { onMount } from "svelte";
    import { sideQuestApi } from "../../../api/sidequest";
    import AlertBox from "../../common/AlertBox.svelte";
    import SideQuestServerSelectModal from "./SideQuestServerSelectModal.svelte";
    import RefreshBox from "../../common/RefreshBox.svelte";
    import SideQuestRestartControl from "./SideQuestRestartControl.svelte";
    import { sideQuestDailyTracker } from "./utils/side-quest-daily-tracker";
    import { sideQuestServerStore } from "./utils/side-quest-server-store";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
	
	const { data, error:listSideQuestsError, mutate } = sideQuestApi.useList({ server:$sideQuestServerStore });
	let showServerSelectModal = $state(false);
	
	const onRefreshClick = () => {
		mutate(undefined);
	};
	
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
					<button onclick={() => sideQuestDailyTracker.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
				</span>
			</strong>
			<p>
				Click the ⚐ icon to mark quests completed for the day
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
				Flags auto-reset at 3am UTC (when all quests refresh).
			</p>
		</div>
	</div>
	<p>
		<b class="instr">Page's Purpose:</b> Lets community keep track of available side quests.
		<b class="instr">How it Works:</b> If a quest is available click ✔, if not then click ✘. Table is cleared every day, and requires the community to update it. Don't make false reports!
	</p>
	<p>
		<b class="instr">Requirements:</b>
		Select your server from the list, and only report sighting on that server.
		&bull;
		Read <a href="http://deadmaze.wikia.com/wiki/Side_quest" style="text-decoration:underline;">the wiki</a> for basics and locations.
	</p>
	
	<p>
		<b class="instr">Quests Table:</b>
		A <b>green background</b> shows a quest with a positive vote total.
		<InfoIconTooltip tooltip="A positive vote total being one or more positive votes than negative votes (positive-negative >= 1)" />
	</p>
</section>
<section>
	<div style="overflow-x:hidden;">
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		<button id="serverButton" onclick={() => { showServerSelectModal = true; }}>
			<img src={`images/flags/${$sideQuestServerStore === 'br' ? 'br_mega' : $sideQuestServerStore}.png`} alt={$sideQuestServerStore} width={43} />
		</button>
		Quests Table <RefreshBox onRefreshClick={onRefreshClick} onAutoRefreshToggled={()=>{}} />
	</h2>
	
	{#if $listSideQuestsError}
		<AlertBox type="danger">{$listSideQuestsError?.message}</AlertBox>
	{/if}
	</div>
	
	{#if !$data}
		<p>Loading...</p>
	{:else}
		<SideQuestRestartControl restartData={$data?.restartTracker} />
		<SideQuestTable zones={$data?.zones} />
	{/if}
	<SideQuestServerSelectModal bind:showModal={showServerSelectModal} onServerChange={(newServer) => { sideQuestServerStore.set(newServer); }} />
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