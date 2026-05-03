//////////////////////////////
//#region Types

import { envVars } from "../utils/env-vars";

//////////////////////////////
interface QuestInfo {
  id: number;
  npcName: string;
  npcPortrait: string;
  npcMap: string;
  votesUp: number;
  votesDown: number;
  isGood: boolean;
  otherServer: string | null;
}

interface ZoneInfo {
  id: number;
  icon: string;
  name: string;
  mapLink: string;
  bossImage: string;
  quests: QuestInfo[];
}

export interface ListSideQuestRequest {}
export interface ListSideQuestResponse {
  restartTracker: {
    id: number;
    votesUp: number;
    votesDown: number;
    resetCount: number;
  };
  zones: ZoneInfo[];
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
export namespace sideQuestApi {
	const baseUrl = `${envVars.API_BASE}trackers/sidequest`;
	
	export async function list(): Promise<ListSideQuestResponse> {
		return (await fetch(`${baseUrl}/quest-table-json.php`, { method: 'GET' })).json();
	}
	
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