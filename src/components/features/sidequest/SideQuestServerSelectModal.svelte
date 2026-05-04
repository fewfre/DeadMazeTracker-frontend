<script lang="ts">
    import Modal from "../../common/modal/Modal.svelte";

	interface Props { showModal: boolean; onServerChange: (server:string) => void; }
	let { showModal = $bindable(), onServerChange } : Props = $props();
	
	const options = [
		{
			name:"Mega Server A",
			flag:"en",
			server_name:"en",
			list:[
				{code:"en", name:"International"},
				{code:"e2", name:"English only"},
				{code:"fr", name:"Français"},
				// {code:"br", name:"Brasil"},
				// {code:"es", name:"Español"},
				{code:"tr", name:"Türkçe"},
				{code:"pl", name:"Polski"},
				// {code:"ru", name:"Русский"},
				{code:"cn", name:"中文"},
				{code:"no", name:"Norsk/Svenska/Dansk"},
				{code:"hu", name:"Magyar"},
				{code:"nl", name:"Nederlands"},
				{code:"ro", name:"Română"},
				{code:"id", name:"Bahasa Indonesia"},
				{code:"de", name:"Deutsch"},
				{code:"ar", name:"العَرَبِيَّة"},
				{code:"ph", name:"Tagalog"},
				{code:"jp", name:"日本語"},
				{code:"fi", name:"Suomi"},
				{code:"it", name:"Italiano"},
				{code:"lt", name:"Lietuvių"},
				{code:"he", name:"עברית"},
				{code:"cz", name:"Čeština/Slovenčina"},
				{code:"hr", name:"Hrvatski"},
				{code:"bg", name:"български"},
				{code:"lv", name:"Latviešu"},
				{code:"et", name:"Eesti"},
				// {code:"pt", name:"Português"},
			]
		},
		{
			name:"Mega Server 1",
			flag:"br_mega",
			server_name:"br",
			list:[
				{code:"br", name:"Brasil"},
				{code:"es", name:"Español"},
				{code:"ru", name:"Русский"},
				{code:"pt", name:"Português"},
			]
		}
	];
	// [
	// 	{code:"e2", name:"English only"},
	// 	{code:"en", name:"International"},
	// 	{code:"fr", name:"Français"},
	// 	{code:"br", name:"Brasil"},
	// 	{code:"es", name:"Español"},
	// 	{code:"tr", name:"Türkçe"},
	// 	{code:"pl", name:"Polski"},
	// 	{code:"ru", name:"Русский"},
	// 	{code:"cn", name:"中文"},
	// 	{code:"no", name:"Norsk/Svenska/Dansk"},
	// 	{code:"hu", name:"Magyar"},
	// 	{code:"nl", name:"Nederlands"},
	// 	{code:"ro", name:"Română"},
	// 	{code:"id", name:"Bahasa Indonesia"},
	// 	{code:"de", name:"Deutsch"},
	// 	{code:"ar", name:"العَرَبِيَّة"},
	// 	{code:"ph", name:"Tagalog"},
	// 	{code:"jp", name:"日本語"},
	// 	{code:"fi", name:"Suomi"},
	// 	{code:"it", name:"Italiano"},
	// 	{code:"lt", name:"Lietuvių"},
	// 	{code:"he", name:"עברית"},
	// 	{code:"cz", name:"Čeština/Slovenčina"},
	// 	{code:"hr", name:"Hrvatski"},
	// 	{code:"bg", name:"български"},
	// 	{code:"lv", name:"Latviešu"},
	// 	{code:"et", name:"Eesti"},
	// 	{code:"pt", name:"Português"},
	// ].forEach(function(sv, i){
	// 	if(i%6==0) {
	// 		html += "</div><div class='server-button-column'>";
	// 	}
	// 	html += "<button class='server-button' data-server='"+sv.code+"'><img src='images/flags/"+sv.code+".png' /> "+sv.name+"</button>";
	// });
</script>

<Modal bind:showModal>
	<h2>Server Selection</h2>
	<p>Please select the server you're playing on, and only report locations from there (or switch to a more populated server).</p>
	<p><b>NOTE:</b> This will not translate the page, it will <b>only</b> change the list of open secret passages.<br />I apologize for the inconvenience.</p>
			
	<div class='button-list'>
	{#each options as o(o.server_name)}
		<button onclick={()=>{ onServerChange(o.server_name); showModal = false; }}>
			<strong><big><img src='images/flags/{o.flag}.png' alt='' style='vertical-align: middle;' width='43' /> {o.name}</big></strong><hr />
			<div>
			{#each o.list as lang}
				<img src='images/flags/{lang.code}.png' alt={lang.code} width='20' />
			{/each}
			</div>
		</button>
	{/each}
	</div>
</Modal>

<style>
p {
	margin-bottom: 0.65em;
}
.button-list {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	gap: 0.5em;
}
button {
	width: 300px;
	vertical-align: top;
}

/* .server-button-column { float:left; }
.server-button-column:after { content:""; clear:both; }
.server-button { float:left; clear:left; width: 100%; text-align: left; }
.server-button img { vertical-align: middle; } */
</style>