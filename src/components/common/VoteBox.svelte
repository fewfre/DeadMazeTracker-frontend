<script lang="ts">
    import type { Snippet } from "svelte";
    import InfoIcon from "../../assets/InfoIcon.svelte";
    import NotificationMessageIcon from "../../assets/NotificationMessageIcon.svg.svelte";
    import YoutubeIcon from "../../assets/YoutubeIcon.svelte";
    import { disableBlur } from "../../stores/bool-localstorage-stores";
    import MediaModal from "./modal/MediaModal.svelte";

	type ActionProps =
	| { type: 'flag', onclick:()=>void }
	| { type: 'notification', enabled:boolean, onclick:()=>void }
	| { type: 'map', link:string; }
	| { type: 'youtube', videoId:string }
	| { type: 'info', tooltip:string }
	| { type: 'blank' }
	
	interface Props {
		active?:boolean;
		best?:boolean;
		grayOut?:boolean;
		lightlyGrayOut?:boolean;
		broken?:boolean;
		flagged?:boolean;
		
		title: string;
		subtitle?: string;
		voteButtons: Snippet;
		addonLeft?: Snippet;
		
		actions?: ActionProps[];
	}
	let {
		active, best, grayOut, lightlyGrayOut, broken, flagged,
		title, subtitle, voteButtons, addonLeft, actions = [],
	} : Props = $props();
	
	let media : { type:"image" | "iframe"; url:string; } | null = $state(null)
</script>

<div class={['vote-box', { active, best, 'gray-out':grayOut, 'lightly-gray-out':lightlyGrayOut, broken, flagged, 'no-blur':$disableBlur }]}>
	<div class="vote-inner">
		{#if addonLeft}
			<div class='addon-left'>{@render addonLeft()}</div>
		{/if}
		<div class='vote-title-and-votes'>
			<div class='vote-title'>
				{title}
				{#if subtitle}
					<small style='display:block; line-height: 1.1;'><i>({subtitle})</i></small>
				{/if}
			</div>
			
			{@render voteButtons?.()}
		</div>
	</div>
	{#if actions.length}
		<div class='action-tray'>
			{#each actions as action, i}
				{#if action.type==='flag'}
					<button class='action flag-action btn-action' onclick={action.onclick} title="Mark as done until reset">⚐</button>
				{:else if action.type==='notification'}
					<button class='action notification-action btn-action' class:notification-on={action.enabled} onclick={action.onclick} title="Trigger browser notifications when this votes change from neutral to positive (will not fire when flag is used to mark it as done)"><NotificationMessageIcon size={16} /></button>
				{:else if action.type==='map'}
					<a class='action action-map-icon btn-action' href={action.link}
						onclick={(e) => { e.preventDefault(); media = { type:action.link.indexOf("//fewfre.com/dmmap") > -1 ? "iframe" : "image", url:e.currentTarget['href'] }; }}
					>
						<img src='images/map-icon.png' width="16" alt="Map icon" />
					</a>
				{:else if action.type==='youtube'}
					<a class='action btn-action' href={`https://www.youtube.com/embed/${action.videoId}?rel=0&autoplay=1`}
					onclick={(e) => { e.preventDefault(); media = { type:'iframe', url:e.currentTarget['href'] }; }}
					
					data-featherlight-iframe-frameborder='0' data-featherlight-iframe-allow='autoplay; encrypted-media' data-featherlight-iframe-allowfullscreen='true' data-featherlight-iframe-style='display:block;border:none;height:85vh;width:85vw;max-width:1024px;max-height:560px;'>
						<YoutubeIcon size={16} />
					</a>
				{:else if action.type==='info'}
					<span class='action info-action' title={action.tooltip}><InfoIcon size={16} /></span>
				{:else if action.type==='blank'}
					<span class='action'></span>
				{/if}
			{/each}
			{#if actions.length == 1 /* We never want an action taking the whole height, so add an empty one at the end if only 1 was passed in */}
				<span class='action'></span>
			{/if}
		</div>
	{/if}
</div>
<MediaModal bind:media={media} />

<style>
.vote-box {
	--border-radius: 5px;
	--action-tray-border-color: grey;
	--action-tray-border-color-left: var(--action-tray-border-color);
	
	position: relative;
	display:flex;
	box-sizing: border-box;
	min-width:170px;
	width:170px;
	max-width: 170px;
	min-height: 50px;
	margin:2px 3px 2px 3px;
	
	text-align:center;
	color:#222;
	background:#F8F8F8;
	border:1px solid purple;
	border-left-width: 5px;
	border-radius: var(--border-radius);
}
.vote-box .vote-inner {
	flex:1;
	display: flex;
	overflow: hidden;
}
.addon-left {
	position:relative;
}
.vote-box .vote-title-and-votes {
	position: relative;
	flex:1;
	display: flex;
	flex-direction: column;
	justify-content: end;
	padding: 2px 0;
}
.vote-box .vote-title { /*width:144px;*/ overflow: hidden; white-space: nowrap; margin: auto 0; }

.vote-box.gray-out {
	border-color:grey;
	filter: brightness(80%);
	
	.vote-inner { filter: blur(0.65px); box-shadow: inset 0 0 6px 2px #5e3660aa; }
	&.no-blur .vote-inner { filter: none; }
	
	.vote-title-and-votes:before { content:'∅'; position:absolute; bottom:0; left:6px; }
	.vote-title-and-votes:after { content:'∅'; position:absolute; bottom:0; right:6px; }
}
.vote-box.lightly-gray-out { opacity:0.9; }

.vote-box.broken { opacity:1; filter: invert(75%); border-color:aqua; }
.vote-box.broken:hover .action:not(.btn-action) { background:black; color:white; }

.vote-box.active {
	background-color:#A0FFA0;
	border-color:#3f933f;
	opacity:1;
	
	&.best { background-color: #50FF50; }
	.vote-title-and-votes { filter: none; }
}
.vote-box.best { box-shadow: 0 0 10px 2px lightgreen; }

.vote-box.flagged {
	border-color: var(--flagged-item-color);
	opacity: 0.35;
	filter: none;
	
	--action-tray-border-color-left: var(--flagged-item-color);
	.vote-inner { box-shadow: inset 0 0 5px 1px var(--flagged-item-color); filter: none; }
}

/**** Action Tray ****/

.action-tray {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	min-width:18px;
	width:18px;
	border-left:1px solid var(--action-tray-border-color-left);
}
.action {
	all: unset;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	text-align: center;

	min-height:18px;
	box-sizing: border-box;
	border-bottom:1px solid var(--action-tray-border-color);
	background:rgba(200,200,200,0.5);
	line-height:1;
	
	&:first-child { border-top-right-radius: var(--border-radius); }
	&:last-child { border-bottom:0; border-bottom-right-radius: var(--border-radius); }
	
	&.btn-action {
		cursor: pointer;
		filter:brightness(90%);
	}
	&.btn-action:hover {
		filter:brightness(80%);
	}
	
	&.flag-action { color:#666; }
	&.info-action { color:#666; }
	&.flag-action:focus { outline: 2px solid var(--flagged-item-color); }
	.flagged &.flag-action { color: white; background: var(--flagged-item-color); }
	.flagged &.flag-action:focus { outline: 2px solid white; }

	&.notification-action { color:#666; }
	&.notification-on {
		color: black;
		background:rgba(200,200,200,0.25);
		:global(path) { filter: drop-shadow(0 0 2px #00FF0099); }
	}
	&.notification-on:focus { outline: 2px solid black; }
}
</style>