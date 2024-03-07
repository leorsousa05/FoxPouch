import { Router } from "./Router";
import "./assets/scss/main.scss";
import { ApiGamesProvider } from "./contexts/ApiGamesContext";
import { GamesDataProvider } from "./contexts/GamesDataContext";

export const App: React.FC = () => {
	return (
		<GamesDataProvider>
			<ApiGamesProvider>
				<Router />
			</ApiGamesProvider>
		</GamesDataProvider>
	)
}



