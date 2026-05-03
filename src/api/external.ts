import { envVars } from "../utils/env-vars";
import { externalMock } from "./mock-data/external-mock";

export interface ProjectListResponse {
	links: Array<{ text:string; href:string; icon?:string; }>;
}

export namespace externalApi {
	export async function fewfreProjectsList(): Promise<ProjectListResponse> {
		if(envVars.USE_MOCK_DATA) return externalMock.createListPassagesResponse;
		return (await fetch("https://projects.fewfre.com/a801/project_list.json", { method: 'GET' })).json();
	}
}