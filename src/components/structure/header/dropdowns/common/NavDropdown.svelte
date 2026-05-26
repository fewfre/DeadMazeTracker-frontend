<script lang="ts">
    import type { Snippet } from "svelte";
	
	interface Props {
		button: Snippet;
		contId?: string;
		contentId: string;
		children: Snippet;
	}
	let { button, contId, contentId, children } : Props = $props();
</script>

<nav id={contId} class="nav-dropdown">
	{@render button?.()}
	<div id={contentId} class="dropdown-content">
		{@render children?.()}
	</div>
</nav>

<style>
.nav-dropdown {
	position: relative;
}
.nav-dropdown .dropdown-content {
	position:absolute;
	display:none;
	right:0;
	margin: 0;
	z-index: 1;
}
.nav-dropdown:hover .dropdown-content { /* Display the dropdown on hover */
	display:block; /* Bring back on-screen when needed */
}
.nav-dropdown:has(:global(button):focus) .dropdown-content { /* Also on focus (done on separate selector so that it doesn't break hover on older browser that don't support :has) */
	display:block; /* Bring back on-screen when needed */
}
</style>