<script lang="ts">
	export let zoneId: number;
	
	const background = [
		null,
		{ src:'images/zone-row-backgrounds/zone-1-sac.webp' },
		{ src:'images/zone-row-backgrounds/zone-2-bay.webp' },
		{ src:'images/zone-row-backgrounds/zone-3-rosa.webp' },
		{ src:'images/zone-row-backgrounds/zone-4-college.webp' },
		{ src:'images/zone-row-backgrounds/zone-5-mall.webp' },
		{ src:'images/zone-row-backgrounds/zone-6-walker.webp' },
		{ src:'images/zone-row-backgrounds/zone-7-museum.webp' },
		{ src:'images/zone-row-backgrounds/zone-8-highway.webp' },
		{ src:'images/zone-row-backgrounds/zone-9-mesa.webp' },
	][zoneId];
</script>

{#if background}
	<div class="background" style="background-image: url('{background.src}');"></div>
{/if}

<style>
.background {
	position: absolute;
	top: 0;
	right: 0;
	width: 300px;
	height: 100%;
	
	background-position: right center;
	background-repeat: no-repeat;
	border-radius: var(--border-radius); /* parent uses it */
	opacity: 0.55;
	
	mask-image: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
}
</style>