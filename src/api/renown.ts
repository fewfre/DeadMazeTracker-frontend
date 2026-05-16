
import { writable } from "svelte/store";
import { envVars } from "../utils/env-vars";
import { renownMock } from "./mock-data/renown-mock";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse, type SWRFetchOptionsExposed } from "./utils/api-helpers";

//////////////////////////////
//#region Types
//////////////////////////////
export interface FriendshipLocationInfo {
  id: number;
  name: string;
  map: string;
  video: string;
  votesUp: number;
  votesDown: number;
  isGood: boolean;
  isBest: boolean;
}
export interface FriendshipInfo {
  id: number;
  name: string;
  portrait: string;
  points: string;
  locations: FriendshipLocationInfo[];
}

export interface ListRenownDogRequest {}
export type ListRenownDogResponse = { friendships: FriendshipInfo[] };

export interface RenownDogVoteRequest {
  id : number;
  upvote: boolean;
  undo?: boolean;
}
export type RenownDogVoteResponse = ErrorableResponse<{ success:true }>;

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-friends"
};
const refreshKey = writable({ key:"" }); // Hacky way to trigger swr refresh on key change, since sswr global mutate/revalidate doesn't work the same as swr
export namespace renownApi {
	const baseUrl = `${envVars.API_BASE}/renown`;
	
	export async function list(): Promise<ListRenownDogResponse> {
		if(envVars.USE_MOCK_DATA) return renownMock.listRenownDogResponse;
		return (await fetch(`${baseUrl}/list-friendships`, { method: 'GET' })).json();
	}
	export function useList(req:ListRenownDogRequest, options:SWRFetchOptionsExposed={}) {
		const resp = useSwrFetch(swrKeys.list, list, options);
		refreshKey.subscribe(({key}) => { if(key === swrKeys.list) resp.revalidate() });
		return resp;
	}
	export function refreshList() { refreshKey.set({ key:swrKeys.list }) };
	
	export async function vote(req: RenownDogVoteRequest) : Promise<RenownDogVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
}