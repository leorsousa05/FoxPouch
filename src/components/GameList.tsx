import { faPlus, faGrip, faList } from "@fortawesome/free-solid-svg-icons";
import { GameCard } from "./GameCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddGameModal } from "./AddGameModal";
import { useState } from "react";
import { useGamesDataContext } from "../contexts/GamesDataContext";

export enum OrientationModes {
	GridMode,
	ListMode
}

export const GameList = () => {

	const { gamesDataList } = useGamesDataContext();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [orientationMode, setOrientationMode] = useState<OrientationModes>(OrientationModes.GridMode);

	return (
		<div className="gamelist">
			<div className="gamelist__statusline">
				<p>All Games ({gamesDataList.length}):</p>

				<div className="gamelist__statusline__orientation">
					<div className={orientationMode === OrientationModes.GridMode ? "gamelist__statusline__orientation__item--active" : "gamelist__statusline__orientation__item"} onClick={() => setOrientationMode(OrientationModes.GridMode)}>
						<FontAwesomeIcon className="gamelist__statusline__orientation__item__icon" icon={faGrip} />
					</div>
					<div className={orientationMode === OrientationModes.ListMode ? "gamelist__statusline__orientation__item--active" : "gamelist__statusline__orientation__item"} onClick={() => setOrientationMode(OrientationModes.ListMode)}>
						<FontAwesomeIcon className="gamelist__statusline__orientation__item__icon" icon={faList} />
					</div>
				</div>
			</div>

			<div className={orientationMode === OrientationModes.ListMode ? "gamelist__list--listmode" : "gamelist__list"}>
				{gamesDataList?.map((game) => (
					<GameCard orientation={orientationMode} image={game.image} name={game.name} path={game.path} id={game.id} lastTimePlayed={game.lastTimePlayed} key={game.id} />
				))}
			</div>

			<AddGameModal isModalOpen={isModalOpen} modalSetter={setIsModalOpen} />
			<button onClick={() => setIsModalOpen(!isModalOpen)} className={isModalOpen ? "gamelist__addbutton open" : "gamelist__addbutton"}>
				< FontAwesomeIcon icon={faPlus} />
			</button>
		</div >
	)
}
