<script lang="ts">
	interface Props { center?:boolean; size?:string; }
	let { center = false, size='20px' } : Props = $props();
</script>

<div class="spinner" class:center style:--size={size}></div>

<style>
/* Featherlight stuff */
@keyframes spinner {
	to {transform: rotate(360deg);}
}

.spinner {
	min-width: var(--size);
	min-height: var(--size);
}
.spinner:before {
	content: '';
	display: block;
	box-sizing: border-box;
	width: var(--size);
	height: var(--size);
	border-radius: 50%;
	border: calc(var(--size) / 10) solid #ccc;
	border-top-color: #333;
	animation: spinner .6s linear infinite;
}
.center {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
}
</style>