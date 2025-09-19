import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import { Login } from "./page/login/login.jsx";
import { Dashboard } from "./page/dashboard/dashboard.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Dashboard></Dashboard>}></Route>
      <Route path="/login" element={<Login></Login>}></Route>
    </Routes>
  </BrowserRouter>,
);
