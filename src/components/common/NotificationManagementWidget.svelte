<script lang="ts">
    import NotificationMessageIcon from "../../assets/NotificationMessageIcon.svg.svelte";
    import { browserSupportsNotifications, hasUserEnabledNotifications, requestNotificationPermissionIfNeeded } from "../../utils/notification-utils";
    import InfoIconTooltip from "./InfoIconTooltip.svelte";

	interface Props { enabled:boolean; onEnableToggled:() => void; }
	let { enabled, onEnableToggled } : Props = $props();
	
	async function handleEnableClick() {
		// No need to check for browser permissions if you're turning it off
		if(enabled) {
			return onEnableToggled();
		}
		
		await requestNotificationPermissionIfNeeded();
		if(hasUserEnabledNotifications()) {
			onEnableToggled();
		} else {
			alert("You must have notifications enabled in your browser to use this feature.");
		}
	}
</script>

{#if browserSupportsNotifications()}
<div class="notification-widget-cont" data-tooltip={!enabled ? "Click to enable notifications for this page. You will be notified when something below you don't have mark finished (flagged) obtains a positive vote total, indicating it is likely available." : "Click to toggle notifications off"}>
	<button class="button-group-part" onclick={handleEnableClick}>
		<NotificationMessageIcon size={20} />
		{#if enabled}
			<span class="enabled-check">✔</span>
		{/if}
	</button>
	{#if enabled}
		<div class="button-group-part">
			<InfoIconTooltip tooltip="For notifications to work, you most have the page/tab open in the background, have auto refresh & this notification toggle enabled, enabled notifications below for your desired passages, and have notifications enabled in your browser for this site. Passages marked done (flagged) won't send a notification." />
		</div>
	{/if}
</div>
{/if}

<style>
.notification-widget-cont {
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
	
	position: relative;
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

.enabled-check {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(calc(-50% - 2px));
	color: green;
	font-size: 10px;
}
</style>