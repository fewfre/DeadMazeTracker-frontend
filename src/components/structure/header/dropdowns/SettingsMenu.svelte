<script lang="ts">
    import { antonioInHeader, disableBlur, disableChat, disableMaxWidth, forceChatBelow } from '../../../../stores/bool-localstorage-stores';
    import { BrowserPonies, browserPoniesEnabled, browserPoniesUseTransparentSite, initBrowserPonies, spawnPonies } from '../../../../stores/browser-ponies';
    import { nyanCatEnabled, toggleNyanCat } from '../../../../stores/nyancat';
    import SwitchVisual from '../../../common/SwitchVisual.svelte';
    import NavDropdown from './common/NavDropdown.svelte';
</script>

<NavDropdown contId='settings-dropdown' contentId='settings-dropdown-contents'>
	{#snippet button()}
		<button id="settings-dropdown-btn" aria-controls="settings-dropdown-contents">
			<img src="images/settings_icon.svg" width="25" alt="Settings">
		</button>
	{/snippet}
	
	<ul>
		<li><button onclick={()=>disableChat.update(v => !v)}><SwitchVisual on={$disableChat} /> Disable Chat</button></li>
		<li><button onclick={()=>forceChatBelow.update(v => !v)}><SwitchVisual on={$forceChatBelow} /> Force Chat to Bottom</button></li>
		<li data-tooltip="Removes blur on grayed out passages with ∅ symbol as it was causing some people performance issues" data-tooltip-position="left">
			<button onclick={()=>disableBlur.update(v => !v)}><SwitchVisual on={$disableBlur} /> Disable Blur</button></li>
		<li><button onclick={()=>disableMaxWidth.update(v => !v)}><SwitchVisual on={$disableMaxWidth} /> Use Full Screen Width</button></li>
		<li><button onclick={()=>antonioInHeader.update(v => !v)}><SwitchVisual on={$antonioInHeader} /> Antonio in Header</button></li>
		<!-- <li><a id="option_export_import_data">Export/Import Data</a></li> -->
		<li><button id="setting_nyancat" onclick={toggleNyanCat}><SwitchVisual on={$nyanCatEnabled} /> Nyan {#if $nyanCatEnabled}Cat{/if}</button></li>
		{#if $nyanCatEnabled}
			<li><a href="http://nyan.cat">^WTF is this?^</a></li>
		{/if}
		
		{#if !$browserPoniesEnabled && !$nyanCatEnabled}
			<li><button onclick={initBrowserPonies}>Friendship is Magic</button></li>
		{/if}
		{#if $browserPoniesEnabled && !$nyanCatEnabled}
			<li><button onclick={spawnPonies}>Click For More Ponies!</button></li>
			<li>
				<div class="list-action-styling">
					<button class="button" onclick={()=>{ BrowserPonies.start();void(0) }} title="Start">▶</button>
					<button class="button" onclick={()=>{ BrowserPonies.stop();void(0) }} title="Stop">■</button>
					<button class="button" onclick={()=>{ BrowserPonies.pause();void(0) }} title="Pause">▮▮</button>
					<button class="button" onclick={()=>{ BrowserPonies.resume();void(0) }} title="Resume">▮▶</button>
					<button class="button" onclick={()=>{ BrowserPonies.togglePoniesToBackground();browserPoniesUseTransparentSite.set(false);void(0) }} title="Toggle ponies in background">↕</button>
					<button class="button" onclick={()=>{ BrowserPonies.unspawnAll();BrowserPonies.stop();void(0) }} title="Remove all Ponies">×</button>
				</div>
			</li>
			<li>
				{#if !$browserPoniesUseTransparentSite}
					<button onclick={() => browserPoniesUseTransparentSite.update(b=>!b)}>I can't see the ponies :(</button>
				{:else}
					<button onclick={() => browserPoniesUseTransparentSite.update(b=>!b)}>Now I can't see the page; undo!</button>
				{/if}
			</li>
			<li>
				<a href="https://panzi.github.io/Browser-Ponies/" target="_blank">Go here to have this on all web pages!</a>
			</li>
		{/if}
	</ul>
</NavDropdown>

<style>
#settings-dropdown-btn {
	padding: 3px 3px;
	line-height: 1;
	border: 2px solid white;
	background: darkgreen;
	border-radius: 5px;
	cursor: pointer;
}
:global(#settings-dropdown):hover #settings-dropdown-btn {
	background: green;
	border-color: #EEE;
}

ul, li { all: unset; }
ul {
	display: flex;
	flex-direction: column;
	gap: 1px;
}
li {
	display: flex;
	justify-content: stretch;
}

li > a, li > button, li > .list-action-styling {
	all: unset;
	flex: 1;
	display: block;
	white-space: nowrap;
	padding: 7px 9px;
	border-radius: 4px;
	text-decoration: none;
	color: #fff;
	background: #111;
	border: 1px solid #EEE;
	cursor: pointer;
}
li > .list-action-styling { cursor: default; }

li > a:hover, li > button:hover {
	color:#fff;
	background:#444;
	text-decoration:underline;
}
</style>