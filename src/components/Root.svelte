<script lang="ts">
    import { antonioInHeader, disableBlur, disableMaxWidth } from "../stores/bool-localstorage-stores";
    import { nyancatBodyClass, nyanCatEnabled } from "../stores/nyancat";
    import LoginModal from "./features/login/LoginModal.svelte";
    import PassagesLanding from "./features/passages/PassagesLanding.svelte";
    import SiteFooter from "./structure/SiteFooter.svelte";
    import CBoxChat from "./structure/chat/CBoxChat.svelte";
    import CookieBanner from "./structure/header/CookieBanner.svelte";
    import SiteHeader from "./structure/header/SiteHeader.svelte";
    import Tab from "./structure/tabs/Tab.svelte";
    import Tabs from "./structure/tabs/Tabs.svelte";
	
	function createBodyClassToggle(className:string) {
		return function bodyClass(node: HTMLElement, enabled: boolean) {
			const update = (on:boolean) => node.classList.toggle(className, on);
			const destroy = () => node.classList.remove(className);
			update(enabled);
			return { update, destroy };
		}
	}
	
	const nyanCatBodyClass = createBodyClassToggle(nyancatBodyClass);
	const disableMaxWidthBodyClass = createBodyClassToggle("no-max-width");
	const disableBlurClass = createBodyClassToggle("no-blur");
</script>

<svelte:body use:nyanCatBodyClass={$nyanCatEnabled} use:disableMaxWidthBodyClass={$disableMaxWidth} use:disableBlurClass={$disableBlur} />

<div class="bodyWrapper">
	{#if $nyanCatEnabled}
		<div class="nyancat_cursor"></div>
	{/if}

	<SiteHeader />
	
	<div id="main_two_column_layout">
		<div id="main_two_column_layout_flex_column">
		<Tabs>
			<Tab index=1 title='tab 1'><PassagesLanding /></Tab>
			<Tab index=2 title='tab 2'>I am the content for tab 2</Tab>
			<Tab index=3 title='tab 3'>I am the content for tab 3</Tab>
			{#if !$antonioInHeader}
				<Tab index=4 title='tab 4'>I am the content for tab 4</Tab>
			{/if}
		</Tabs>
		</div>
		
		<CBoxChat />
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