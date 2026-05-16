<script lang="ts">
    import LoadingSpinner from "./LoadingSpinner.svelte";
</script>

<div class="table-loading-spinner">
	<LoadingSpinner center size='80px' />
	Loading...
</div>

<style>
.table-loading-spinner {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
	padding: 15px;
	font-size: 24px;
}
</style>