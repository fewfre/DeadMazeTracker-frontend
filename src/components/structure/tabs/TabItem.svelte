<script lang="ts">
	import { type Snippet } from 'svelte';
	import { getTabsContext } from './tabs-context';

	interface Props {
		index: number;
		hash?: string;
		titleSnippet?: Snippet;
		children: Snippet;
	}

	let { index, hash, titleSnippet, children }: Props = $props();

	const tabsContext = getTabsContext();
	// svelte-ignore state_referenced_locally - seems to work this way, and any changes just causes an endless loop
	tabsContext.registerTab(index, titleSnippet, () => children, hash);
</script>
