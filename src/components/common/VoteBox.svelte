<script lang="ts">
    import type { Snippet } from "svelte";
    import VoteButtons from "./VoteButtons.svelte";

	type ActionProps =
	| { type: 'flag', onclick:()=>void }
	| { type: 'map', link:string }
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
		
		actions?: ActionProps[];
	}
	let {
		active, best, grayOut, lightlyGrayOut, broken, flagged,
		title, subtitle, voteButtons, actions = [],
	} : Props = $props();
</script>

<div class={['vote-box', { active, best, 'gray-out':grayOut, 'lightly-gray-out':lightlyGrayOut, broken, flagged }]}>
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
						data-featherlight={action.link.indexOf("//fewfre.com/dmmap") > -1 ? "iframe" : "image"} data-featherlight-iframe-width='1024' data-featherlight-iframe-height='640'>
						<img src='https://vignette.wikia.nocookie.net/deadmaze/images/3/30/Map_icon.png/revision/latest/scale-to-width-down/15' alt="Map icon" />
					</a>
				{:else if action.type==='youtube'}
					<a class='action' href={`https://www.youtube.com/embed/${action.videoId}?rel=0&autoplay=1`} data-featherlight='iframe' data-featherlight-iframe-frameborder='0' data-featherlight-iframe-allow='autoplay; encrypted-media' data-featherlight-iframe-allowfullscreen='true' data-featherlight-iframe-style='display:block;border:none;height:85vh;width:85vw;max-width:1024px;max-height:560px;'>
						<!--<div>Icons made by <a href="https://www.flaticon.com/authors/simpleicon" title="SimpleIcon">SimpleIcon</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a></div>-->
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 90 90" style="margin:auto; enable-background:new 0 0 90 90;" xml:space="preserve">
						<g><path fill="red" d="M90,26.958C90,19.525,83.979,13.5,76.55,13.5h-63.1C6.021,13.5,0,19.525,0,26.958v36.084C0,70.475,6.021,76.5,13.45,76.5h63.1C83.979,76.5,90,70.475,90,63.042V26.958z M36,60.225V26.33l25.702,16.947L36,60.225z"/></g>
						</svg>
					</a>
				{:else if action.type==='info'}
					<span class='action disabled'><abbr title={action.tooltip}>ⓘ</abbr></span>
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

<style>
.vote-box {
	display:flex;
	min-width:170px;
	width:170px;
	max-width: 170px;
	
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

	&.flagged .vote-contents { box-shadow: inset 0 0 5px 3px orangered; }
	& .personal-daily { color:#666; }
	&.flagged .personal-daily { color: white; background: red; }
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