<script lang="ts">
    import { onMount } from "svelte";
    import { bossesAutoRefreshInterval } from "../../../stores/number-localstorage-stores";
    import { getBossesListContext } from "./utils/boss-context";

    const { data, revalidate } = getBossesListContext();
    const onRefreshClick = () => revalidate();

    // We want a refresh to trigger whenever the landing page is opened to avoid stale data
    onMount(() => { onRefreshClick(); });

    let activeBossCount = $derived($data?.bosses.filter((b) => b.activeLocationId).length ?? 0);
    let shouldShowBadge = $derived(activeBossCount > 0 && $data !== undefined && $bossesAutoRefreshInterval !== null);
</script>

{#if shouldShowBadge}
    <span class="alert-badge" aria-label="Active boss count">{activeBossCount}</span>
{/if}

<style>
.alert-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    width: 18px;
    height: 18px;
    font-size: 12px;
    font-weight: bold;
    line-height: 1;
    color: white;
    border-radius: 999px;
    background: #ff6b6b;
	box-shadow: 0 0 4px #ffcdcd;
	transform: translateY(2px);
}
</style>