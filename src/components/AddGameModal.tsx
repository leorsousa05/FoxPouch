import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { message, open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useGamesDataContext } from "../contexts/GamesDataContext";
import { ApiGameList, GamesData } from "../@types/gamesdata";
import { SearchInput } from "./SearchInput";
import { fetch } from "@tauri-apps/api/http";

interface Props {
	isModalOpen: boolean
	modalSetter: Dispatch<SetStateAction<boolean>>
}

interface ApiResponse {
	data: ApiGameList[]
}

export const AddGameModal = ({ isModalOpen, modalSetter }: Props) => {
	const [gameName, setGameName] = useState<string>("");
	const [gamePath, setGamePath] = useState<string>("");
	const [gameImage, setGameImage] = useState<string>("");
	const [isOptionSelected, setIsOptionSelected] = useState<boolean>(false);
	const [apiGameList, setApiGameList] = useState<ApiResponse>();
	const [isGameSelected, setIsGameSelected] = useState<boolean>(false);
	const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
	const { setGamesData } = useGamesDataContext();

	const handleGameName = (e: FormEvent<HTMLInputElement>) => {
		setGameName(e.currentTarget.value);
	};

	const handleGameSelection = (e: FormEvent<HTMLOptionElement>) => {
		const game: ApiGameList = JSON.parse(e.currentTarget.value);
		setGameName(game.name);
		setIsOptionSelected(prev => !prev);
	};

	const handleSubmit = () => {

		if (!gamePath && !gameName) {
			message("Fill up all the fields!", { title: "Fields Missing!", type: "warning" })
			return
		}

		modalSetter(!isModalOpen);

		let gameInfo: GamesData = {
			name: gameName.toLowerCase(),
			path: gamePath,
			image: gameImage,
			id: crypto.randomUUID(),
			lastTimePlayed: "Don't played yet"
		}

		setGamesData(gameInfo);
		setIsGameSelected(false);
		setIsImageSelected(false);
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

	const handleGameSearch = async () => {

		const token = "1af35c2d58e1f8be97a5ac03d38eebf7";

		const response = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${gameName}`, {
			method: "GET",
			headers: {
				'authorization': `Bearer ${token}`
			}
		})

		if (!response.ok) {
			throw new Error(`Http error! status: ${response.status}`)
		} else {
			const data = await response.data as ApiResponse;
			setApiGameList(data);
			setIsOptionSelected(false);
		}
	}

	const handleImage = async () => {
		try {
			const selectedPath = await open({
				multiple: false,
				title: "Select the game image",
				filters: [{
					name: "Image",
					extensions: ["png", "jpeg", "jpg", "webp"]
				}]
			});
			if (selectedPath && typeof selectedPath === "string") {
				setGameImage(convertFileSrc(selectedPath));
				setIsImageSelected(true);
			}
		} catch (err) {
			setIsImageSelected(false);
			console.error(err);
		}
	}

	return (
		<div className={`${isModalOpen ? "modal--open" : "modal"}`}>
			<div className="modal__container">
				<label htmlFor="game_name">Search the Game</label>
				<SearchInput onIconClick={handleGameSearch} placeholder="Game Name" onInput={handleGameName} value={gameName} name="gameName" type="text" />
				<datalist id="gameName" role="listbox" className={!isOptionSelected ? "modal__container__gamelist" : "modal__container__gamelist--deactivated"}>
					{apiGameList?.data.map(game => (
						<option onClick={handleGameSelection} value={JSON.stringify(game)} className="modal__container__gamelist__item" key={game.id}>
							{game.name}
						</option>
					))}
				</datalist>

				<label htmlFor="game_file">Game Executable</label>
				<button onClick={handleFiles} className="modal__container__button">Select The Game</button>
				<p className="modal__container__selected_input">{isGameSelected && "Game Selected"}</p>

				<label htmlFor="game_image">Game Image</label>
				<button onClick={handleImage} className="modal__container__button">Select The Image</button>
				<p className="modal__container__selected_input">{isImageSelected && "Image Selected"}</p>

				<div className="modal__container__buttons_container">
					<button onClick={handleSubmit} className="modal__container__buttons_container__button">Add Game</button>
					<button onClick={() => modalSetter(!isModalOpen)} className="modal__container__buttons_container__button close">Close</button>
				</div>
			</div>
		</div>
	)
}
