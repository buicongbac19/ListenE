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

import TrackManager from "./sections/track/track-manager";

import { TopicListView } from "./sections/topic/view";

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

                {/* Tracks route */}
                <Route path="manage-track" element={<TrackManager />} />

                {/* Topics route */}
                <Route path="manage-topic" element={<TopicListView />} />
              </Route>
              <Route path="/" element={<Navigate to="/auth" replace />} />

              <Route path="/manage-user" element={<UserListView />} />
            </Route>
            <Route path="/auth" element={<Authentication />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </NavBarProvider>
    </SnackbarProvider>
  );
}

export default App;
