import { PropsWithChildren, useState } from "react";
import { modalCtx } from "./ctx";

export default function ModalContextProvider({ children }: PropsWithChildren) {
  const [display, setDisplay] = useState<boolean>(false);
  const toggleDisplay = () => setDisplay((prev) => !prev);

  return (
    <modalCtx.Provider value={{ display, toggleDisplay, setDisplay }}>
      {children}
    </modalCtx.Provider>
  );
}
