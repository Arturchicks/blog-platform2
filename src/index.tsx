import ReactDOM from "react-dom/client"
import { router } from "./app/routing"
import { RouterProvider } from "react-router-dom"
import { Provider } from "react-redux"
import { store } from "./shared/redux"
import "./index.css"
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
