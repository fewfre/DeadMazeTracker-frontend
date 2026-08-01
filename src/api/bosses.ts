
import { writable } from "svelte/store";
import { envVars } from "../utils/env-vars";
import type { ZoneId } from "../utils/zone-helpers";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse, type SWRFetchOptionsExposed } from "./utils/api-helpers";

//////////////////////////////
//#region Types
//////////////////////////////
export interface BossLocationInfo {
  id: number;
  name: string;
}
export interface BossInfo {
  id: number;
  zoneId: ZoneId;
  name: string;
  bossImage: string;
  lastKilled: string;
  activeLocationId: number | null;
  locations: BossLocationInfo[];
}

export interface ListBossesRequest {}
export type ListBossesResponse = { bosses:BossInfo[]; };

export interface BossVoteRequest {
  bossId: number;
  action: "open" | "incorrect" | "killed";
  locationId?: number;
}
export type BossVoteResponse = ErrorableResponse<{ success:true }>;

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-bosses"
};
const refreshKey = writable({ key:"" }); // Hacky way to trigger swr refresh on key change, since sswr global mutate/revalidate doesn't work the same as swr
export namespace bossesApi {
	const baseUrl = `${envVars.API_BASE}/bosses`;
	
	export async function list(): Promise<ListBossesResponse> {
		// if(envVars.USE_MOCK_DATA) return bossesMock.createListBossesResponse;
		return (await fetch(`${baseUrl}/list-bosses`, { method: 'GET' })).json();
	}
	export function useList(req:ListBossesRequest, options:SWRFetchOptionsExposed={}) {
		const resp = useSwrFetch(swrKeys.list, list, options);
		refreshKey.subscribe(({key}) => { if(key === swrKeys.list) resp.revalidate() });
		return resp;
	}
	export function refreshList() { refreshKey.set({ key:swrKeys.list }) };
	
	export async function vote(req: BossVoteRequest) : Promise<BossVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
}