<script>
    import ExportImportFlagsModal from "./header/ExportImportFlagsModal.svelte";

	let showExportImportModal = $state(false);
</script>
<footer>
	Code by
	<img src="https://www.gravatar.com/avatar/351491aa6b0f5ee6ef19e015c71442f9.jpg?s=14" alt="" style="vertical-align: middle;" />
	<!-- <script>document.write('<img src="https://fewfre.com/images/avatar.jpg?tag=dm_sp&ref='+encodeURIComponent(document.referrer)+'" height="14" style="vertical-align: middle;" />');</script> -->
	Fewfre using PHP, MySQL, and jQuery.
	<small>(<a href="logs/">tracker logs</a>)</small>
	<small>(<a id="export_import_toggle" role="presentation" onclick={(e) => { e.preventDefault(); showExportImportModal = true; }}>export / import data</a>)</small>
	<span class="flattr-cont"><a href="//fewfre.com/donate/">[&thinsp;Donate&thinsp;]</a></span>
</footer>
<ExportImportFlagsModal bind:showModal={showExportImportModal} />

<style>
footer {
	box-sizing: border-box;
	font-size: 75%;
	color: #BBB;
	border-top: 2px solid currentColor;
	padding: 10px 5px 5px;
	clear: both;
}
.flattr-cont {
	float: right;
}
.flattr-cont a {
	color: darkgreen;
	text-decoration: none;
	text-shadow: -3px -3px 3px white, 3px -3px 3px white, -3px 3px 3px white, 3px 3px 3px white;
}
.flattr-cont a:hover {
	color: green;
	text-decoration: underline;
	text-shadow: -3px -3px 3px #efffc9, 3px -3px 3px #efffc9, -3px 3px 3px #efffc9, 3px 3px 3px #efffc9;
}
</style>