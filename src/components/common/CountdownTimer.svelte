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
	const setProgress = (p:number) => progress = Math.min(Math.max(0, p), 1);
	
	const makeTimeUntilEventString = (event:ReoccurringEventProps) => {
		const diff = getUtcDateOfNextEvent(event).diff(dayjs());
		const duration = dayjs.duration(diff);
		switch(event.frequency) {
			default: case "hourly":
				setProgress(diff / (60_000 * 60));
				return `${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "daily":
				setProgress(diff / (60_000 * 60 * 24));
				return `${padStart(duration.hours(), 2)}:${padStart(duration.minutes(), 2)}:${padStart(duration.seconds(), 2)}`;
			case "weekly": {
				setProgress(diff / (60_000 * 60 * 24 * 7));
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
	<span class="timer-icon" class:shake={progress < 0.2} style:--progress={1-(progress/0.2)}><TimerIcon size={24} rotate={360*progress} /></span>
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




.timer-icon { font-size: 0; }
.timer-icon.shake {
	--shake-offset: calc(0.5px + (2px * var(--progress)));
	animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) infinite, delay-animation calc(8s - 6s * var(--progress)) linear infinite;
	animation-fill-mode: forwards;
}
.timer-icon.shake :global(svg .timer-knob) {
	fill: hsl(calc(60 - (60 * var(--progress))), 100%, 75%); /* This transitions between yellow/orange/red as the progress gets closer to ending */
}

@keyframes shake {
	0%, 50%, 100% { transform: translateX(0); }
	5%, 15%, 25%, 35%, 45% { transform: translateX(calc(-1 * var(--shake-offset))); animation-delay: calc(0.1s * var(--animation-index)); }
	10%, 20%, 30%, 40% { transform: translateX(var(--shake-offset)); animation-delay: calc(0.1s * var(--animation-index)); }
	/* 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); animation-delay: calc(0.1s * var(--animation-index)); }
	20%, 40%, 60%, 80% { transform: translateX(5px); animation-delay: calc(0.1s * var(--animation-index)); } */
}
@keyframes delay-animation {
  0%, 50% { transform: none; }
  100% { opacity: 1; }
}
</style>