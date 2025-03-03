import React, { memo } from "react";
import AdminPanel from "./admin/AdminPanel";

const AdminPanelWrapper = memo(
  function AdminPanelWrapper() {
    return <AdminPanel />;
  },
  () => true
); // Always return true since this component has no props

export default AdminPanelWrapper;

/* The original AdminPanel code has been moved to src/components/admin/AdminPanel.jsx */
