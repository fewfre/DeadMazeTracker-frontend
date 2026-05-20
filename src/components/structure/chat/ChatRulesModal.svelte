<script>
    import Modal from "../../common/modal/Modal.svelte";

	let { showModal = $bindable() } = $props();
</script>

<Modal bind:showModal={showModal}>
	<div id="chat_rules">
		<ul>
			<li>No spam (<a href="https://en.wikipedia.org/wiki/Spam_%28food%29" target="_blank"><img width="25" src="images/spam-can.png" alt="spam can" /> except the food</a>)</li>
			<li>No trading (outside of trading channel)</li>
			<li>Respect others</li>
			<li>Strive to be the best version of yourself</li>
			<li>No drama</li>
		</ul>
	</div>
</Modal>

<style>
#chat_rules a {
	text-decoration: underline;
	&:hover { opacity:0.9; }
}
#chat_rules img {
	vertical-align: middle;
}
</style>