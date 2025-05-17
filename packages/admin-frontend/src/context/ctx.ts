import { createContext } from "react";

export const sidebarCtx = createContext<{
  display: boolean;
  toggleDisplay: () => void;
}>({
  toggleDisplay: () => {},
  display: false,
});

export const modalCtx = createContext<{
  display: boolean;
  toggleDisplay: () => void;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  toggleDisplay: () => {},
  setDisplay: () => {},
  display: false,
});
