import { createContext, onMount } from "svelte";
import { bossesApi } from "../../../../api/bosses";
import { bossesAutoRefreshInterval } from "../../../../stores/number-localstorage-stores";
import { bossesNotificationManagement } from "./bosses-notification-management";

const [getContext, setContext] = createContext<ReturnType<typeof bossesApi.useList>>();

export const getBossesListContext = getContext;
export const useSetBossesListContext = () => {
	const swrResp = bossesApi.useList({}, { refreshInterval: bossesAutoRefreshInterval });
	setContext(swrResp);
	swrResp.data.subscribe(data => {
		bossesNotificationManagement.detectChangesToBossActiveLocations(data?.bosses);
	});
    onMount(() => { swrResp.revalidate(); });
	return swrResp;
};