//////////////////////////////
//#region Types

import { envVars } from "../utils/env-vars";

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
export type ListAntonioResourcesResponse = AntonioResourceInfo[];

export interface AntonioResourceVoteRequest {
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface AntonioResourceVoteResponse {}

//////////////////////////////
//#region API Calls
//////////////////////////////
export namespace antonioApi {
	const baseUrl = `${envVars.API_BASE}trackers/antonio`;
	
	export async function list(): Promise<ListAntonioResourcesResponse> {
		return (await fetch(`${baseUrl}/table-json.php`, { method: 'GET' })).json();
	}
	
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