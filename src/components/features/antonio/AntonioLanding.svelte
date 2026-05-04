<script>
    import { antonioApi } from "../../../api/antonio";
    import RefreshBox from "../../common/RefreshBox.svelte";
    import TimerBox from "../../common/TimerBox.svelte";
    import AntonioTable from "./AntonioTable.svelte";

	const { data, revalidate } = antonioApi.useList();
	
	const onRefreshClick = () => {
		revalidate();
	};
</script>
<section>
	<TimerBox label="Time Until Reset" format='hms' offset={-4} />
	
	<p>
	Antonio is a shop npc who buys resources.
	He can be found in the main building behind the counter in Lakeview Lane.
	You can read more about it <a href="https://deadmaze.wikia.com/wiki/Antonio">here</a>.
	</p>
</section>
<section>
	<h2 style="border-bottom: 2px solid currentColor; margin-bottom: 5px;">
		Resource List <RefreshBox onRefreshClick={onRefreshClick} onAutoRefreshToggled={()=>{}} />
	</h2>
	
	<AntonioTable />
</section>