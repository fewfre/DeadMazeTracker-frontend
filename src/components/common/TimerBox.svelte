<script lang="ts">
	import { onMount } from 'svelte';
    import { getDateWithUTCOffset, padStart } from '../../utils/helpers';
	
	type FormatType = 'ms' | 'hms' | 'dhms';
	interface Props {
		label: string;
		format: FormatType,
		offset: number;
		timer2?: {
			label: string;
			format: FormatType,
			offset: number;
		}
	}
	let { label, format, offset, timer2 } : Props = $props();
	
	const makeTimeString = (offset:number, format:FormatType) => {
		var countDownDate = getDateWithUTCOffset(offset);
		if(format === 'dhms') {
			var daysLeft = (7 - (countDownDate.getDay()-4)) % 7;
			return `${daysLeft > 0 ? `<span style="white-space: nowrap;">${daysLeft} days</span>` : ""} ${padStart((24-countDownDate.getHours()-1) % 24, 2)}:${padStart(60-countDownDate.getMinutes()-1, 2)}:${padStart(60-countDownDate.getSeconds(), 2)}`;
		}
		else if(format === 'hms') {
			return `${padStart((24-countDownDate.getHours()-1) % 24, 2)}:${padStart(60-countDownDate.getMinutes()-1, 2)}:${padStart(60-countDownDate.getSeconds(), 2)}`;
		}
		return `${padStart(60-countDownDate.getMinutes()-1, 2)}:${padStart(60-countDownDate.getSeconds(), 2)}`;
	}
	const getTimeString = () => makeTimeString(offset, format);
	const getTime2String = () => timer2 ? makeTimeString(timer2.offset, timer2.format) : "";
	
	let timeString = $state(getTimeString());
	let time2String = $state(getTime2String());
	
	onMount(() => {
		const intervalId = setInterval(() => {
			timeString = getTimeString();
			time2String = getTime2String();
		}, 1000);
		
		return () => clearInterval(intervalId);
	});
</script>

<div class="timer-cont cols">
	<div><b>{label}:</b> <code id="zone_reset_time" class="timer-time">{@html timeString}</code></div>
	{#if timer2}
		<div><b>{timer2.label}:</b> <code id="boss_reset_time" class="timer-time">{@html time2String}</code></div>
	{/if}
</div>

<style>
.cols {
	display:flex;
	justify-content: space-between;
}
.timer-cont {
	font-size:24px;
	margin-bottom:3px;
	padding: 2px 3px 2px 5px;
	border:3px double orange;
}
.timer-time {
	font-family: monospace;
	background: none;
	color:orange;
}
</style>