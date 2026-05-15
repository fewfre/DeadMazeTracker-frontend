import { envVars } from "../utils/env-vars";
import { externalMock } from "./mock-data/external-mock";

export interface ProjectListResponse {
	links: Array<{ text:string; href:string; icon?:string; }>;
}

export namespace externalApi {
	export async function fewfreProjectsList(): Promise<ProjectListResponse> {
		if(envVars.USE_MOCK_DATA) return externalMock.createListPassagesResponse;
		return (await fetch(envVars.PROJECTS_JSON_URL, { method: 'GET' })).json();
	}
}