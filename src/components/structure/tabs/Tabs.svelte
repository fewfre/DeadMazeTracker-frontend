<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { setTabsContext, type TabsContextType } from './tabs-context';

	interface Props {
		onChange?: (index: number, hash?: string) => void;
		children: Snippet;
	}

	let { children, onChange }: Props = $props();

	let activeIndex = $state(1);
	let tabs = $state(new Map<number, { titleSnippet: Snippet | undefined; content: () => Snippet | undefined; hash?: string }>());

	const tabsContext: TabsContextType = {
		registerTab: (index: number, titleSnippet: Snippet | undefined, content: () => Snippet | undefined, hash?: string) => {
			tabs.set(index, { titleSnippet, content, hash });
			tabs = new Map(tabs); // Trigger reactivity
		},
		setActiveIndex: (index: number) => {
			activeIndex = index;
		},
		get tabs() {
			return tabs;
		},
		get activeIndex() {
			return activeIndex;
		}
	};
	setTabsContext(tabsContext);

	const getIndexFromHash = (hash: string) => {
		const normalized = hash.replace(/^#/, '');
		return Array.from(tabs.entries()).find(([_index, data]) => data.hash === normalized)?.[0];
	};

	const updateHash = (hash?: string) => {
		if (typeof window === 'undefined') {
			return;
		}

		const target = hash ? `#${hash}` : `${window.location.pathname}${window.location.search}`;
		window.history.replaceState(null, '', target);
		window.dispatchEvent(new HashChangeEvent("hashchange")); /* Needed since we need to know when hash changes for antonio in header */
	};

	const activateTab = (index: number) => {
		activeIndex = index;
		const tab = tabs.get(index);
		updateHash(tab?.hash);
		onChange?.(index, tab?.hash);
	};

	onMount(() => {
		const syncHash = () => {
			if (typeof window === 'undefined') {
				return;
			}

			const indexFromHash = getIndexFromHash(window.location.hash);
			if (indexFromHash !== undefined) {
				activeIndex = indexFromHash;
			}
		};

		syncHash();
		window.addEventListener('hashchange', syncHash);

		return () => {
			window.removeEventListener('hashchange', syncHash);
		};
	});

	$effect(() => {
		const indexFromHash = typeof window !== 'undefined' ? getIndexFromHash(window.location.hash) : undefined;
		if (indexFromHash !== undefined) {
			activeIndex = indexFromHash;
		}

		if (tabs.size > 0 && !tabs.has(activeIndex)) {
			activeIndex = Math.min(...tabs.keys());
		}
	});
	const sortedTabs = $derived.by(() => {
		return Array.from(tabs.entries())
			.sort(([a], [b]) => a - b)
			.map(([index, data]) => ({ index, ...data }));
	});
</script>

<div class="tabs-container">
	<div class="tabs-header">
		{#each sortedTabs as tab (tab.index)}
			{#if tab.titleSnippet}
				<button
					class="tab-button"
					class:active={activeIndex === tab.index}
					onclick={() => activateTab(tab.index)}
				>
					{@render tab.titleSnippet()}
				</button>
			{/if}
		{/each}
	</div>

	<div class="tabs-content">
		{#each sortedTabs as tab (tab.index)}
			{#if activeIndex === tab.index}
				<article class="tab-pane">
					<h2 style:display="none">{tab.hash}</h2>
					{@render tab.content()?.()}
				</article>
			{/if}
		{/each}
	</div>

	<div style="display: none;">
		{@render children?.()}
	</div>
</div>

<style>
.tabs-container {
	display: flex;
	flex-direction: column;
}

.tabs-header {
	display: flex;
	justify-content: stretch;
	gap: 0;
	border-bottom: 1px solid white;
}

.tabs-content {
	padding: 0 0;
}

/* .tab-pane {
	animation: fadeIn 0.2s ease;
} */

/* @keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
} */

.tab-button {
	all: unset;
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	box-sizing: border-box;
	cursor: pointer;
	
	height: 45px;
	padding: 10px 4px;
	margin: 0 3px;
	font-size: 125%;
	text-decoration: none;
	color: #CCC;
	white-space: nowrap;
	
	background: var(--tab-bg-color, #005600);
	border: 1px solid white;
	border-bottom: 0;
	border-radius: 5px 5px 0 0;
}
.tab-button:empty { display:none; }
.tab-button:hover {
	background: var(--tab-bg-color--hover, darkgreen);
}
.tab-button.active {
	cursor:default;
	background: var(--tab-bg-color--active, green);
}
.tab-button.active, .tab-button:hover {
	font-size: 130%;
}
</style>
