<script lang="ts">
    import RefreshIcon from "../../assets/RefreshIcon.svelte";
    import { getI18n } from "../../i18n/i18n";

	interface Props { onRefreshClick:()=>void; autoRefreshInterval:number|null; loading?:boolean; }
	let { onRefreshClick, autoRefreshInterval=$bindable(), loading } : Props = $props();
	let checked = $derived(!!autoRefreshInterval);
	let autoRefreshIntervalOpen = $state(false);
	
	const toggleAutoRefresh = () => autoRefreshInterval = !checked ? 600_000 : null;
</script>

<span class="refresh-cont">
	<button id="refresh" class="button-group-part" onclick={onRefreshClick} disabled={loading}>
		<span class="refresh-icon"><RefreshIcon size={20} /></span>
		{#if loading}
			<img src='images/loading-dots.gif' width='43' alt='Loading...' />
		{:else}
			{$getI18n("refresh.refresh", "Refresh")}
		{/if}
	</button>
</span>
<span class="refresh-cont">
	{#if !checked}
		<button class="button-group-part" class:checked onclick={toggleAutoRefresh} role="switch" aria-checked={checked}
		data-tooltip="Toggle auto-refresh on - this value will be remembered across page loads">
			<!-- ⏲ -->
			 <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="-2 0 30 30"><path fill-rule="evenodd" d="M14 14.18V9a1 1 0 1 0-2 0v5.18A3 3 0 0 0 13 20a3 3 0 0 0 1-5.82M13 28a11 11 0 1 1 0-22 11 11 0 0 1 0 22m.99-23.95L14 4V2h4a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2h4v2l.01.05a13 13 0 1 0 1.98 0"/></svg>
				<span class="small">{$getI18n("refresh.auto-refresh-enable", "Enable Auto Refresh")}</span>
		</button>
	{:else}
		<button class="stop-button button-group-part" class:checked onclick={toggleAutoRefresh} role="switch" aria-checked={checked}
		data-tooltip="Click to toggle auto refresh off">
			<!-- Source: https://www.svgrepo.com/svg/151802/stop -->
			<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16" height="16" viewBox="0 0 473.931 473.931"><circle cx="236.966" cy="236.966" r="236.966" fill="currentColor"/><path fill="#fff" d="M338.771 324.568c0 7.846-6.361 14.207-14.215 14.207H149.345c-7.85 0-14.211-6.361-14.211-14.207V149.349c0-7.854 6.361-14.215 14.211-14.215H324.56c7.854 0 14.215 6.361 14.215 14.215v175.219z"/></svg>
		</button>
		<span class="button-group-part">
			<span class="small">{$getI18n("refresh.auto-refresh", "Auto Refresh")}</span>
		</span>
	{/if}
	
	{#if checked}
		{#if !autoRefreshIntervalOpen}
			<button class="button-group-part open-interval-toggle" class:checked onclick={()=>(autoRefreshIntervalOpen = !autoRefreshIntervalOpen)} role="switch" aria-checked={autoRefreshIntervalOpen}
			data-tooltip="How often content is auto refreshed - click to change current auto-refresh interval">
				<span class="small">{$getI18n("refresh.rate", "Rate")}:&thinsp;{(autoRefreshInterval ?? 0) < 60_000 ? `${(autoRefreshInterval ?? 0) / 1000}s` : `${(autoRefreshInterval ?? 0) / 60_000}m`}</span>
			</button>
		{:else}
			<button class="close-input button-group-part" onclick={()=>(autoRefreshIntervalOpen = !autoRefreshIntervalOpen)}>
				<!-- ← -->
				<svg width="12px" height="12px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6 3L6 6H12L12 10H6L6 13L5 13L0 8L5 3L6 3Z" fill="currentColor"/>
					<path d="M16 2L16 14H14L14 2L16 2Z" fill="currentColor"/>
				</svg>
			</button>
			<span class="button-group-part" style:gap='4px'>
				<input type="number" required step="0.2" min="0.2" style:width='40px'
				value={(autoRefreshInterval ?? 0)/60_000}
				onchange={(e)=>{
					const val = (e.target as HTMLInputElement).valueAsNumber;
					if(!val || !isFinite(val) || isNaN(val)) return autoRefreshInterval = null;
					autoRefreshInterval = Math.max(12_000, val*60_000);
				}} />
				<span class="small">Minutes</span>
			</span>
		{/if}
	{/if}
</span>

<style>
.refresh-cont {
	display: inline-flex;
	align-items: center;
	line-height: 1;
	
	margin-bottom: 1px;
	color: #0B1215;
	--border-radius: 5px;
	
	--refresh-bg: lightgrey;
	--refresh-bg-hover: #B9B9B9;
	--refresh-border-color: gray;
}

/***************************************
* Button Group / Extra button parts
****************************************/

.button-group-part {
	all: unset;
	display: flex;
	align-items: center;
	gap: 2px;
	box-sizing: border-box;
	
	background: var(--refresh-bg);
	border: solid 1px var(--refresh-border-color);
	height: 27px;
	padding: 0 5px;
	cursor: default;
}
.button-group-part + .button-group-part {
	border-left: none;
}
.button-group-part:first-child {
	border-top-left-radius: var(--border-radius);
	border-bottom-left-radius: var(--border-radius);
}
.button-group-part:last-child {
	border-top-right-radius: var(--border-radius);
	border-bottom-right-radius: var(--border-radius);
}
button.button-group-part:hover {
	background-color:var(--refresh-bg-hover);
	cursor: pointer;
}

.small { font-family: monospace; font-size: 10px; position: relative; top: 1px; }

/***************************************
* Main button part
****************************************/

/* Refresh Button */
#refresh {
	box-sizing: border-box;
	position: relative;
	padding: 0px 5px 0px 25px !important;
	background: var(--refresh-bg);
	border: solid 1px var(--refresh-border-color);
	line-height: 25px;
	/* border-radius: var(--border-radius); */
	margin: 5px 0 5px 10px;
	min-width: 80px; /* We need enough room to show the loading dots */
	font-size: 14px;
}
#refresh:disabled {
	--refresh-bg: #bbb;
	--refresh-bg-hover: #bbb;
	cursor: not-allowed !important;
}

.refresh-icon {
	position: absolute;
	top:-3.5px;
	left:-7px;
	
	display: flex;
	align-items: center;
	justify-content: center;
	
	box-sizing: border-box;
	background: var(--refresh-bg);
	border:solid 1px var(--refresh-border-color);
	border-right: 0;
	width: 32px;
	height: 32px;
	border-radius: 12px;
}
.refresh-icon:after {
	/* Create a rectangle to cover up the part of the refresh icon container's border we don't want visible */
	content: "";
	position: absolute;
	width: 10px;
	height: 25px;
	right: 0;
	background: var(--refresh-bg);
}
:global(.refresh-icon svg) {
	z-index: 1;
}
#refresh:hover, #refresh:hover .refresh-icon, #refresh:hover .refresh-icon:after {
	background-color:var(--refresh-bg-hover);
}
#refresh:not(:disabled):hover :global(.refresh-icon svg) {
	animation: refresh-rotate 1.5s linear infinite;
}
@keyframes refresh-rotate {
	100% { transform: rotate(360deg); }
}

/***************************************
* Toggle to turn auto refresh on/off
****************************************/

.stop-button {
	color: #e84849;
	font-size: 16px;
}

/* .toggle-icon { font-size: 14px; font-weight: bolder; }
.toggle-icon { color:black; }
.checked .toggle-icon { color:green; } */

/***************************************
* Interval Inputs and such
****************************************/

.close-input {
	display: flex;
	align-items: center;
	
	font-size: 14px;
	cursor: pointer;
	background-color: rgb(175, 175, 175);
	border-right: none;
	color: #444;
	line-height: 1;
}
</style>