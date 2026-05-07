<script lang="ts">
    import InfoIcon from "../../assets/InfoIcon.svelte";

	interface Props { tooltip:string; size?:number; }
	const { tooltip, size=16 } : Props = $props();
</script>

<span title={tooltip}><InfoIcon size={size} /></span>

<style>
span {
	vertical-align: middle;
}
</style>