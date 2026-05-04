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
    import { sideQuestTrackerStore } from "../../../stores/trackers/sidequest-tracker-localstorage-store";
	
	const SIDE_QUEST_MEGA_SERVER_LS_KEY = "sideQuestMegaServer";
	export const server = writable((()=>{
		let lang = localStorage.getItem(SIDE_QUEST_MEGA_SERVER_LS_KEY);
		const validServers = ["en", "e2", "fr", "br", "es", "tr", "pl", "ru", "cn", "no", "hu", "nl", "ro", "id", "de", "ar", "ph", "jp", "fi", "it", "lt", "he", "cz", "hr", "bg", "lv", "et", "pt"];
		if(!validServers.includes(lang || "")) { lang = "en"; }
		return lang;
	})());
	server.subscribe(value => { localStorage.setItem(SIDE_QUEST_MEGA_SERVER_LS_KEY, value); });
	
	const { data, error:listSideQuestsError, mutate } = sideQuestApi.useList({ server:$server });
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
					<button onclick={() => sideQuestTrackerStore.resetTracker()}>Reset <span style="color:red;">⚐</span>s</button>
				</span>
			</strong>
			<p>
				Click the ⚐ icon to mark quests completed for the day
				<abbr title="This is for YOUR personal use; this info is not sent to the server or shared with others.">ⓘ</abbr>.
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
		<abbr title="A positive vote total being one or more positive votes than negative votes (positive-negative >= 1)">ⓘ</abbr>
	</p>
</section>
<section>
	<div style="overflow-x:hidden;">
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		<button id="serverButton" onclick={() => { showServerSelectModal = true; }}>
			<img src={`images/flags/${$server === 'br' ? 'br_mega' : $server}.png`} alt={$server} width={43} />
		</button>
		Quests Table <RefreshBox onRefreshClick={onRefreshClick} onAutoRefreshToggled={()=>{}} />
	</h2>
	
	{#if $listSideQuestsError}
		<AlertBox type="danger">{$listSideQuestsError?.message}</AlertBox>
	{/if}
	</div>
	
	<SideQuestRestartControl restartData={$data?.restartTracker} />
	<SideQuestTable list={$data?.zones} />
	<SideQuestServerSelectModal bind:showModal={showServerSelectModal} onServerChange={(newServer) => { server.set(newServer); }} />
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