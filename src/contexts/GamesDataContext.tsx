import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react"
import { GamesData, GamesDataContextType } from "../@types/gamesdata";

export const GamesDataContext = createContext<GamesDataContextType | undefined>(undefined);

export const GamesDataProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [gamesDataList, setGamesDataList] = useState<GamesData[]>(() => {
		const localGamesDataListString: string | null = localStorage.getItem("games");
		return localGamesDataListString ? JSON.parse(localGamesDataListString) : [];
	});
	const [gamesData, setGamesData] = useState<GamesData>({
		name: "",
		path: "",
		image: "",
	});

	useEffect(() => {

		const tempGameData: GamesData = {
			name: gamesData.name,
			path: gamesData.path,
			image: gamesData.image
		}

		if (Object.values(tempGameData).every(value => value === "")) {
			return;
		}

		setGamesDataList((previous) => {
			const newState = [...previous, tempGameData];
			localStorage.setItem("games", JSON.stringify(newState));
			return newState;
		});

	}, [gamesData]);

	return (
		<GamesDataContext.Provider value={{ gamesData, gamesDataList, setGamesData, setGamesDataList }}>
			{children}
		</GamesDataContext.Provider>
	)
}

export const useGamesDataContext = () => {
	const context = useContext(GamesDataContext);
	if (!context) {
		throw new Error('useMyContext must be used within a MyProvider');
	}
	return context;
};
