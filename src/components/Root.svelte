<script lang="ts">
    import { getI18n } from "../i18n/i18n";
    import { antonioInHeader, disableBlur, disableChat, disableMaxWidth } from "../stores/bool-localstorage-stores";
    import { browserPoniesDisplayOnSiteBackground, browserPoniesUseTransparentSite } from "../stores/browser-ponies";
    import { nyanCatBodyClass, nyanCatEnabled } from "../stores/nyancat";
    import AntonioLanding from "./features/antonio/AntonioLanding.svelte";
    import AntonioSummary from "./features/antonio/summary/AntonioSummary.svelte";
    import PassagesLanding from "./features/passages/PassagesLanding.svelte";
    import RenownLanding from "./features/renown/RenownLanding.svelte";
    import SideMissionsLanding from "./features/side-missions/SideMissionsLanding.svelte";
    import NyanCatCursor from "./structure/NyanCatCursor.svelte";
    import SiteFooter from "./structure/SiteFooter.svelte";
    import CBoxChat from "./structure/chat/CBoxChat.svelte";
    import CookieBanner from "./structure/header/CookieBanner.svelte";
    import SiteHeader from "./structure/header/SiteHeader.svelte";
    import TabItem from "./structure/tabs/TabItem.svelte";
    import Tabs from "./structure/tabs/Tabs.svelte";
	
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
	
	<main id="main_two_column_layout">
		<div id="main_two_column_layout_flex_column">
		<Tabs>
			<TabItem index={1} hash='passages'>
				{#snippet titleSnippet()}<img src="images/tabicon-sp-crate.png" height="20" alt="" />&nbsp;{$getI18n("tab.secretPassages", "Secret Passages")}{/snippet}
				<PassagesLanding />
			</TabItem>
			<TabItem index={2} hash='side-missions'>
				{#snippet titleSnippet()}<img src='images/tabicon-compass.png' height="20" alt="" />&nbsp;{$getI18n("tab.sideMissions", "Side Missions")}{/snippet}
				<SideMissionsLanding />
			</TabItem>
			<TabItem index={3} hash='renown'>
				{#snippet titleSnippet()}
					<img src='images/tabicon-dog.png' height="20" alt="" />&nbsp;{$getI18n("tab.doggy", "Doggy")}
				{/snippet}
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
	</main>
</div>
<SiteFooter />
<CookieBanner />

<style>
.bodyWrapper {
	background: #003816;
	padding: 0 5px;
	outline: currentColor 2px solid;
	
	min-height: 100%;
	margin: 0 auto calc(-1 * var(--footer-height));
	
  --dot:#bfc7d1; /* adjust tint */
  background: #00200c;
  background-image: url(/images/content-bg.svg);
  background-repeat: repeat;
  background-position: 0 -45px;
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
	height: var(--footer-height);
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