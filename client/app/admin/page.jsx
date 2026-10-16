"use client";

import AdminDashboard from "../../src/screens/AdminDashboard";
import AdminRoute from "../../src/routes/AdminRoute";

export default function Page() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}
