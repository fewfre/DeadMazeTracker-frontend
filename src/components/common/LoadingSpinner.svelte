<script lang="ts">
	interface Props { center?:boolean }
	let { center = false } : Props = $props();
</script>

<div class="spinner" class:center></div>

<style>
/* Featherlight stuff */
@keyframes spinner {
	to {transform: rotate(360deg);}
}

.spinner {
	min-width: 20px;
	min-height: 20px;
}
.spinner:before {
	content: '';
	display: block;
	box-sizing: border-box;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	border: 2px solid #ccc;
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