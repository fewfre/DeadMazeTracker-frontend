<script lang="ts">
	export let zoneId: number;
	
	const background = [
		null,
		{ src:'/images/zone-row-backgrounds/zone-sac.webp' },
		{ src:'/images/zone-row-backgrounds/zone-bay.webp' },
		{ src:'/images/zone-row-backgrounds/zone-rosa.webp' },
		{ src:'/images/zone-row-backgrounds/zone-college.webp' },
		{ src:'/images/zone-row-backgrounds/zone-mall.webp' },
		{ src:'/images/zone-row-backgrounds/zone-walker.webp' },
		{ src:'/images/zone-row-backgrounds/zone-museum.webp' },
		{ src:'/images/zone-row-backgrounds/zone-highway.webp' },
		{ src:'/images/zone-row-backgrounds/zone-mesa.webp' },
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
	width: 25%;
	height: 100%;
	
	background-position: calc(100% + 200px) center;
	background-repeat: no-repeat;
	border-radius: var(--border-radius); /* parent uses it */
	opacity: 0.5;
	
	mask-image: linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0));
}
</style>