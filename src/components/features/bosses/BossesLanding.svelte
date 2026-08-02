<script lang="ts">
    import { onMount } from "svelte";
    import { bossesApi } from "../../../api/bosses";
    import NotificationMessageIcon from "../../../assets/NotificationMessageIcon.svg.svelte";
    import { getI18n } from "../../../i18n/i18n";
    import { bossesAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import CountdownTimer from "../../common/CountdownTimer.svelte";
    import DoubleOrangeBorderBox from "../../common/DoubleOrangeBorderBox.svelte";
    import InfoIconTooltip from "../../common/InfoIconTooltip.svelte";
    import LoadingSpinnerForTable from "../../common/LoadingSpinnerForTable.svelte";
    import NotificationManagementWidget from "../../common/NotificationManagementWidget.svelte";
    import RefreshButtonWidget from "../../common/RefreshButtonWidget.svelte";
    import TableHeader from "../../common/TableHeader.svelte";
    import BossesList from "./BossesList.svelte";
    import { getBossesListContext } from "./utils/boss-context";
    import { bossTracker } from "./utils/boss-tracker";
    import { bossesNotificationManagement } from "./utils/bosses-notification-management";
    const { bossesNotificationsManagementStore } = bossesNotificationManagement;
	
	const { data, error:listBossesError, revalidate, isFetching, mutate } = getBossesListContext();
	const onRefreshClick = () => revalidate();
	
	let alert : { type:AlertType, message: string, dismissible?:boolean } | null = $state(null);
	$effect(() => { alert = $listBossesError ? { type:'danger', message:$listBossesError.message } : null; });
	
	// We want a refresh to trigger whenever the landing page is opened to avoid stale data
	onMount(() => { onRefreshClick(); });
</script>

<section>
	<DoubleOrangeBorderBox>
		<CountdownTimer label={$getI18n("countdown.bossReset")} occurrence={bossTracker.resetOccurrence} />
	</DoubleOrangeBorderBox>
	
	<div>
		<div id='personalTrackerDescCont'>
		<div id='personalBossResetDesc'>
			<strong>
				Personal Boss Log
				<span id="personalBossReset" style:float="right">
					<button onclick={() => bossTracker.resetTracker()}>Manual Reset</button>
				</span>
			</strong>
			<p>
				Click the ⚐ icons below to mark bosses completed for the week
				<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." />.
				Boss tracking auto-resets 0:00 UTC on Thursdays.
			</p>
		</div>
		</div>
		
		<p>A detailed fan guide on learning <a href="https://deadmaze.fandom.com/wiki/Boss" target="_blank" class="underlined-link">bosses</a>, how to find them, and how to prepare for them can be found <a href="https://docs.google.com/document/d/1VFrCxCe101MpvY0ZOE__aeC1JVAie9yMYHxK7YCLS1U/edit" target="_blank" class="underlined-link">here</a>. Also thanks to this guide for the updated maps used on this page.</p>
		<p>
			<b class="instr">Marking complete:</b>
			Click the flag button in the top right corner on the entries below to mark as done<InfoIconTooltip tooltip="This is for YOUR personal use; this info is not sent to the server or shared with others." position="left" />.
		</p>
		<p>
			<b class="instr">Finding Bosses:</b>
			The best way to collaborate with others is to join the <code>/chat boss</code> in-game chat.
		</p>
		<p>
			<b class="instr">Quick Voting:</b>
			You may notice this page doesn't utilize the up/down vote system; due to the fast paced nature of bosses, a single person marking boss progress is somewhat required, as otherwise it might be to late.
			This does however open it up to abuse a bit more, but there are some weekly limits on voting so it shouldn't be too bad. Apologizes for any notification spam you may experience.
		</p>
		
		{#if $bossesAutoRefreshInterval === null}
			<AlertBox type='info'>It is highly advised to enable auto refresh below (the will also enabled a red alert pill on the tab above when there's an active boss). Then for even timelier updates you can also enable the browser notifications option next to it (<span style:display="inline-flex" style:vertical-align="middle"><NotificationMessageIcon size={20} /></span>).</AlertBox>
		{/if}
	</div>
</section>
<section>
	<TableHeader>
		Locations <RefreshButtonWidget loading={$isFetching} onRefreshClick={onRefreshClick} bind:autoRefreshInterval={$bossesAutoRefreshInterval} defaultInterval={60_000} />
		{#if $bossesAutoRefreshInterval !== null}
			<NotificationManagementWidget enabled={$bossesNotificationsManagementStore.enabled} onEnableToggled={() => { bossesNotificationsManagementStore.update(obj => ({ ...obj, enabled:!obj.enabled })); }} />
		{/if}
	</TableHeader>
	{#if alert}
		<AlertBox type={alert.type} onClose={alert?.dismissible ? ()=>{ alert=null; } : undefined}>{alert.message}</AlertBox>
	{/if}
	
	{#if !$data}
		<LoadingSpinnerForTable />
	{:else}
		<BossesList bosses={$data.bosses} handleVoteApiCall={async req => {
			alert = null;
			mutate($data, { revalidate: false });
			
			bossesApi.vote(req)
			.then(function(resp){
				if('error' in resp) {
					alert = { type:'warning', message:resp.error, dismissible:true };
				}
			})
			.catch(function(err:Error){
				alert = { type:'danger', message:err?.message || "There was an error submitting your vote", dismissible:true }
				console.error(err);
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
#personalBossResetDesc {
	width:275px;
	padding:2px 3px;
	margin-top: 2px;
	border:2px solid var(--flagged-item-color);
}
</style>