<script lang="ts">
    import type { Snippet } from "svelte";
	
	interface Props { children: Snippet; }
	let { children } : Props = $props();
</script>

<li>{@render children()}</li>

<style>
li { all: unset; }
li > :global(:is(a, button)) {
	display: flex;
	align-items: center;
	gap: 0.5ex;
	padding: 7px 9px;
	width: 100%;
	
	color: #fff;
	font-weight: bold;
	text-decoration: none;
	
	background: #111;
	border: 1px solid #EEE;
	border-radius: 4px;
	cursor: pointer;
	
	&:hover {
		color: #fff;
		background: #333;
		text-decoration: underline;
		
		:global(img) { transform: scale(1.15); }
	}
}
</style>