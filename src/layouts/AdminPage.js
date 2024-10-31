import React from "react";
import AdminSidebar from "../components/AdminPage/AdminSidebar";
import { Box, Toolbar } from "@mui/material";

const drawerWidth = 240;

const AdminPage = ({ children }) => {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar khusus untuk halaman Admin */}
      <AdminSidebar />

      {/* Konten utama di AdminPage */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: `${drawerWidth}px`, // Margin kiri sesuai dengan lebar sidebar
          width: `calc(100% - ${drawerWidth}px)`, // Mengurangi lebar konten utama agar tidak tertutupi sidebar
        }}
      >
        <Toolbar /> {/* Opsional: untuk spasi jika ada AppBar di atas */}
        {children} {/* Ini adalah konten dari halaman admin */}
      </Box>
    </Box>
  );
};

export default AdminPage;
