
import { revalidate } from "sswr";
import { envVars } from "../utils/env-vars";
import { renownMock } from "./mock-data/renown-mock";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse } from "./utils/api-helpers";

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
export namespace renownApi {
	const baseUrl = `${envVars.API_BASE}/renown`;
	
	export async function list(): Promise<ListRenownDogResponse> {
		if(envVars.USE_MOCK_DATA) return renownMock.listRenownDogResponse;
		return (await fetch(`${baseUrl}/list-friendships`, { method: 'GET' })).json();
	}
	export function useList() {
		return useSwrFetch(swrKeys.list, list);
	}
	export function refreshList() { revalidate(swrKeys.list) }
	
	export async function vote(req: RenownDogVoteRequest) : Promise<RenownDogVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
}