import { useState } from "react";

import { DashboardMenu } from "./menu";
import { DashboardOverview } from "./overview";
import { CustomNavbar } from "./navbar";

import { auth } from "../../firebase";

export function Dashboard() {
  console.log(auth.currentUser);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <>
      <div className="vh-100">
        <CustomNavbar toggleSidebar={toggleSidebar} />
        <div className="d-flex align-self-stretch">
          <div
            style={{
              width: sidebarVisible ? "250px" : "0px",
              transition: "width 0.3s ease-in-out",
              overflow: "hidden",
            }}
          >
            <DashboardMenu isVisible={sidebarVisible} />
          </div>

          <div className="flex-fill my-3 mx-3">
            <DashboardOverview></DashboardOverview>
          </div>
        </div>
      </div>

      <footer className="container-fluid py-5 bg-info-subtle text-center">
        <p>
          This is free and unencumbered software released into the public
          domain.
        </p>
      </footer>
    </>
  );
}
