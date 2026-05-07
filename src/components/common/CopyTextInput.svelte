<script lang="ts">
    import { copyToClipboard } from "../../utils/helpers";

	interface Props { label:string; value:string; }
	const { label='Share Link', value="https://fewfre.com/dmtracker" }:Props = $props();
</script>

<div id="shareLinkCont">
	{label}: <input readonly value={value} onclick={e => e.currentTarget.select()} />
	<button onclick={e => copyToClipboard(value)}>copy</button>
</div>

<style>
#shareLinkCont {
	float:right;
	color: #222;
	font-size: 16px;
	padding:2px 5px;
	margin-left: 6px;
	background:#EEE;
	border-top:1px solid #CCC;
	border-bottom:1px solid #CCC;
}
#shareLinkCont input {
	width: 175px;
	padding: 2px 5px;
	border-radius: 3px;
	background: #E0E0E0;
}
</style>