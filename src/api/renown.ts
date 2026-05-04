//////////////////////////////
//#region Types

import { envVars } from "../utils/env-vars";

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
  icon: string;
  name: string;
  locations: FriendshipLocationInfo[];
}

export interface ListRenownDogRequest {}
export type ListRenownDogResponse = FriendshipInfo[];

export interface RenownDogVoteRequest {
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface RenownDogVoteResponse {}

//////////////////////////////
//#region API Calls
//////////////////////////////
export namespace renownApi {
	const baseUrl = `${envVars.API_BASE}trackers/renown`;
	
	export async function list(): Promise<ListRenownDogResponse> {
		return (await fetch(`${baseUrl}/friendship-table-json.php`, { method: 'GET' })).json();
	}
	
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