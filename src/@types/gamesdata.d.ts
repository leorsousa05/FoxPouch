import { SetStateAction } from "react"

export interface GamesData {
	name: string
	path: string
	image: string
}

export interface GamesDataContextType {
	gamesData: GamesData
	setGamesData: Dispatch<SetStateAction<GamesData>>
	gamesDataList: GamesData[]
	setGamesDataList: Dispatch<SetStateAction<gamesDataList>>
}
