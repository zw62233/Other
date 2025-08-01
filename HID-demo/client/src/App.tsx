import React, { ReactElement, FC } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import HeaderComponent from "./components/layout/HeaderComponent";

const App: FC = (): ReactElement => {
  return (
    <React.Fragment>
      <div className="app-container">
        <div className="hid-grid">
          <div className="hid-grid__column hid-grid__column--12-sm">

            <HeaderComponent title="" />
            <div className="hid-grid">
              <div className="hid-grid__column hid-grid__column--12-xs hid-grid__column--12-sm hid-grid__column--12-md hid-grid__column--12-lg hid-grid__column--12-md">
                <Outlet />
              </div></div>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </React.Fragment>
  );
};

export default App;