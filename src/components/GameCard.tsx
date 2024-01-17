import { FC } from "react";
import { invoke } from "@tauri-apps/api";
import { useGamesDataContext } from "../contexts/GamesDataContext";

interface GameInfo {
	gameImage: string
	gameTitle: string
	gamePath: string
}

export const GameCard: FC<GameInfo> = ({ gameImage, gameTitle, gamePath }) => {

	const { gamesDataList, setGamesDataList } = useGamesDataContext();

	const handleExecute = async () => {
		invoke("execute_game", { path: gamePath })
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.error(e);
			})
	}

	const handleDelete = () => {
		const deletedItemList = gamesDataList.filter(game => game.name !== gameTitle);
		setGamesDataList(deletedItemList);
		localStorage.setItem("games", JSON.stringify(deletedItemList));
	}

	return (
		<div className="gamecard">
			<img className="gamecard__image" src={gameImage} />
			<div className="gamecard__infos">
				<h2 className="gamecard__infos__title">{gameTitle}</h2>
			</div>

			<div className="gamecard__button_group">
				<button onClick={handleExecute} className="gamecard__button_group__button">Start</button>
				<button onClick={handleDelete} className="gamecard__button_group__button delete">Delete</button>
			</div>
		</div>
	)
}
