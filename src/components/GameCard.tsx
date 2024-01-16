import { GamesData } from "./GameList";
import { Dispatch, SetStateAction } from "react";
import { invoke } from "@tauri-apps/api";

interface Props {
	gameImage: string
	gameTitle: string
	gamePath: string
	localGamesList: GamesData[]
	localGamesListSetter: Dispatch<SetStateAction<GamesData[]>>
}

export const GameCard: React.FC<Props> = ({ gameImage, gameTitle, gamePath, localGamesList, localGamesListSetter }: Props) => {


	const handleExecute = async () => {
		console.log(gamePath);
		invoke("execute_game", { path: gamePath })
			.then((res) => {
				console.log(res);
			})
			.catch((e) => {
				console.error(e);
			})
	}

	const handleDelete = () => {
		const deletedItemList = localGamesList.filter(game => game.name !== gameTitle);
		localGamesListSetter(deletedItemList);
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
				<button onClick={handleDelete} className="gamecard__button_group__button">Delete</button>
			</div>
		</div>
	)
}
