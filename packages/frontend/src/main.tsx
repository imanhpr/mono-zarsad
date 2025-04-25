import { StrictMode, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./styles/style.css";

import { routeTree } from "./routeTree.gen";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "./store";
import { zarApiInstance } from "./api";
import LoadingSpinnerPage from "./components/LoadingSpinner";
import { AuthState, refreshAccessToken } from "./store/auth.slice";
import { AnimatePresence, motion } from "motion/react";

const rootElement = document.getElementById("root")!;

const router = createRouter({
  routeTree,
  context: { zarAPI: zarApiInstance },
});

function InnerApp() {
  const status = useSelector((state: { auth: AuthState }) => state.auth.status);
  const dispatch = useDispatch();
  useEffect(() => {
    if (status === "idle") {
      dispatch(refreshAccessToken());
    }
  }, [status, dispatch]);

  return (
    <AnimatePresence>
      {status === "loading" && (
        <motion.div
          key="loading"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            hidden: { y: 50, scale: 1, opacity: 0 },
            visible: { y: 0, scale: 1, opacity: 1 },
          }}
        >
          <LoadingSpinnerPage />
        </motion.div>
      )}
      {status === "success" && <RouterProvider router={router} />}
    </AnimatePresence>
  );
}

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

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
