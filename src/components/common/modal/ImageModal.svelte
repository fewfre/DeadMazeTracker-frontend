<script lang="ts">
    import LoadingSpinner from "../LoadingSpinner.svelte";
    import Modal from "./Modal.svelte";

	interface Props { modalImage?: string|null }
	let { modalImage = $bindable() } : Props = $props();
	let showModal = $state(false);
	let imageLoaded = $state(false);
	$effect(() => {
		if (modalImage) {
			showModal = true;
			imageLoaded = false;
		}
	});
	$effect(() => {
		if(!showModal) {
			modalImage = null;
		}
	});
</script>

<Modal bind:showModal={showModal}>
	{#if !imageLoaded}
		<LoadingSpinner center />
	{/if}
	<img src={modalImage} alt="" onload={() => { imageLoaded = true; }} />
</Modal>

<style>
img {
	height: 85vh;
	max-width: 90vw;
	object-fit: contain;
}
</style>