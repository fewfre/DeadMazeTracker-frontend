<script lang="ts">
	import dayjs from "dayjs";
	import duration from 'dayjs/plugin/duration';
	import { onMount } from 'svelte';
	import TimerIcon from "../../assets/TimerIcon.svelte";
	import { padStart } from '../../utils/helpers';
	import { getUtcDateOfNextEvent, type ReoccurringEventProps } from '../../utils/time-id-store-helpers';
	dayjs.extend(duration);
	
	interface Props {
		label?: string;
		occurrence: ReoccurringEventProps;
	}
	let { label, occurrence } : Props = $props();
	let progress = $state(0);
	
	const makeTimeUntilEventString = (event:ReoccurringEventProps) => {
		const diff = getUtcDateOfNextEvent(event).diff(dayjs());
		const duration = dayjs.duration(diff);
		switch(event.frequency) {
			default: case "hourly":
				progress = diff / (60_000 * 60);
				return `${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "daily":
				progress = diff / (60_000 * 60 * 24);
				return `${padStart(duration.hours(), 2)}:${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "weekly": {
				progress = diff / (60_000 * 60 * 24 * 7);
				const daysLeft = duration.days();
				const dayString = daysLeft > 0 ? `<span style="white-space: nowrap;">${daysLeft} days</span> ` : "";
				return `${dayString}${padStart(duration.hours(), 2)}:${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			}
		}
	}
	const getTimeString = () => makeTimeUntilEventString(occurrence);
	
	let timeString = $state(getTimeString());
	
	onMount(() => {
		const intervalId = setInterval(() => {
			timeString = getTimeString();
		}, 1000);
		
		return () => clearInterval(intervalId);
	});
</script>

<div class="timer-cont">
	<TimerIcon size={24} rotate={Math.min(Math.max(0, 360*progress), 360)} />
	{#if label}<strong>{label}:</strong>{/if}
	<code class="timer-time">{@html timeString}</code>
</div>

<style>
.timer-cont {
	display: flex;
	align-items: center;
	gap: 0.2em;
	font-size: 24px;
}
strong {
	padding-right: 0.15em;
}
.timer-time {
	all:unset;
	font-family: monospace;
	color: orange;
}
</style>