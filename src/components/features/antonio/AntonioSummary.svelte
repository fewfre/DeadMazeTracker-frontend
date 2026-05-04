<script lang="ts">
    import { antonioApi } from "../../../api/antonio";

	const { data: summaryData } = antonioApi.useGetSummary();
</script>

<span id="antonio_summary">
	<span class="antonio-head antonio-cell"><img src="https://projects.fewfre.com/a801/deadmaze/tracker/images/antonio.png" height="20" alt="Antonio" /></span>
	{#if $summaryData && $summaryData.valid}
		<span class="antonio-cell">{$summaryData.num}<img src={$summaryData.icon} height="20" alt="Resource" /></span>
		<span class="antonio-cell">{$summaryData.rep}<img src='images/reputation-20px.png' height='20' alt="Reputation" /></span>
	{:else}
		<span class="antonio-cell"> <b>??</b> </span>
	{/if}
</span>

<style>
#antonio_summary {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 2px 3px;
	
	background: rgba(255,255,255,0.2);
	/* border: 1px solid darkcyan; */
	border-radius: 5px;
}
.antonio-cell { display: inline-flex; align-items: center; gap: 0.35em; line-height: 1; padding: 0 5px; border-left:1px solid darkgoldenrod; }
.antonio-cell img { vertical-align: middle; line-height: 0; }
.antonio-head { border-left: 0; }
</style>