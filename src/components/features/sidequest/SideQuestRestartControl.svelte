<script lang="ts">
    import { sideQuestApi, type SideQuestRestartTrackerInfo } from "../../../api/sidequest";
	
	const { restartData } : { restartData:SideQuestRestartTrackerInfo|undefined } = $props();

	const restartVotesUp = restartData?.votesUp ?? 0;
	const restartVotesDown = restartData?.votesDown ?? 0;
	const restartResetCount = restartData?.resetCount ?? 0;

	const danger = $derived(restartVotesUp > restartVotesDown/2 && restartVotesUp >= 9);
</script>

{#if restartData}
	<details class:danger>
		<summary>Did server restart recently? (✔ <span class='restart-vote-up-num2'>{restartVotesUp}</span>, ✘ <span class='restart-vote-down-num2'>{restartVotesDown}</span>)</summary>
		<div style='border:1px solid #DDD; padding:0 4px 1px;'>
			<p>Whenever the game updates and server restarts, the locations of NPCs change, and this list needs to be reset early.</p>
			<p>If 15+ people vote positive about a reset and 80% of the votes are positive this list will reset. Note: these votes reset every hour (##:00).</p>
			<p>Please don't vote negative about a reset unless combatting trolls, as otherwise if a reset does happen it'll take longer to fix it.</p>
			
			<div class='vote-buttons-group'>"
				<button class='restart-vote-up vote-up'>Yes there was a restart ✔ <span class='num'>{restartVotesUp}</span></button>
				<button class='restart-vote-down vote-down'>No, don't clear the list! ✘ <span class='num'>{restartVotesDown}</span></button>
			</div>
		</div>
	</details>
{/if}

<style>
.danger {
	background: blueviolet;
}
</style>