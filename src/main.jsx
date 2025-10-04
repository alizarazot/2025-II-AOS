import { createRoot } from "react-dom/client";
import { routes } from "./app.jsx";

import { ProtectedRoute } from "./component/protected-route.jsx";
import { ClientManagement } from "./component/client-management/client-management.jsx";

createRoot(document.getElementById("root")).render(routes);
