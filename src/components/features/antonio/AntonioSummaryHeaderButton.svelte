<script lang="ts">
    import { antonioApi } from "../../../api/antonio";
    import AntonioSummary from "./AntonioSummary.svelte";

	const { data: summaryData } = antonioApi.useGetSummary();
	
	let selected = $state(window.location.hash === "#antonio");

	$effect(() => {
		const handleHashChange = () => {
			selected = window.location.hash === "#antonio";
		};

		window.addEventListener("hashchange", handleHashChange);
		// We need to also listen for this custom event since hashchange doesn't fire since the tabs use replaceState since we don't want the history cluttered with tab changes
		window.addEventListener("trackerAppTabsChanged", handleHashChange);

		return () => {
			window.removeEventListener("hashchange", handleHashChange);
			window.removeEventListener("trackerAppTabsChanged", handleHashChange);
		};
	});
	
	const handleClick = () => {
		if (!selected) {
			window.location.hash = "antonio";
		}
	};
</script>

<button id="antonio_btn" class="antonio_btn_header" class:selected onclick={handleClick}>
	<AntonioSummary />
</button>

<style>
.antonio_btn_header {
	border: 2px solid rgb(51, 167, 57);
}
.antonio_btn_header.selected {
	background: lightcyan;
	border-color: rgb(0, 194, 194);
	box-shadow: -2px -1px 5px 3px azure;
}
</style>