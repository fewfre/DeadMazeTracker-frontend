<script lang="ts">
	import dayjs from "dayjs";
	import duration from 'dayjs/plugin/duration';
	import type { Snippet } from "svelte";
	dayjs.extend(duration);
	
	interface Props { children:Snippet, mb?:number; }
	let { children, mb=3 } : Props = $props();
</script>

<div class="box cols" style:margin-bottom="{mb}px">
	{@render children?.()}
</div>

<style>
.cols {
	display:flex;
	justify-content: space-between;
}
.box {
	padding: 2px 3px 2px 5px;
	border:3px double orange;
}
</style>