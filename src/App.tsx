import { Router } from "./Router";
import "./assets/scss/main.scss";
import { GamesDataProvider } from "./contexts/GamesDataContext";

export const App: React.FC = () => {
	return (
		<GamesDataProvider>
			<Router />
		</GamesDataProvider>
	)
}



