<script lang="ts">
    import { antonioInHeader, disableBlur, disableChat, disableMaxWidth, forceChatBelow } from "../stores/bool-localstorage-stores";
    import { nyanCatBodyClass, nyanCatEnabled } from "../stores/nyancat";
    import PassagesLanding from "./features/passages/PassagesLanding.svelte";
    import AntonioSummary from "./features/antonio/AntonioSummary.svelte";
    import SiteFooter from "./structure/SiteFooter.svelte";
    import CBoxChat from "./structure/chat/CBoxChat.svelte";
    import CookieBanner from "./structure/header/CookieBanner.svelte";
    import SiteHeader from "./structure/header/SiteHeader.svelte";
    import TabItem from "./structure/tabs/TabItem.svelte";
    import Tabs from "./structure/tabs/Tabs.svelte";
    import AntonioLanding from "./features/antonio/AntonioLanding.svelte";
    import SideQuestLanding from "./features/sidequest/SideQuestLanding.svelte";
    import RenownLanding from "./features/renown/RenownLanding.svelte";
    import { browserPoniesDisplayOnSiteBackground, browserPoniesUseTransparentSite } from "../stores/browser-ponies";
    import NyanCatCursor from "./structure/NyanCatCursor.svelte";
	
	function createBodyClassToggle(className:string) {
		return function bodyClass(node: HTMLElement, enabled: boolean) {
			const update = (on:boolean) => node.classList.toggle(className, on);
			const destroy = () => node.classList.remove(className);
			update(enabled);
			return { update, destroy };
		}
	}
	
	const disableMaxWidthBodyClass = createBodyClassToggle("no-max-width");
	const disableBlurClass = createBodyClassToggle("no-blur");
	const nyanCatBodyClassToggle = createBodyClassToggle(nyanCatBodyClass);
	const mlpInBackgroundClass = createBodyClassToggle("mlp-in-background");
	const mlpMakeSiteSeeThroughClass = createBodyClassToggle("mlp-make-site-see-through");
</script>

<svelte:body
	use:disableMaxWidthBodyClass={$disableMaxWidth}
	use:disableBlurClass={$disableBlur}
	use:nyanCatBodyClassToggle={$nyanCatEnabled}
	use:mlpInBackgroundClass={$browserPoniesDisplayOnSiteBackground}
	use:mlpMakeSiteSeeThroughClass={$browserPoniesUseTransparentSite}
/>

<div class="bodyWrapper">
	{#if $nyanCatEnabled}
		<NyanCatCursor />
	{/if}
	
	<SiteHeader />
	
	<div id="main_two_column_layout">
		<div id="main_two_column_layout_flex_column">
		<Tabs onChange={(index, hash) => { window.dispatchEvent(new Event('trackerAppTabsChanged')) }}>
			<TabItem index={1} hash='passages'>
				{#snippet titleSnippet()}<img src="images/tabicon-sp-crate.png" height="20" alt="" />&nbsp;Passages{/snippet}
				<PassagesLanding />
			</TabItem>
			<TabItem index={2} hash='sidequest'>
				{#snippet titleSnippet()}<img src='images/tabicon-compass.png' height="20" alt="" />&nbsp;Side Quests{/snippet}
				<SideQuestLanding />
			</TabItem>
			<TabItem index={3} hash='renown'>
				{#snippet titleSnippet()}<img src='images/tabicon-survivor-notes.png' height="20" alt="" />&nbsp;Renown (<img src='images/tabicon-dog.png' height="20" alt="" />&nbsp;Dog){/snippet}
				<RenownLanding />
			</TabItem>
			<TabItem index={4} hash='antonio'>
				{#snippet titleSnippet()}{#if !$antonioInHeader}<AntonioSummary />{/if}{/snippet}
				<AntonioLanding />
			</TabItem>
		</Tabs>
		</div>
		
		{#if !$disableChat}
			<CBoxChat />
		{/if}
	</div>
</div>
<SiteFooter />
<CookieBanner />

<style>
.bodyWrapper {
	background: #003816;
	padding: 0 5px;
	outline: currentColor 2px solid;
	
	min-height: 100%;
	margin: 0 auto -45px; /* equal to footer height */
	
	background: #00200c;
	background-image:
		radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
		radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
		radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
		radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
	background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px;
	background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
}
/* https://css-tricks.com/snippets/css/sticky-footer/ */
.bodyWrapper:after { content:""; display:block; }
:global(.mlp-in-background) .bodyWrapper {
	position:relative;
	z-index:100000000;
	background-color:rgba(0,32,12,0.6);
}
:global(.mlp-make-site-see-through) .bodyWrapper > :global(*:not(header)) {
	opacity: 0.1 !important;
}

:global(footer), .bodyWrapper:after {
	height: 45px; /* ':after' must be the same height as 'footer' */
}

#main_two_column_layout {
	display:flex;
	flex-wrap: wrap;
	padding-top: 10px;
}
#main_two_column_layout_flex_column {
	flex: 1;
}
#main_two_column_layout :global(aside) {
	width: 300px;
	padding-left: 5px;
	margin-left: auto;
}
</style>