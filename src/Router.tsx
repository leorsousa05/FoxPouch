import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Home } from "./pages/Home";

const router = createBrowserRouter([{
	path: "/",
	element: <Home />
}])

export const Router = () => {
	return <RouterProvider router={router} />
}
