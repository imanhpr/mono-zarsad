import LoadingSpinnerPage from "./components/LoadingSpinnerPage";
import { refreshAccessToken } from "./store/auth.slice";
import { AnimatePresence, motion } from "motion/react";
import { useAppDispatch, useAppSelector } from "./hooks/redux-hooks";
import { useEffect } from "react";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import zarApiInstance from "./api";

const router = createRouter({
  routeTree,
  context: { zarAPI: zarApiInstance },
});

export default function InnerApp() {
  const status = useAppSelector((state) => state.auth.status);
  const dispatch = useAppDispatch();
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

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
