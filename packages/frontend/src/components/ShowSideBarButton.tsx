import { useContext, memo } from "react";
import { ShowSideBarContext } from "../context/contexts";

function ShowSideBarButton() {
  const { setShowSideBar } = useContext(ShowSideBarContext);
  function sideBarBtnClickHandler() {
    setShowSideBar((v) => !v);
  }
  return (
    <div className="my-2">
      <button
        onClick={sideBarBtnClickHandler}
        className="bg-slate-600 px-4 py-2 rounded text-white cursor-pointer"
      >
        X
      </button>
    </div>
  );
}

export default memo(ShowSideBarButton);
