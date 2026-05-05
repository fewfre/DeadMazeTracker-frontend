<script lang="ts">
    import LoadingSpinner from "../LoadingSpinner.svelte";
    import Modal from "./Modal.svelte";

	type MediaType = "image" | "iframe";
	interface Props { media:{ type: MediaType; url: string } | null }
	let { media = $bindable() } : Props = $props();
	
	let showModal = $state(false);
	let loaded = $state(false);
	$effect(() => {
		if (media) {
			showModal = true;
			loaded = false;
		}
	});
	$effect(() => {
		if(!showModal) {
			media = null;
		}
	});
</script>

<Modal bind:showModal={showModal}>
{#if !media}
	<LoadingSpinner center />
{:else}
	{#if media.type === 'image'}
		{#if !loaded}
			<LoadingSpinner center />
		{/if}
		<!-- We always want the image to show even when not loaded to prompt the loading -->
		<img src={media.url} alt="" onload={() => { loaded = true; }} />
	{:else if media.type === 'iframe'}
		<iframe src={media.url} title="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
	{/if}
{/if}
</Modal>

<style>
img {
	max-height: 85vh;
	max-width: 90vw;
	object-fit: contain;
}
iframe {
	height: 85vh;
	width: 90vw;
    max-width: 1024px;
    max-height: 560px;
	object-fit: contain;
}
</style>