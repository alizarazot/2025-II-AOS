import { createRoot } from "react-dom/client";
import { routes } from "./app.jsx";

import { ProtectedRoute } from "./component/protected-route.jsx";

createRoot(document.getElementById("root")).render(routes);
