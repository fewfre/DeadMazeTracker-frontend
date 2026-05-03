<script>
  import { getContext } from 'svelte'
	import { tabsKey } from './Tabs.svelte'
	
	export let index
	export let title
	
	const tabContent = getContext('tabContent')	
	const { selectedTab, tabs } = getContext(tabsKey)
	$tabs = $tabs.some((t) => t == index) ? $tabs : [...$tabs, index]
	
	$: isSelected = index == $selectedTab
</script>

{#if !tabContent}
  <li>
    <a href={`#tab-${index}`} on:click|preventDefault={() => ($selectedTab = index)} class:isSelected>
      {title}
    </a>
  </li>
{:else if isSelected}
  <slot />
{/if}

<style>
li {
	all: unset;
	flex: 1;
}
a {
	flex: 1;
	display: block;
	box-sizing: border-box;
	cursor: pointer;
	
	padding: 10px 2px;
	margin: 0 3px;
	font-size: 125%;
	text-align: center;
	text-decoration: none;
	
	background: #005600;
	border: 1px solid white;
	border-bottom: 0;
	border-radius: 5px 5px 0 0;
}
a :global(img) {
	vertical-align: middle;
}
a:hover {
	background: darkgreen;
}
a.isSelected {
	cursor:default;
	background: green;
}
a.isSelected, a:hover {
	font-size: 130%;
}
</style>