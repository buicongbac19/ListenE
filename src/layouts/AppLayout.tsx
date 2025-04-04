import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AppBar from "../components/AppBar";

const DashboardLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        backgroundColor: "#f1f1f3",
      }}
    >
      <AppBar />
      <Box sx={{ flexGrow: 1, padding: "20px 20px 0 0" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
