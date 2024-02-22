import { FC, FormEventHandler, InputHTMLAttributes, MouseEventHandler } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	placeholder: string;
	onInput: FormEventHandler<HTMLInputElement>;
	onIconClick: MouseEventHandler<SVGSVGElement>;
	value: string;
	name: string;
	type: string;
}

export const SearchInput: FC<InputProps> = ({ placeholder, onInput, onIconClick, value, name, type }) => {
	return (
		<div className="search_input">
			<input placeholder={placeholder} list="" onInput={onInput} value={value} name={name} className="search_input__input" type={type} />
			<FontAwesomeIcon onClick={onIconClick} className="search_input__icon" icon={faSearch} />
		</div>
	)
}
