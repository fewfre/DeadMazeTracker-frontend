<script>
	// Based on: https://svelte.dev/playground/modal?version=5.55.5
	let { showModal = $bindable(), children } = $props();

	let dialog = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog.showModal();
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
	<div>
		<!-- {@render header?.()} -->
		{@render children?.()}
		<!-- svelte-ignore a11y_autofocus -->
		<button class="close" autofocus onclick={() => dialog.close()}>✕</button>
	</div>
</dialog>

<style>
dialog {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translateX(-50%) translateY(-50%);
	
	background: #003816;
	border: 2px solid white;
	padding: 25px;
	
	color: #CCC;
	background: #00200c;
	background-image:
	radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px),
	radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px),
	radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px),
	radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px);
	background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; 
	background-position: 0 0, 40px 60px, 130px 270px, 70px 100px;
}
dialog::backdrop {
	background: rgba(0, 0, 0, 0.8);
}
:global(body:has(dialog[open])) {
  overflow: hidden;
}
dialog[open] {
	/* animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); */
	animation: fade 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes zoom {
	from {
		transform: scale(0.95);
	}
	to {
		transform: scale(1);
	}
}
dialog[open]::backdrop {
	animation: fade 0.2s ease-out;
}
@keyframes fade {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}
button {
	display: block;
}

.close {
	position: absolute;
	z-index: 9999;
	top: 0;
	right: 0;
	line-height: 25px;
	width: 25px;
	cursor: pointer;
	text-align: center;
	font-family: Arial, sans-serif;
	background: #fff;
	background: rgba(255, 255, 255, .3);
	color: #000;
	border: 0;
	padding: 0;
}
</style>
