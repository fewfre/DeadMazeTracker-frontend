<script lang="ts">
	import { onMount } from 'svelte';
    import { padStart } from '../../utils/helpers';
    import { getUtcDateOfNextEvent, type ReoccurringEventProps } from '../../utils/time-id-store-helpers';
	import dayjs from "dayjs";
	import duration from 'dayjs/plugin/duration';
	dayjs.extend(duration);
	
	type FormatType = 'ms' | 'hms' | 'dhms';
	interface Props {
		label: string;
		occurrence: ReoccurringEventProps;
		timer2?: {
			label: string;
			occurrence: ReoccurringEventProps;
		}
		
	}
	let { label, occurrence, timer2 } : Props = $props();
	
	const makeTimeUntilEventString = (event:ReoccurringEventProps) => {
		const duration = dayjs.duration(getUtcDateOfNextEvent(event).diff(dayjs()));
		switch(event.frequency) {
			default: case "hourly":
				return `${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "daily":
				return `${padStart(duration.hours(), 2)}:${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "weekly": {
				const daysLeft = duration.days();
				const dayString = daysLeft > 0 ? `<span style="white-space: nowrap;">${daysLeft} days</span> ` : "";
				return `${dayString}${padStart(duration.hours(), 2)}:${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			}
		}
	}
	const getTimeString = () => makeTimeUntilEventString(occurrence);
	const getTime2String = () => timer2 ? makeTimeUntilEventString(timer2.occurrence) : "";
	
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