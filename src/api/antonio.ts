import { readable, writable } from "svelte/store";
import { envVars } from "../utils/env-vars";
import { antonioMock } from "./mock-data/antonio-mock";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse, type SWRFetchOptionsExposed } from "./utils/api-helpers";

//////////////////////////////
//#region Types
//////////////////////////////
export type AntonioSummaryResponse = { valid:false } | {
	valid: true;
	num: number;
	icon: string;
	rep: number;
}

export interface AntonioResourceInfo {
  id: number;
  icon: string;
  name: string;
  votesUp: number;
  votesDown: number;
  isGood: boolean;
  isBest: boolean;
}

export interface ListAntonioResourcesRequest {}
export type ListAntonioResourcesResponse = { resources: AntonioResourceInfo[] };

export interface AntonioResourceVoteRequest {
  id : number;
  upvote: boolean;
  undo?: boolean;
}
export type AntonioResourceVoteResponse = ErrorableResponse<{ success:true }>;

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-antonio",
	summary: "antonio-summary"
};
const refreshKey = writable({ key:"" }); // Hacky way to trigger swr refresh on key change, since sswr global mutate/revalidate doesn't work the same as swr
export namespace antonioApi {
	const baseUrl = `${envVars.API_BASE}/antonio`;
	
	export async function list(): Promise<ListAntonioResourcesResponse> {
		if(envVars.USE_MOCK_DATA) return antonioMock.listResourcesResponse;
		return (await fetch(`${baseUrl}/list-resources`, { method: 'GET' })).json();
	}
	export function useList(req: ListAntonioResourcesRequest, options:SWRFetchOptionsExposed={}) {
		const resp = useSwrFetch(swrKeys.list, list, options);
		refreshKey.subscribe(({key}) => { if(key === swrKeys.list) resp.revalidate() });
		return resp;
	}
	export function refreshList() {
		refreshKey.set({ key:swrKeys.list });
		refreshKey.set({ key:swrKeys.summary }); // Also refresh summary since summary of list
	}
	
	export async function getSummary(): Promise<AntonioSummaryResponse> {
		if(envVars.USE_MOCK_DATA) return antonioMock.summaryResponse;
		return (await fetch(`${baseUrl}/summary`, { method: 'GET' })).json();
	}
	export function useGetSummary() {
		const resp = useSwrFetch(swrKeys.summary, getSummary, { refreshInterval: readable(60_000) });
		refreshKey.subscribe(({key}) => { if(key === swrKeys.list) resp.revalidate() });
		return resp;
	}
	export function refreshSummary() { refreshKey.set({ key:swrKeys.list }) };
	
	export async function vote(req: AntonioResourceVoteRequest) : Promise<AntonioResourceVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
}