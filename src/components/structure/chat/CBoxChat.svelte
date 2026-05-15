<script lang="ts">
	import { onMount } from 'svelte';
    import ChatFiltersModal from './ChatFiltersModal.svelte';
    import ChatRulesModal from './ChatRulesModal.svelte';
    import { forceChatBelow } from '../../../stores/bool-localstorage-stores';
    import { envVars } from '../../../utils/env-vars';
	
	let showRulesModal = $state(false);
	let showFiltersModal = $state(false);

	const cboxBase = `https://www2.cbox.ws/box/?boxid=${envVars.CBOX_BOXID}&boxtag=xY8OvF`;
	const tabs = [
		{ href: cboxBase, label: 'General' },
		{ href: `${cboxBase}&tid=5&tkey=17ccf67c30d09bf7`, label: 'Trade' },
		{ href: `${cboxBase}&tid=6&tkey=30ae46fac3de7f81`, label: 'Boss' },
		{ href: `${cboxBase}&tid=2&tkey=892b3205d36a083c`, label: '🇬🇧', flag:true },
		{ href: `${cboxBase}&tid=3&tkey=b5c130c9c339148b`, label: '🇪🇸', flag:true },
		{ href: `${cboxBase}&tid=4&tkey=feb06400f051a730`, label: '🇧🇷', flag:true },
		// { href: 'https://projects.fewfre.com/a801/deadmaze/trackerchat/`, label: 'BlaB! AX' },
	];

	let activeTabIndex = $state(0);
	let chatSrc = $state(tabs[0].href);

	function handleTabClick(index:number) {
		activeTabIndex = index;
		chatSrc = tabs[index].href;
	}

	/////////////////////////////////////
	// Chat height / resize logic
	/////////////////////////////////////
	function _getTopOfChat() {
		const chatAside = document.getElementById('chat_aside');
		if (!chatAside) return 0;
		return Math.max(0, chatAside.getBoundingClientRect().top);
	}

	function _getChatHeightOfWindowOrWrapper() {
		const bodyWrapper = document.querySelector('.bodyWrapper');
		if (!bodyWrapper) return window.innerHeight;
		return window.innerHeight < bodyWrapper.clientHeight ? window.innerHeight : bodyWrapper.clientHeight;
	}

	function _resizeChat() {
		const chatAside = document.getElementById('chat_aside');
		const chat = document.getElementById('chat');
		const chatPos = document.getElementById('chat_pos');

		if (!chatAside || !chat || !chatPos) return;

		chatAside.style.width = ''; // Use default size

		if ($forceChatBelow || chatAside.getBoundingClientRect().top > 200) {
			chatPos.style.position = 'static';
			chat.setAttribute('height', '550');
			chatAside.style.width = '100%';
		} else {
			const height = _getChatHeightOfWindowOrWrapper() - _getTopOfChat() - 40 - 25;
			chat.setAttribute('height', String(height));
			chatPos.style.top = _getTopOfChat() + 'px';
			chatPos.style.position = 'fixed';
		}
	}
	
	$effect(() => {
		$forceChatBelow; // This needed so that the effect fires whenever this store changes
		_resizeChat();
	});

	onMount(() => {
		_resizeChat();
		setTimeout(_resizeChat, 10); // Chrome seems to need a slight delay to avoid the "top" being set a few pixels too low

		window.addEventListener('resize', _resizeChat);
		window.addEventListener('scroll', _resizeChat);

		return () => {
			window.removeEventListener('resize', _resizeChat);
			window.removeEventListener('scroll', _resizeChat);
		};
	});
</script>

<aside id="chat_aside">
<div id="chat_pos">
	<div id="chat-tabs">
		{#each tabs as tab, i}
			<a href={tab.href} class="chat-tab-link" class:flag={tab.flag} class:active={activeTabIndex === i} onclick={(e) => { e.preventDefault(); handleTabClick(i); }}>
				{tab.label}
			</a>
		{/each}
	</div>
	<iframe id="chat" src={chatSrc} width="100%" height="655" allowtransparency={true} frameborder="0" marginheight="0" marginwidth="0" scrolling="auto" title="Cbox Chat"></iframe>
	
	<button data-featherlight="#chat_rules" onclick={() => (showRulesModal = true)}>Chat Rules</button>
	<ChatRulesModal bind:showModal={showRulesModal} />
	<button data-featherlight="#chat_filters" onclick={() => (showFiltersModal = true)}>Text Filters</button>
	<ChatFiltersModal bind:showModal={showFiltersModal} />
</div>
</aside>

<style>
#chat_pos {
	position: fixed;
	width: inherit;
	/* pointer-events: none; */
}
/* #chat_pos * { pointer-events: all; } */

#chat-tabs {
	display: flex;
	align-items: center;
	gap: 4px;
}
.chat-tab-link {
	padding: 4px 5px;
	line-height: 1;
	color: #FFF;
	
	background: #4479BA;
	border-radius: 4px;
	border: solid 1px #20538D;
	text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.4);
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 1px 1px rgba(0, 0, 0, 0.2);
	transition-duration: 0.2s;
	user-select:none;
	
	border-bottom: none;  border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
}
.chat-tab-link:hover {
	background: #356094;
	border-color: #2A4E77;
	text-decoration: none;
}
.chat-tab-link:active {
	box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.6);
	background: #2E5481;
	border-color: #203E5F;
}
.chat-tab-link.active {
	background: #0656b7;
	border-color: #577AA0;
	pointer-events: none;
}
.flag {
	font-family: "Twemoji Country Flags", "Helvetica", "Comic Sans", serif;
}
</style>