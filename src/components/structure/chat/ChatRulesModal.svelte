<script>
    import Modal from "../../common/modal/Modal.svelte";

	let { showModal = $bindable() } = $props();
</script>

<Modal bind:showModal={showModal}>
	<div id="chat_rules" class="featherlight-inline-contents" style="margin-top: 3px;">
		<ul>
			<li>No spam (<a href="https://en.wikipedia.org/wiki/Spam_%28food%29" style="text-decoration:underline;" target="_blank"><img style="vertical-align:middle;" width="25" src="images/spam-can.png" alt="spam can" /> except the food</a>)</li>
			<li>No trading (outside of trading channel)</li>
			<li>Respect others</li>
			<li>Strive to be the best version of yourself</li>
			<li>No drama</li>
		</ul>
	</div>
</Modal>