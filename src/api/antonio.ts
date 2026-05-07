import { mutate, useSWR } from "sswr";
import { envVars } from "../utils/env-vars";
import { antonioMock } from "./mock-data/antonio-mock";

//////////////////////////////
//#region Types
//////////////////////////////
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
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface AntonioResourceVoteResponse {}

export type AntonioSummaryResponse = { valid:false } | {
	valid: true;
	num: number;
	icon: string;
	rep: number;
}

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-antonio",
	summary: "antonio-summary"
};
export namespace antonioApi {
	const baseUrl = `${envVars.API_BASE}trackers/antonio`;
	
	export async function list(): Promise<ListAntonioResourcesResponse> {
		if(envVars.USE_MOCK_DATA) return antonioMock.listResourcesResponse;
		return (await fetch(`${baseUrl}/table-json.php`, { method: 'GET' })).json();
	}
	export function useList() {
		return useSWR<ListAntonioResourcesResponse>(swrKeys.list, { fetcher: list });
	}
	export function refreshList() { mutate(swrKeys.list, undefined) }
	
	export async function getSummary(): Promise<AntonioSummaryResponse> {
		if(envVars.USE_MOCK_DATA) return antonioMock.summaryResponse;
		return (await fetch(`${baseUrl}/summary-json.php`, { method: 'GET' })).json();
	}
	export function useGetSummary() {
		return useSWR<AntonioSummaryResponse>(swrKeys.summary, { fetcher: getSummary, refreshInterval: 60_000 });
	}
	export function refreshSummary() { mutate(swrKeys.summary, undefined) }
	
	export async function vote(req: AntonioResourceVoteRequest) : Promise<AntonioResourceVoteResponse> {
		return fetch(`${baseUrl}/vote.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				id: req.id.toString(),
				type: req.type,
				unvote: !req.unvote ? "1" : "0"
			}).toString()
		});
	}
}