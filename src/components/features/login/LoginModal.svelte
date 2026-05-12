<script>
    import Modal from "../../common/modal/Modal.svelte";

	let { showModal = $bindable() } = $props();
</script>

<Modal bind:showModal={showModal}>
	<p>
		Due to a friendly neighborhood troll (👋 I see you there), I've added a bit of a login system.
		It's annoying, but hopefully less annoying than not having it.
	</p>

	<p>
		If you get a screen asking you to download an Auth app, you can instead get a text message by clicking the small "I'd rather use SMS" at the bottom.
		Sorry if either of these is a deal breaker.
		Mostly likely won't appear on google/twitter logins though.
	</p>

	<p>
		<center><img src="images/remember_sms.png" alt="Example screenshot" /></center>
		If you do have to use text message / auth app to login, then make sure to hit this box to avoid having to enter a code every time!
	</p>
	
	<!-- <center><button style="font-size:28px;" onclick={()=>{ login(); }}>Log in</button></center> -->
	
	<details style="margin-top:20px;">
		<summary>Privacy Policy / Security Stuff</summary>
		<p>
			For anyone has security concerns, the login system uses a 3rd party system, <a href="https://auth0.com/">auth0</a>;
			nothing other than the user id is stored on my server.
			No info is shown publicly to others (although you can see your own nickname when logged in).
			If I login to the auth0 system I can see emails, and if you use twitter/google to login,
			it does show me the name you use for the account (but no addresses or other sensitive info).
			And I can never see any passwords stored, or any phone numbers used for authentication (just last 4 numbers).
		</p>
		<p>
			As for using what data I do have access to, I promise not to use any data maliciously;
			and to back that up I'm to lazy to sell it and self centered to snoop anyways =p
			Plus, not that many people use this site, I'd probably make like 10 cents selling any data 🤔.
		</p>
	</details>
</Modal>

<style>
p {
	margin: 12px 0;
}
</style>