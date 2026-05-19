<script lang="ts">
    import InfoIcon from "../../assets/InfoIcon.svelte";

	interface Props { tooltip:string; size?:number; position?:'top' | 'right' | 'bottom' | 'left'; }
	const { tooltip, size=16, position='top' } : Props = $props();
</script>

<span data-tooltip={tooltip} data-tooltip-position={position}><InfoIcon size={size} /></span>

<style>
span {
	vertical-align: middle;
}
</style>