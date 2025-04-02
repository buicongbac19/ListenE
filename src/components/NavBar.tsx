import * as React from "react";
import { useEffect } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import GroupIcon from "@mui/icons-material/Group";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useNavigate } from "react-router-dom";
import { useNavBar } from "../provider/NavBarProvider";

export default function NavBar() {
  const { value, setValue } = useNavBar();

  useEffect(() => {
    const navItem = localStorage.getItem("navItem");
    if (navItem) setValue(navItem);
  }, []);

  const navigate = useNavigate();

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation
      showLabels
      sx={{
        width: "200px",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 20px 0 0",
        backgroundColor: "#fff",
      }}
      value={value}
      onChange={handleChange}
    >
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Dashboard"
        value="dashboard"
        icon={<DashboardIcon />}
        onClick={() => {
          navigate("/dashboard");
          setValue("dashboard");
          localStorage.setItem("navItem", "dashboard");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý người dùng"
        value="cars"
        icon={<GroupIcon />}
        onClick={() => {
          navigate("/dashboard/manage-car");
          setValue("cars");
          localStorage.setItem("navItem", "cars");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý các track"
        value="customers"
        icon={<GraphicEqIcon />}
        onClick={() => {
          navigate("/dashboard/manage-track");
          setValue("customers");
          localStorage.setItem("navItem", "customers");
        }}
      />
      <BottomNavigationAction
        sx={{
          outline: "none !important",
          border: "none",
          width: "calc(100% + 40px)",
        }}
        label="Quản lý đơn hàng"
        value="orders"
        icon={<ShoppingCartIcon />}
        onClick={() => {
          navigate("/dashboard/manage-order");
          setValue("orders");
          localStorage.setItem("navItem", "orders");
        }}
      />
    </BottomNavigation>
  );
}
