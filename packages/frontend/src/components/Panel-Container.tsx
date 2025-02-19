import { Link } from "@tanstack/react-router";
import { Fragment } from "react";

export default function PanelContainer() {
  return (
    <Fragment>
      <div className="bg-slate-200 min-h-screen">
        <h1>به پنل زرصــاد خوش آمدید</h1>
        <Link to="/auth/logout" replace={true}>
          Logout
        </Link>
        <br />
        <Link to="/about">About</Link>
      </div>
    </Fragment>
  );
}
