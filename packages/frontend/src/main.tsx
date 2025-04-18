import { StrictMode, useContext } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./styles/style.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import AuthContextProvider from "./context/AuthContext-";
import { Provider } from "react-redux";
import { store } from "./store";
import { AuthContext } from "./context/contexts";
import axios from "axios";
import ZarAPI from "./api";

const baseurl = import.meta.env.VITE_API_URL;
// Create a new router instance
const ax = axios.create({ baseURL: baseurl });
const zarAPI = new ZarAPI(ax);
const router = createRouter({
  routeTree,
  context: { zarAPI, auth: undefined },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useContext(AuthContext);
  if (auth.isLoading === false)
    return <RouterProvider router={router} context={{ auth }} />;
  return (
    <div className="bg-slate-200 min-h-screen">
      <h1>Loading</h1>
    </div>
  );
}
// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthContextProvider zarAPI={zarAPI}>
        <Provider store={store}>
          <InnerApp />
        </Provider>
      </AuthContextProvider>
    </StrictMode>
  );
}
