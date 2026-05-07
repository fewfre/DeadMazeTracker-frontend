
import { mutate, useSWR } from "sswr";
import { envVars } from "../utils/env-vars";
import { renownMock } from "./mock-data/renown-mock";

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
export type ListRenownDogResponse = { friends: FriendshipInfo[] };

export interface RenownDogVoteRequest {
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface RenownDogVoteResponse {}

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-friends"
};
export namespace renownApi {
	const baseUrl = `${envVars.API_BASE}trackers/renown`;
	
	export async function list(): Promise<ListRenownDogResponse> {
		if(envVars.USE_MOCK_DATA) return renownMock.listRenownDogResponse;
		return (await fetch(`${baseUrl}/friendship-table-json.php`, { method: 'GET' })).json();
	}
	export function useList() {
		return useSWR<ListRenownDogResponse>(swrKeys.list, { fetcher: list });
	}
	export function refreshList() { mutate(swrKeys.list, undefined) }
	
	export async function vote(req: RenownDogVoteRequest) : Promise<RenownDogVoteResponse> {
		return fetch(`${baseUrl}/vote.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				location_id: req.id.toString(),
				type: req.type,
				unvote: !req.unvote ? "1" : "0"
			}).toString()
		});
	}
}