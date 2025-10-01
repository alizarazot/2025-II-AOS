import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Login } from "./page/login/login.jsx";
import { Dashboard } from "./page/dashboard/dashboard.jsx";
import { Register } from "./page/login/register.jsx";
import { Reset } from "./page/login/reset.jsx";

import { ProtectedRoute } from "./component/protected-route.jsx";
import { Products } from "./component/products-management/products-management.jsx";
import { Providers } from "./component/providers-management/providers-management.jsx";

export const routes = (

<BrowserRouter>
    <Routes>
      {/* Ruta por defecto para evitar pantalla en blanco en "/" */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="products" element={<Products></Products>}></Route>
        <Route path="providers" element={<Providers></Providers>}></Route>
        </Route>
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
)