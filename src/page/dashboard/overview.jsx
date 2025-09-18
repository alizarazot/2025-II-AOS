export function DashboardOverview() {
  return (
    <>
      <div className="d-flex justify-content-around align-items-start">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title"> Total users </h5>
            <p> There are 0 users. :) </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <img
              className="card-img-top"
              height="300"
              src="https://imgs.xkcd.com/comics/tasks.png"
            />
            <h5 className="card-title"> XKCD </h5>
            <p> My favorite comic. </p>
            <a href="https://xkcd.com/1425" className="btn btn-primary">
              {" "}
              Visit{" "}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
