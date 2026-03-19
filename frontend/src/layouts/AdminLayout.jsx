// frontend/src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, Divider,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  IconButton, Button, useTheme, useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  MenuBook as MenuBookIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';

const drawerWidth = 260;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  // Danh sách các menu điều hướng
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Cấu trúc Khóa học', icon: <SchoolIcon />, path: '/courses' },
    { text: 'Học viên & Học phí', icon: <PeopleIcon />, path: '/students' },
    { text: 'Sổ điểm Lớp học', icon: <MenuBookIcon />, path: '/grades' },
    { text: 'Quản lý Task', icon: <AssignmentIcon />, path: '/tasks' },
  ];

  // Khối Sidebar (Menu bên trái)
  const drawerContent = (
    <div>
      <Toolbar sx={{ backgroundColor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" noWrap fontWeight="bold">
          ECMS PORTAL
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1, px: 2 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.dark' : 'text.primary',
                  '&:hover': { backgroundColor: 'primary.light', color: 'primary.dark' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.dark' : 'inherit', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: isActive ? 'bold' : 'medium' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f8' }}>
      {/* 1. Thanh Header (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          boxShadow: 'none',
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: 'white',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Hệ thống Quản lý Trung tâm
          </Typography>
          <Button color="error" variant="outlined" startIcon={<LogoutIcon />} onClick={handleLogout} size="small">
            Đăng xuất
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. Thanh Menu Sidebar (Drawer) */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }} // Tối ưu hiệu năng trên mobile
          sx={{
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #e0e0e0' },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 3. Vùng Nội dung Chính (Main Content) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar /> {/* Thêm khoảng trống bằng đúng chiều cao của Header để không bị lấp chữ */}
        {/* <Outlet /> là nơi các trang con (Dashboard, TaskList...) sẽ được render vào */}
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminLayout;