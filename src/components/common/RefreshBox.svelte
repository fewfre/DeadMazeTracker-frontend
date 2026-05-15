<script lang="ts">
	interface Props { onRefreshClick:()=>void; autoRefreshInterval:number|null; loading?:boolean; }
	let { onRefreshClick, autoRefreshInterval=$bindable(), loading } : Props = $props();
	let checked = $derived(!!autoRefreshInterval);
	let autoRefreshIntervalOpen = $state(false);
</script>

<div id="refreshCont">
	<button id="refresh" class="button-group-part" onclick={onRefreshClick} disabled={loading}>
		{#if loading}
			<img src='images/loading-dots.gif' width='43' alt='Loading...' />
		{:else}
			Refresh
		{/if}
	</button>
	{#if !checked}
		<button class="auto-refresh-toggle button-group-part" class:checked onclick={()=>(autoRefreshInterval = 600_000)} role="switch" aria-checked={checked}
		data-tooltip="Toggle auto-refresh on - this value will be remembered across page loads">
			<!-- ⏲ -->
			 <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="-2 0 30 30"><path fill-rule="evenodd" d="M14 14.18V9a1 1 0 1 0-2 0v5.18A3 3 0 0 0 13 20a3 3 0 0 0 1-5.82M13 28a11 11 0 1 1 0-22 11 11 0 0 1 0 22m.99-23.95L14 4V2h4a1 1 0 1 0 0-2H8a1 1 0 1 0 0 2h4v2l.01.05a13 13 0 1 0 1.98 0"/></svg>
		</button>
	{:else}
		<button class="auto-refresh-toggle button-group-part" class:checked onclick={()=>(autoRefreshInterval = !checked ? 600_000 : null)} role="switch" aria-checked={checked}
		data-tooltip="Click to toggle auto refresh off">
			<span class="small">AUTO</span>
		</button>
	{/if}
	
	{#if checked}
		{#if !autoRefreshIntervalOpen}
			<button class="button-group-part small open-interval-toggle" class:checked onclick={()=>(autoRefreshIntervalOpen = !autoRefreshIntervalOpen)} role="switch" aria-checked={autoRefreshIntervalOpen}
			data-tooltip="Change current auto-refresh interval">
				{(autoRefreshInterval ?? 0) < 60_000 ? `${(autoRefreshInterval ?? 0) / 1000}s` : `${(autoRefreshInterval ?? 0) / 60_000}m`}
			</button>
		{:else}
			<button class="close-input button-group-part" onclick={()=>(autoRefreshIntervalOpen = !autoRefreshIntervalOpen)}>
				<!-- ← -->
				<svg width="12px" height="12px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M6 3L6 6H12L12 10H6L6 13L5 13L0 8L5 3L6 3Z" fill="currentColor"/>
					<path d="M16 2L16 14H14L14 2L16 2Z" fill="currentColor"/>
				</svg>
			</button>
			<div class="button-group-part">
				<input id="autoRefreshValue" type="number" required step="0.2" min="0.2"
				value={(autoRefreshInterval ?? 0)/60_000}
				onchange={(e)=>{
					const val = (e.target as HTMLInputElement).valueAsNumber;
					if(!val || !isFinite(val) || isNaN(val)) return autoRefreshInterval = null;
					autoRefreshInterval = Math.max(12_000, val*60_000);
				}} />
				<span class="small">Minutes</span>
			</div>
		{/if}
	{/if}
</div>

<style>
#refreshCont {
	display: inline-flex;
	align-items: center;
	line-height: 1;
	
	margin-bottom: 1px;
	color: #0B1215;
	--border-radius: 5px;
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
	
	background: lightgrey;
	border: solid 1px grey;
	height: 27px;
	padding: 0 3px;
}
.button-group-part + .button-group-part {
	border-left: none;
}
.button-group-part:last-child {
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
}
button.button-group-part:hover {
	background-color:#B9B9B9;
}

.small { font-family: monospace; font-size: 10px; }

/***************************************
* Main button part
****************************************/

/* #refreshCont button { padding: 2px 12px; } */
#autoRefreshValue { width: 40px; }

/* Refresh Button */
#refresh {
	box-sizing: border-box;
	position: relative;
	padding: 0px 5px 0px 30px !important;
	background: lightgrey;
	border: solid 1px grey;
	line-height: 25px;
	/* border-radius: var(--border-radius); */
	margin: 5px 0 5px 10px;
	min-width: 86px;
	font-size: 14px;
}
#refresh:before {
	content:"";
	box-sizing: border-box;
	display: inline-block;
	position: absolute;
	margin: 0;
	padding: 0;

	top:-5px;
	left:-5px;

	background:lightgrey;
	border:solid 1px grey;
	border-right: 0;
	width: 35px;
	height: 35px;
	border-radius: 35px;
}
#refresh:after {
	content:"";
	box-sizing: border-box;
	position: absolute;
	margin: 0;
	padding: 0;
	transform-origin: 16px 16px;

	top:-3.5px;
	left:-3.5px;
	
	display: block;
	width: 32px;
	height: 32px;
	background: url(../images/refresh_icon.png);
	background-size: auto auto;
	background-size: 32px;
}
#refresh:hover, #refresh:hover:before {
	background-color:#B9B9B9;
}
#refresh:hover:after {
	animation: refresh-rotate 1.5s linear infinite;
}
@keyframes refresh-rotate {
	100% { transform: rotate(360deg); }
}

/***************************************
* Toggle to turn auto refresh on/off
****************************************/

/* #refresh:has(+ .auto-refresh-toggle) {
	border-right: none;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
} */

.toggle-icon { font-size: 14px; font-weight: bolder; }
.toggle-icon { color:black; }
.checked .toggle-icon { color:green; }

/***************************************
* Interval Inputs and such
****************************************/
 
.auto-refresh-toggle:has(+ .open-interval-toggle) {
	border-right: none;
	&:after {
		content:":";
		position: relative;
		right: -1px;
		display: block;
		width: 0;
		font-size: 12px;
		color: gray;
	}
}

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