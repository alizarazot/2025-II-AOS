import { NavLink } from "react-router-dom";

import {
  FaHome,
  FaChartBar,
  FaCog,
  FaPalette,
  FaEllipsisH,
} from "react-icons/fa";

export function DashboardMenu({ isVisible }) {
  return (
    <div
      className="bg-white h-100"
      style={{
        width: "250px",
        minWidth: "250px",
      }}
    >
      <div className="p-3">
        <div id="sidebar-accordion" className="accordion accordion-flush">
          <div className="accordion-item border-0">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed bg-transparent text-primary fw-bold px-0 border-0 shadow-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#home-collapse"
                aria-expanded="false"
                aria-controls="home-collapse"
              >
                <FaHome className="me-2" />
                Home
              </button>
            </h2>
            <div
              id="home-collapse"
              className="accordion-collapse collapse"
              data-bs-parent="#sidebar-accordion"
            >
              <div className="accordion-body px-0 py-2">
                <ul className="list-unstyled ps-3">
                  <li className="mb-2">
                    <NavLink to="/dashboard/products"
                      className="text-decoration-none text-dark d-block py-2 px-2 rounded"
                    >
                      <FaChartBar className="me-2" />
                      Productos
                    </NavLink>
                  </li>
                  <li className="mb-2">
                    <a
                      href="#"
                      className="text-decoration-none text-dark d-block py-2 px-2 rounded"
                    >
                      <FaChartBar className="me-2" />
                      BMAP
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="accordion-item border-0">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed bg-transparent text-primary fw-bold px-0 border-0 shadow-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#settings-collapse"
                aria-expanded="false"
                aria-controls="settings-collapse"
              >
                <FaCog className="me-2" />
                Settings
              </button>
            </h2>
            <div
              id="settings-collapse"
              className="accordion-collapse collapse"
              data-bs-parent="#sidebar-accordion"
            >
              <div className="accordion-body px-0 py-2">
                <ul className="list-unstyled ps-3">
                  <li className="mb-2">
                    <a
                      href="#"
                      className="text-decoration-none text-dark d-block py-2 px-2 rounded"
                    >
                      <FaPalette className="me-2" />
                      Toggle theme
                    </a>
                  </li>
                  <li className="mb-2">
                    <a
                      href="#"
                      className="text-decoration-none text-dark d-block py-2 px-2 rounded"
                    >
                      <FaEllipsisH className="me-2" />
                      More settings
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
