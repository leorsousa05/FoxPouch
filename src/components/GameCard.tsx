import { FC, useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useGamesDataContext } from "../contexts/GamesDataContext";
import { GamesData } from "../@types/gamesdata";
import { OrientationModes } from "./GameList";
import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
	orientation: OrientationModes
}

export const GameCard: FC<GamesData & Props> = ({ image, name, path, id, lastTimePlayed, timePlayed, orientation }) => {

	const { gamesDataList, setGamesDataList } = useGamesDataContext();
	const [tempTimePlayed, setTempTimePlayed] = useState<number>(0);

	const hasExecuted = useRef(false);

	const handleExecute = async () => {
		await invoke("execute_game", { path })
			.then((res: string | unknown) => {
				console.log("Executado!")
				if (typeof res === "string") {
					setTempTimePlayed(parseInt(res));
				}
			})
			.catch((e) => {
				console.error(e);
			});

		hasExecuted.current = true;
	}

	useEffect(() => {
		if (!hasExecuted.current) {
			return
		}

		let game = gamesDataList.find((game) => game.id === id);
		const gameListWithoutUpdatedGame = gamesDataList.filter((game) => game.id !== id);

		const currentDate = new Date();

		const currentDayOfMonth = currentDate.getDate();
		const currentMonth = currentDate.getMonth();
		const currentYear = currentDate.getFullYear();
		const currentHour = currentDate.getHours();
		const currentMinutes = currentDate.getMinutes();

		if (game) {
			game.lastTimePlayed = currentDayOfMonth + "/" + ((currentMonth + 1) < 10 ? "0" : "") + (currentMonth + 1) + "/" + currentYear + " - " + currentHour + ":" + (currentMinutes < 10 ? "0" + currentMinutes : currentMinutes);

			if (tempTimePlayed) {
				game.timePlayed += tempTimePlayed;
			}

			gameListWithoutUpdatedGame.push(game);
		}


		setGamesDataList(gameListWithoutUpdatedGame);
	}, [tempTimePlayed])

	const handleDelete = () => {
		const deletedGame = gamesDataList.filter(game => game.id !== id);
		setGamesDataList(deletedGame);
	}

	switch (orientation) {
		case OrientationModes.GridMode:
			return (
				<div className="gamecard--grid">
					<img className="gamecard__image" src={image} />

					<div className="gamecard__container">
						<div className="gamecard__container__infos">
							<h2 className="gamecard__container__infos__title">{name}</h2>
							<h2 className="gamecard__container__infos__time">Last Time Played: <br /> {lastTimePlayed}</h2>
						</div>

						<div className="gamecard__container__button_group">
							<button onClick={handleExecute} className="gamecard__container__button_group__button">Start</button>
							<button onClick={handleDelete} className="gamecard__container__button_group__button--delete">Delete</button>
						</div>
					</div>
				</div>
			)
		case OrientationModes.ListMode:
			return (
				<div className="gamecard--list">
					<img className="gamecard__image" src={image} />

					<div className="gamecard__container">
						<div className="gamecard__container__infos">
							<h2 className="gamecard__container__infos__title">{name}</h2>
							<div className="gamecard__container__infos__items">
								<h2 className="gamecard__container__infos__items">Last Time Played: <br /> {lastTimePlayed}</h2>
								<h2 className="gamecard__container__infos__items">Elapsed Time Played: <br /> {timePlayed ? ((timePlayed / 60) / 60).toFixed(2) + "h" : "Play Now!"}</h2>
							</div>
						</div>
						<div className="gamecard__container__button_group">
							<button onClick={handleDelete} className="gamecard__container__button_group__button--delete">
								<FontAwesomeIcon className="gamecard__container__button_group__button__icon--delete" icon={faTrash} />
							</button>
							<button onClick={handleExecute} className="gamecard__container__button_group__button">
								<FontAwesomeIcon className="gamecard__container__button_group__button__icon" icon={faPlay} />
							</button>
						</div>
					</div>

				</div>

			)
	}

}
