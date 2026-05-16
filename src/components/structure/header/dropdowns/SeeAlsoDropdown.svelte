<script lang="ts">
    import { externalApi } from "../../../../api/external";
    import NavDropdown from "./common/NavDropdown.svelte";
    import NavMenuListItem from "./common/NavMenuListItem.svelte";

	
	const listResponsePromise = externalApi.fewfreProjectsList();
</script>

{#await listResponsePromise then listResponse}
	<NavDropdown contId='see-also-links-dropdown' contentId='see-also-links-dropdown-content'>
		{#snippet button()}
			<button id="see-also-dropdown-trigger" aria-controls="see-also-links-dropdown-content">
				See Also
			</button>
		{/snippet}
		<ul>
			{#each listResponse.links.filter((link) => !link.href.includes('deadmaze/tracker')) as linkData}
				<NavMenuListItem><a href={linkData.href}>
					{#if linkData.icon}<img src={linkData.icon} width="14" alt="">{/if}
					{linkData.text}
				</a></NavMenuListItem>
			{/each}
		</ul>
	</NavDropdown>
{/await}

<style>
#see-also-dropdown-trigger {
    display: flex;
	align-items: center;
	box-sizing: border-box;
	height: 34px;
    padding: 0 9px;
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    background: #333;
    border: 2px solid #EEE;
    border-radius: 4px;
	cursor: pointer;
}
:global(#see-also-links-dropdown):hover #see-also-dropdown-trigger {
		background: #111;
		text-decoration: none;
}

ul {
	all: unset;
	display: flex;
	flex-direction: column;
	gap: 2px;
	white-space:nowrap;
}
</style>