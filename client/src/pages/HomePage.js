import { Row } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import DoctorList from "../components/DoctorList";
import Layout from "./../components/Layout";

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);

  const getUserData = async () => {
    try {
      const res = await axios.get("/api/user/getAllDoctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Layout>
      <div style={{ textAlign: "center", marginBottom: "20px", opacity: 0, animation: "fadeIn 1s forwards" }}>
        <h3 style={{ fontSize: "2rem", color: "#333", fontWeight: "600" }}>
          Home Page
        </h3>
        <div style={{ width: "100%", height: "1px", backgroundColor: "#ddd", margin: "20px 0" }}></div>
      </div>

      <Row style={{ display: "flex", justifyContent: "center", gap: "20px", animation: "fadeIn 1s forwards" }}>
        {doctors && doctors.map((doctor) => (
          <div
            key={doctor._id}
            style={{
              width: "250px",
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              transition: "all 0.3s ease",
              transform: "scale(1)",
              animation: "fadeIn 1s forwards",
            }}
            className="doctor-card"
          >
            <DoctorList doctor={doctor} />
          </div>
        ))}
      </Row>

      {/* Add CSS animations */}
      <style>
        {`
          /* Fade-in animation */
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          /* Hover effect for cards */
          .doctor-card:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
    </Layout>
  );
};

export default HomePage;
