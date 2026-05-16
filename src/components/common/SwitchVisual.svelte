<script lang="ts">
	interface Props { on:boolean }
	let { on } : Props = $props();
</script>

<span class={["switch", { on }]}></span>

<style>
/*******************************
* SWITCH - http://cssdeck.com/labs/a-simple-css-switch
********************************/
.switch {
	position: relative;
	display: inline-block;
	font-size: 1.6em;
	font-weight: bold;
	color: #ccc;
	text-shadow: 0px 1px 1px rgba(255,255,255,0.8);
	height: 18px;
	padding: 0px 20px;
	border: 1px solid rgba(0,0,0,0.2);
	border-radius: 40px;
	background: #ececec;
	box-shadow: 0px 0px 4px rgba(0,0,0,0.1), inset 0px 1px 3px 0px rgba(0,0,0,0.1);
	cursor: pointer;
	vertical-align: text-bottom;
}

.switch:before {
	content:"";
	position: absolute;
	top: 1px;
	width: 14px;
	height: 14px;
	border: 1px solid rgba(0,0,0,0.3);
	border-radius: 40px;
	background: white;

	box-shadow: inset 0px 1px 0px 0px rgba(255,255,255,0.5);
	z-index: 999;
	transition: all 0.15s ease-in-out;
	
	left: 58%; /* Off state */
}
.switch.on:before { left: 3%; background: #33d2da; }
</style>