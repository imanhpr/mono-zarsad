import { createContext } from "react";

export const sidebarCtx = createContext<{
  display: boolean;
  toggleDisplay: () => void;
}>({
  toggleDisplay: () => {},
  display: false,
});
