<script lang="ts">
	interface Props { onRefreshClick:()=>void; onAutoRefreshToggled:()=>void; }
	let { onRefreshClick, onAutoRefreshToggled } : Props = $props();
</script>

<div id="refreshCont">
	<button id="refresh" onclick={onRefreshClick}>Refresh</button> -
	<label><input id="autoRefreshCheckbox" type="checkbox" onchange={()=>onAutoRefreshToggled()} /><abbr title="Your setting will be stored in a cookie">Auto Refresh</abbr></label>
	<label id="autoRefreshValueCont" style="display:none;"> : <input id="autoRefreshValue" type="number" step="any" min="0" value="1" required /> Minutes</label>
</div>

<style>
#refreshCont {
	display: inline-block;
	font-size: 14px;
	font-weight: normal;
	padding: 1px 5px 1px 1px;
	margin-bottom: 1px;
	border: 1px solid #EEE;
	border-radius: 2px;
}
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
	border-radius: 5px;
	margin: 5px 0 5px 10px;
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
</style>