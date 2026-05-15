<script lang="ts">
    import type { Snippet } from "svelte";
    import VoteButtons from "./VoteButtons.svelte";
    import MediaModal from "./modal/MediaModal.svelte";
    import YoutubeIcon from "../../assets/YoutubeIcon.svelte";
    import InfoIcon from "../../assets/InfoIcon.svelte";

	type ActionProps =
	| { type: 'flag', onclick:()=>void }
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

<div class={['vote-box', { active, best, 'gray-out':grayOut, 'lightly-gray-out':lightlyGrayOut, broken, flagged }]}>
	{#if addonLeft}
		<div class='addon-left'>
			{@render addonLeft()}
		</div>
	{/if}
	<div class='vote-contents vote-title-and-votes'>
		<div class='vote-title'>
			{title}
			{#if subtitle}
				<small style='display:block; line-height: 1.1;'><i>({subtitle})</i></small>
			{/if}
		</div>
		
		
		{@render voteButtons?.()}
	</div>
	{#if actions.length}
		<div class='action-tray'>
			{#each actions as action, i}
				{#if action.type==='flag'}
					<button class='action personal-daily' onclick={action.onclick}>⚐</button>
				{:else if action.type==='map'}
					<a class='action action-map-icon' href={action.link}
						onclick={(e) => { e.preventDefault(); media = { type:action.link.indexOf("//fewfre.com/dmmap") > -1 ? "iframe" : "image", url:e.currentTarget['href'] }; }}
					>
						<img src='images/map-icon.png' width="16" alt="Map icon" />
					</a>
				{:else if action.type==='youtube'}
					<a class='action' href={`https://www.youtube.com/embed/${action.videoId}?rel=0&autoplay=1`}
					onclick={(e) => { e.preventDefault(); media = { type:'iframe', url:e.currentTarget['href'] }; }}
					
					data-featherlight-iframe-frameborder='0' data-featherlight-iframe-allow='autoplay; encrypted-media' data-featherlight-iframe-allowfullscreen='true' data-featherlight-iframe-style='display:block;border:none;height:85vh;width:85vw;max-width:1024px;max-height:560px;'>
						<YoutubeIcon size={16} />
					</a>
				{:else if action.type==='info'}
					<span class='action disabled info' title={action.tooltip}><InfoIcon size={16} /></span>
				{:else if action.type==='blank'}
					<span class='action disabled'></span>
				{/if}
			{/each}
			{#if actions.length == 1}
				<span class='action disabled'></span>
			{/if}
		</div>
	{/if}
</div>
<MediaModal bind:media={media} />

<style>
.vote-box {
	display:flex;
	min-width:170px;
	width:170px;
	max-width: 170px;
	min-height: 50px;
	
	margin:2px 3px 2px 3px;
	color:#222;
	border:1px solid purple;
	background:#F8F8F8;
	position: relative;
	vertical-align: bottom;
	text-align:center;
	background-clip: padding-box;/*https://stackoverflow.com/a/16337203/1411473*/
	border-radius: 5px;
	border-left:solid 5px purple;

	overflow:hidden;
	box-sizing: border-box;
	
	&.active { background-color:#A0FFA0; border-color:#3f933f; }
	&.best { box-shadow: 0 0 10px 2px lightgreen; }
	&.best.active { background-color: #50FF50; }

	/* &.flagged .vote-contents { box-shadow: inset 0 0 5px 3px orangered; } */
	&.flagged { box-shadow: inset 0 0 5px 3px orangered; }
	& .personal-daily { color:#666; }
	& .info { color:#666; }
	&.flagged .personal-daily { color: white; background: red; }
	.personal-daily:focus { outline: 2px solid black; }
}
.vote-box .vote-contents {
	position:relative;
	flex:1;
	display: flex;
	/* flex-direction: column;
	justify-content: end; */
	max-width:calc(100% - 19px);/* 100% - action tray width + border */
	padding: 2px 0;
}
.addon-left {
	padding: 2px 0;
}
.vote-box .vote-title-and-votes {
	display: flex;
	flex-direction: column;
	justify-content: end;
	flex:1;
}
.vote-box .vote-title { /*width:144px;*/ overflow: hidden; white-space: nowrap; margin: auto 0; }

.vote-box.gray-out {
	border-color:grey;
	filter: brightness(65%);
	
	.vote-contents { /*opacity: 0.45;*/ filter: blur(0.65px); }
	:global(.no-blur) & .vote-contents { filter: none; }
	.vote-contents:before { content:'∅'; position:absolute; bottom:0; left:6px; }
	.vote-contents:after { content:'∅'; position:absolute; bottom:0; right:6px; }
}

.vote-box.lightly-gray-out { opacity:0.9; }

.vote-box.broken { opacity:1; filter: invert(75%); border-color:aqua; }
.vote-box.broken:hover .action.disabled { background:black; color:white; }

.vote-box.active { opacity:1; }
.vote-box.active .vote-contents { filter: none; }

/**** Action Tray ****/

.action-tray {
	display: flex;
	flex-direction: column;
	/* background:#EEE; */
	border-left:1px solid grey;
}
.action {
	all: unset;
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	text-align: center;
	
	cursor: pointer;
	filter:brightness(90%);

	width:18px;
	min-height:18px;
	box-sizing: border-box;
	border-bottom:1px solid grey;
	/* background:#EEE; */
	background:rgba(200,200,200,0.5);
	line-height:1;
	
	&:last-child { border-bottom:0; }
	
	&.disabled {
		cursor: default;
		filter: none;
	}
}
</style>