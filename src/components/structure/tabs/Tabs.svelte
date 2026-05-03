<script context="module">
  // SOURCE: https://svelte.dev/playground/1ec0cc2cef5e4d0a90783d8d81733c87?version=5.55.5  -- https://reddit.com/r/sveltejs/comments/11dp4d6/help_with_tabs_component/jab2r6m/
  export const tabsKey = {}
</script>

<script>
  import TabContent from './TabContent.svelte'
  import { writable } from 'svelte/store'
	import { setContext, onMount } from 'svelte'
	
	const tabs = writable([])
  const selectedTab = writable(null)
	setContext(tabsKey, { tabs, selectedTab })
  onMount(() => {
    if ($tabs.length > 0) $selectedTab = $tabs[0]
  })
</script>

<ul>
	<slot />
</ul>

<TabContent>
  <slot />
</TabContent>

<style>
ul {
	all: unset;
	display: flex;
	padding: 0;
	margin-bottom: 3px;
	border-bottom: 1px solid white;
}
</style>