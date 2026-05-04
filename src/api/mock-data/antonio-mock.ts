import type { AntonioSummaryResponse, ListAntonioResourcesResponse } from "../antonio";

export namespace antonioMock {
	export const summaryResponse: AntonioSummaryResponse = {
		valid: true,
		num: 123,
		icon: "https://vignette.wikia.nocookie.net/deadmaze/images/4/47/Sacramento_Suburbs_icon.png/revision/latest",
		rep: 456
	};
	
	export const listResourcesResponse: ListAntonioResourcesResponse = {
		resources:[
			{ id: 1, name: "Sacramento Suburbs", icon: "https://vignette.wikia.nocookie.net/deadmaze/images/4/47/Sacramento_Suburbs_icon.png/revision/latest",
				votesUp: 10, votesDown: 2, isGood: true, isBest: false },
		]
	}
}