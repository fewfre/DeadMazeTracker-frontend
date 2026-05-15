
import { revalidate } from "sswr";
import { envVars } from "../utils/env-vars";
import { passagesMock } from "./mock-data/passages-mock";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse, type SWRFetchOptionsExposed } from "./utils/api-helpers";

//////////////////////////////
//#region Types
//////////////////////////////
export interface PassageZoneInfo {
  id: number;
  icon: string;
  name: string;
  mapLink: string;
  bossImage: string;
  passages: PassageInfo[];
}
export interface PassageInfo {
  id: number;
  name: string;
  altName: string;
  votesUp: number;
  votesDown: number;
  broken: boolean;
  openOneRoundAgo: boolean;
  openTwoRoundsAgo: boolean;
}

export interface ListPassagesRequest {}
export type ListPassagesResponse = { zones:PassageZoneInfo[]; };

export interface PassageVoteRequest {
  id : number;
  upvote: boolean;
  undo?: boolean;
}
export type PassageVoteResponse = ErrorableResponse<{ success:true }>;

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-passages"
};
export namespace passagesApi {
	const baseUrl = `${envVars.API_BASE}/passages`;
	
	export async function list(): Promise<ListPassagesResponse> {
		if(envVars.USE_MOCK_DATA) return passagesMock.createListPassagesResponse;
		return (await fetch(`${baseUrl}/list-passages`, { method: 'GET' })).json();
	}
	export function useList(req:ListPassagesRequest, options:SWRFetchOptionsExposed={}) {
		return useSwrFetch(swrKeys.list, list, options);
	}
	export function refreshList() { revalidate(swrKeys.list, list) }
	
	export async function vote(req: PassageVoteRequest) : Promise<PassageVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
}