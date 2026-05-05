<script lang="ts">
    import { copyToClipboard } from "../../../utils/helpers";
    import AlertBox from "../../common/AlertBox.svelte";
    import Modal from "../../common/modal/Modal.svelte";

	let { showModal = $bindable() } = $props();
	
	let alert : { type:"success" | "warning" | "danger" | "info" | "primary", message: string } = $state(null);
	let importInputValue = $state("");

	$effect(() => {
		if(showModal) {
			alert = null;
			importInputValue = "";
		}
	});
	
	function exportData() {
		// var data = {
		// 	sp_personal_daily: {
		// 		time: _dailyTrackerTimestamp,
		// 		data: _personalDailyHistory,
		// 	},
		// 	boss_personal: {
		// 		data: _personalBossHistory,
		// 	},
		// 	sidequest_personal: {
		// 		time: Cookies.getJSON("sidequest_personalDailyTime"),
		// 		data: Cookies.getJSON("sidequest_personalDaily"),
		// 	},
		// };
		// return btoa(JSON.stringify(data));
		return btoa(JSON.stringify( window.tabber.doDataExport() ));
	}
	
	function importData(pString) {
		
		var data = JSON.parse(atob(pString));
		// if(data.sp_personal_daily) {
		// 	_dailyTrackerTimestamp = data.sp_personal_daily.time;
		// 	_personalDailyHistory = data.sp_personal_daily.data;
		// 	_savePersonalDailyHistory();
		// }
		// if(data.boss_personal) {
		// 	_personalBossHistory = data.boss_personal.data;
		// 	_savePersonalBossHistory();
		// }
		// if(data.sidequest_personal) {
		// 	Cookies.set("sidequest_personalDailyTime", data.sidequest_personal.time, { expires: 1 });
		// 	Cookies.set("sidequest_personalDaily", data.sidequest_personal.data, { expires: 1 });
		// }
		// refreshTable();
		window.tabber.doDataImport(data)
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
		<AlertBox type={alert.type}>{alert.message}</AlertBox>
	{/if}
	<label for="export_import_export">Export:</label>
	<button id="export_import_export" onclick={() => copyToClipboard( exportData() )}>Copy to Clipboard</button>
	&bull;
	<label for="export_import_input">Import:</label>
	<input id="export_import_input" placeholder="Paste here" bind:value={importInputValue} onpaste={onPaste} onclick={() => (importInputValue = "")} />
	<!-- <button id="export_import_import">Import</button> -->
</Modal>