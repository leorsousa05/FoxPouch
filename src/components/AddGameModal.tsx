import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { message, open } from "@tauri-apps/api/dialog";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { useGamesDataContext } from "../contexts/GamesDataContext";

interface Props {
	isModalOpen: boolean
	modalSetter: Dispatch<SetStateAction<boolean>>
}

export const AddGameModal = ({ isModalOpen, modalSetter }: Props) => {
	const [gameName, setGameName] = useState<string>("");
	const [gamePath, setGamePath] = useState<string>("");
	const [gameImage, setGameImage] = useState<string>("");
	const [isGameSelected, setIsGameSelected] = useState<boolean>(false);
	const [isImageSelected, setIsImageSelected] = useState<boolean>(false);
	const { setGamesData } = useGamesDataContext();

	const handleGameName = (e: FormEvent<HTMLInputElement>) => {
		setGameName(e.currentTarget.value);
	}

	const handleSubmit = () => {


		if (!gamePath && !gameName) {
			message("Fill up all the fields!", { title: "Fields Missing!", type: "warning" })
			return
		}

		modalSetter(!isModalOpen);

		let gameInfo = {
			name: gameName.toLowerCase(),
			path: gamePath,
			image: gameImage
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
			});
			if (selectedPath && typeof selectedPath === "string") {
				setGamePath(selectedPath);
			}
			setIsGameSelected(true);
		} catch (err) {
			setIsGameSelected(false);
			console.error(err);
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
			}
			setIsImageSelected(true);
		} catch (err) {
			setIsImageSelected(false);
			console.error(err);
		}
	}

	return (
		<div className={`modal ${isModalOpen ? "open" : ""}`}>
			<div className="modal__container">
				<label htmlFor="game_name">Game Name</label>
				<input onInput={handleGameName} value={gameName} name="game_name" className="modal__container__text_input" type="text" />

				<label htmlFor="game_file">Game Executable</label>
				<button onClick={handleFiles} className="modal__container__button">Select The Game</button>
				<p className="modal__container__selected_input">{isGameSelected && "Game Selected"}</p>

				<label htmlFor="game_image">Game Image</label>
				<button onClick={handleImage} className="modal__container__button">Select The Image</button>
				<p className="modal__container__selected_input">{isImageSelected && "Image Selected"}</p>

				<div className="modal__container__buttons_container">
					<button onClick={handleSubmit} className="modal__container__buttons_container__button">Add Game</button>
					<button onClick={() => modalSetter(!isModalOpen)} className="modal__container__buttons_container__button">Close</button>
				</div>
			</div>
		</div>
	)
}
