<script lang="ts">
    import { nyanCatEnabled } from '../../../stores/nyancat';
    import SettingsMenu from './dropdowns/SettingsMenu.svelte';
    import NavAuthDropdown from './dropdowns/AuthDropdown.svelte';
    import NavLangSelectDropdown from './dropdowns/LangSelectDropdown.svelte';
    import TimerBox from '../../common/TimerBox.svelte';
    import SeeAlsoDropdown from './dropdowns/SeeAlsoDropdown.svelte';
    import { antonioInHeader } from '../../../stores/bool-localstorage-stores';
    import AntonioSummaryHeaderButton from '../../features/antonio/AntonioSummaryHeaderButton.svelte';

	// Image by Tasted#8196 on Discord - https://i.imgur.com/8eQG2qB.png
	const mainIconSrc = $derived(!$nyanCatEnabled ? "images/8eQG2qB.png" : "images/nyancat.gif");
</script>

<header>
	<img id="app-logo" src={mainIconSrc} height="90" alt="Site Logo" />
	<div id="app-title-row">
		{#if !$nyanCatEnabled}
			<h1>Dead Maze Tracker</h1>
		{:else}
			<h1>
				NYAN NYAN NYAN
				<audio id="nyancat_audio" controls loop preload="none" volume={0.5} style="border: 1px solid white; position: absolute; margin-left: 10px;"> <source src="images/nyancat.ogg" type="audio/ogg" /> </audio>
			</h1>
		{/if}
		
		<div id="app-nav-section">
			<NavAuthDropdown />
			{#if $antonioInHeader}
				<AntonioSummaryHeaderButton />
			{/if}
			<NavLangSelectDropdown />
			<SeeAlsoDropdown />
			<SettingsMenu />
		</div>
	</div>
	
	<TimerBox
		label="Time Until Zone Reset"
		format='hms'
		offset={-5}
		timer2={{ label: "Boss Reset", format: 'dhms', offset: 0 }}
	/>
</header>
	
<style>
header {
	display: grid;
	grid-template-columns: auto 1fr;
}

#app-logo {
	grid-row: span 2;
	background: #00200c;
	border: 5px solid currentColor;
	border-top: 0;
	border-left: 0;
	padding: 1px 2px 2px 2px;
	margin: 0 3px 0 -5px;
}
:global(.nyancat) #app-logo { background: #215e9e; }

#app-title-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	padding: 4px 0 4px 10px;
	margin: 0 0 10px;
	border-bottom: 5px solid currentColor;
}
#app-title-row h1 { margin: 0; }

#app-nav-section {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 4px;
	line-height: 1;
}
</style>