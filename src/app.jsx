import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Login } from "./page/login/login.jsx";
import { Dashboard } from "./page/dashboard/dashboard.jsx";
import { Register } from "./page/login/register.jsx";
import { Reset } from "./page/login/reset.jsx";
import { Forget } from "./page/login/forget.jsx";

import { ProtectedRoute } from "./component/protected-route.jsx";
import { ClientManagement } from "./component/client-management/client-management.jsx";
import { Products } from "./component/products-management/products-management.jsx";
import { Providers } from "./component/providers-management/providers-management.jsx";
import { AuditoriaView } from "./component/auditoria-view.jsx";

export const routes = (
  <BrowserRouter>
    <Routes>
      {/* Redirect '/' to '/dashboard' */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard></Dashboard>
          </ProtectedRoute>
        }
      >
        <Route
          path="clients"
          element={<ClientManagement></ClientManagement>}
        ></Route>
        <Route path="products" element={<Products></Products>}></Route>
        <Route path="providers" element={<Providers></Providers>}></Route>
        <Route
          path="auditoria"
          element={<AuditoriaView></AuditoriaView>}
        ></Route>
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/forget" element={<Forget />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
);
