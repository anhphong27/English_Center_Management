// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Chào mừng đến với Hệ thống ECMS!</Typography>
      <Typography variant="body1" gutterBottom>Bạn đã đăng nhập thành công nhờ JWT Token.</Typography>
      <Button variant="outlined" color="error" onClick={handleLogout} sx={{ mt: 2 }}>
        Đăng Xuất
      </Button>
    </Box>
  );
};

export default Dashboard;