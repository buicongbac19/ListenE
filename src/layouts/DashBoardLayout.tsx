import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";

const DashboardLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100vw",
        backgroundColor: "#f1f1f3",
      }}
    >
      <NavBar />
      <Box sx={{ flexGrow: 1, padding: "20px" }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
