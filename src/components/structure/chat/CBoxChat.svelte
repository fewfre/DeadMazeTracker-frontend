<script lang="ts">
	import { onMount } from "svelte";
	import { getI18n } from "../../../i18n/i18n";
	import { forceChatBelow } from "../../../stores/bool-localstorage-stores";
	import { envVars } from "../../../utils/env-vars";
	import ChatFiltersModal from "./ChatFiltersModal.svelte";
	import ChatRulesModal from "./ChatRulesModal.svelte";

	let showRulesModal = $state(false);
	let showFiltersModal = $state(false);

	const cboxBase = `https://www2.cbox.ws/box/?boxid=${envVars.CBOX_BOXID}&boxtag=xY8OvF`;
	const tabs = $derived([
		{ href: cboxBase, label: $getI18n("chat_tab.general", "General") },
		{ href: `${cboxBase}&tid=5&tkey=17ccf67c30d09bf7`, label: $getI18n("chat_tab.trade", "Trade") },
		{ href: `${cboxBase}&tid=6&tkey=30ae46fac3de7f81`, label: "Boss" },
		{ href: `${cboxBase}&tid=2&tkey=892b3205d36a083c`, label: "🇬🇧", img: "images/flags/en.png" },
		{ href: `${cboxBase}&tid=3&tkey=b5c130c9c339148b`, label: "🇪🇸", img: "images/flags/es.png" },
		{ href: `${cboxBase}&tid=4&tkey=feb06400f051a730`, label: "🇧🇷", img: "images/flags/br.png" },
		// { href: 'https://projects.fewfre.com/a801/deadmaze/trackerchat/`, label: 'BlaB! AX' },
	]);

	let activeTabIndex = $state(0);
	let chatSrc = $derived(tabs[activeTabIndex].href);
	
	let displayBottomOfPage = $state($forceChatBelow);
	
	let chatPlacementPlaceholder:HTMLElement, chatAside:HTMLElement, chatIframe:HTMLIFrameElement, chatTabsElem:HTMLElement, chatBottomElem:HTMLElement;

	/////////////////////////////////////
	// Chat height / resize logic
	/////////////////////////////////////
	function _getChatHeightOfWindowOrWrapper() {
		const bodyWrapper = document.querySelector(".bodyWrapper");
		if (!bodyWrapper) return window.innerHeight;
		return window.innerHeight < bodyWrapper.clientHeight ? window.innerHeight : bodyWrapper.clientHeight;
	}

	function _resizeChat() {
		// Placeholder used as it remains a consistent size and thus we know where it ends up in the flow is the source of truth
		displayBottomOfPage = chatPlacementPlaceholder.offsetTop > 200;
		if(displayBottomOfPage) return;

		const boundingRect = chatPlacementPlaceholder.getBoundingClientRect(), topOfChat = Math.max(0, boundingRect.top);
		const height = _getChatHeightOfWindowOrWrapper() - topOfChat - chatTabsElem.clientHeight - chatBottomElem.clientHeight - 1/* border */;
		chatIframe.setAttribute("height", height.toString());
		chatAside.style.top = `${topOfChat}px`;
		chatAside.style.left = `${boundingRect.left}px`;
	}

	$effect(() => {
		$forceChatBelow; // This needed so that the effect fires whenever this store changes
		_resizeChat();
	});

	onMount(() => {
		_resizeChat();
		setTimeout(_resizeChat, 10); // Chrome seems to need a slight delay to avoid the "top" being set a few pixels too low
		
		// We need to use a resize observer on main since data loading in can cause a change in the layout without any direct user input like those from a resize/scroll event
		const resizeObserver = new ResizeObserver(() => { _resizeChat(); });
		resizeObserver.observe(document.querySelector("main")!);
		
		window.addEventListener("resize", _resizeChat);
		window.addEventListener("scroll", _resizeChat);

		return () => {
			window.removeEventListener("resize", _resizeChat);
			window.removeEventListener("scroll", _resizeChat);
			resizeObserver.unobserve(document.querySelector("main")!);
		};
	});
</script>

