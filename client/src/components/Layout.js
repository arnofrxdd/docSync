import { Badge, message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    navigate("/login");
  };

  const doctorMenu = [
    { name: "Home", path: "/", icon: "fa-solid fa-house" },
    { name: "Appointments", path: "/doctor-appointments", icon: "fa-solid fa-list" },
    { name: "Profile", path: `/doctor/profile/${user?._id}`, icon: "fa-solid fa-user" },
  ];

  const SidebarMenu = user?.isAdmin
    ? adminMenu.filter((menu) => menu.name !== "Profile")
    : user?.isDoctor
      ? doctorMenu
      : userMenu.filter((menu) => menu.name !== "Profile");

  return (
    <div className="layout-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>DocSync</h2>
        </div>
        <nav className="menu">
          {SidebarMenu.map((menu) => {
            const isActive = location.pathname === menu.path;
            return (
              <div
                key={menu.name}
                className={`menu-item ${isActive ? "active" : ""}`}
              >
                <Link to={menu.path}>
                  <i className={menu.icon}></i>
                  <span>{menu.name}</span>
                </Link>
              </div>
            );
          })}
          <div className="menu-item" onClick={handleLogout}>
            <Link to="/login">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </Link>
          </div>
        </nav>
      </aside>
      <main className="main-content">
        <header className="header">
          <div className="notification" onClick={() => navigate("/notification")}>
            <Badge count={user?.notification?.length || 0}>
              <i className="fa-solid fa-bell"></i>
            </Badge>
          </div>
          <div className="user-info">
            <h4>{user?.name}</h4>
          </div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  );
};

export default Layout;
