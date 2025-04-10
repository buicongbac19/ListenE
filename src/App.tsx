"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authentication from "./pages/Auththentication";
import ForgotPassword from "./pages/ForgotPassword";
import HomePage from "./pages/HomePage";
import { NavBarProvider } from "./provider/NavBarProvider";
import DashboardLayout from "./layouts/DashBoardLayout";
import AppLayout from "./layouts/AppLayout";
import { SnackbarProvider } from "./components/snackbar";

import { UserListView } from "./sections/user/view";

import TrackManager from "./sections/dashboard-view/track/track-manager";

import TopicDetailsPage from "./pages/TopicDetailsPage";
import SessionDetailsPage from "./pages/SessionDetailsPage";
import TrackPracticePage from "./pages/TrackPracticePage";
import TrackSegmentsPage from "./pages/TrackSegmentsPage";
import SegmentPracticePage from "./pages/SegmentPracticePage";
import TopicsPage from "./pages/TopicsPage";

import { AnimatePresence } from "framer-motion";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",
      light: "#757de8",
      dark: "#002984",
      contrastText: "#fff",
    } as any,
    secondary: {
      main: "#f50057",
      light: "#ff4081",
      dark: "#c51162",
      contrastText: "#fff",
    } as any,
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 12px 28px rgba(0, 0, 0, 0.1)",
          },
        },
      },
    },
  },
});
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <NavBarProvider>
          <Router>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<AppLayout />}>
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route
                    path="/topic/:topicId"
                    element={<TopicDetailsPage />}
                  />
                  <Route
                    path="/session/:sessionId"
                    element={<SessionDetailsPage />}
                  />
                  <Route
                    path="/track/:trackId"
                    element={<TrackPracticePage />}
                  />
                  <Route
                    path="/track/:trackId/segments"
                    element={<TrackSegmentsPage />}
                  />
                  <Route
                    path="/track/:trackId/segment/:segmentId"
                    element={<SegmentPracticePage />}
                  />
                  <Route path="/dashboard" element={<DashboardLayout />}>
                    {/* Tracks route */}
                    <Route path="manage-track" element={<TrackManager />} />

                    {/* Topics route */}
                  </Route>

                  <Route path="/manage-user" element={<UserListView />} />
                </Route>
                <Route path="/auth" element={<Authentication />} />
                <Route
                  path="/auth/forgot-password"
                  element={<ForgotPassword />}
                />
              </Routes>
            </AnimatePresence>
          </Router>
        </NavBarProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
