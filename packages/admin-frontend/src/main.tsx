import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "./index.css";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "react-bootstrap";
import AuthContextProvider from "./context/Auth-Context";
import { UserAPI } from "./api";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./store";

const ax = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});
const userAPI = new UserAPI(ax);
// Create a new router instance
const router = createRouter({ routeTree, context: { userAPI } });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider dir="rtl">
        <AuthContextProvider>
          <Provider store={store}>
            <RouterProvider router={router} />
          </Provider>
        </AuthContextProvider>
      </ThemeProvider>
    </StrictMode>
  );
}
