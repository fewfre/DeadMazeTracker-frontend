import { createContext, onMount } from "svelte";
import { passagesApi } from "../../../../api/passages";
import { passagesAutoRefreshInterval } from "../../../../stores/number-localstorage-stores";
import { passagesNotificationManagement } from "./passages-notification-management";

const [getContext, setContext] = createContext<ReturnType<typeof passagesApi.useList>>();

export const getPassagesListContext = getContext;
export const useSetPassagesListContext = () => {
	const swrResp = passagesApi.useList({}, { refreshInterval: passagesAutoRefreshInterval });
	setContext(swrResp);
	swrResp.data.subscribe(data => {
		passagesNotificationManagement.detectChangesToPassageVotes( data?.zones.flatMap(z=>z.passages) );
	});
	swrResp.error.subscribe(data => {}); // I don't know WHY, but `error` in `swrResp` was causing issues when stored in the context, but subscribing to it here seems to fix it. I don't know why, but it does. ¯\_(ツ)_/¯
	onMount(() => { swrResp.revalidate(); });
	return swrResp;
};