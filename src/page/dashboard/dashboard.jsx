import { useState, useEffect } from "react";

import { Outlet } from "react-router";

import { DashboardMenu } from "../../component/menu";
import { CustomNavbar } from "../../component/navbar";
import { auth } from "../../firebase";
import { auditoriaService } from "../../services/auditoria-service";

export function Dashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    // Registrar ingreso cuando entra al dashboard
    const user = auth.currentUser;
    if (user) {
      auditoriaService.registrarIngreso(user);
    }

    // Registrar salida cuando cierra la pestaña o sale del dashboard
    const handleBeforeUnload = () => {
      auditoriaService.registrarSalida();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // También registrar salida cuando el componente se desmonta
      auditoriaService.registrarSalida();
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <CustomNavbar toggleSidebar={toggleSidebar} />
      <div className="d-flex">
        <div
          style={{
            width: sidebarVisible ? "250px" : "0px",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden",
          }}
          className="flex-shrink-0"
        >
          <DashboardMenu isVisible={sidebarVisible} />
        </div>

        <div className="flex-grow-1 my-3 mx-3 overflow-x-auto">
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
