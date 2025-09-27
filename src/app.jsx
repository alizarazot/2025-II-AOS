import { useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import { Login } from "./page/login/login.jsx";
import { Dashboard } from "./page/dashboard/dashboard.jsx";
import { Register } from "./page/login/register.jsx";
import { Reset } from "./page/login/reset.jsx";

import { ProtectedRoute } from "./component/protected-route.jsx";

export const routes = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {" "}
            <Dashboard />{" "}
          </ProtectedRoute>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
    </Routes>
  </BrowserRouter>
);
