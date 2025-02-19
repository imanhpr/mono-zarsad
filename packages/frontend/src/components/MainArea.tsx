import { useContext } from "react";
import { ShowSideBarContext } from "../context/contexts";

export default function MainArea() {
  const { setShowSideBar } = useContext(ShowSideBarContext);
  return (
    <div className="w-full">
      <button onClick={() => setShowSideBar((v) => !v)}>click</button>
    </div>
  );
}
