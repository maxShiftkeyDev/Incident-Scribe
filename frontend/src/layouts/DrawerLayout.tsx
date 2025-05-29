// src/layouts/DrawerLayout.tsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, AppBar, Toolbar, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/List";

const drawerWidth = 240;

export default function DrawerLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Incidents", icon: <ListAltIcon />, path: "/incidents" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Incident Manager
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map(({ text, icon, path }) => (
              <ListItem key={text} disablePadding>
                <ListItemButton onClick={() => navigate(path)}>
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
