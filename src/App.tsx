import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Authentication from "./pages/Auththentication";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { NavBarProvider } from "./provider/NavBarProvider";
import DashboardLayout from "./layouts/DashBoardLayout";
import AppLayout from "./layouts/AppLayout";
import { SnackbarProvider } from "./components/snackbar";

import { UserListView } from "./sections/user/view";

import "./App.css";

function App() {
  return (
    <SnackbarProvider>
      <NavBarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="home" element={<Home />} />
              </Route>
              <Route path="/" element={<Navigate to="/register" replace />} />

              <Route path="/manage-user" element={<UserListView />} />
            </Route>
            <Route path="/register" element={<Authentication />} />
            <Route
              path="/register/forgot-password"
              element={<ForgotPassword />}
            />
          </Routes>
        </Router>
      </NavBarProvider>
    </SnackbarProvider>
  );
}

export default App;
