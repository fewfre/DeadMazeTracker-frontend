<script lang='ts'>
    import { siteLang } from "../../../../i18n/i18n";
    import NavDropdown from "./common/NavDropdown.svelte";
    import NavMenuListItem from "./common/NavMenuListItem.svelte";
	
	const langList = [
		{ code:"en", name:"English", flag:"images/flags/en.png" },
		{ code:"pt-br", name:"Português do Brasil", flag:"images/flags/br.png" },
	];
	const curLangData = langList.find(l=>l.code === $siteLang) ?? langList[0];
</script>

<NavDropdown contId='lang-select-dropdown' contentId='nav-lang-dropdown-content'>
	{#snippet button()}
		<button id="lang-dropdown-btn" aria-controls="nav-lang-dropdown-content">
			<img src={curLangData.flag} width="25" alt={curLangData.code} />
		</button>
	{/snippet}
	<ul>
		{#each langList as langData}
			<NavMenuListItem>
				<button onclick={() => { siteLang.set(langData.code); }}>
					<img src={langData.flag} width="20" alt={langData.code}>
					{langData.name}
				</button>
			</NavMenuListItem>
		{/each}
	</ul>
</NavDropdown>

<style>
#lang-dropdown-btn {
	display: flex;
	align-items: center;
	padding: 5px;
	line-height: 1;
	border: 2px solid white;
	background: darkgreen;
	border-radius: 5px;
	cursor: pointer;
}
:global(#lang-select-dropdown):hover #lang-dropdown-btn {
	background: green;
	border-color: #EEE;
}

ul {
	all: unset;
	display: flex;
	flex-direction: column;
	gap: 2px;
	white-space:nowrap;
}
</style>