<script>
    import { cookieConsent } from "../../../stores/bool-localstorage-stores";
</script>

{#if !$cookieConsent}
	<div id="cookie-notice">
		This site uses only the freshest of cookies, with a special recipe from grandma herself*!
		No longer must you use boring normal browser cookies; we have all kinds!
		🍪 Chocolate chip, 🥠 Fortune cookies, ... I ran ot of cookie emojis.
		But many more, I promise!
		But seriously, like every site on planet earth we use cookies on this site.
		I only have this banner since I wanted to make a joke.
		Plz don't sue me.
		<br>
		<small>*There are no irl cookies, let alone a grandma who makes them; I'm sorry ;_;</small>
		<button onclick={() => { cookieConsent.set(true); }}>❌ EAT THE COOKIES 🍪</button>
	</div>
{/if}

<style>
#cookie-notice {
	position: fixed;
	width: 100%;
	bottom: 0;
	left: 0;
	z-index: 999;
	padding: 12px 25px;
	background: #00200c;
	box-sizing: border-box;
	border: 1px solid green;
	border-top-width: 5px;
	
}
#cookie-notice button {
	float: right;
	padding: 3px 3px;
	margin: 0 0 0 3px;
	line-height: 1;
	color: white;
	border: 2px solid white;
	background: darkgreen;
	border-radius: 5px;
}
#cookie-notice button:hover {
	background: green;
	border-color: #EEE;
}
</style>