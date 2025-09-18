import { Link } from "react-router";

export function Dashboard() {
  return (
    <>
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

      <div className="container my-3">TODO: Add main section.</div>

      <footer class="container-fluid py-5 bg-info-subtle text-center fixed-bottom">
        <p>
          This is free and unencumbered software released into the public
          domain.
        </p>
      </footer>
    </>
  );
}