<div id="chat-aside-placement-placeholder" class:force-bottom={$forceChatBelow} bind:this={chatPlacementPlaceholder} aria-hidden="true"></div>
<aside id="chat-aside" class:display-bottom-of-page={displayBottomOfPage} bind:this={chatAside}>
	<div id="chat-tabs" bind:this={chatTabsElem}>
		{#each tabs as tab, i}
			<a
				href={tab.href}
				class="chat-tab-link"
				class:active={activeTabIndex === i}
				onclick={(e) => {
					e.preventDefault();
					activeTabIndex = i;
				}}
			>
				{#if !tab.img}
					{tab.label}
				{:else}
					<img src={tab.img} alt={tab.label} />
				{/if}
			</a>
		{/each}
	</div>
	<iframe
		id="chat-iframe"
		bind:this={chatIframe}
		src={chatSrc}
		width="100%"
		height="655"
		title="Cbox Chat"
	></iframe>

	<div id="chat-bottom" bind:this={chatBottomElem}>
		<button class="chat-bottom-button" data-featherlight="#chat_rules" onclick={() => (showRulesModal = true)}>Chat Rules</button>
		<ChatRulesModal bind:showModal={showRulesModal} />
		<button class="chat-bottom-button" data-featherlight="#chat_filters" onclick={() => (showFiltersModal = true)}>Text Filters</button>
		<ChatFiltersModal bind:showModal={showFiltersModal} />
	</div>
</aside>

<style>
	#chat-aside-placement-placeholder { width:300px; /* We need it to have the sidebar width since we use it to check wether there is enough space for the chat since we can check if it's been pushed down or not */ }
	#chat-aside-placement-placeholder.force-bottom { width:100%; }
	#chat-aside {
		position: fixed;
		min-width: 300px;
		width: 300px;
		pointer-events: none; /* Needed to fix issue with it covering donate link */
		& > * { pointer-events: all; } /* But we still want children to be clickable */
	}
	#chat-aside.display-bottom-of-page {
		position: static;
		width: 100% !important;
		#chat-iframe {
			min-height: 300px;
			height: calc(100vh - 200px) !important;
			max-height: 550px;
		}
	}
	
	#chat-iframe {
		display: block;
		overflow: auto;
		border: none;
		background-color: transparent;
	}

	#chat-tabs {
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.chat-tab-link {
		padding: 4px 6px 3px;
		line-height: 1;
		color: #fff;

		/* background: #4479ba; */
		background: #5e3660;
		border-radius: 4px 4px 0 0;
		/* border: solid 1px #20538d; */
		border: solid 1px #432545;
		border-bottom: 1px solid transparent;
		text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.4),
			0 1px 1px rgba(0, 0, 0, 0.2);
		transition-duration: 0.2s;
		user-select: none;
	}
	.chat-tab-link:hover, .chat-tab-link:focus {
		/* background: #356094; */
		background: #4f3054;
		border-color: #5e3660;
		text-decoration: none;
	}
	.chat-tab-link:active {
		box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);
	}
	.chat-tab-link.active {
		/* background: #0656b7; */
		background: #331d3b;
		/* border-color: #577aa0; */
		border-color: #4f3054;
		border-bottom-color: #bf9e92;
		pointer-events: none;
	}
	.chat-tab-link img {
		height: 16px;
		vertical-align: middle;
	}
	
	#chat-bottom {
		width:fit-content;
		position: relative;
		display: flex;
		align-items: center;
		gap: 0.25em;
		box-sizing: border-box;
		height: var(--footer-height);
		transform: translateY(-1px);
	}
	.chat-bottom-button {
		all: unset;
		position: relative;
		display: inline-block;
		padding: 3px 6px;
		background: #002b00; /* Slightly brighter version of the site content background that it sits on top of - still gives a bit of the illusion of being see through without seeing the stuff behind it (like the footer border) */
		border: solid 3px #5e3660;
		border-radius: 5px;
		color: #fff;
		box-shadow: 3px 3px 3px 0 #5e3660aa;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	.chat-bottom-button:hover {
		transform: translate(3px, 3px);
		box-shadow: -3px -3px 3px 0 #5e3660aa;
	}
	.chat-bottom-button:hover:active {
		background-color: #00200c;
	}
</style>
