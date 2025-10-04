import { useState } from "react";

import { Outlet } from "react-router";

import { DashboardMenu } from "../../component/menu";
import { CustomNavbar } from "../../component/navbar";

export function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomNavbar toggleSidebar={toggleSidebar} />
      <div className="d-flex flex-fill">
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
          <Outlet></Outlet>
        </div>
      </div>
      <footer className="container-fluid py-5 bg-info-subtle text-center">
        <p>
          This is free and unencumbered software released into the public
          domain.
        </p>
      </footer>
    </div>
  );
}
