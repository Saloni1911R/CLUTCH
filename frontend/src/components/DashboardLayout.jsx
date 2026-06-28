import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../pages/Sidebar"; // Make sure your Sidebar component filename matches this!

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100vw", backgroundColor: "#0b0f19" }}>
      {/* Sidebar stays locked on the left side */}
      <Sidebar />

      {/* Main container changed from #f9fafb to #0b0f19 to eliminate the white line strip */}
      <main style={{ flex: 1, padding: "24px", backgroundColor: "#0b0f19", overflowY: "auto" }}>
        <Outlet />
      </main>
    </div>
  );
}