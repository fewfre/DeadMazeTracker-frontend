import { getContext, setContext } from 'svelte';
import type { Snippet } from 'svelte';

export interface TabData {
	index: number;
	hash?: string;
	titleSnippet: Snippet | undefined;
	content: () => Snippet | undefined;
}

export interface TabsContextType {
	registerTab: (index: number, titleSnippet: Snippet | undefined, content: () => Snippet | undefined, hash?: string) => void;
	setActiveIndex: (index: number) => void;
	tabs: Map<number, Omit<TabData, 'index'>>;
	activeIndex: number;
}

const CONTEXT_KEY = 'tabs-context';

export function createTabsContext(): TabsContextType {
	return {
		registerTab: () => {},
		setActiveIndex: () => {},
		tabs: new Map(),
		activeIndex: 1
	};
}

export function setTabsContext(context: TabsContextType): void {
	setContext(CONTEXT_KEY, context);
}

export function getTabsContext(): TabsContextType {
	return getContext<TabsContextType>(CONTEXT_KEY);
}
