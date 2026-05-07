import { mutate, useSWR } from "sswr";
import { envVars } from "../utils/env-vars";
import { sideQuestMock } from "./mock-data/sidequest-mock";

//////////////////////////////
//#region Types
//////////////////////////////
export interface QuestInfo {
  id: number;
  npcName: string;
  npcPortrait: string;
  npcMap: string;
  votesUp: number;
  votesDown: number;
  isGood: boolean;
  otherServer: string | null;
}

export interface QuestZoneInfo {
  id: number;
  icon: string;
  name: string;
  mapLink: string;
  bossImage: string;
  quests: QuestInfo[];
}

export interface SideQuestRestartTrackerInfo {
    id: number;
    votesUp: number;
    votesDown: number;
    resetCount: number;
}

export interface ListSideQuestRequest { server:string; }
export interface ListSideQuestResponse {
  restartTracker: SideQuestRestartTrackerInfo;
  zones: QuestZoneInfo[];
}

export interface SideQuestVoteRequest {
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface SideQuestVoteResponse {}

export interface SideQuestVoteRestartRequest {
  id : string | number;
  type: "up" | "down";
  unvote?: boolean;
}
export interface SideQuestVoteRestartResponse {}

//////////////////////////////
//#region API Calls
//////////////////////////////
const swrKeys = {
	list: "list-side-quests"
};
export namespace sideQuestApi {
	const baseUrl = `${envVars.API_BASE}trackers/sidequest`;
	
	export async function list(req:ListSideQuestRequest): Promise<ListSideQuestResponse> {
		if(envVars.USE_MOCK_DATA) return sideQuestMock.listSideQuestResponse;
		return (await fetch(`${baseUrl}/quest-table-json.php?server=${req.server}`, { method: 'GET' })).json();
	}
	export function useList(req:ListSideQuestRequest) {
		return useSWR<ListSideQuestResponse>(`${swrKeys.list}-${req.server}`, { fetcher: list });
	}
	export function refreshList(server:string) { mutate(`${swrKeys.list}-${server}`, undefined) }
	
	export async function vote(req: SideQuestVoteRequest) : Promise<SideQuestVoteResponse> {
		return fetch(`${baseUrl}/vote.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				quest: req.id.toString(),
				type: req.type,
				unvote: !req.unvote ? "1" : "0"
			}).toString()
		});
	}
	
	export async function voteForRestart(req: SideQuestVoteRestartRequest) : Promise<SideQuestVoteRestartResponse> {
		return fetch(`${baseUrl}/vote_restart.php`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				type: req.type,
				unvote: !req.unvote ? "1" : "0"
			}).toString()
		});
	}
}