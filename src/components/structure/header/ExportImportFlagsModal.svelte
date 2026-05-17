<script lang="ts">
    import { copyToClipboard } from "../../../utils/helpers";
    import AlertBox, { type AlertType } from "../../common/AlertBox.svelte";
    import Modal from "../../common/modal/Modal.svelte";
    import { bossTracker } from "../../features/passages/utils/boss-tracker";
    import { passagesDailyTracker } from "../../features/passages/utils/passages-daily-tracker";
    import { sideMissionsDailyTracker } from "../../features/side-missions/utils/side-missions-daily-tracker";

	let { showModal = $bindable() } = $props();
	
	let alert : { type:AlertType, message: string } | null = $state(null);
	let importInputValue = $state("");

	$effect(() => {
		if(showModal) {
			alert = null;
			importInputValue = "";
		}
	});
	
	function exportData() {
		return btoa(JSON.stringify({
			...passagesDailyTracker.exportData(),
			...bossTracker.exportData(),
			...sideMissionsDailyTracker.exportData(),
		}));
	}
	
	function importData(pString:string) {
		var data = JSON.parse(atob(pString));
		passagesDailyTracker.importData(data);
		bossTracker.importData(data);
		sideMissionsDailyTracker.importData(data);
	}
	
	function onCopy() {
		copyToClipboard( exportData() ).then(() => {
			alert = { type:"success", message:"Data copied to clipboard" };
		})
		.catch((error:Error) => {
			alert = { type:"danger", message:`Error copying to clipboard: ${error.message ?? 'unknown'}` };
		});
	}
	
	function onPaste(e:ClipboardEvent & { currentTarget: EventTarget & HTMLInputElement; }) {
		alert = null;
		try {
			var tData = ((e as any).originalEvent ?? e).clipboardData.getData('text');
			importData( tData.trim() );
			
			alert = { type: "success", message: "Data imported successfully!" };
			setTimeout(function(){ importInputValue = ""; });
			
			setTimeout(function(){
				showModal = false;
			}, 0.5*1000);
		}
		catch(e) {
			alert = { type: "danger", message: "Seems there was an error! Please make sure you copied the string exactly / pasted valid content!" };
		}
	}
</script>

<Modal bind:showModal={showModal}>
	<h2>Export / Import Personal Log Data</h2>
	<p>
		This allows you to keep track of your sp/boss "flags" across different devices.
		To export, press the button to copy the data into your <a href="https://en.wikipedia.org/wiki/Clipboard_%28computing%29">Clipboard</a>.
		Then go to a different computer, paste the string into the text field.
		Note: This will replace any current data when imported (it won't merge them).
	</p>
	
	{#if alert}
		<AlertBox type={alert.type} onClose={()=>(alert = null)}>{alert.message}</AlertBox>
	{/if}
	<label for="export_import_export">Export:</label>
	<button id="export_import_export" onclick={onCopy}>Copy to Clipboard</button>
	&bull;
	<label for="export_import_input">Import:</label>
	<input id="export_import_input" placeholder="Paste here" bind:value={importInputValue} onpaste={onPaste} onclick={() => (importInputValue = "")} />
	<!-- <button id="export_import_import">Import</button> -->
</Modal>