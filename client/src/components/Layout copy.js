import { Badge, message, Drawer } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { adminMenu, userMenu } from "../Data/data";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully!");
    navigate("/login");
  };

  const doctorMenu = [
    { name: "Dashboard", path: "/", icon: "fa-solid fa-chart-pie" },
    { name: "Appointments", path: "/doctor-appointments", icon: "fa-solid fa-calendar-check" },
    { name: "My Profile", path: `/doctor/profile/${user?._id}`, icon: "fa-solid fa-user-doctor" },
  ];

  const sidebarMenu = user?.isAdmin
    ? adminMenu.filter((item) => item.name !== "Profile")
    : user?.isDoctor
      ? doctorMenu
      : userMenu.filter((item) => item.name !== "Profile");

  return (
    <div style={{ height: "100vh", backgroundColor: "#f9f9f9", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header
        style={{
          height: "60px",
          backgroundColor: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 20px",
          boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      >
        <span style={{ fontSize: "20px", fontWeight: "600", color: "#333" }}>
          Welcome, {user?.name || "User"}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            onClick={() => navigate("/notification")}
            style={{ cursor: "pointer", position: "relative" }}
          >
            <Badge count={user?.notification?.length || 0}>
              <i className="fa-solid fa-bell" style={{ fontSize: "18px", color: "#444" }}></i>
            </Badge>
          </div>

          <i
            className="fa-solid fa-bars"
            style={{ fontSize: "20px", cursor: "pointer", color: "#444" }}
            onClick={() => setDrawerVisible(true)}
          ></i>
        </div>
      </header>

      {/* Drawer Menu */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        bodyStyle={{ padding: 0 }}
      >
        <nav style={{ display: "flex", flexDirection: "column" }}>
          {sidebarMenu.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setDrawerVisible(false)}
                style={{
                  padding: "15px 20px",
                  textDecoration: "none",
                  backgroundColor: active ? "#f0f0f0" : "transparent",
                  color: "#333",
                  borderBottom: "1px solid #eee",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div
            onClick={() => {
              handleLogout();
              setDrawerVisible(false);
            }}
            style={{
              padding: "15px 20px",
              cursor: "pointer",
              color: "#e74c3c",
              borderTop: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </div>
        </nav>
      </Drawer>

      {/* Main Content */}
      <main style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
