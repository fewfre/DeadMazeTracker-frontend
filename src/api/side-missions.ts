import { get, writable, type Readable } from "svelte/store";
import { envVars } from "../utils/env-vars";
import { sideMissionMock } from "./mock-data/side-missions-mock";
import { standardJsonPostFetch, useSwrFetch, type ErrorableResponse, type SWRFetchOptionsExposed } from "./utils/api-helpers";

//////////////////////////////
//#region Types
//////////////////////////////
export interface SideMissionInfo {
  id: number;
  npcName: string;
  npcPortrait: string;
  npcMap: string;
  votesUp: number;
  votesDown: number;
  isGood: boolean;
  otherServer: string | null;
}

export interface SideMissionZoneInfo {
  id: number;
  icon: string;
  name: string;
  mapLink: string;
  bossImage: string;
  missions: SideMissionInfo[];
}

export interface SideMissionRestartTrackerInfo {
    id: number;
    votesUp: number;
    votesDown: number;
    resetCount: number;
}

export interface ListSideMissionsRequest { server:string; }
export interface ListSideMissionsResponse {
  zones: SideMissionZoneInfo[];
  restartTracker: SideMissionRestartTrackerInfo;
}

// Vote

export interface SideMissionVoteRequest {
  id : number;
  upvote: boolean;
  undo?: boolean;
  server?:string;
}
export type SideMissionVoteResponse = ErrorableResponse<{ success:true }>;

// Restart Server

export interface SideMissionVoteRestartRequest {
  upvote: boolean;
  undo?: boolean;
}
export type SideMissionVoteRestartResponse = ErrorableResponse<{ success:true }>;

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-side-missions"
};
const refreshKey = writable({ key:"" }); // Hacky way to trigger swr refresh on key change, since sswr global mutate/revalidate doesn't work the same as swr
export namespace sideMissionApi {
	const baseUrl = `${envVars.API_BASE}/side-missions`;
	
	export async function list(req:Readable<ListSideMissionsRequest>): Promise<ListSideMissionsResponse> {
		if(envVars.USE_MOCK_DATA) return sideMissionMock.listSideMissionsResponse;
		return (await fetch(`${baseUrl}/list-side-missions?server=${get(req).server}`, { method: 'GET' })).json();
	}
	export function useList(req:Readable<ListSideMissionsRequest>, options:SWRFetchOptionsExposed={}) {
		const resp = useSwrFetch(swrKeys.list, ()=>list(req), options);
		req.subscribe(() => resp.revalidate()); // Trigger refresh if request changes
		refreshKey.subscribe(({key}) => { if(key === swrKeys.list) resp.revalidate() });
		return resp;
	}
	export function refreshList(server:string) { refreshKey.set({ key:swrKeys.list }) };
	
	export async function vote(req: SideMissionVoteRequest) : Promise<SideMissionVoteResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote`, req);
	}
	
	export async function voteForRestart(req: SideMissionVoteRestartRequest) : Promise<SideMissionVoteRestartResponse> {
		return standardJsonPostFetch(`${baseUrl}/vote-restart`, req);
	}
}