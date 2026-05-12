
import { revalidate, useSWR } from "sswr";
import { envVars } from "../utils/env-vars";
import { passagesMock } from "./mock-data/passages-mock";
import { useSwrFetch } from "./utils/api-helpers";

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
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface PassageVoteResponse {}

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-passages"
};
export namespace passagesApi {
	const baseUrl = `${envVars.API_BASE}trackers/passages`;
	
	export async function list(): Promise<ListPassagesResponse> {
		if(envVars.USE_MOCK_DATA) return passagesMock.createListPassagesResponse;
		return (await fetch(`${baseUrl}/zone-table-json.php`, { method: 'GET' })).json();
	}
	export function useList() {
		return useSwrFetch(swrKeys.list, list);
	}
	export function refreshList() { revalidate(swrKeys.list) }
	
	export async function vote(req: PassageVoteRequest) {
		return fetch(`${baseUrl}/vote.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				passage: req.id.toString(),
				type: req.type,
				unvote: !req.unvote ? "1" : "0"
			}).toString()
		});
	}
}