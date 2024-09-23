import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemText, ListItemIcon, IconButton, Toolbar, Divider, Typography, Box } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MovieIcon from "@mui/icons-material/Movie";
import GroupIcon from "@mui/icons-material/Group";
import RateReviewIcon from "@mui/icons-material/RateReview";
import CategoryIcon from "@mui/icons-material/Category";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { text: "User", icon: <PersonIcon />, path: "/admin/user" },
    { text: "Film", icon: <MovieIcon />, path: "/admin/film" },
    { text: "Cast", icon: <GroupIcon />, path: "/admin/cast" },
    { text: "Review", icon: <RateReviewIcon />, path: "/admin/review" },
    { text: "Genre", icon: <CategoryIcon />, path: "/admin/genre" },
  ];

  const theme = createTheme({
    palette: {
      primary: deepPurple,
      background: {
        default: "#f4f4f9",
      },
    },
    typography: {
      fontFamily: "Sans, Arial, sans-serif",
      fontWeight: 500,
    },
  });

  const toggleDrawer = (open) => () => {
    setIsOpen(open);
  };

  const drawerWidth = 240;

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer(true)}
          sx={{ m: 1 }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          variant="temporary"
          open={isOpen}
          onClose={toggleDrawer(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              backgroundColor: deepPurple[50],
            },
          }}
        >
          <Toolbar>
            <Box sx={{ flexGrow: 1, textAlign: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: deepPurple[700] }}>
                Admin Panel
              </Typography>
            </Box>
            <IconButton onClick={toggleDrawer(false)}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {menuItems.map((item, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false); // Close the drawer after clicking
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: deepPurple[100],
                    color: deepPurple[700],
                  },
                }}
              >
                <ListItemIcon sx={{ color: deepPurple[500] }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ fontWeight: "bold", color: deepPurple[700] }}
                />
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ padding: "10px", textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              &copy; 2024 Admin Panel
            </Typography>
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
};

export default AdminSidebar;
