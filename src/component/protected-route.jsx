import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { auth } from "../firebase";

export function ProtectedRoute({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser ? true : false);
  auth.onAuthStateChanged((user) => {
    setIsLoggedIn(user ? true : false);
  });

  if (isLoggedIn) {
    return children;
  }

  const navigate = useNavigate();
  useEffect((_) => {
    navigate("/login");
  });
}
