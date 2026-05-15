<script lang="ts">
	import { antonioInHeader } from "../../../stores/bool-localstorage-stores";
	import { nyanCatEnabled } from "../../../stores/nyancat";
	import { envVars } from "../../../utils/env-vars";
	import CopyTextInput from "../../common/CopyTextInput.svelte";
	import TimerBox from "../../common/TimerBox.svelte";
	import AntonioSummaryHeaderButton from "../../features/antonio/AntonioSummaryHeaderButton.svelte";
	import NavAuthDropdown from "./dropdowns/AuthDropdown.svelte";
	import NavLangSelectDropdown from "./dropdowns/LangSelectDropdown.svelte";
	import SeeAlsoDropdown from "./dropdowns/SeeAlsoDropdown.svelte";
	import SettingsMenu from "./dropdowns/SettingsMenu.svelte";

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
				<audio
					id="nyancat_audio"
					controls
					loop
					preload="none"
					volume={0.5}
					style="border: 1px solid white; position: absolute; margin-left: 10px;"
				>
					<source src="images/nyancat.ogg" type="audio/ogg" />
				</audio>
			</h1>
		{/if}

		<div id="app-nav-section">
			<NavAuthDropdown />
			{#if $antonioInHeader}
				<AntonioSummaryHeaderButton />
			{/if}
			<NavLangSelectDropdown />
			{#if envVars.PROJECTS_JSON_URL}
				<SeeAlsoDropdown />
			{/if}
			<SettingsMenu />
		</div>
	</div>

	<div id="subheader">
		<TimerBox label="Time Until Zone Reset" occurrence={{ frequency: "daily", hour: 5 }} />
		<CopyTextInput label="Share" value="https://fewfre.com/dmtracker" width="300px" />
	</div>
</header>

<style>
	header {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: auto 1fr;
		margin: 0 -5px;
	}

	#app-logo {
		grid-row: span 2;
		background: #00200c;
		border: 5px solid currentColor;
		border-top: 0;
		border-left: 0;
		padding: 1px 2px 2px 2px;
	}
	:global(.nyancat) #app-logo {
		background: #215e9e;
	}

	#app-title-row {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 4px 5px 4px 10px;
		border-bottom: 5px solid currentColor;
	}
	#app-title-row h1 {
		margin: 0;
	}

	#app-nav-section {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 4px;
		line-height: 1;
	}

	#subheader {
		display: flex;
		align-items: center;
		gap: 5px;
		padding: 4px 5px 0;
	}
	#subheader :global(*:first-child) {
		flex: 1;
	}
	#subheader :global(.timer-cont) {
		margin: 0;
	}
</style>
