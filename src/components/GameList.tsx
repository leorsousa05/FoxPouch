import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GameCard } from "./GameCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddGameModal } from "./AddGameModal";
import { useEffect, useState } from "react";

export interface GamesData {
	name: string
	path: string
	image: string
}

export const GameList = () => {

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [gamesList, setGamesList] = useState<GamesData[]>([]);
	const [gameData, setGameData] = useState<GamesData>({
		name: "",
		path: "",
		image: ""
	});
	const [localGamesList, setLocalGamesList] = useState<GamesData[]>(() => {
		const localGamesListString: string | null = localStorage.getItem("games");
		return localGamesListString ? JSON.parse(localGamesListString) : [];
	})

	useEffect(() => {
		let tempGameData = {
			name: gameData.name,
			path: gameData.path,
			image: gameData.image
		}

		if (tempGameData.name === "" && tempGameData.path === "", tempGameData.image == "") {
			return
		}

		if (localGamesList) {
			let gamesList = localGamesList;
			gamesList.push(tempGameData);
			setLocalGamesList(gamesList);
			localStorage.setItem("games", JSON.stringify(localGamesList));
			return
		}

		let arrOfGames: object[] = [];

		arrOfGames.push(tempGameData);

		localStorage.setItem("games", JSON.stringify(arrOfGames));

	}, [gameData])

	useEffect(() => {
		const localGamesList = localStorage.getItem("games");

		if (localGamesList) {
			let parsedLocalGamesList = JSON.parse(localGamesList);
			setGamesList(parsedLocalGamesList);
		}
	}, [gameData, localGamesList])

	return (
		<div className="gamelist">
			{gamesList?.map((game, id) => (
				<GameCard localGamesList={localGamesList} localGamesListSetter={setLocalGamesList} gameImage={game.image} gameTitle={game.name} gamePath={game.path} key={id} />
			))}

			<AddGameModal gameDataSetter={setGameData} isModalOpen={isModalOpen} modalSetter={setIsModalOpen} />
			<button onClick={() => setIsModalOpen(!isModalOpen)} className="gamelist__addbutton">
				<FontAwesomeIcon icon={faPlus} />
			</button>
		</div>
	)
}
