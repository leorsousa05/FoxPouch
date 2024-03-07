import { SetStateAction } from "react"

export interface ApiGameList {
	id: number,
	name: string,
	verified: boolean,
	types: []
}

export interface ApiGameImageList {
	id: number,
	url: string
}

export interface ApiGameImageResponse {
	data: ApiGameImageList[]
}

export interface ApiGameSearchResponse {
	data: ApiGameList[]
}

export interface ApiGamesContext {
	apiGameList: ApiGameSearchResponse,
	setApiGameList: Dispatch<SetStateAction<ApiResponse>>,
	gameSelected: ApiGameList,
	getHeroOnApi(): Promise<string>,
	gameSelection(event: FormEvent<HTMLInputElement>): void,
	searchGameOnApi(gameName: string): Promise<any>
}
