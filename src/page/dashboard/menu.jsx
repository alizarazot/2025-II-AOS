export function DashboardMenu() {
  return (
    <>
      <div id="dashboard-menu" className="accordion">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              aria-expanded="true"
              data-bs-toggle="collapse"
              data-bs-target="#collapse-home-items"
            >
              Home
            </button>
          </h2>
          <div
            id="collapse-home-items"
            className="accordion-collapse collapse show overflow-hidden"
            data-bs-parent="#dashboard-menu"
          >
            <ul className="list-group list-group-flush">
              <li className="list-group-item active"> Overview </li>
              <li className="list-group-item"> Detailed </li>
            </ul>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              aria-expanded="false"
              data-bs-toggle="collapse"
              data-bs-target="#collapse-settings-items"
            >
              Settings
            </button>
          </h2>
          <div
            id="collapse-settings-items"
            className="accordion-collapse collapse overflow-hidden"
            data-bs-parent="#dashboard-menu"
          >
            <ul className="list-group list-group-flush">
              <li className="list-group-item"> Toggle theme </li>
              <li className="list-group-item"> More settings </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
