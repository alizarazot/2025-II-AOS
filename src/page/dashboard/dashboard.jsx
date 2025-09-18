import { Link } from "react-router";

import { DashboardMenu } from "./menu";

export function Dashboard() {
  return (
    <>
      <div className="min-vh-100">
        <nav className="navbar navbar-expand-sm">
          <div className="container-fluid">
            <Link className="navbar-brand text-primary" to="/">
              Dashboard
            </Link>

            {/* TODO: Login. */}
            <form>
              <button className="btn btn-outline-dark" disabled>
                Logout
              </button>
            </form>
          </div>
        </nav>

        <div className="d-flex align-self-stretch">
          <div className="px-2">
            <DashboardMenu className></DashboardMenu>
          </div>
          <div className="container my-3">TODO: Add main section.</div>
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
