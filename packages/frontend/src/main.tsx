import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./styles/style.css";

import { Provider } from "react-redux";
import { store } from "./store";
import InnerApp from "./InnerApp";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider store={store}>
        <InnerApp />
      </Provider>
    </StrictMode>
  );
}
