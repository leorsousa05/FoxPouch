import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react";
import { message, open } from "@tauri-apps/api/dialog";
import { useGamesDataContext } from "../contexts/GamesDataContext";
import { GamesData } from "../@types/gamesdata";
import { useApiGamesContext } from "../contexts/ApiGamesContext";
import { SearchInput } from "./SearchInput";
import { ApiGameList } from "../@types/apigames";

interface Props {
	isModalOpen: boolean
	modalSetter: Dispatch<SetStateAction<boolean>>
}


export const AddGameModal = ({ isModalOpen, modalSetter }: Props) => {
	const [gameName, setGameName] = useState<string>("");
	const [gamePath, setGamePath] = useState<string>("");
	const [isGameSelected, setIsGameSelected] = useState<boolean>(false);
	const [isOptionSelected, setIsOptionSelected] = useState<boolean>(true);

	const { setGamesData } = useGamesDataContext();
	const { searchGameOnApi, gameSelection, apiGameList, gameSelected, getHeroOnApi } = useApiGamesContext();

	useEffect(() => setGameName(gameSelected.name), [gameSelected])

	const handleGameName = (e: FormEvent<HTMLInputElement>) => {
		setGameName(e.currentTarget.value);
	};

	const handleSubmit = async () => {

		if (!gamePath && !gameName) {
			message("Fill up all the fields!", { title: "Fields Missing!", type: "warning" })
			return
		}

		const gameImage = await getHeroOnApi();

		modalSetter(!isModalOpen);

		let gameInfo: GamesData = {
			name: gameName.toLowerCase(),
			path: gamePath,
			image: gameImage,
			id: crypto.randomUUID(),
			lastTimePlayed: "Don't played yet",
			timePlayed: 0
		}

		setGamesData(gameInfo);
		setIsGameSelected(false);
		setGameName("");
	}

	const handleFiles = async () => {
		try {
			const selectedPath = await open({
				multiple: false,
				title: "Open Game Executable",
				filters: [{
					name: "Executable",
					extensions: ["exe"]
				}]
			});
			if (selectedPath && typeof selectedPath === "string") {
				setGamePath(selectedPath);
				setIsGameSelected(true);
			}
		} catch (err) {
			setIsGameSelected(false);
			console.error(err);
		}
	}

	const handleInputSearch = async () => {
		if (!gameName) {
			setIsOptionSelected(true);
			return false
		}

		await searchGameOnApi(gameName)
			.catch(e => {
				setIsOptionSelected(true);
				throw new Error(e);
			});

		setIsOptionSelected(false);
	}

	return (
		<div className={`${isModalOpen ? "modal--open" : "modal"}`}>
			<div className="modal__container">
				<label htmlFor="game_name">Search the Game</label>
				<SearchInput onIconClick={handleInputSearch} placeholder="Game Name" onInput={handleGameName} value={gameName} name="gameName" type="text" />
				<datalist id="gameName" role="listbox" className={!isOptionSelected ? "modal__container__gamelist" : "modal__container__gamelist--deactivated"}>
					{apiGameList?.data.map((game: ApiGameList) => (
						<option onClick={(e) => {
							gameSelection(e);
							setIsOptionSelected(true);
						}} value={JSON.stringify(game)} className="modal__container__gamelist__item" key={game.id}>
							{game.name}
						</option>
					))}
				</datalist>

				< label htmlFor="game_file">Game Executable</label>
				<button onClick={handleFiles} className="modal__container__button">Select The Game</button>

				<div className="modal__container__buttons_container">
					<button onClick={handleSubmit} className={isGameSelected && gameSelected.name ? "modal__container__buttons_container__button" : "modal__container__buttons_container__button--disabled"} disabled={isGameSelected && gameSelected.id ? false : true} >Add Game</button>
					<button onClick={() => modalSetter(!isModalOpen)} className="modal__container__buttons_container__button close">Close</button>
				</div>
			</div>
		</div >
	)
}
