import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { GameCard } from "./GameCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddGameModal } from "./AddGameModal";
import { useState } from "react";
import { useGamesDataContext } from "../contexts/GamesDataContext";

export const GameList = () => {

	const { gamesDataList } = useGamesDataContext();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	return (
		<div className="gamelist">
			{gamesDataList?.map((game, id) => (
				<GameCard gameImage={game.image} gameTitle={game.name} gamePath={game.path} key={id} />
			))}

			<AddGameModal isModalOpen={isModalOpen} modalSetter={setIsModalOpen} />
			<button onClick={() => setIsModalOpen(!isModalOpen)} className={isModalOpen ? "gamelist__addbutton open" : "gamelist__addbutton"}>
				< FontAwesomeIcon icon={faPlus} />
			</button>
		</div >
	)
}
