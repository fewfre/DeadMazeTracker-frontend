<script lang="ts">
    import { bossTracker } from "./utils/boss-tracker";
	const { bossTrackerStore } = bossTracker;

	interface Props {
		bossImage: string;
		zone: number;
	}
	let { bossImage, zone } : Props = $props();
	const bossChecked = $derived($bossTrackerStore.idsFlagged[zone]);
</script>

<button
	aria-label="Toggle boss for zone: {zone} (currently: {bossChecked ? "ON" : "OFF" })"
	class={['personal-boss', { 'boss-voted': bossChecked }]}
	style:background-image='url({bossImage})'
	onclick={() => bossTracker.toggleFlag(zone)}
	title="Mark boss as killed for the week (personal use, not sent to server)"
></button>

<style>
.personal-boss {
	all: unset;
	--width: 55px;
	--height: 25px;
	/* position: absolute; top:0; right:0; padding: 2px; line-height: 1; opacity:0.2; */
	position: absolute;
	right: 0;
	bottom: 0;
	width: var(--width);
	height: var(--height);
	border-left: solid 1px gold;
	border-top: solid 1px gold;
	opacity:0.5;
	cursor: pointer;
}
.personal-boss:hover { opacity:0.75; --height: 30px; }
.personal-boss.boss-voted { opacity:1; border-color: green; background: rgba(142, 239, 142, 0.4); }
.personal-boss.boss-voted:before {
	content:"✔";
	position:absolute; right: 0; margin: auto; width: var(--width);
	bottom: 0;
	line-height: calc(var(--height) - 1px);
	text-align: center;
	color:green;
	font-weight:bold;
	font-size: 20px;
	text-shadow: -1px -1px 2px lightgreen, 1px -1px 2px lightgreen, -1px 1px 2px lightgreen, 1px 1px 2px lightgreen;
}
.personal-boss.boss-voted:hover { opacity:0.88; }
</style>