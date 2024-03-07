import { FC, FormEvent, ReactNode, createContext, useContext, useState } from "react";
import { fetch } from "@tauri-apps/api/http";
import { ApiGameImageResponse, ApiGameList, ApiGameSearchResponse, ApiGamesContext } from "../@types/apigames";

export const apiGamesContext = createContext<ApiGamesContext | undefined>(undefined);

export const ApiGamesProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const token = "Bearer 1af35c2d58e1f8be97a5ac03d38eebf7";
	const [apiGameList, setApiGameList] = useState<ApiGameSearchResponse>({ data: [] });
	const [gameSelected, setGameSelected] = useState<ApiGameList>({
		id: 0,
		name: "",
		verified: false,
		types: []
	});

	const searchGameOnApi = async (gameName: string) => {

		setApiGameList({ data: [] });

		const response = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${gameName}`, {
			method: "GET",
			headers: {
				'authorization': token,
			}
		})

		if (!response.ok) {
			throw new Error(`Http error! status: ${response.status}`)
		}

		const data = await response.data as ApiGameSearchResponse;

		if (data.data.length === 0) {
			throw new Error("Game not found!");
		}

		setApiGameList(data);
	}

	const getHeroOnApi = async () => {
		const response = await fetch(`https://www.steamgriddb.com/api/v2/grids/game/${gameSelected.id}?dimensions=920x430,460x215,512x512,1024x1024,342x482`, {
			method: "GET",
			headers: {
				"authorization": token,
			}
		});

		if (!response.ok) {
			throw new Error(`Http error! status: ${response.status}`)
		}

		if (response.status === 404) {
			throw new Error(`Game not found!`);
		}

		const data = await response.data as ApiGameImageResponse;
		return data.data[0].url

	}

	const gameSelection = (event: FormEvent<HTMLInputElement>) => {
		setGameSelected(JSON.parse(event.currentTarget.value));
		console.log(gameSelected);
	}

	return (
		<apiGamesContext.Provider value={{ apiGameList, setApiGameList, searchGameOnApi, gameSelection, gameSelected, getHeroOnApi }}>
			{children}
		</apiGamesContext.Provider>
	)
}

export const useApiGamesContext = () => {
	const context = useContext(apiGamesContext);
	if (!context) {
		throw new Error('useMyContext must be used within a MyProvider');
	}
	return context;
};
