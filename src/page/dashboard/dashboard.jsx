import { Link } from "react-router";

import { DashboardMenu } from "./menu";
import { DashboardOverview } from "./overview";
import { CustomNavbar } from "./navbar";

export function Dashboard() {
  return (
    <>
      <CustomNavbar />
      <div className="min-vh-100">
        <nav className="navbar navbar-expand-sm">
          <div className="container-fluid">
            <Link className="navbar-brand text-primary" to="/">
              Dashboard
            </Link>
            <Link to="/login" className="btn btn-outline-dark">
              Logout
            </Link>
          </div>
        </nav>

        <div className="d-flex align-self-stretch">
          <div className="px-2">
            <DashboardMenu className></DashboardMenu>
          </div>

          <div className="container my-3">
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
